# Public chat and health check-ins — 25 October 2026

## Owner request and shipped direction

Remove the visitor login from research chat, investigate all eleven reference tests at peptide.sale/calculator, add carefully written English check-ins, and reduce the site's navigation and information overload. Preserve the approved typography, mineral/botanical palette and original green WebGL hero.

The home page now offers three clear starting points: ask a question, take a health check-in, or use a research tool. The header uses four direct links and one Ask AI action. The laboratory and tools pages explain those choices briefly. Research source settings and method detail are progressive disclosures; a source panel appears with the answer. Existing scientific and institutional pages remain reachable.

## Reference inspection and content decisions

Delegated reviewers completed all eleven reference categories using synthetic answers, without accounts, purchases or personal data. Useful interaction: choose a topic, answer one question at a time, see a result. Defects excluded: inverted general-health interpretation, undefined skin/digital-overload results, mixed or shortened clinical scales, fabricated biological-age implications and product/treatment recommendations.

Atlas contains GAD-7, PHQ-9 and SARC-F with published scoring, plus eight descriptive check-ins. The eight do not produce invented clinical scores. Anxiety/mood include an unscored impact question. PHQ-9 item 9 support is independent of the total. All answers remain in browser memory and can be saved explicitly as Markdown; no account, server submission, AI transfer or browser persistence.

Primary sources reviewed:

- https://www.hiv.uw.edu/page/mental-health-screening/gad-7
- https://www.hiv.uw.edu/page/mental-health-screening/phq-9
- https://uhs.fsu.edu/sites/g/files/upcbnu1651/files/docs/PHQ-9%20and%20GAD-7%20Form_a.pdf
- https://www.pfizer.com/news/press-release/press-release-detail/pfizer_to_offer_free_public_access_to_mental_health_assessment_tools_to_improve_diagnosis_and_patient_care
- https://www.slu.edu/medicine/internal-medicine/geriatric-medicine/aging-successfully/-pdf/rapid-geriatric-assessment.pdf
- https://www.va.gov/PAINMANAGEMENT/docs/PainNRS.pdf
- https://archive.cdc.gov/www_cdc_gov/hrqol/hrqol14_measure.htm
- https://988lifeline.org/ and https://988.ca/

## Public AI boundary

The public API requires no Access identity or cookie. Same-origin JSON, bounded content, scope classification, retrieved-source validation and private owner-inbox protection remain. D1 atomically enforces three requests/minute and twenty/UTC day per network, plus the existing site ceiling of three hundred/day. A daily HMAC identifies networks; IPv6 groups use /64. Raw IPs and prompts are not stored in rate-limit records. Shared networks share an allowance. Missing provider, D1 or trusted edge context fails closed.

## Automated and preview verification

Candidate `3ee5c599cc7269873ef047ac1814018485ecada8`; tree `350aaccce5509cfd5989e5ddc691a1296a2cd9f1`. Local and remote trees match. TypeScript, all 50 tests and production build passed. Cloudflare isolated review build `aa339bfc-87f0-4d0e-938a-15f90286854e` passed. It had no production AI secrets, D1 or email bindings, so its AI-unavailable state was expected.

Browser checks used the supported cloud browser. The preview wrapper rendered 390/768/1440/1920 CSS widths plus 959/960/1000/1001 navigation boundaries. Scrollbars consume 15px of content width. No horizontal overflow in the tested chat layouts; mobile Menu and desktop links/Ask AI switch without duplication. Keyboard Enter opens the mobile navigation, Escape closes it. Home three-path anchor, collection topic filter and tools cards were checked visually. Collection descriptions and all eleven categories remain visible with JavaScript disabled; the page explains that interactive answering requires JavaScript.

SARC-F synthetic browser case: Some for the first four items, no falls. Result 4/10 and 'Further assessment indicated'. Back preserved the selected answer; no initial answer was selected; Continue was disabled until selection. PHQ-9 synthetic case: first eight zero, item9 one, impact zero. Result 1/27; supportive guidance appeared on item9, persisted through impact and remained on the result. Actual top-level Markdown download contained all ten responses, the score, support, interpretation, sources and privacy note. A preview iframe download event timed out; top-level download succeeded.

The existing hero animation implementation was not changed. No new animation performance or reduced-motion browser measurement is claimed by this release; existing reduced-motion/offscreen behavior was preserved. Scores are screening/reflection information, not a claim of clinical validation of the application.

## Production verification

The first production candidate deployed successfully (build `8c7a800e-8413-4086-895e-de47a09b5eb3`, version `35747513-455e-4030-a364-b598abb86bb3`, 100%). The first real public literature request exposed a production-only error: Workers does not support `redirect: error`, which Node-based provider checks had accepted. The scope boundary and curated-note answer both succeeded, isolating retrieval. Official Cloudflare documentation confirms the runtime behavior: https://developers.cloudflare.com/workers/runtime-apis/request/ . Retrieval now uses `manual` and rejects non-2xx, including redirects, without following a different destination. Regression cases cover 301/302/307/308 and safe stage diagnostics. Logs contain only allowlisted internal codes and error classes, never prompts, provider bodies or arbitrary exception messages.

The live curated CALERIE answer, contextual follow-up and actual Markdown brief download passed without signing in. The downloaded 2,108-byte brief contained the title, question, limitations, source links and retrieval provenance. A follow-up exposed a formatting annotation, `[Citation omitted per format.]`; the existing citation-decoration cleanup was extended and tested while retaining verified source links.

Additional browser QA passed General health=Excellent and Pain=5/A little, with descriptive summaries and no invented total score. All remaining first-question routes were opened through the chooser and had zero selected answers with disabled Continue.

Fixed release `7ae6a306ce978f4bfb7d9084b4aed51637091cde` (tree `aef2358061fd2f853b159cf996f2b295da83c92a`) passed TypeScript, all 53 tests and build. Production build `dab9a1cf-fecc-4746-acce-37e6f80b835d` succeeded; deployment `73c7935b-bb86-400b-8542-fbb698ce9df4` served version `a1844dcc-7ac2-4f36-881a-b312f924f16e` at100%.

The anonymous production browser then completed CALERIE literature search: two usable indexed abstracts, a source-linked answer and limitations. A contextual follow-up asking which measures changed returned a fresh source-linked answer and one matching abstract. Neither request visited Cloudflare login. Verified cited PMID37118425 against the primary PubMed record. The real literature-mode download was3511bytes and included PubMed links, abstract basis, query, retrieval time and limitations, without leaked formatting annotations. Unrelated coding produced the intended scope boundary. Reset from curated mode returned to literature mode and cleared selected notes. Prompt buttons were disabled while a request was running.

Production `/tools/check-ins` rendered all eleven categories. Screenshots are in `images/checkins-live-20261025.jpg` and `images/public-chat-live-20261025.jpg`. The final proof commit also corrects singular 'abstract' in the source-count label; the AI pipeline is unchanged from the verified release.

Temporary review infrastructure is removed after these checks. No production secrets, domain/email settings, enquiry data or private Access policies were changed.
