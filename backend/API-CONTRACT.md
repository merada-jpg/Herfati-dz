# API Contract

The frontend API boundary in `src/services/api.ts` defines the minimum server endpoints.

## GET /api/artisans
Returns only public artisan profiles. Verification badges and ratings must be server-derived.

## POST /api/bookings
Authenticated customer only. Server sets `status=pending`; client cannot select `confirmed`, `completed`, or verification fields.

## POST /api/reviews
Authenticated customer only. Server verifies ownership of a completed booking, prevents duplicate reviews, applies moderation status, and derives verified-booking state.

## POST /api/emergency-requests
Authenticated customer only. Server validates the request, applies abuse/rate limits, creates an audit event, and dispatches notifications through trusted services.

## Security rules

- Never expose database service-role credentials to Vite/browser code.
- Treat every request body as untrusted.
- Authorize using the authenticated session on the server.
- Recalculate trust signals server-side.
- Rate-limit booking, review, registration and emergency endpoints.
- Do not persist booking PII in browser localStorage.
