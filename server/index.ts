import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';

const app = express();
const port = Number(process.env.PORT ?? 8787);
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000';
const rateWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const rateMax = Number(process.env.RATE_LIMIT_MAX ?? 30);
const buckets = new Map<string, { count: number; reset: number }>();

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
app.use((_req, res, next) => { res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('X-Frame-Options','DENY'); res.setHeader('Referrer-Policy','no-referrer'); next(); });
app.use((req, res, next) => { const key = req.ip ?? 'unknown'; const now = Date.now(); const b = buckets.get(key); if (!b || now >= b.reset) buckets.set(key,{count:1,reset:now+rateWindowMs}); else { b.count++; if (b.count > rateMax) return res.status(429).json({error:'Too many requests. Try again later.'}); } next(); });
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

type AuthenticatedRequest = Request & { userId?: string; accessToken?: string };

function requireConfig(_req: Request, res: Response, next: NextFunction) {
  if (!supabaseUrl || !supabaseAnonKey) return res.status(503).json({ error: 'Backend is not configured.' });
  next();
}

function bearer(req: Request) {
  const value = req.header('authorization') ?? '';
  return value.startsWith('Bearer ') ? value.slice(7).trim() : '';
}

async function supabaseFetch(path: string, init: RequestInit = {}, token?: string) {
  const headers = new Headers(init.headers);
  headers.set('apikey', supabaseAnonKey!);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${supabaseUrl}${path}`, { ...init, headers });
}

async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = bearer(req);
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const response = await supabaseFetch('/auth/v1/user', { method: 'GET' }, token);
    if (!response.ok) return res.status(401).json({ error: 'Invalid or expired session.' });
    const user = await response.json() as { id?: string };
    if (!user.id) return res.status(401).json({ error: 'Invalid session.' });
    req.userId = user.id;
    req.accessToken = token;
    next();
  } catch {
    res.status(401).json({ error: 'Authentication check failed.' });
  }
}

function stringField(value: unknown, max: number) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max ? value.trim() : null;
}

app.get('/api/health', (_req, res) => {
  res.json({ data: { ok: true, service: 'herfati-dz-api' } });
});

app.get('/api/artisans', requireConfig, async (_req, res) => {
  const response = await supabaseFetch(
    '/rest/v1/artisan_profiles?select=user_id,craft_id,bio_ar,bio_fr,years_experience,hourly_rate_dzd,daily_rate_dzd,verification_status,insurance_verified,available_emergency&verification_status=eq.verified',
  );
  const body = await response.text();
  if (!response.ok) return res.status(response.status).json({ error: 'Unable to load artisans.' });
  res.status(200).json({ data: JSON.parse(body) });
});

app.post('/api/bookings', requireConfig, requireAuth, async (req: AuthenticatedRequest, res) => {
  const artisanId = stringField(req.body?.artisan_user_id, 80);
  const description = stringField(req.body?.service_description, 2000);
  const address = stringField(req.body?.address_text, 500);
  const scheduledAt = typeof req.body?.scheduled_at === 'string' ? req.body.scheduled_at : null;
  if (!artisanId || !description) return res.status(400).json({ error: 'artisan_user_id and service_description are required.' });

  const response = await supabaseFetch('/rest/v1/bookings?select=*', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      customer_user_id: req.userId,
      artisan_user_id: artisanId,
      service_description: description,
      address_text: address,
      scheduled_at: scheduledAt,
      status: 'pending',
    }),
  }, req.accessToken);
  const data = await response.json().catch(() => null);
  if (!response.ok) return res.status(response.status).json({ error: 'Booking could not be created.' });
  res.status(201).json({ data: Array.isArray(data) ? data[0] : data });
});

app.post('/api/reviews', requireConfig, requireAuth, async (req: AuthenticatedRequest, res) => {
  const bookingId = stringField(req.body?.booking_id, 80);
  const artisanId = stringField(req.body?.artisan_user_id, 80);
  const comment = typeof req.body?.comment === 'string' ? req.body.comment.trim().slice(0, 2000) : null;
  const rating = Number(req.body?.rating);
  if (!bookingId || !artisanId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'booking_id, artisan_user_id and rating (1-5) are required.' });
  }

  const bookingResponse = await supabaseFetch(
    `/rest/v1/bookings?select=id&customer_user_id=eq.${encodeURIComponent(req.userId!)}&artisan_user_id=eq.${encodeURIComponent(artisanId)}&id=eq.${encodeURIComponent(bookingId)}&status=eq.completed`,
    { method: 'GET' },
    req.accessToken,
  );
  const bookings = await bookingResponse.json().catch(() => []);
  if (!bookingResponse.ok || !Array.isArray(bookings) || bookings.length !== 1) {
    return res.status(409).json({ error: 'Review requires a completed booking belonging to this customer and artisan.' });
  }

  const response = await supabaseFetch('/rest/v1/reviews?select=*', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      booking_id: bookingId,
      customer_user_id: req.userId,
      artisan_user_id: artisanId,
      rating,
      comment,
      status: 'pending',
    }),
  }, req.accessToken);
  const data = await response.json().catch(() => null);
  if (!response.ok) return res.status(response.status).json({ error: 'Review could not be created.' });
  res.status(201).json({ data: Array.isArray(data) ? data[0] : data });
});

app.post('/api/emergency-requests', requireConfig, requireAuth, async (req: AuthenticatedRequest, res) => {
  const categoryId = stringField(req.body?.category_id, 80);
  const description = stringField(req.body?.description, 2000);
  const wilayaCode = stringField(req.body?.wilaya_code, 10);
  const commune = stringField(req.body?.commune, 120);
  if (!categoryId || !description || !wilayaCode) {
    return res.status(400).json({ error: 'category_id, description and wilaya_code are required.' });
  }

  const response = await supabaseFetch('/rest/v1/emergency_requests?select=*', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      customer_user_id: req.userId,
      category_id: categoryId,
      description,
      wilaya_code: wilayaCode,
      commune,
      status: 'open',
    }),
  }, req.accessToken);
  const data = await response.json().catch(() => null);
  if (!response.ok) return res.status(response.status).json({ error: 'Emergency request could not be created.' });
  res.status(201).json({ data: Array.isArray(data) ? data[0] : data });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(port, () => console.log(`Herfati DZ API listening on :${port}`));
