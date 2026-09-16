# ProAge Atlas

An English-language, image-led research website with a local evidence-reading room. Built with React, TypeScript and Vite, with build-time HTML rendering for every public route.

## Development

Install dependencies with npm install. Run npm run dev for local development, npm run lint for the TypeScript check and npm run build for optimized media, the browser application, page HTML and sitemap. npm run preview serves the built site locally.

## Public pages

Home, Institute & People, Research, Longevity Medicine, Geriatric Medicine, Biomarkers & Measurement, AI Laboratory, Projects & Initiatives, Methods & Trust, and Contact.

The evidence explorer supports local search, topic filters, expandable source limitations and Markdown export. Contact links open an email application; there is no simulated form submission. No live AI inference, clinical assessment or patient-data intake is represented.

## Media

The three conceptual illustrations used in the design come from the repository’s existing original images. scripts/prepare-media.mjs creates responsive WebP versions at build time; the cellular crop removes embedded decorative labels. OIAA portraits and public-document covers retain their original attribution. Institutional images and titles are not a claim of endorsement.

## Deployment

The existing GitHub main branch deploys automatically to geromtology-ai-lab.vercel.app through Vercel. cleanUrls resolves the prerendered .html documents. There is no universal SPA rewrite: unknown paths should retain a real 404 response.

Owner design constraints and verification requirements are recorded in AGENTS.md.
