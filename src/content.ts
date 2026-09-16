export const siteOrigin = 'https://geromtology-ai-lab.vercel.app';
export const media = {
  cells: '/media/cells-1280.webp',
  laboratory: '/media/laboratory-1280.webp',
  epigenetics: '/media/epigenetics-1280.webp',
  ilnitski: 'https://proage.online/assets/proage/card1-portrait-crop.png',
  prashchayeu: 'https://proage.online/assets/proage/card2-portrait-crop.png',
  institute: 'https://proage.online/assets/proage/hero-global-health-summit.jpg',
};

export const routes: Record<string, { title: string; description: string }> = {
  '/': { title: 'ProAge Atlas — A longer view of human health', description: 'Aging research, medical expertise and applied AI. Explore ProAge Atlas, its scientific context and its research software laboratory.' },
  '/institute': { title: 'Institute & People — ProAge Atlas', description: 'The human perspective behind ProAge Atlas. Medical expertise, gerontology, professional education and hands-on research engineering.' },
  '/research': { title: 'Research — ProAge Atlas', description: 'Explore longevity medicine, geriatric medicine, aging biomarkers and evidence-led research methods.' },
  '/research/longevity': { title: 'Longevity Medicine — ProAge Atlas', description: 'An inquiry into healthy aging across the life course: prevention, healthspan and the interpretation of intervention evidence.' },
  '/research/geriatrics': { title: 'Geriatric Medicine — ProAge Atlas', description: 'A research perspective on function, autonomy and the everyday environments of older people.' },
  '/research/biomarkers': { title: 'Biomarkers & Measurement — ProAge Atlas', description: 'Compare the questions behind aging measurements, from clinical Phenotypic Age to DNA methylation and pace-of-aging methods.' },
  '/laboratory': { title: 'AI Laboratory — ProAge Atlas', description: 'Explore source-grounded research software, a local evidence library and an independent AI evaluation program.' },
  '/projects': { title: 'Projects & Initiatives — ProAge Atlas', description: 'Explore ProAge Atlas research software and selected public research and education initiatives from OIAA.' },
  '/methods': { title: 'Methods & Trust — ProAge Atlas', description: 'How the research program approaches provenance, correction-aware methods, synthetic data and expert review.' },
  '/contact': { title: 'Get in Touch — ProAge Atlas', description: 'Start a conversation about aging research, professional education, research pilots or technology collaboration.' },
};

export const fields = [
  { slug: 'longevity', title: 'Longevity medicine', kicker: 'Health across the life course', image: media.cells, imageKind: 'cells', text: 'What helps people retain health, ability and possibility as they age? We bring a research perspective to prevention, lifestyle and the biology of aging.', tags: 'Healthspan · Prevention · Evidence' },
  { slug: 'geriatrics', title: 'Geriatric medicine', kicker: 'The person beyond the measurement', image: media.institute, imageKind: 'institute', text: 'Function and independence belong at the centre of the conversation. Explore the relationship between medical knowledge, everyday environments and the needs of older people.', tags: 'Function · Independence · Quality of life' },
  { slug: 'biomarkers', title: 'Biomarkers & measurement', kicker: 'A measurement is a starting point', image: media.epigenetics, imageKind: 'epigenetics', text: 'Different measurements answer different questions. We examine how age estimates, pace measures and functional outcomes can be compared without losing their context.', tags: 'Biological signals · Methods · Interpretation' },
];

export const readings = [
  { key: 'dunedinpace', category: 'Biomarkers', title: 'DunedinPACE', subtitle: 'A DNA methylation biomarker of the pace of aging', publication: 'Belsky et al. · eLife · 2022', text: 'A pace-of-aging measure developed using longitudinal observations and DNA methylation. It asks a different question from an estimate of chronological age.', caveat: 'A research biomarker is not evidence that a particular treatment extends life.', url: 'https://elifesciences.org/articles/73420' },
  { key: 'phenotypic', category: 'Biomarkers', title: 'Clinical Phenotypic Age', subtitle: 'Read the corrected method, not just the headline', publication: 'Liu et al. · PLOS Medicine · 2019 correction', text: 'The published correction is a necessary reference when implementing the clinical Phenotypic Age method. Coefficients, units and transformations need to remain attached to the calculation.', caveat: 'Clinical Phenotypic Age is not the DNA-methylation PhenoAge assay.', url: 'https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1002760' },
  { key: 'healthy-aging', category: 'Healthy aging', title: 'Healthy aging', subtitle: 'A person-centred frame for the research', publication: 'World Health Organization · Topic resource', text: 'A starting point for understanding aging in relation to people, their abilities and the environments in which they live.', caveat: 'A public health resource, not a personalized care assessment.', url: 'https://www.who.int/health-topics/ageing' },
  { key: 'rag', category: 'AI methods', title: 'Retrieval-augmented generation', subtitle: 'Connecting a language model with retrieved material', publication: 'Lewis et al. · Research paper · 2020', text: 'A foundational approach to combining retrieval with text generation. The laboratory treats source-grounded retrieval as a candidate workflow to evaluate, not a guarantee of correct answers.', caveat: 'Source retrieval does not replace expert assessment of a scientific claim.', url: 'https://arxiv.org/abs/2005.11401' },
];

