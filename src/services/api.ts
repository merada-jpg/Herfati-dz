import { supabase } from './supabase';

export type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const session = supabase ? (await supabase.auth.getSession()).data.session : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init?.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {}),
    };
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
    const response = await fetch(`${API_BASE ?? ''}${path}`, { ...init, headers, credentials: 'include' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return { data: null, error: payload.error ?? `Request failed (${response.status})` };
    return { data: payload.data as T, error: null };
  } catch {
    return { data: null, error: 'Network error. Please try again.' };
  }
}

export const api = {
  listArtisans: () => request('/api/artisans'),
  createBooking: (input: unknown) => request('/api/bookings', { method: 'POST', body: JSON.stringify(input) }),
  createReview: (input: unknown) => request('/api/reviews', { method: 'POST', body: JSON.stringify(input) }),
  createEmergency: (input: unknown) => request('/api/emergency-requests', { method: 'POST', body: JSON.stringify(input) }),
};
