# Laboratory visual system · 20 October 2026

## Owner direction

The owner rejected the previous copper/gray patchwork, decorative SVG animations and inconsistent form styling. Preserve the accepted fonts and original green home hero. Bring public pages, research tools, navigation and footer into one system.

## Implementation

- One light mineral background, white working surfaces, deep green-black type and a restrained botanical accent. The footer is a separate dark closing surface.
- Shared header with trigger-aligned dropdowns; shared mobile navigation and compact footer. Removed competing legacy color overrides from the active Atlas stylesheets.
- Existing DM Sans and Instrument Serif retained. Original home hero engine and image retained; decorative image captions removed.
- Transparent, deterministic volumetric Canvas studies replace the former SVG illustrations. Cell and molecular ribbon scenes rotate continuously, pause offscreen and on document hiding, and render a static view for reduced motion. Accessible descriptions distinguish illustration from measured data.
- PhenoAge and Study Planner share aligned numeric controls, units, focus treatment, help tooltips, segmented unit selection and Radix slider/select primitives. Numeric fields have no native number steppers. Result values update immediately without a misleading count-up. Published calculations and data handling remain unchanged.
- Contact and other editorial heroes now use the same light surface, type and transparent scientific scene. No old dark photograph remains behind dark hero text.

## Sources consulted

Visual references were inspected directly: Isomorphic Labs and Chai Discovery. Current Radix UI documentation was retrieved through Context7 for ToggleGroup, Select, Tabs and Slider behavior. Existing installed dependencies were reused; no package versions changed.

## Verification

- `npm run check`: TypeScript passed and all 24 existing scientific/security tests passed.
- Production build passed locally and in isolated Cloudflare review builds.
- Focused lint on revised TypeScript passed without errors. Existing PageContent static-image optimization warnings remain.
- Browser preview checked on home, laboratory, PhenoAge, Study Planner, About, Contact and Evidence Library.
- PhenoAge layout measured at 360, 390, 430, 599, 601, 768, 959, 961, 1440 and 1920 CSS pixels: document scroll width equaled client width at every size. Desktop two-panel layout changes to a stacked layout below 960px. Numeric fields retain consistent height.
- Synthetic PhenoAge example: 41.8 years, chronological age 50.0, difference -8.2. Unit conversion, reset, invalid CRP, comma decimal, error focus and calculation trace were exercised.
- Study Planner: default 152 recruits, 64 evaluable per group, 80.1% power. Keyboard target-power change to 81% and difference change to 8 gave 54 evaluable / 64 recruits, with 82.2% achieved power. Results update immediately and the power curve updates.
- Desktop dropdown sizing/position and contact Select selection verified. Mobile menu opens with keyboard and dismisses with Escape.
- Home content and original hero fallback remain visible with JavaScript disabled.
- Scientific scene phase advanced on screen and remained unchanged once offscreen. Visible decorative captions and Pause controls are absent.
- Browser screenshots inspected for desktop, tablet and mobile. Hardware FPS and OS reduced-motion emulation were not measured; reduced-motion listener and cleanup were inspected in source. No claim is made about untested authenticated AI or inbox paths.

## Release boundary

This pass changes presentation and local calculator control behavior. Scientific formulas, API handlers, authentication, form submission checks, email routing, database bindings and dependency versions were not edited. Production must fast-forward from `fd013ada6ac8f65369c8dbad329a82f786947183`, with a rollback branch retaining that commit. The isolated visual review worker has no production database, routes, email bindings or secrets and is removed after release verification.

## Production receipt

- Released commit: `5393a879718a5440d17197ce0c47fa6a70a0db0e`.
- Successful Cloudflare build: `8e76f882-752f-4e01-8852-0558001bc3f8`.
- Production deployment: `b0d39042-38ed-4ac2-8327-1160b428bffe`, version `1c6149e8-a552-46ee-ae8d-c5e1a1dff98e`, 100% traffic, 20 October 2026 12:02 UTC.
- Rollback branch: `backup/before-laboratory-system-20261020`.
- Rechecked the PhenoAge synthetic result (41.8), global dropdown and navigation to the laboratory on gerontology.app. No application errors appeared in the inspected production browser log.
- Evidence Library search for PhenoAge combined with Original research returned 4 of 14 sources. Its mobile document had no horizontal overflow.
- Verified final mobile navigation group headings use the dark ink color on the light surface.
- Production screenshots: `phenoage-production-20261020.jpg`, `laboratory-production-20261020.jpg`.
