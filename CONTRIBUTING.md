# Contributing to ProAge Atlas

Create a feature branch from `cloudflare/production`. Keep each change reviewable and explain the concrete user behavior before and after it. Pull requests should target `cloudflare/production`; pushes to that branch deploy through Cloudflare Workers Builds.

## Preserve the product

- Preserve the green/ivory palette, editorial typography and approved hero and laboratory animation engines.
- Use the real founder photograph and clearly attributed scientific profiles.
- Distinguish current capabilities, product hypotheses and planned features.
- Keep laboratory/tool transitions as document anchors until the earlier client-router issue has been reproduced and fixed.
- Keep methods, units, versions, source links and limitations attached to calculated or generated outputs.

## Verify a change

Run `pnpm typecheck`, `pnpm test` and `pnpm build`. Test changed behavior against meaningful expected outcomes rather than duplicating implementation details. Review the final diff and check that secrets, build output and personal enquiries are absent.

For UI changes, inspect real layouts at 390, 768, 1440 and 1920 pixels, keyboard navigation, reduced motion, pause controls, browser back/forward and deep links. Record the checks actually performed and any environment limitation. Do not label HTTP checks as browser clicks.

## Secrets and records

Use ignored `.dev.vars` locally and Worker secrets in production. Never commit Azure keys, Cloudflare credentials, authentication cookies, raw requests or enquiry data. The private inbox is not a public API. Source changes and migrations must preserve existing records; make an explicit backup before destructive schema changes.

## Review and release

Use clear English titles and descriptions. Include validation and material limitations. A production rollback changes application code; it must not delete contact records or rewrite Git history. See `docs/DEPLOYMENT.md` for the production flow.
