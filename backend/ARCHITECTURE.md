# Herfati DZ — Backend Architecture

## Current state

The frontend is a Vite + React application. Production trust, booking, review, and verification state must live on the server.

The PostgreSQL foundation is in:
`supabase/migrations/0001_initial.sql`

## Trust invariants

1. Artisan verification defaults to `unverified`.
2. Verification decisions are moderator/admin operations, not client claims.
3. A booking is created as `pending`.
4. A verified review requires the authenticated customer to own the booking and the booking to be `completed`.
5. Review publication is moderated through `review_status`.
6. Audit events are append-only from normal client contexts.
7. RLS limits records by authenticated identity.
8. Booking PII is not persisted in browser localStorage.

## Next implementation gate

Before production launch:

- connect the frontend to a real Supabase project;
- add server-side auth/session handling;
- implement booking transition RPCs/functions with authorization;
- implement moderator verification workflow;
- add rate limiting and abuse controls;
- add privacy retention/deletion jobs;
- add notification delivery and retry handling;
- run CI and browser smoke tests;
- configure production secrets only in the deployment platform.

## Important

The seed frontend data is demo content. It must not be presented as verified real-world professional data without an actual verification workflow.
