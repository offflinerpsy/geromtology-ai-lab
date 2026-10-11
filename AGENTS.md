# ProAge Atlas — engineering and owner requirements

## Source and deployment

The active application is on `cloudflare/production` in `offflinerpsy/geromtology-ai-lab`. Production runs in the owner's Cloudflare account, Worker `proage-atlas`. Use the repository's normal build; do not add a Sites runtime dependency. `main` preserves the legacy Vercel implementation. Do not change its deployment or rewrite history as a side effect of product work.

Run type checks, meaningful tests and the production build before a release. Use Git branches and forward commits. Preserve rollback references and check for concurrent changes before publishing. A build is not browser QA; report unavailable checks accurately. Follow the execution environment's supported browser policy rather than installing an alternative to bypass it.

## Design

Do not add decorative section numbering, numbered-card motifs, invented metrics, gratuitous icons or fake dashboards. Retain the premium editorial composition, purposeful imagery and typography. Preserve the approved WebGL hero, transparent cellular field, GSAP/Three.js laboratory scenes, visible pause controls and reduced-motion behavior. Avoid scroll hijacking. Reading text and essential content must remain available when motion is unavailable.

The website is multi-page. Preserve header/footer/mobile paths, keyboard focus, Escape dismissal, deep links, back/forward and existing document-anchor entry to laboratory/tools.

## Content and science

Public copy is English. Atlas is an independent research software initiative. Attribute OIAA titles, portraits and initiatives; do not imply unconfirmed startup employment or endorsement. Never invent clinical trials, patient cohorts, scientific performance, customer counts, revenue, investment or product adoption.

Conceptual imagery must be labeled appropriately. The assistant synthesizes selected curated notes, not full-text retrieval. Calculators must retain methods, units, versions, source links and assumptions. Do not turn research outputs into treatment or diagnostic advice.

## Data and security

Keep AI secrets server-side. Verify Cloudflare Access JWT signatures, issuer, audience and expiry; never trust identity headers or decoded claims by themselves. Restrict the inbox to the configured owner. Preserve form origin checks, bounded input and durable abuse limits. Do not commit personal enquiry records, secret material or generated build artifacts.

## Verification

For UI changes inspect 390/768/1440/1920 layouts and actual browser interactions when a supported browser is available. Check reduced motion, animation pause, meaningful no-JavaScript content and horizontal overflow. Report unavailable browser/FPS/AI sign-in checks; do not claim them from a server response.
