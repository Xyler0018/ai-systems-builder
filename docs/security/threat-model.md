# Threat Model

## Assets

- Learning roadmap progress, logs, tasks, blockers, proof links, settings, and backup exports.
- Local SQLite database and `.env` configuration.
- User-entered URLs, notes, and imported backup content.

## Trust Boundaries

- Browser to Next.js API routes.
- API routes to Prisma/SQLite.
- Backup import/export boundary.
- CSV export to spreadsheet applications.
- User-entered URLs to browser navigation.
- Local-only deployment boundary.

## User Roles

- Single local owner.
- No anonymous/public users are intended.
- No admin/non-admin role split currently exists.

## Likely Attackers

- A web page attempting cross-site requests to the local app.
- A person on the same network if the app is bound beyond localhost.
- A malicious backup file.
- A malicious URL stored in an imported or manually entered record.

## Abuse Cases

- Cross-site mutation against local APIs.
- Full backup exfiltration if the server is reachable remotely.
- Malicious import overwriting records or injecting unsafe fields.
- CSV formula execution after export.
- Stored dangerous links such as `javascript:` URLs.
- Denial of service through large JSON imports or repeated expensive requests.

## Current Mode

The application is treated as local-first and single-user. Remote access should remain disabled unless a deployment-specific review is completed.
