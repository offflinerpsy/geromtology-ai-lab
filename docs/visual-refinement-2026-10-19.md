# Graphite visual refinement — 19 October 2026

Owner direction: a single global header/footer; a quieter, premium black palette; stronger typography; no link nudges, image hover zoom, decorative up-right arrows or repetitive section labels. Preserve the approved home hero movement and research content.

## Implementation

- One shared header now covers editorial, laboratory and instrument routes. A compact shared footer retains primary destinations plus a disclosure directory for institutional and research links.
- Graphite, warm paper and platinum replace green/blue UI tones. Instrument Serif and DM Sans are self-hosted, with their OFL licenses.
- The original home hero renderers are unchanged; artwork receives neutral CSS grading. The discarded inquiry sprites and photographic laboratory planes are no longer rendered.
- A sectional cell and molecular helix use actual Three.js geometry with server-rendered SVG fallback. The entrance settles, rendering is gated by visibility, and reduced-motion requests retain a static plate.
- Evidence, biomarker-input and power illustrations replace decorative vials. Number transitions and the study power curve follow the real deterministic outputs. Measurement formulas, input units, exports and sources are preserved.
- Section rhythm uses space and surface changes. Data table rules, form boundaries and keyboard focus remain where they carry meaning.

## Validation before browser review

TypeScript, focused lint on the new scientific components, 22 numerical/security/contact tests and the production build passed. Browser checks follow on an isolated Cloudflare review deployment. Review deployment strips production D1, email and environment configuration.

Rollback source: `dbab4184836536aa9c72a7d45e448df4b6b30a9b`. The source branch remains `cloudflare/production`; the legacy main branch and enquiry data are untouched.
