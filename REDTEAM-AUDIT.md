# Herfati DZ — Red Team / OODA Audit
Date: 2026-10-05

## Executive verdict

**Status: NOT production-ready.** The project is a polished frontend prototype with useful UX flows, but it currently lacks the server-side trust, persistence, identity, authorization, notification, observability and test controls required for a real marketplace.

## Critical findings

| ID | Severity | Finding | Risk | Corrective action |
|---|---|---|---|---|
| RT-01 | Critical | Client-side registration could self-assign verification/insurance status and fabricate a verification review. | False trust signals; reputational/legal exposure. | New registrations are explicitly unverified and no synthetic review is created. Verification must be server-side. |
| RT-02 | High | Booking was labeled confirmed without a real provider, transaction, or notification. | Users may believe an appointment exists when nobody was notified. | Booking state is now pending; UI explicitly states that this prototype has not sent an external notification. |
| RT-03 | High | Booking PII (phone/address) was persisted in browser localStorage. | Privacy exposure on shared devices and uncontrolled retention. | Booking requests are now in-memory until a real backend/privacy policy exists. |
| RT-04 | High | Reviews submitted from the UI were automatically marked as verified bookings. | Review integrity and marketplace manipulation risk. | New UI reviews are unverified by default. |
| RT-05 | High | Runtime image URLs pointed into /src/... when used as strings. | Broken images after Vite production builds. | Assets moved to /public/images and referenced via /images/... |
| RT-06 | Medium | Browser state was parsed with unchecked JSON.parse. | Corrupt/tampered local state can crash or poison UI state. | Basic shape validation added before accepting persisted artisan data. |
| RT-07 | Medium | Unsupported marketing claims such as “#1” and universal CAM certification were presented as facts. | Misleading claims and trust erosion. | Copy now distinguishes a directory/prototype from independently verified credentials. |
| RT-08 | Medium | No authentication/authorization boundary exists. | Anyone with browser access can act as any role. | Required before production: real identity and server-side authorization. |
| RT-09 | Medium | No abuse controls: rate limiting, CAPTCHA/risk scoring, spam controls, moderation workflow. | Fake artisans, spam bookings, review manipulation. | Required before public launch. |
| RT-10 | Medium | No automated test suite or CI quality gate was present. | Regressions can reach production unnoticed. | Add unit, integration, accessibility and E2E tests plus CI gates. |

## OODA

### Observe
React/Vite frontend; demo data embedded in source; browser localStorage; no production database/auth/notification layer; GitHub repository was initially empty.

### Orient
The UX is suitable for a prototype, but the trust model is inverted: verification states were controlled by the browser rather than a trusted service.

### Decide
Prioritize **trust correctness > feature count**. Never display verification, booking confirmation, insurance state or verified review unless the backend can prove it.

### Act
Applied the hardening pass: removed client-side self-verification; removed synthetic verification review; changed booking creation to pending; stopped persisting booking PII in localStorage; stopped auto-marking reviews as verified; hardened localStorage parsing; corrected production asset paths; removed unsupported “#1 / nationally certified” claims.

## PHD / NoAI / Arifect

- **PHD:** prioritize proof, correctness, hardening and durable architecture over presentation.
- **NoAI:** do not imply an AI/backend capability exists merely because environment variables or UI labels mention it.
- **Arifect:** separate product experience, trust architecture, data lifecycle and deployment concerns.

## Production release gate

Do not call this a production marketplace until RT-01 through RT-05 are backed by a real server-side architecture and automated tests.
