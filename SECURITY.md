# Security Policy

## Supported Versions

This is a local-first single-user application. Security fixes apply to the current `1.x` codebase.

## Reporting a Vulnerability

Use the project owner's preferred private contact channel. Include:

- affected version or commit;
- affected route or file;
- reproduction steps;
- impact;
- suggested remediation if known.

Do not include real secrets, private documents, or unrelated personal data in reports.

## Disclosure Expectations

Please allow reasonable time for review and remediation before public disclosure. This project is not currently represented as production-secure or multi-user hardened.

## Known Limitations

- No public registration or multi-user authentication is included.
- Remote access is blocked by default; hosted usage requires explicit `APP_ACCESS_TOKEN` handling and deployment review.
- Malware scanning for imported files/backups is not included.
- SQLite is intended for local development.

## Security Update Policy

Run security checks before exposing the app beyond localhost:

```bash
npm run lint
npm run typecheck
npm run build
npm audit
npm run test:security
```
