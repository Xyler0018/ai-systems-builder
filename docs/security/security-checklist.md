# Security Checklist

- [x] Local-only remote access boundary.
- [x] Origin checks for state-changing API requests.
- [x] Basic in-memory API rate limits.
- [x] Request body size checks for high-risk APIs.
- [x] Model allowlist for dynamic Prisma delegates.
- [x] Strict URL protocol validation.
- [x] CSV formula neutralization.
- [x] Safer external link rendering.
- [x] Basic security headers and CSP.
- [x] Production guard for seed and SQL helper scripts.
- [x] Security smoke test script.
- [ ] Full authentication and session management.
- [ ] Persistent audit log table.
- [ ] Backup import dry-run and rollback UI.
- [ ] Distributed rate limit store for hosted deployment.
- [ ] OWASP ZAP baseline scan.
- [ ] Semgrep and secret scanning in CI.
