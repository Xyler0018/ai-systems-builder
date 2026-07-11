# Deployment Hardening

Do not expose this app publicly until a deployment-specific review is completed.

## Required Before Hosting

- Use HTTPS.
- Set `APP_ACCESS_TOKEN` to a high-entropy secret if remote access is required.
- Keep the database private.
- Store secrets in the host secret manager, not in `.env` committed files.
- Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit`, and `npm run test:security`.
- Add persistent rate limiting if multiple instances are deployed.
- Add authentication if more than one person will access it.
- Protect backups and logs.
- Disable seed and migration helper commands in production unless explicitly approved.

## Current Local Defaults

- Requests from non-local hosts are rejected unless a valid bearer token matches `APP_ACCESS_TOKEN`.
- API responses use `no-store` where applicable.
- Security headers are configured through Next.js.