export const articleCopy: Record<string, { eyebrow: string; title: string; emphasis: string; lead: string; image: string; caption: string; sections: { title: string; body: string }[]; source: string; sourceLabel: string }> = {
  longevity: {
    eyebrow: 'Longevity medicine', title: 'More life in', emphasis: 'the years ahead.',
    lead: 'Healthy aging is a lifelong question. Our interest is in the evidence that connects biological understanding with the possibilities of everyday life.',
    image: media.cells, caption: 'Conceptual cellular study. Illustrative, not experimental output.',
    sections: [
      { title: 'Begin with the question', body: 'An intervention can be studied for many different reasons: a change in a biological signal, an effect on physical function, or an outcome that matters to people over time. The research question needs to specify which of these is being examined. Our proposed evidence work separates the population, intervention, comparison and outcome before attempting to compare findings.' },
      { title: 'Follow the whole chain of evidence', body: 'We want research records to retain the design of the study, the population observed and the limitations acknowledged by its authors. A laboratory observation and a clinical outcome should not become interchangeable when they are summarized. The same care is needed when interpreting prevention, lifestyle and emerging approaches to longevity medicine.' },
      { title: 'Connect research with practice thoughtfully', body: 'The scientific context includes the Open Institute of Age and Aging and its work in longevity medicine and professional education. ProAge Atlas explores the software side of that conversation: how specialists can inspect sources, compare methods and keep their assessments reproducible.' },
      { title: 'The next research step', body: 'Develop a defined review question with a scientific collaborator. Agree inclusion criteria, create a source registry and compare structured extraction with an expert reference. This is a proposed research workflow, not a clinical service or a recommendation to use a particular intervention.' },
    ], source: 'https://www.who.int/health-topics/ageing', sourceLabel: 'Explore the WHO resource on ageing',
  },
  geriatrics: {
    eyebrow: 'Geriatric medicine', title: 'The science of', emphasis: 'living well.',
    lead: 'Function, independence and dignity give aging research its human scale. The person should remain visible behind every measurement.',
    image: media.institute, caption: 'OIAA scientific leadership. Image and institutional context: proage.online.',
    sections: [
      { title: 'Look beyond a single score', body: 'Our research perspective begins with the activities, relationships and environments that shape everyday life. A useful evidence record should explain what was measured and why it mattered to the people involved. ProAge Atlas is designed around keeping that context available instead of compressing it into one universal age score.' },
      { title: 'Bring disciplines into the same conversation', body: 'Medical expertise, professional education and digital methods offer different ways of examining the same problem. The goal of a shared research workspace is not to replace those perspectives. It is to make the questions, definitions and assumptions legible across them, so that collaborators can understand where their interpretations agree and where they differ.' },
      { title: 'Preserve the setting', body: 'Evidence gathered in a particular community or research population should retain that setting when it travels. The proposed review schema includes population, geography, follow-up, outcome definitions and missing information. Where a paper does not support a field, the record should say so rather than supply a plausible-looking answer.' },
      { title: 'Translate knowledge responsibly', body: 'OIAA provides the institutional context for geriatric medicine and professional education. The ProAge Atlas software initiative is separate from clinical practice. Public demonstrations do not accept patient records, provide a diagnosis or create an individualized care plan. Any clinical study would require its own governance, roles and approvals.' },
    ], source: 'https://proage.online/', sourceLabel: 'Read the institute’s geriatric medicine overview',
  },
  biomarkers: {
    eyebrow: 'Biomarkers & measurement', title: 'Different signals.', emphasis: 'Deeper questions.',
    lead: 'Aging is not one measurement. The research program asks what each signal describes, what it leaves out and when comparison is meaningful.',
    image: media.epigenetics, caption: 'Conceptual epigenetic illustration. Not a molecular simulation or assay result.',
    sections: [
      { title: 'Keep the method with the result', body: 'A method name alone is not enough for reproducible work. The laboratory’s proposed method register keeps the original publication, correction history, variable definitions, units and implementation assumptions together. A reviewer should be able to reconstruct what was done without reverse-engineering a chart or relying on a model’s explanation.' },
      { title: 'Age and pace are different questions', body: 'DunedinPACE is a DNA-methylation biomarker of the pace of aging. Clinical Phenotypic Age is a different research method, with a published correction that matters for implementation. These examples make a practical point: two outputs should not be treated as interchangeable just because both are described in the language of aging.' },
      { title: 'Inspect disagreement', body: 'The proposed program begins by comparing definitions and assumptions. Later work would examine missingness, calibration and performance in appropriately governed datasets. A disagreement between measures can be a useful research question. It should not be hidden by selecting whichever score gives the most attractive story.' },
      { title: 'A research program, not a diagnostic shortcut', body: 'The public reference explorer links to original methods and keeps limitations visible. It does not run an epigenetic assay or estimate an individual’s biological age. Expert review and independent evaluation remain prerequisites for any new implementation or claim of practical usefulness.' },
    ], source: 'https://elifesciences.org/articles/73420', sourceLabel: 'Read the original DunedinPACE paper',
  },
};

export const projects = [
  { title: 'ProAge Atlas', category: 'Technology', label: 'Independent software initiative', text: 'A research workspace for traceable evidence, method comparison and auditable AI evaluation.', image: media.laboratory, href: '/laboratory', external: false },
  { title: 'Aging in the Democratic Republic of Congo', category: 'Research', label: 'OIAA · Community research', text: 'A public report on functional disorders among older people in South Kivu.', image: 'https://proage.online/assets/docs/rapport-rdc-aging-project-cover.jpg', href: 'https://proage.online/#news', external: true },
  { title: 'Gerontology in Côte d’Ivoire', category: 'Education', label: 'OIAA · Professional education', text: 'An educational initiative centred on independence, dignity and everyday environments.', image: 'https://proage.online/assets/docs/cote-divoire-gerontology-course-cover.jpg', href: 'https://proage.online/#news', external: true },
  { title: 'Peptide Calculator', category: 'Technology', label: 'OIAA · External digital project', text: 'An institute initiative in self-assessment and healthy-aging education. Separate from ProAge Atlas.', image: media.epigenetics, href: 'https://peptide.sale/', external: true },
];
