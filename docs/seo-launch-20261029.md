# ProAge Atlas search launch record — 29 October 2026

## Scope and evidence

The public website is `https://gerontology.app/`, served by Cloudflare Worker `proage-atlas` from the `cloudflare/production` branch. This record describes observable technical readiness, not search visibility or ranking. Google Search Console data for the domain is unavailable in the connected account.

The live audit sampled the homepage, About, Investors, Roadmap, Laboratory, Evidence Copilot, Evidence library, Tools, PhenoAge, People, Contact, `robots.txt` and `sitemap.xml`. Each sampled page returned 200, included a self-referencing canonical and exactly one H1. The sitemap contains 40 unique public URLs through the shared page registry; the laboratory, evidence, biomarker, AI evaluation, check-in and privacy routes are present. The 1200 × 630 Open Graph image exists. The robot policy excludes private management, API and authentication routes.

## Changes in this release

- Remove the duplicated brand from document titles when an editorial title already contains “ProAge Atlas”. Give the broad editorial routes distinct, descriptive titles without changing their page copy or visual design.
- Repair H1→H3 skips in Laboratory entry cards and People cards by using H2 while preserving their existing CSS styling.
- Add conservative `WebSite` structured data for the canonical name and URL. This does not claim a company entity, medical organization, clinical credentials or an internal search engine.
- Make internal navigation links in the privacy page, assistant and no-JavaScript header use the framework link component; preserve external source links as ordinary anchors.
- Correct a stale private inbox hint about email forwarding; active Cloudflare routing already forwards `hello@` and `contact@` to the verified owner Gmail.

The existing sitemap, canonical generation, social-card metadata, mobile visual design and approved hero remain in place. Do not add keyword-stuffed headings, unsupported medical claims or structured data for features that are not publicly available.

## External setup and measurement

The linked Search Console account did not show a `gerontology.app` property on this date. The owner can create a **Domain property** and provide its exact Google TXT verification value; add that record in Cloudflare DNS and submit `https://gerontology.app/sitemap.xml`. The verification value cannot be generated from the repository. After verification, monitor indexing, queries and page experience in Search Console; this audit cannot infer them from page source.

For LinkedIn, the prepared company copy and product description are in the separate startup core. Do not create a Google Business Profile for a purely online product without eligible in-person customer contact. Reassess if genuine staffed premises and qualifying service activity exist.

## Release verification

Run `pnpm run lint`, `pnpm run check`, `pnpm run build`, and verify live title, canonical, H1 hierarchy, JSON-LD, sitemap, and a Cloudflare production deployment after the commit. The remaining `no-img-element` lint warnings concern intentional existing imagery and are not changed in this release.
