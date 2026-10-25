# AI evidence product — release verification, 25 October 2026

Production source: `9ef74c61b8959d480fce391216e3442bb9e9db5e` (tree `1f1c647fd506d0c9d2774309cd7f07c26afc8ce1`). This includes the product release and the live-verified retrieval/citation correction.

Cloudflare build `4f6c7b97-6676-4699-90e4-80c5c4e1b64b` completed successfully at 09:34:08 UTC. Deployment `045eb8d4-8f54-4158-8373-b033fed318ea` serves Worker version `69c522e2-508c-490e-94ef-4b151ef4f523` at 100% traffic. The production browser was reloaded after deployment and reached the configured signed-out state. Rollback reference: `backup/before-ai-evidence-product-20261025` → `5393a879718a5440d17197ce0c47fa6a70a0db0e`.

## Completed checks

- TypeScript checks, all 36 automated tests and the production build pass. New tests cover bounded conversations, scope-routing decisions with synthetic provider responses, malformed/failed classification, query injection, literature metadata normalization, retracted/preprint/invalid-source rejection, current-source citation validation, empty/outage behavior and streamed byte limits. Live-discovered regressions cover long literal search phrases, broad OR queries and leaked citation display annotations. Existing auth and calculator tests remain passing.
- Real Europe PMC retrieval: a DunedinPACE/CALERIE query returned 395 indexed matches and twelve records; the normalizer accepted six abstracts and constructed PubMed links. This verifies the actual retrieval service, not live Azure generation.
- Isolated Cloudflare review build for application commit `2455332f05c30901efbab6b33567a157f7599275` passed. Only README/deployment documentation changed between that application commit and production.
- Browser inspection of the assistant at 390, 768, 1440 and 1920 frame widths; additional overflow measurements at 360, 430, 599, 601, 959 and 961. All measured document scroll widths matched client widths. The native scrollbar consumes 15 pixels inside the frame, so effective content widths were frame width minus 15.
- Mobile home and tablet About inspected. Original green hero image and animation implementation remain unchanged; only hero text and destination links changed.
- Assistant examples populate the question. Both source modes work. Multiple curated sources can be selected without collapsing the picker; selected notes remain visible.
- JavaScript-disabled rendering retains product/method copy and the explicit fallback links to the evidence library and AI method. AI input is not usable without JavaScript.
- Production browser shows the new assistant, research-workspace navigation and the correct signed-out state. The sign-in CTA opens the existing Cloudflare Access email-code form. The research app remains verified-email access; no Access policy was widened or bypassed. Existing server-side secret names remain present.
- Temporary preview Worker and its build trigger were removed after production verification.

## Live server-side verification

The owner's existing Azure CLI connection on the explicitly authorized Mac was used for a bounded check of the actual research modules. The Azure key was obtained and used only inside the local verification process; it was never returned, persisted in a test file or committed. No new Azure resource, browser identity, Access policy or unauthenticated production route was created.

The first live check exposed two retrieval problems: the classifier generated long phrases that the query required verbatim, and OR between concepts let general aging articles outrank the named CALERIE study. The corrected query uses concise essential concepts and non-stopword terms combined with AND. It retrieved the 2023 CALERIE paper, PMID 37118425, and the 2020 DunedinPoAm paper for the initial question; the follow-up retrieved CALERIE itself. The answers distinguished a modest DunedinPACE biomarker effect from evidence of longer life, described the post hoc analysis and limited follow-up, and distinguished clinical PhenoAge from methylation measures.

All six live cases passed: literature question (13.0 seconds), contextual follow-up (11.8 seconds), curated biomarker comparison (6.6 seconds), unrelated coding (2.8 seconds), mixed-topic instruction override (1.7 seconds), and personal dosing (1.6 seconds). The three boundary cases made only a classification call, without literature retrieval or synthesis. See [request/source metadata](ai-live-checks-20261025.json). No raw abstracts or credentials are included in that record.

The model sometimes inserted citation tokens or bracketed formatting notes in prose despite structured source IDs. A final deterministic display cleanup removes these annotations while preserving and validating the linked source ID arrays. Captured examples are covered by the regression test. This display-only step was applied after the live generation; retrieval and prompts remained unchanged.

## Remaining verification limits

The Azure/retrieval checks were server-side, not through an authenticated visitor browser session. The signed-in browser conversation, production HTTP auth-to-generation chain and actual brief download remain unverified. Six live cases do not establish general scientific accuracy or prompt-injection resistance. The source/limit checks reduce risk but do not certify scientific correctness.

Direct shell HTTP smoke requests were rejected by Cloudflare screening with code 1010; this was not an application response. Browser rendering and the sign-in transition succeeded. Do not report a production anonymous API POST returning 401 from those blocked shell checks.

FPS, reduced-motion changes and all unrelated routes were not re-audited in this content/assistant change; the motion implementation was preserved. No patient data, credentials, enquiry records or model-generated clinical claims were used as test data.

![Published Evidence Copilot, signed-out state](ai-copilot-production-20261025.jpg)
