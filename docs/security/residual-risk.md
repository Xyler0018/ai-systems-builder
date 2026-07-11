# Residual Risk

## Remaining Risks

- The app has no full user authentication or account model.
- The local bearer-token remote-access fallback is not a replacement for a maintained auth library.
- In-memory rate limiting is not sufficient for multi-instance production.
- Security event logging is minimal.
- Backup import has no user-facing dry run, audit trail, or rollback.
- Automated DAST/SAST tools were not yet configured in CI.

## Recommendation

Treat the current hardening as suitable for local-first use. Before public hosting, add a maintained authentication layer, persistent authorization model, audit logging, CI security tooling, and deployment-specific secret management.
