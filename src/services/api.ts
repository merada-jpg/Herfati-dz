// Server boundary for Herfati DZ.
// This module intentionally contains no privileged credentials.
// The browser must call a trusted API/backend for bookings, reviews,
// verification, emergency dispatch and audit events.

export type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE ?? ''}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      credentials: 'include',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return { data: null, error: payload.error ?? `Request failed (${response.status})` };
    return { data: payload.data as T, error: null };
  } catch {
    return { data: null, error: 'Network error. Please try again.' };
  }
}

export const api = {
  listArtisans: () => request('/api/artisans'),
  createBooking: (input: unknown) =>
    request('/api/bookings', { method: 'POST', body: JSON.stringify(input) }),
  createReview: (input: unknown) =>
    request('/api/reviews', { method: 'POST', body: JSON.stringify(input) }),
  createEmergency: (input: unknown) =>
    request('/api/emergency-requests', { method: 'POST', body: JSON.stringify(input) }),
};
