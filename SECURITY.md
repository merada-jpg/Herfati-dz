# Security Policy

## Scope

Herfati handles artisan profiles, booking requests, contact details, and reviews. Security and trust issues are treated as production blockers when they can affect user safety, privacy, identity, or transaction integrity.

## Reporting

Do not disclose exploitable vulnerabilities in public issues. Report them privately to the repository maintainers with:

- affected route/component
- reproduction steps
- impact
- suggested mitigation, if known

## Security principles

- Verification status is server-controlled and auditable.
- Booking requests are not considered confirmed until a real provider/backend confirms them.
- Personal booking data must not be persisted in browser local storage.
- Reviews become verified only through a server-side completed-booking relationship.
- Secrets must never be committed to the repository.
