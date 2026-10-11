![ProAge Atlas — research for healthy aging](https://proage-atlas.offflinerpsy.workers.dev/images/proage-atlas-share.png)

# ProAge Atlas

**Scientific evidence, aging measurements and study planning — in one research workspace.**

ProAge Atlas is an independent research software initiative for small geroscience and longevity research teams. It brings a curated reference library, measurement-method context, two reproducible calculators and source-linked AI synthesis into a single workspace.

[Explore the live platform](https://proage-atlas.offflinerpsy.workers.dev) · [Production source](https://github.com/offflinerpsy/geromtology-ai-lab/tree/cloudflare/production) · [Product direction](https://proage-atlas.offflinerpsy.workers.dev/about) · [Investors](https://proage-atlas.offflinerpsy.workers.dev/investors) · [Roadmap](https://proage-atlas.offflinerpsy.workers.dev/roadmap)

## Production

The current application is hosted on **Cloudflare Workers** and maintained on **`cloudflare/production`**. That branch contains the complete source, product documentation, tests and deployment configuration.

```sh
git clone --branch cloudflare/production https://github.com/offflinerpsy/geromtology-ai-lab.git
cd geromtology-ai-lab
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Node.js 22.19 or later and the pinned pnpm version are required. Cloudflare Workers Builds validates and publishes the production branch. The application has no dependency on the ChatGPT Sites runtime.

## Research instruments

| Instrument | Role |
| --- | --- |
| Evidence library | Search and filter a selected reference collection with explicit limitations |
| PhenoAge Explorer | Inspect the published clinical biomarker model, units and reproducible calculations |
| Study Planner | Explore two-group sample size, noncentral-t power, allocation and dropout |
| Evidence Copilot | Compare prepared source notes using server-side Azure AI and source-linked answers |
| Enquiries | Receive research, pilot and investment enquiries in a private Cloudflare D1 inbox |

This is a working research prototype. It does not provide diagnosis or treatment advice, and it does not claim clinical validation, completed commercial pilots, customers or funding. The evidence collection is curated; the assistant works from prepared notes rather than live literature search or full-text retrieval.

## Documentation

- [Architecture and development](https://github.com/offflinerpsy/geromtology-ai-lab/blob/cloudflare/production/README.md)
- [Deployment, authentication, secrets and rollback](https://github.com/offflinerpsy/geromtology-ai-lab/blob/cloudflare/production/docs/DEPLOYMENT.md)
- [Release verification](https://github.com/offflinerpsy/geromtology-ai-lab/blob/cloudflare/production/docs/RELEASE-2026-10-11.md)
- [Contribution guide](https://github.com/offflinerpsy/geromtology-ai-lab/blob/cloudflare/production/CONTRIBUTING.md)
- [Ownership and third-party material](https://github.com/offflinerpsy/geromtology-ai-lab/blob/cloudflare/production/RIGHTS.md)

The earlier implementation remains on `main` to preserve its legacy Vercel integration and history. Start new product work from `cloudflare/production`. The backup branch `backup/before-cloudflare-migration-20261011` preserves the pre-migration revision.

Maintained by Alex Yarosh. Public visibility does not grant an open-source license.
