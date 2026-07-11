# Security Audit

## Summary

This audit focused on the practical attack surface of the local-first AI Systems Builder dashboard: API route mutation/export/import, data validation, backup restore, CSV export, URL rendering, security headers, and deployment assumptions.

## Findings

| ID | Title | Severity | Affected Files | Status |
| --- | --- | --- | --- | --- |
| ASB-001 | No authentication or remote access boundary | High | `middleware.ts`, `app/api/**` | Mitigated for local-first mode |
| ASB-002 | Missing CSRF/origin checks on mutations | High | `app/api/**/route.ts` | Fixed |
| ASB-003 | Over-trusted backup import | High | `app/api/import/route.ts` | Partially fixed |
| ASB-004 | Full backup export exposed all data | High | `app/api/export/[type]/route.ts` | Mitigated by local/token boundary |
| ASB-005 | Weak server-side validation | Medium | `lib/mutations.ts`, `app/api/settings/route.ts` | Improved |
| ASB-006 | CSV formula injection | Medium | `lib/utils.ts` | Fixed |
| ASB-007 | Dangerous URL rendering | Medium | `lib/mutations.ts`, `components/tracker-page.tsx` | Fixed |
| ASB-008 | Raw internal errors returned to clients | Medium | `app/api/**/route.ts` | Reduced |
| ASB-009 | Missing security headers | Medium | `next.config.ts` | Fixed |
| ASB-010 | Production seed/db helper safety | Low | `prisma/seed.ts`, `scripts/apply-sqlite-migration.ts` | Fixed |

## Residual Notes

- This is still not a production multi-user application.
- Backup import validation is stricter, but no dry-run UI or audit table exists yet.
- No persistent distributed rate-limit store exists.
- No authentication library has been added because the app is intentionally local-first.
