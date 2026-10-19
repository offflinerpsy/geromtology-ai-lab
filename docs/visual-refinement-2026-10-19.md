# Graphite visual refinement — 19 October 2026

Owner direction: a single global header/footer; a quieter, premium black palette; stronger typography; no link nudges, image hover zoom, decorative up-right arrows or repetitive section labels. Preserve the approved home hero movement and research content.

## Implementation

- One shared header now covers editorial, laboratory and instrument routes. A compact shared footer retains primary destinations plus a disclosure directory for institutional and research links.
- Graphite, neutral paper and platinum replace green/blue UI tones. Instrument Serif and DM Sans are self-hosted, with their OFL licenses.
- The original home hero renderers are unchanged; artwork receives neutral CSS grading. The discarded inquiry sprites and photographic laboratory planes are no longer rendered.
- A sectional cell and molecular helix use actual Three.js geometry with server-rendered SVG fallback. The entrance settles, rendering is gated by visibility, and reduced-motion requests retain a static plate.
- Evidence, biomarker-input and power illustrations replace decorative vials. Number transitions and the study power curve follow the real deterministic outputs. Measurement formulas, input units, exports and sources are preserved.
- Section rhythm uses space and surface changes. Data table rules, form boundaries and keyboard focus remain where they carry meaning.

## Validation before browser review

TypeScript, focused lint on the new scientific components, 22 numerical/security/contact tests and the production build passed. Browser checks follow on an isolated Cloudflare review deployment. Review deployment strips production D1, email and environment configuration.

## Browser review

- Reviewed real iframe viewports of 390, 768, 1440 and 1920 CSS pixels on an isolated Cloudflare Worker. Home, Laboratory, About, PhenoAge and Study Planner have one header and one footer, with no horizontal document overflow at the inspected widths.
- At 768 pixels, the PhenoAge example produced 41.8 years for chronological age 50. At 1920 pixels, changing the Study Planner meaningful difference from 5 to 8 updated recruitment from 152 to 62 and power from 80.1% to 80.7%, with the corresponding power curve.
- The mobile navigation opens, and the compact institutional footer directory expands to preserve its destinations. The desktop footer is approximately 405 CSS pixels high when collapsed.
- With JavaScript disabled at 390 pixels, home copy, links and scientific SVG illustrations remain visible. The review browser disables WebGL; this verifies the vector fallback, not GPU appearance or frame rate. Three.js scenes compile but still require a GPU-enabled visual check.
- Replaced the shared link wrapper with native document links after the review browser exposed the existing vinext RSC-prefetch exception. This keeps route changes and deep links reliable without changing content or tool calculations.

Rollback source: `dbab4184836536aa9c72a7d45e448df4b6b30a9b`. The source branch remains `cloudflare/production`; the legacy main branch and enquiry data are untouched.
