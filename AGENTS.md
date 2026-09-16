# ProAge Atlas — owner requirements

## Design rules

The owner explicitly prohibits decorative section numbering and numbered-card motifs. Never add ordinal labels such as 01 / 02 / 03, progress counters, numbered eyebrows or decorative index numbers. Actual dates or sourced scientific values are different; do not invent metrics for visual impact.

Keep a premium, image-led editorial composition. Avoid generic SaaS card grids, floating fake dashboards, gratuitous icons and decorative KPI panels. Preserve deliberate typography, varied section composition and generous whitespace. Do not copy another company’s identity, claims or assets.

Navigation must be a usable multi-page system, not a collection of misleading buttons. Preserve the desktop research disclosure, native mobile dialog, keyboard navigation, Escape handling, focus restoration, deep links and browser back/forward behavior.

Motion must have a purpose: restrained image movement, headline entrances, one-shot reveals, clear hover/focus feedback. Respect prefers-reduced-motion and the visible pause control. Content must remain available if JavaScript or animation is unavailable. Never introduce scroll hijacking or hide uninitialized content.

## Content boundaries

Public site copy is English. ProAge Atlas is an independent research software initiative. OIAA public titles, portraits and initiatives need clear attribution; do not imply unconfirmed startup appointments or institutional endorsement.

Do not invent clinical validation, trials, patient cohorts, revenue, funding, model training results or scientific performance. Conceptual laboratory/cellular imagery must not be represented as a real facility or experimental result. The local evidence explorer filters a bounded collection and exports reading notes; it does not perform live model inference or provide medical advice.

## Build and delivery

Work in offflinerpsy/geromtology-ai-lab. Production is https://geromtology-ai-lab.vercel.app. Commit to GitHub and let the existing Vercel Git integration deploy. Do not create another project or deploy an unrelated manual copy.

Before updating main, run the type check and build, inspect real browser screenshots on desktop and mobile, test navigation, search/filter/export, reduced motion, no-JavaScript content and overflow. Preserve a rollback reference and avoid force-pushing over concurrent work.

The build prepares responsive WebP images from committed originals and prerenders each route to real HTML. Maintain unique title, description, canonical, sitemap and a real 404 response. The legacy Express assistant is not part of this static deployment; do not claim its API is available.
