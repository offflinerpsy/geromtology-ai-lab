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
- Browser QA: pending preview verification below.

The isolated visual review worker has no production routes, database, mail or AI secrets. Its review-only wrapper supports fixed-width iframes, no-JavaScript mode and a reduced-motion branch check. The wrapper is never used by the production build.
