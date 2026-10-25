# Depth and navigation refinement — 25 October 2026

## Authority and recovery

The owner asked to preserve the approved version, then improve depth, heading and small-text legibility, neutralise green interface styling, contract the header on scroll, add smooth text underlines and useful mega menus, deepen the footer and add meaningful looping infographics.

Recovery branch: `backup/approved-before-depth-polish-20261025`, commit `e90b8ed88247a571f923a825d18e705f7d741c65`. Original WebGL hero renderer, asset, motion and green palette are unchanged. Its serif accent is retained independently of the new interface heading family.

## Implementation

- Shared Manrope headings and DM Sans body copy, larger small text, warm mineral surfaces and slate/blue-black interface ink. Forms, chat and check-ins use the same system.
- Header starts integrated with the home hero; scroll contracts it into a centred, rounded floating panel. Text navigation has a smooth underline. Existing Radix primitives provide disclosure, focus and dismissal behavior; no new dependency.
- Three bounded mega panels expose real destinations. Mobile uses expandable groups in the existing Sheet. A no-JavaScript navigation fallback remains usable.
- Darker near-black footer and compact, consistent endings. Home remains a short sequence: hero, three starting paths, healthy-aging context, evidence-process explanation, footer.
- Transparent Canvas process illustrations explain literature-to-brief workflow, PhenoAge inputs and overlapping study distributions. No measured data, invented metrics or clinical outputs. Text descriptions are server-rendered. Continuous calm loops pause offscreen, in hidden tabs and under reduced motion; a static fallback remains without JavaScript.
- Calculations, official questionnaire text/scoring, chat scope/retrieval/security and private inbox behavior unchanged.

## Checks

- TypeScript passed.
- Existing 53 numerical, questionnaire, request-boundary and AI tests passed.
- Production build passed.
- Browser QA used the isolated Cloudflare preview and the supported cloud browser. The local browser extension was occupied by its UI, so no local-session claims are made.
- Check-in collection: 360, 390, 430, 768, 959, 960, 1000, 1001, 1440 and 1920 CSS-pixel widths; zero horizontal overflow and correct mobile/desktop navigation switch. Vertical browser scrollbars account for 15px less content width.
- Home: complete top-to-bottom review of hero, start paths, cellular context, dark evidence-flow section and footer. Original hero composition retained. Desktop mega panels open; ArrowDown enters links; Escape returns focus. Menu transitions use Radix's accessible primitive (Context7 documentation checked).
- Mobile: health collection, PhenoAge fields and AI composer inspected at 390px. Mobile Sheet opens, expandable groups work, Escape restores focus. The review harness initially hid the top of its iframe behind its own toolbar; its scale now fits both dimensions. This was a harness issue, not a production menu defect.
- Motion: evidence-flow phase advanced while visible, then remained 0.97 across reads when paused offscreen. Both tool diagrams reported reduced mode and phase 0.00 across reads using the review-only matchMedia branch shim. This checks the production reduced-motion branch, not an operating-system settings change. No FPS claim.
- No JavaScript: descriptions and process labels remain server-rendered; navigation links and static fallback remain. A newly detected 390px overlap was corrected by placing fallback navigation in normal document flow; final recheck pending.
- Independent reviewer checked the source and preview: 390px cinematic AI evaluation title, mobile Sheet/disclosures/Escape, 768px tool typography and motion. Reported title clipping was fixed; no release blockers remained. A 15px diagram alignment difference at tablet width was corrected in the final polish.
- No application errors observed in the checked page console; browser-extension metadata errors are unrelated. Preview AI intentionally has no provider binding and reports unavailable; production anonymous readiness will be checked after release.
- Not performed: exhaustive every-route/every-width sweep, formal performance benchmark or OS-level motion preference change.

The isolated visual review worker has no production routes, database, mail or AI secrets. Its review-only wrapper supports fixed-width iframes, no-JavaScript mode and a reduced-motion branch check. The wrapper is never used by the production build.
