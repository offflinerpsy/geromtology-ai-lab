# ProAge Atlas: AI product direction

Decision date: 25 October 2026. This is a product and engineering decision, not clinical validation.

## The product

ProAge Atlas is an independent software startup building an AI evidence workspace for geroscience teams. Its initial product is Evidence Copilot: a question becomes a source-linked research brief, with findings, methods, limitations and a reproducible search record. The initial audience is small geroscience laboratories and clinical research teams comparing aging measurements and published findings. Audience demand and willingness to pay remain hypotheses to validate.

The language model is supplied through the existing Azure deployment. The product contribution is the domain-specific workflow, evidence provenance and reviewable output, not ownership of a medical foundation model.

Current prototype: topic-scoped conversation, live retrieval of indexed biomedical abstracts, an optional curated-note mode, three follow-ups, downloadable Markdown briefs, measurement references and deterministic calculators. Next: saved research projects and review history. Later, subject to pilot evidence: team review, new-publication monitoring and subscriptions. No commercial adoption, scientific accuracy, clinical certification or delivery date is asserted.

## What Microsoft offers

| Option | What it provides | Decision for this prototype |
|---|---|---|
| Healthcare Agent Service | Managed healthcare assistant platform, visual scenarios, healthcare grounding and web-chat integration | A real ready-made option if the product becomes patient-facing or needs healthcare service workflows. It still requires configuration, sources and evaluation. No separate resource was provisioned. |
| Healthcare AI foundation models | Research building blocks for medical imaging and other specialist data modalities | Not a ready-made geroscience literature chat. Consider only for a defined research task with suitable data and validation. |
| Azure OpenAI Responses API web search | Bing-backed indexed search, domain filtering and URL citations | An available broader-web option. Additional search charges and data-boundary conditions apply. Microsoft documents that external live-page access is not supported by this tool; avoid calling it unrestricted live browsing. |
| Existing Azure model + Europe PMC retrieval | Existing model connection with public publication metadata and abstracts | Selected for the initial evidence product. No additional model training, new Azure resource or search API key is needed. |
| MAI-DxO | Diagnostic research orchestration and evaluation, with current real-world study plans | Not treated as a documented deployable chat/API for this product. Benchmark results are not evidence for Atlas performance. |

Healthcare Agent pricing documentation currently distinguishes F0 evaluation/development from C1 consumption. C1 lists $0.01 per action, with different tasks consuming different action counts; it is not a flat monthly complete-product estimate. S1 is deprecated. Any future procurement needs actual regional availability, subscription eligibility, licensing and workload costs checked at that time.

## Implemented workflow

1. Existing Cloudflare Access session is signature-, issuer-, audience- and expiry-verified.
2. Validate bounded request and exact Origin. Enforce six requests/minute, forty/day per user and three hundred/day for the prototype across the site (UTC buckets). Failed/classification requests consume allowance too.
3. Azure classifies the latest request with bounded conversation context. Non-research, personal medical and unsafe requests return fixed scope messages without retrieval or answer generation. Classification is probabilistic, not an unbreakable security boundary.
4. For literature mode, generate concise scientific concepts and construct a server-owned Europe PMC query, constrained to aging-related PubMed-indexed records with abstracts. Combine essential concepts and their non-stopword terms with AND: long model phrases are not treated as literal quotations, and broad alternative topics do not swamp a named study. Exclude records marked as retracted. Do not fetch user/model-supplied URLs. Take up to six usable abstracts from the first twelve relevance-ranked results. Indexing and the retraction filter do not establish publication quality or comprehensive correction coverage. A narrow query can miss relevant work; an empty retrieval is disclosed rather than replaced with model memory.
5. Ask Azure to synthesize only the current source set. Historical answers are conversational context, never evidence. Require paragraph-level source identifiers and reject unknown citations or malformed output. These checks do not verify entailment or scientific correctness.
6. Show sources, abstract/note basis, query, retrieval time and limitations. Export a Markdown brief. No silent fallback to model memory after failed/empty retrieval.

The original key remains a server-side Cloudflare secret. Requests use `store:false`; this is not a claim about all Azure operational retention. Question/context and retrieved public evidence go to Azure; generated scientific search phrases go to Europe PMC. Conversations stay in tab memory and are not persisted in the application database. Do not enter personal medical data or confidential research.

## Evaluation and release limits

Automated tests exercise boundaries with provider fixtures, retrieval normalization, query injection, citation rejection, bounded inputs, failure paths and the existing mathematical/authentication behavior. Six additional live server-side checks used the existing Azure connection and real Europe PMC service on 25 October: CALERIE retrieval and synthesis, a contextual follow-up, curated biomarker comparison, unrelated coding, a mixed-topic instruction override, and a personal dosing prompt. These passed after correcting literal-phrase and overly broad query behavior. Source and request metadata are recorded in `../qa/ai-live-checks-20261025.json`. These are smoke checks, not a scientific or adversarial benchmark. The authenticated browser conversation and actual brief download remain separate, unverified paths; no visitor identity or Access policy was forged or changed. Before broader use, expand representative evaluation and obtain expert review of citation fidelity and omissions. A published scientific benchmark does not yet exist.

## Primary sources consulted

- Microsoft Healthcare Agent overview: https://learn.microsoft.com/en-us/azure/health-bot/overview
- Current pricing and deprecated-tier distinction: https://learn.microsoft.com/en-us/azure/health-bot/pricing-details
- Healthcare AI model scope: https://learn.microsoft.com/en-us/azure/foundry-classic/how-to/healthcare-ai/healthcare-ai-models
- Azure Responses web search, filters, billing and limitations: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/web-search
- Current MAI-DxO research update (22 October 2026): https://microsoft.ai/news/building-medical-superintelligence/
- Europe PMC REST API, core metadata/abstracts and relevance ordering: https://europepmc.org/RestfulWebService
