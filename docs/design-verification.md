# Editorial redesign — verification record

## Scope

This is an implementation-side verification record, not an independent audit or an owner design acceptance. The redesign replaces the old numbered landing-page composition with ten English-language routes, an image-led editorial design, desktop research disclosure navigation, mobile dialog navigation and a local evidence-reading room.

## Completed local checks

The TypeScript check and production build passed. The build produces responsive WebP media, ten prerendered pages, a custom 404 document, sitemap and robots file. Legacy server.ts is not published as a public static bundle.

A Playwright Chromium run passed 146 assertions covering HTTP responses, one H1 per route, unique route canonicals, no remaining template placeholders, absence of decorative numbering, and horizontal overflow checks at 320, 390, 768, 1024, 1440 and 1920 CSS pixels on all ten routes.

Interaction checks passed for keyboard and hover disclosure, Escape dismissal, browser back navigation, the research accordion, pause motion, reduced-motion preferences, the mobile dialog focus boundary and restoration, body-scroll locking and release, and navigation from the mobile menu.

The evidence explorer passed topic filtering, text search, expanding limitations, empty-state reset and Markdown download containing the original source URL and caveat. The project filter and contact email copy also passed. Contact links do not silently send messages.

All ten routes retained substantial main content with JavaScript disabled. Unknown routes returned HTTP 404 in the local clean-URL test server. No JavaScript runtime or React hydration errors were captured.

After correcting text contrast, axe-core reported no automated WCAG A/AA violations in its checks on the ten desktop pages. Automated checks do not establish full WCAG conformance or replace manual accessibility testing.

## Visual inspection

Actual browser screenshots were inspected for the desktop homepage, the expanded research menu, the mobile homepage and navigation, the complete homepage composition, the laboratory hero, the institute intro and the contact page. Portrait containers preserve the head and use contained positioning; document covers are not cropped into unrelated photography.

The hero uses slow CSS image motion, not a video or a live microscopy feed. Section reveals are one-shot. Hover states affect image scale, arrow movement, color and link underlines. Reduced-motion and pause controls disable animation without hiding content.

## Deployment gate

Publish through the existing GitHub main to Vercel integration only after checking the final source against the tested workspace. Verify the production deployment SHA, real clean URLs, browser hydration and interactive controls after deployment. This local record alone is not evidence that production deployment completed.

## Owner requirements

Decorative ordinal numbers and KPI panels are prohibited in AGENTS.md. Previous production remains available through the backup/before-editorial-redesign-20260916 Git branch.
