# Production Security Baseline

## Never trust the client

The frontend is a presentation layer. In production, the API must enforce:
- authentication and server-side authorization;
- artisan verification state;
- booking state transitions;
- review eligibility;
- rate limits and abuse controls.

## Privacy

Do not persist booking PII in browser storage. Production storage must define:
- purpose;
- retention period;
- deletion/export process;
- access audit trail.

## Trust signals

CAM/insurance badges and verified-review labels must be derived from server-side records and never from user-submitted booleans.

## Deployment gate

Do not expose the marketplace to real customers until CI passes install, typecheck, build, and automated tests.