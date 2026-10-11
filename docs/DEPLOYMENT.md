# Deployment and operations

## Production authority

| Resource | Authority |
| --- | --- |
| Source | `offflinerpsy/geromtology-ai-lab`, branch `cloudflare/production` |
| Host | Cloudflare Workers, `proage-atlas` |
| URL | https://proage-atlas.offflinerpsy.workers.dev |
| Database | Cloudflare D1, `proage-atlas`, binding `DB` |
| Authentication | Cloudflare Access, verified-email research login and a separate owner-only inbox policy |
| AI provider | Existing Azure Responses endpoint and deployment, server-only secret |

The legacy `main` branch retains its earlier Vercel integration. Start product changes from `cloudflare/production`; its pushes trigger production checks, builds and deployment in Cloudflare.

## Automatic publishing

Cloudflare Workers Builds uses the root directory, pinned Node.js/pnpm versions, `npm run check && npm run build`, then `npm run deploy`. Deployment uses Vite-generated `dist/server/wrangler.json`, uploads Worker modules and static assets and preserves dashboard-managed variables.

The build credential is held by Cloudflare Builds. It is not committed to Git or placed in the browser. Production secrets remain in Cloudflare. Source does not depend on the ChatGPT environment or a Sites helper.

## Runtime configuration

Public binding definitions are in `wrangler.jsonc`. Worker secrets:

- `AZURE_OPENAI_API_KEY`
- `CONTACT_INBOX_OWNER_EMAIL`

Azure URL/deployment and Access organization/audiences are non-secret runtime configuration. Add or rotate secrets through the dashboard or interactive `wrangler secret put` prompt. Never pass a key in a shell argument, echo it or put it in source. Copy `.dev.vars.example` to ignored `.dev.vars` for local development. No mock identity bypass is included.

## Access

`/auth/login` is protected by Cloudflare Access email verification. The Worker verifies the session JWT signature, issuer, audience and expiry, and redirects only to a relative URL. Public source discovery does not require sign-in; AI synthesis requires a verified session.

`/manage/*` has a separate owner-email Access policy. The inbox also checks the signed identity against its secret owner setting. Public pages never reveal enquiry records.

## Database and rollback

The contact schema and existing records were transferred to the owner's D1 database. Future changes use reviewed forward migrations in `drizzle/`; run `pnpm db:migrate` before deploying code that requires a new schema. Migrations are separate from routine deployments.

Back up before destructive changes. Never commit database exports or personal records. Preserve D1 data when rolling back code. Use a forward Git revert on `cloudflare/production`, or an urgent Cloudflare Worker version rollback followed by Git reconciliation. Do not rewrite history.

Legacy backup: `backup/before-cloudflare-migration-20261011` at `000dce2050389f88f21967cf60d3629af272ebae`. Audited Sites version 12 remains a separate recovery copy at source commit `341b87f0ff3081537ae5a59989d35c8937d6cd16`.

## Release checks and limits

Run typecheck, numerical/security tests and build. After deployment check route status, canonicals, sitemap/robots, contact persistence, anonymous AI denial and Access protection. Browser interactions, responsive layouts, signed-in AI answers and FPS need actual browser QA; HTTP responses are not click tests. The supported managed browser was unavailable during migration. Automatic email notifications remain unconfigured; enquiries are stored in the private inbox.
