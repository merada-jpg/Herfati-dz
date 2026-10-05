# Herfati DZ backend foundation

This directory defines the production data contract before a real database is connected.

## Required entities

- users
- artisan_profiles
- verification_cases
- bookings
- reviews
- audit_events
- emergency_requests

## Invariants

- Verification is server-side only.
- A booking starts as pending.
- Only a completed booking can authorize a verified review.
- Authorization is enforced server-side.
- PII has explicit retention/deletion rules.
- State transitions are append-only in audit_events.

The current frontend is intentionally not presented as a production backend.