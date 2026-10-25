# Deployment and operations

## Production authority

| Resource | Authority |
| --- | --- |
| Source | `offflinerpsy/geromtology-ai-lab`, branch `cloudflare/production` |
| Host | Cloudflare Workers, `proage-atlas` |
| Primary URL | https://gerontology.app |
| Fallback URL | https://proage-atlas.offflinerpsy.workers.dev |
| Email | Cloudflare Email Routing and Email Sending |
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

`/auth/login` is protected by Cloudflare Access email verification. The Worker verifies the session JWT signature, issuer, audience and expiry, and redirects only to a relative URL. Browsing the curated evidence library does not require sign-in. AI scope classification, live literature retrieval and synthesis require a verified session. The endpoint enforces exact same-origin requests, bounded input, six requests per minute and forty per UTC day per user, plus a site-wide ceiling of three hundred per UTC day. These are prototype allowances, not a paid service plan. Rate-limit counters use the existing contact_rate_limits table; no migration is required.

`/manage/*` has a separate owner-email Access policy. The inbox also checks the signed identity against its secret owner setting. Public pages never reveal enquiry records.

## Database and rollback

The contact schema and existing records were transferred to the owner's D1 database. Future changes use reviewed forward migrations in `drizzle/`; run `pnpm db:migrate` before deploying code that requires a new schema. Migrations are separate from routine deployments.

Back up before destructive changes. Never commit database exports or personal records. Preserve D1 data when rolling back code. Use a forward Git revert on `cloudflare/production`, or an urgent Cloudflare Worker version rollback followed by Git reconciliation. Do not rewrite history.

Legacy backup: `backup/before-cloudflare-migration-20261011` at `000dce2050389f88f21967cf60d3629af272ebae`. Audited Sites version 12 remains a separate recovery copy at source commit `341b87f0ff3081537ae5a59989d35c8937d6cd16`.

## Release checks and limits

Run typecheck, numerical/security tests and build. After deployment check route status, canonicals, sitemap/robots, contact persistence, anonymous AI denial and Access protection. Browser interactions, responsive layouts, signed-in AI answers and FPS need actual browser QA; HTTP responses are not click tests. The supported managed browser was unavailable during migration. Enquiries are stored in the private inbox first, then the Worker sends an owner notification. Email delivery failure is logged with the enquiry reference and does not discard the saved enquiry or invite duplicate submissions.

## Domain and email

`gerontology.app` and `www.gerontology.app` are custom domains of `proage-atlas`. Both are declared in `wrangler.jsonc` so future Git deployments retain them. A zone-level redirect sends www and HTTP requests to `https://gerontology.app`, retaining the path and query string. SEO canonicals, sitemap and social URLs use the primary origin.

Existing Access applications protect `/auth/login` and `/manage/*` on the custom domains and the fallback hostname. Their audiences and owner-only inbox policy are unchanged.

- Public correspondence: **hello@gerontology.app**; **contact@gerontology.app** is an alias. Both forward to the owner's verified Gmail destination. These are routing addresses, not separate IMAP mailboxes.
- Application sender: **notifications@gerontology.app**. The `EMAIL` binding permits this sender and the verified owner destination only. Contact messages set Reply-To to the visitor's validated email; the application does not send to arbitrary visitors.
- Cloudflare manages routing MX/SPF and sending return-path MX/SPF/DKIM. DMARC is configured with `p=reject`.
- Notification content includes enquiry details and the private inbox link. The privacy notice describes this transfer. There are no marketing messages or automatic replies.

Regenerate binding declarations after configuration changes with `npx wrangler types worker-bindings.d.ts --env-interface CloudflareBindings --include-runtime false`.

Rollback source before domain/email: `854236b319cd8ab58ba485a0d8190628af9ca970`. A code rollback preserves D1 enquiry records. Cloudflare DNS, Access and routing rules are independent of code; review them separately before removing a domain or email feature.
