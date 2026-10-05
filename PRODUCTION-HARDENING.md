# Production hardening applied

This build is intentionally honest about its current capability.

- New artisan profiles are **unverified** until a real verification workflow validates them.
- New reviews are **not verified bookings** automatically.
- Booking requests are **pending**, not confirmed, and are not sent to an external notification provider.
- Booking PII is not persisted in localStorage.
- Demo asset paths now resolve from /public/images in production builds.
- Marketing copy no longer claims unsupported national certification or “#1” status.

## Still required

A real backend, authentication, authorization, database, verification workflow, notifications, moderation, privacy controls, rate limiting, tests, CI and monitoring are required before public production use.
