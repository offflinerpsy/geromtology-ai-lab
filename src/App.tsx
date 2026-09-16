import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Download, Menu, Minus, Pause, Play, Plus, Search, X } from 'lucide-react';
import { articleCopy, fields, media, projects, readings, routes, siteOrigin } from './content';

type Children = { children: React.ReactNode };
export const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';

function Mark() {
  return <svg className="brand-mark" viewBox="0 0 42 42" fill="none" aria-hidden="true"><ellipse cx="21" cy="21" rx="9" ry="18" stroke="currentColor" strokeWidth="1.2" transform="rotate(-35 21 21)" /><ellipse cx="21" cy="21" rx="9" ry="18" stroke="currentColor" strokeWidth="1.2" transform="rotate(35 21 21)" /><path d="M7 32c9-10 18-13 28-22" stroke="currentColor" strokeWidth="1.2" /></svg>;
}
function Brand() {
  return <a className="brand" href="/" aria-label="ProAge Atlas home"><Mark /><span className="brand-name">ProAge<span>ATLAS</span></span></a>;
}
function Eyebrow({ children }: Children) { return <p className="eyebrow">{children}</p>; }
function TextLink({ href, children, className = '', external = false }: Children & { href: string; className?: string; external?: boolean }) {
  return <a href={href} className={`text-link ${className}`} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><span>{children}</span><ArrowUpRight size={19} /></a>;
}
function ButtonLink({ href, children, light = false }: Children & { href: string; light?: boolean }) {
  return <a className={`button-link ${light ? 'button-light' : ''}`} href={href}><span>{children}</span><span className="button-arrow"><ArrowUpRight size={19} /></span></a>;
}
function Image({ src, alt, eager = false, className = '', sizes = '(max-width: 760px) 100vw, 60vw' }: { src: string; alt: string; eager?: boolean; className?: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed) return <span className={`image-fallback ${className}`} role="img" aria-label={alt}><Mark /><span>Image temporarily unavailable</span></span>;
  const srcSet = src.startsWith('/media/') ? [640, 1280, 1920].map(width => `${src.replace('-1280', `-${width}`)} ${width}w`).join(', ') : undefined;
  return <img className={className} src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} width="1600" height="1000" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" onError={() => setFailed(true)} />;
}

function Header({ path }: { path: string }) {
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const researchButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const dark = path === '/' || path === '/laboratory';
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => { setMega(false); setMobile(false); }, [path]);
  useEffect(() => {
    if (!mega) return;
    const dismiss = (event: PointerEvent) => { if (!(event.target as Element).closest('.site-header')) setMega(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMega(false); researchButton.current?.focus(); } };
    document.addEventListener('pointerdown', dismiss); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, [mega]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (!mobile) { if (node.open) node.close(); return; }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!node.open) node.showModal();
    const resize = () => { if (window.innerWidth > 1050) setMobile(false); };
    window.addEventListener('resize', resize);
    return () => { document.body.style.overflow = previous; window.removeEventListener('resize', resize); if (node.open) node.close(); menuButton.current?.focus(); };
  }, [mobile]);
  const active = (href: string) => path === href || (href !== '/' && path.startsWith(href + '/'));
  return <>
    <header className={`site-header ${dark ? 'header-on-dark' : ''} ${scrolled ? 'is-scrolled' : ''} ${mega ? 'is-expanded' : ''}`} onMouseLeave={() => setMega(false)}>
      <div className="header-bar wrap">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/institute" aria-current={active('/institute') ? 'page' : undefined} onFocus={() => setMega(false)}>Institute</a>
          <div className="nav-disclosure" onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setMega(true); }}>
            <button ref={researchButton} className={active('/research') ? 'is-current' : ''} type="button" aria-expanded={mega} aria-controls="research-navigation" onClick={() => setMega(value => !value)}>Research <ChevronDown size={14} /></button>
          </div>
          <a href="/laboratory" aria-current={active('/laboratory') ? 'page' : undefined} onFocus={() => setMega(false)}>AI Laboratory</a>
          <a href="/projects" aria-current={active('/projects') ? 'page' : undefined} onFocus={() => setMega(false)}>Projects</a>
        </nav>
        <div className="header-actions"><a className="contact-link" href="/contact">Get in touch <ArrowUpRight size={17} /></a><button ref={menuButton} className="menu-toggle" aria-label="Open navigation" aria-expanded={mobile} aria-controls="mobile-navigation" onClick={() => setMobile(true)}><Menu size={24} /></button></div>
      </div>
      <div className={`mega-menu ${mega ? 'is-open' : ''}`} id="research-navigation" inert={!mega} aria-hidden={!mega}>
        <div className="mega-inner wrap"><div className="mega-intro"><Eyebrow>Fields of inquiry</Eyebrow><p>A longer view.<br /><em>A closer look.</em></p><TextLink href="/research">Explore all research</TextLink></div><div className="mega-links">{fields.map(field => <a href={`/research/${field.slug}`} key={field.slug}><span><strong>{field.title}</strong><small>{field.kicker}</small></span><ArrowUpRight size={21} /></a>)}<a href="/methods"><span><strong>Methods & trust</strong><small>How we approach the evidence</small></span><ArrowUpRight size={21} /></a></div><a href="/laboratory" className="mega-feature"><Image src={media.laboratory} alt="Conceptual research laboratory" /><span>Inside the AI laboratory <ArrowUpRight size={20} /></span></a></div>
      </div>
    </header>
    {mega && <div className="nav-shade" aria-hidden="true" />}
    <dialog id="mobile-navigation" ref={dialog} className="mobile-dialog" aria-label="Site navigation" onCancel={event => { event.preventDefault(); setMobile(false); }} onClose={() => setMobile(false)}>
      <div className="mobile-dialog-top"><Brand /><button className="round-button" onClick={() => setMobile(false)} aria-label="Close navigation"><X size={24} /></button></div>
      <nav aria-label="Mobile navigation" onClick={event => { if ((event.target as Element).closest('a')) setMobile(false); }}><a href="/institute">Institute <ArrowUpRight /></a><a href="/research">Research <ArrowUpRight /></a><div className="mobile-subnav">{fields.map(field => <a key={field.slug} href={`/research/${field.slug}`}>{field.title}</a>)}</div><a href="/laboratory">AI Laboratory <ArrowUpRight /></a><a href="/projects">Projects <ArrowUpRight /></a><a href="/contact">Get in touch <ArrowUpRight /></a></nav>
      <div className="mobile-dialog-bottom"><a href="mailto:hello@base2026.dev">hello@base2026.dev</a><span>Aging research & intelligence</span></div>
    </dialog>
  </>;
}

function Footer({ paused, onPause }: { paused: boolean; onPause: () => void }) {
  return <footer className="site-footer"><div className="wrap"><div className="footer-top"><div><Brand /><p>Understanding aging.<br />Expanding possibility.</p></div><nav aria-label="Footer navigation"><div><span>Explore</span><a href="/institute">Institute & people</a><a href="/research">Research</a><a href="/projects">Projects & initiatives</a></div><div><span>The laboratory</span><a href="/laboratory">ProAge Atlas</a><a href="/laboratory#evidence">Evidence library</a><a href="/methods">Methods & trust</a></div><div><span>Connect</span><a href="/contact">Get in touch</a><a href="https://proage.online/" target="_blank" rel="noopener noreferrer">Visit OIAA <ArrowUpRight size={13} /></a><a href="https://base2026.dev/founder" target="_blank" rel="noopener noreferrer">Founder profile <ArrowUpRight size={13} /></a></div></nav></div><div className="footer-bottom"><span>© 2026 ProAge Atlas</span><p>Independent research software initiative. Not a diagnostic or medical service.<br />Scientific references and institutional profiles are not endorsements.</p><button onClick={onPause} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? 'Motion paused' : 'Pause motion'}</button></div></div></footer>;
}
function Invitation() {
  return <section className="invitation"><div className="wrap"><div className="invitation-meta reveal"><Eyebrow>A shared field of possibility</Eyebrow><p>Research partners, thoughtful collaborators<br />and people asking the next question.</p></div><a href="/contact" className="invitation-link reveal"><span>Let’s look <em>further.</em></span><span className="invitation-arrow"><ArrowUpRight strokeWidth={1} /></span></a></div></section>;
}

function HomeHero({ paused, onPause }: { paused: boolean; onPause: () => void }) {
  return <section className="home-hero"><div className="hero-art" aria-hidden="true"><Image src={media.cells} eager alt="" sizes="100vw" /></div><div className="hero-vignette" /><div className="hero-content wrap"><Eyebrow>The science of aging. The possibilities of life.</Eyebrow><h1><span className="hero-line"><span>A deeper</span></span><span className="hero-line"><span>understanding.</span></span><span className="hero-line hero-italic"><span>A longer horizon.</span></span></h1><div className="hero-bottom-copy"><p>Bringing medical expertise, aging research<br className="desktop-break" /> and artificial intelligence into perspective.</p><ButtonLink href="/research" light>Explore our work</ButtonLink></div></div><div className="hero-foot wrap"><a className="scroll-cue" href="#purpose"><span><ArrowDown size={18} /></span>Discover ProAge</a><div className="hero-caption"><span>Conceptual cellular study<br />Illustrative, not experimental output</span><button className="round-button" aria-label={paused ? 'Resume motion' : 'Pause motion'} aria-pressed={paused} onClick={onPause}>{paused ? <Play size={15} /> : <Pause size={15} />}</button></div></div></section>;
}

function ResearchLens({ full = false }: { full?: boolean }) {
  const [selected, setSelected] = useState('longevity');
  const current = fields.find(field => field.slug === selected)!;
  return <section className={`research-section section-space ${full ? 'research-full' : ''}`} id="research"><div className="wrap"><div className="section-heading reveal"><Eyebrow>Fields of inquiry</Eyebrow><h2>Human questions.<br /><em>Scientific perspectives.</em></h2><TextLink href="/research">The research program</TextLink></div><div className="research-layout"><figure className="research-image reveal"><div key={selected} className="image-switch"><Image src={current.image} alt={selected === 'geriatrics' ? 'Scientific leadership of OIAA at a health summit' : current.kicker + ' — conceptual scientific illustration'} /></div><figcaption><span>{selected === 'geriatrics' ? 'Scientific context · OIAA' : 'A closer perspective · Conceptual study'}</span><span className="image-reticle" aria-hidden="true">+</span></figcaption></figure><div className="research-accordion reveal">{fields.map(field => <article className={selected === field.slug ? 'is-active' : ''} key={field.slug}><h3><button id={`field-${field.slug}`} aria-expanded={selected === field.slug} aria-controls={`panel-${field.slug}`} onClick={() => setSelected(field.slug)}><span>{field.title}</span>{selected === field.slug ? <Minus size={20} /> : <Plus size={20} />}</button></h3><div id={`panel-${field.slug}`} role="region" aria-labelledby={`field-${field.slug}`} hidden={selected !== field.slug}><p>{field.text}</p><span className="field-tags">{field.tags}</span><TextLink href={`/research/${field.slug}`}>Explore this field</TextLink></div></article>)}<a className="research-lab-link" href="/laboratory"><span>Applied AI research</span><ArrowUpRight size={20} /></a></div></div></div></section>;
}
function LaboratoryFeature() {
  return <section className="lab-feature section-space"><div className="wrap"><div className="lab-feature-head reveal"><Eyebrow>The AI laboratory</Eyebrow><h2>Human expertise.<br /><em>Machine perspective.</em></h2><p>New tools for enduring questions.<br />Built around evidence, not just answers.</p></div><a href="/laboratory" className="lab-film reveal"><Image src={media.laboratory} alt="Conceptual laboratory with an epigenetic research instrument" sizes="100vw" /><div className="lab-film-shade" /><span className="lab-film-tag">ProAge Atlas / Research in development</span><div className="lab-film-caption"><span>Inside the<br /><em>AI laboratory.</em></span><span className="film-arrow"><ArrowUpRight strokeWidth={1} size={35} /></span></div><span className="media-disclosure">Conceptual laboratory imagery</span></a><div className="lab-principles reveal"><div><h3>Traceable evidence.</h3><p>Follow an observation back to its source, population and limitations.</p></div><div><h3>Reproducible methods.</h3><p>Keep definitions, corrections and assumptions available for inspection.</p></div><div><h3>Independent evaluation.</h3><p>Test the usefulness of an AI workflow against expert review.</p></div></div></div></section>;
}
function People({ expanded = false }: { expanded?: boolean }) {
  return <section className="people-section section-space" id="people"><div className="wrap"><div className="section-heading reveal"><Eyebrow>Knowledge is human</Eyebrow><h2>Medical experience.<br /><em>Technical curiosity.</em></h2>{!expanded && <TextLink href="/institute#people">Meet our people</TextLink>}</div><div className="people-grid"><article className="person reveal"><a className="portrait" href="https://proage.online/" target="_blank" rel="noopener noreferrer" aria-label="Andrei Ilnitski’s institutional profile"><Image src={media.ilnitski} alt="Prof. Andrei Ilnitski — portrait from OIAA" /><span className="portrait-arrow"><ArrowUpRight /></span></a><div className="person-meta"><span>Academic Director · OIAA</span><h3>Prof. Andrei Ilnitski</h3><p>Gerontology, geriatrics, preventive medicine and rehabilitation.</p>{expanded && <TextLink href="https://proage.online/" external>Institutional profile</TextLink>}</div></article><article className="person reveal"><a className="portrait" href="https://proage.online/" target="_blank" rel="noopener noreferrer" aria-label="Kiryl Prashchayeu’s institutional profile"><Image src={media.prashchayeu} alt="Prof. Kiryl Prashchayeu — portrait from OIAA" /><span className="portrait-arrow"><ArrowUpRight /></span></a><div className="person-meta"><span>Director · OIAA</span><h3>Prof. Kiryl Prashchayeu</h3><p>Gerontology, clinical practice, functional capacity and professional education.</p>{expanded && <TextLink href="https://proage.online/" external>Institutional profile</TextLink>}</div></article><article className="founder-panel reveal"><Eyebrow>Product, web & AI engineering</Eyebrow><div className="founder-motif" aria-hidden="true"><Mark /></div><div><h3>Alex Yarosh</h3><span>Founder & technical builder · ProAge Atlas</span><p>Translating research questions into software that can be used, inspected and improved.</p><TextLink href="https://base2026.dev/founder" external>Selected work</TextLink></div></article></div><p className="attribution reveal">Medical roles and portraits are attributed to OIAA’s public profiles. ProAge Atlas is an independent software initiative; formal scientific roles and responsibilities require agreement.</p></div></section>;
}
function Home({ paused, onPause }: { paused: boolean; onPause: () => void }) {
  return <><HomeHero paused={paused} onPause={onPause} /><section className="purpose section-space" id="purpose"><div className="wrap purpose-grid"><Eyebrow>Our purpose</Eyebrow><div><h2 className="reveal">More life in<br /><em>the years ahead.</em></h2><div className="purpose-copy reveal"><p>Aging is a human story. Understanding it takes more than a single measurement, a single discipline or a single point of view.</p><div><p>We connect the questions of gerontology with medical expertise and research software. Our ambition is a clearer picture of healthy aging — and better tools for the people studying it.</p><TextLink href="/institute">Discover the institute</TextLink></div></div></div></div></section><ResearchLens /><LaboratoryFeature /><People /><section className="editorial-band"><div className="wrap reveal"><Eyebrow>A different kind of intelligence</Eyebrow><h2>The source is part<br />of <em>the answer.</em></h2><p>A useful research tool should make evidence easier to question, not harder to inspect.</p><TextLink href="/methods">Our approach to methods & trust</TextLink></div></section><Invitation /></>;
}
function PageIntro({ eyebrow, title, emphasis, lead }: { eyebrow: string; title: string; emphasis: string; lead: string }) {
  return <section className="page-intro wrap"><div className="page-intro-top"><Eyebrow>{eyebrow}</Eyebrow><span className="intro-flower" aria-hidden="true"><Mark /></span></div><h1>{title}<br /><em>{emphasis}</em></h1><p className="intro-lead">{lead}</p></section>;
}
function Institute() {
  return <><PageIntro eyebrow="Institute & people" title="A shared curiosity." emphasis="A human purpose." lead="Medicine, research and technology offer different perspectives on aging. We make room for the conversation between them." /><figure className="institute-panorama wrap reveal"><Image eager src={media.institute} alt="OIAA scientific leadership at the Global Health and Lifestyle Leadership Summit" sizes="100vw" /><figcaption>Scientific context: Open Institute of Age and Aging · Image: OIAA</figcaption></figure><section className="section-space"><div className="wrap prose-grid reveal"><Eyebrow>Our scientific context</Eyebrow><div><h2>From medical experience<br /><em>to new possibilities.</em></h2><p>The Open Institute of Age and Aging brings together gerontology, longevity medicine, geriatric medicine and professional education.</p><p>ProAge Atlas explores an adjacent question: how research software can help specialists navigate evidence, compare aging measurements and evaluate AI-supported workflows. The founder reports permission to collaborate with the ProAge team; specific roles, rights and institutional responsibilities require formal agreement.</p><TextLink href="https://proage.online/" external>Visit the Open Institute of Age and Aging</TextLink></div></div></section><People expanded /><section className="education-section section-space"><div className="wrap split-text reveal"><div><Eyebrow>Beyond the laboratory</Eyebrow><h2>Knowledge gains value<br /><em>when it travels.</em></h2></div><div><p>Professional education and community projects provide a different view of the questions raised in the laboratory. Our projects page connects the software initiative with selected public work from the institute, with attribution and original links kept in view.</p><TextLink href="/projects">Explore projects & education</TextLink></div></div></section><Invitation /></>;
}
function Research() {
  return <><PageIntro eyebrow="The research program" title="A longer view." emphasis="A closer look." lead="From cellular processes to everyday function. Our research direction connects biological signals, human experience and the evidence between them." /><ResearchLens full /><section className="section-space research-methods"><div className="wrap split-text reveal"><div><Eyebrow>The questions behind the work</Eyebrow><h2>Investigate signals.<br /><em>Keep the context.</em></h2></div><div><h3>When do aging signals disagree?</h3><p>Compare what different measures are designed to describe before combining them into one story.</p><h3>Which findings survive comparison?</h3><p>Keep study design, population, outcomes and limitations visible when reading across publications.</p><h3>Where can AI genuinely help?</h3><p>Evaluate research workflows on the same tasks, with expert correction time and failure analysis in view.</p><TextLink href="/laboratory">Explore the laboratory</TextLink></div></div></section><Invitation /></>;
}
function ResearchArticle({ slug }: { slug: string }) {
  const article = articleCopy[slug];
  if (!article) return <NotFound />;
  return <><PageIntro eyebrow={article.eyebrow} title={article.title} emphasis={article.emphasis} lead={article.lead} /><div className="wrap article-layout"><aside className="article-aside"><figure><Image eager src={article.image} alt={article.caption} /><figcaption>{article.caption}</figcaption></figure><a href="/research" className="back-link"><ArrowRight size={16} /> All research fields</a></aside><article className="article-body">{article.sections.map(section => <section className="reveal" key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}<div className="article-source reveal"><Eyebrow>Further reading</Eyebrow><TextLink href={article.source} external>{article.sourceLabel}</TextLink><TextLink href="/laboratory#evidence">Open the reference explorer</TextLink></div></article></div><Invitation /></>;
}

function EvidenceExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [announcement, setAnnouncement] = useState('');
  const results = useMemo(() => readings.filter(item => (category === 'All' || item.category === category) && `${item.title} ${item.subtitle} ${item.text} ${item.publication}`.toLowerCase().includes(query.trim().toLowerCase())), [query, category]);
  function exportNotes() {
    if (!results.length) return;
    const text = '# ProAge Atlas — research reading notes\n\nLocal reference-library export. No AI inference or clinical assessment.\n\n' + results.map(item => `## ${item.title}\n\n${item.publication}\n\n${item.text}\n\nLimitation: ${item.caveat}\n\nOriginal source: ${item.url}`).join('\n\n---\n\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'proage-atlas-reading-notes.md'; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000); setAnnouncement('Reading notes exported. Original source links and limitations are included.');
  }
  return <section className="evidence-section section-space" id="evidence"><div className="wrap"><div className="section-heading reveal"><Eyebrow>Explore the evidence</Eyebrow><h2>A reading room.<br /><em>Not a black box.</em></h2><p>Try the local reference explorer.<br />No model call. No personal data.</p></div><div className="evidence-workbench reveal"><div className="evidence-toolbar"><label className="search-field"><Search size={20} /><span className="sr-only">Search research references</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a method, topic or author…" /></label><button className="export-button" onClick={exportNotes} disabled={!results.length}>Export reading notes <Download size={17} /></button></div><div className="filter-row" aria-label="Filter references">{['All', 'Biomarkers', 'Healthy aging', 'AI methods'].map(value => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div><div className="evidence-results" aria-live="polite" aria-atomic="false">{results.length ? results.map(item => <article className="evidence-record" key={item.key}><div><span className="reference-category">{item.category}</span><h3>{item.title}</h3><p className="reference-subtitle">{item.subtitle}</p><span className="reference-publication">{item.publication}</span></div><div><p>{item.text}</p><details><summary>Keep this limitation in view <Plus size={14} /></summary><p>{item.caveat}</p></details><TextLink href={item.url} external>Read the original source</TextLink></div></article>) : <div className="empty-state"><h3>No matching references.</h3><p>Try a broader term or clear the filters.</p><button onClick={() => { setQuery(''); setCategory('All'); }}>Reset the explorer <ArrowRight size={16} /></button></div>}</div><p className="workbench-note">A bounded reference collection, not a systematic review. Summaries are reading aids; the original sources remain authoritative.</p><span className="sr-only" role="status">{announcement}</span></div></div></section>;
}
function Laboratory() {
  return <><section className="laboratory-hero"><div className="lab-hero-art" aria-hidden="true"><Image src={media.laboratory} eager alt="" sizes="100vw" /></div><div className="wrap"><Eyebrow>The AI laboratory / ProAge Atlas</Eyebrow><h1>Human expertise.<br /><em>Machine perspective.</em></h1><p>Research software for the space between<br />a scientific paper and an informed judgment.</p><ButtonLink href="#evidence" light>Enter the reading room</ButtonLink><span className="lab-hero-caption">Research in development · Conceptual laboratory imagery</span></div></section><section className="section-space lab-introduction"><div className="wrap split-text reveal"><div><Eyebrow>Built to be questioned</Eyebrow><h2>Intelligence that keeps<br /><em>its sources in view.</em></h2></div><div><p>ProAge Atlas explores how source-grounded retrieval, structured evidence and reproducible methods can help specialists work with the literature on healthy aging.</p><p>Today’s public experience is a local reference explorer. Model training, independent benchmark results and clinical validation are not represented as completed.</p><TextLink href="/methods">The boundaries of the prototype</TextLink></div></div></section><EvidenceExplorer /><section className="section-space development-section" id="roadmap"><div className="wrap"><div className="section-heading reveal"><Eyebrow>The development program</Eyebrow><h2>From a promising idea<br /><em>to evidence of use.</em></h2></div><div className="development-list reveal"><article><span>Foundation</span><div><h3>A research question worth answering.</h3><p>Formalize scientific collaboration, source rights and a review protocol before expanding the software.</p></div><small>Planned</small></article><article><span>Evaluation</span><div><h3>Compare the simple and the sophisticated.</h3><p>Test basic prompting and source-grounded approaches on the same held-out tasks. Keep errors and expert corrections visible.</p></div><small>Planned</small></article><article><span>Research pilots</span><div><h3>Find out what is genuinely useful.</h3><p>Work toward independent paying pilots that can evaluate repeat use, review burden and cost per accepted research record.</p></div><small>Planned</small></article></div></div></section><Invitation /></>;
}
function Projects() {
  const [filter, setFilter] = useState('All');
  const filtered = projects.filter(project => filter === 'All' || project.category === filter);
  return <><PageIntro eyebrow="Projects & initiatives" title="Beyond the" emphasis="laboratory." lead="Knowledge takes different forms: a research tool, a community project, a learning program. Explore the work and follow it to its original context." /><section className="projects-section wrap"><div className="filter-row project-filters" aria-label="Filter projects">{['All', 'Research', 'Technology', 'Education'].map(value => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}</button>)}</div><div className="projects-grid" aria-live="polite">{filtered.map(project => <article className="project" key={project.title}><a className={`project-image ${project.image.includes('/docs/') ? 'is-document' : ''}`} href={project.href} {...(project.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><Image src={project.image} alt={project.image.includes('/docs/') ? `${project.title} — official document cover` : `${project.title} — conceptual illustration`} /><span><ArrowUpRight size={26} /></span></a><div className="project-copy"><Eyebrow>{project.label}</Eyebrow><h2><a href={project.href} {...(project.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{project.title}</a></h2><p>{project.text}</p><TextLink href={project.href} external={project.external}>{project.external ? 'Explore the original project' : 'Explore the laboratory'}</TextLink></div></article>)}</div><p className="attribution">OIAA projects are attributed to the institute’s public website and are separate from the ProAge Atlas software initiative. Listings do not validate medical or commercial claims made by external services.</p></section><Invitation /></>;
}
function Methods() {
  return <><PageIntro eyebrow="Methods & trust" title="The source is part" emphasis="of the answer." lead="A research workflow should show what is known, how it was established and what still needs to be checked." /><div className="wrap methods-layout"><aside className="methods-aside"><Eyebrow>Our commitments</Eyebrow><p>Traceable.<br />Reproducible.<br /><em>Reviewable.</em></p><TextLink href="/laboratory#evidence">Inspect the references</TextLink></aside><article className="article-body"><section className="reveal"><h2>Provenance before polish.</h2><p>Research notes keep a direct original-source link. The reference explorer retains a publication label, a short reading summary and a limitation instead of presenting a fluent answer without context. These notes are not a substitute for reading the paper.</p></section><section className="reveal"><h2>Corrections belong to the method.</h2><p>An implementation should identify which published method it follows, including relevant corrections. Units, transformations, missing-value rules and assumptions need to remain inspectable. The reference library includes the PLOS Medicine correction for clinical Phenotypic Age as a concrete example.</p><TextLink href={readings[1].url} external>Open the published correction</TextLink></section><section className="reveal"><h2>Demonstration is not validation.</h2><p>This website does not run a clinical assessment, an epigenetic assay or a live language model. The public reference explorer filters a fixed collection in your browser. Its export contains those reading notes and original links, not newly generated scientific findings.</p></section><section className="reveal"><h2>Human review is part of the design.</h2><p>The proposed AI research program would compare workflows on shared held-out tasks and examine unsupported claims, numerical errors and expert correction time. No training run, model checkpoint or independently measured performance is claimed here.</p></section><section className="reveal"><h2>Respect the boundary around data.</h2><p>Do not send patient records, medical documents or other sensitive information through public contact channels. This site has no patient intake and no production research authentication. Any future study needs appropriate agreements, rights, data governance and ethics review.</p></section><section className="reveal"><h2>Be clear about institutional context.</h2><p>OIAA titles, portraits and public projects are attributed to the institute. ProAge Atlas is an independent research software initiative. Formal appointments and collaboration responsibilities require written agreement. References to publications or organizations do not imply endorsement.</p></section></article></div><Invitation /></>;
}
function Contact() {
  const [copied, setCopied] = useState('');
  const [notice, setNotice] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy(email: string) {
    try { await navigator.clipboard.writeText(email); setCopied(email); setNotice('Email address copied.'); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(''), 2500); }
    catch { setNotice('Clipboard access is unavailable. The email address can be selected or opened directly.'); }
  }
  return <><section className="contact-page wrap"><div className="contact-intro"><Eyebrow>Get in touch</Eyebrow><h1>The next question<br /><em>starts here.</em></h1><p>Research, education or a new tool for discovery.<br />Let’s find the right conversation.</p><div className="contact-orbit" aria-hidden="true"><Mark /></div></div><div className="contact-options"><article><Eyebrow>Research, education & medical expertise</Eyebrow><h2>Talk to the institute.</h2><p>Scientific collaboration and professional education with the Open Institute of Age and Aging.</p><a className="email-link" href="mailto:a.n.ilnitski@gmail.com?subject=ProAge%20research%20inquiry">a.n.ilnitski@gmail.com <ArrowUpRight size={23} /></a><button className="copy-button" onClick={() => copy('a.n.ilnitski@gmail.com')}>{copied === 'a.n.ilnitski@gmail.com' ? <Check size={15} /> : <Copy size={15} />}{copied === 'a.n.ilnitski@gmail.com' ? 'Copied' : 'Copy address'}</button></article><article><Eyebrow>AI laboratory & technology partnerships</Eyebrow><h2>Build the next perspective.</h2><p>Research software, design partnerships, pilot discussions and applied AI with Alex Yarosh.</p><a className="email-link" href="mailto:hello@base2026.dev?subject=ProAge%20Atlas%20collaboration">hello@base2026.dev <ArrowUpRight size={23} /></a><button className="copy-button" onClick={() => copy('hello@base2026.dev')}>{copied === 'hello@base2026.dev' ? <Check size={15} /> : <Copy size={15} />}{copied === 'hello@base2026.dev' ? 'Copied' : 'Copy address'}</button></article><p className="contact-note">Email links open your email application. Nothing is sent automatically. Please do not include patient records or sensitive medical information.</p><span className="contact-status" role="status">{notice}</span></div></section></>;
}
function NotFound() { return <section className="not-found wrap"><Eyebrow>ProAge Atlas</Eyebrow><h1>A different<br /><em>path forward.</em></h1><p>This page could not be found.</p><ButtonLink href="/">Return to the homepage</ButtonLink></section>; }

export function App({ initialPath = '/' }: { initialPath?: string }) {
  const [path, setPath] = useState(normalizePath(initialPath));
  const [paused, setPaused] = useState(false);
  const previousPath = useRef(path);
  useEffect(() => {
    const pop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  useEffect(() => {
    const meta = routes[path];
    document.title = meta?.title || 'Page not found — ProAge Atlas';
    const description = document.querySelector('meta[name="description"]');
    if (description && meta) description.setAttribute('content', meta.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', siteOrigin + path);
    for (const name of ['og:title', 'og:description', 'og:url']) {
      const node = document.querySelector(`meta[property="${name}"]`);
      if (node) node.setAttribute('content', name === 'og:title' ? document.title : name === 'og:url' ? siteOrigin + path : meta?.description || '');
    }
    if (previousPath.current !== path) {
      previousPath.current = path;
      const frame = requestAnimationFrame(() => {
        document.getElementById('main')?.focus({ preventScroll: true });
        let id = window.location.hash.slice(1);
        try { id = decodeURIComponent(id); } catch { /* Keep malformed fragments inert. */ }
        const target = id ? document.getElementById(id) : null;
        if (target) target.scrollIntoView({ behavior: 'instant' }); else window.scrollTo({ top: 0, behavior: 'instant' });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [path]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const setup = () => {
      observer?.disconnect(); elements.forEach(element => element.removeAttribute('data-reveal'));
      if (paused || preference.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.removeAttribute('data-reveal'); observer?.unobserve(entry.target); }
      }), { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });
      elements.forEach(element => { if (element.getBoundingClientRect().top > window.innerHeight) element.dataset.reveal = 'waiting'; observer?.observe(element); });
    };
    setup(); preference.addEventListener('change', setup);
    return () => { observer?.disconnect(); elements.forEach(element => element.removeAttribute('data-reveal')); preference.removeEventListener('change', setup); };
  }, [path, paused]);
  function navigate(event: React.MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin || !['http:', 'https:'].includes(url.protocol)) return;
    const next = normalizePath(url.pathname);
    if (!(next in routes) || (next === path && url.hash)) return;
    event.preventDefault();
    if (next === path) { window.scrollTo({ top: 0, behavior: paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); return; }
    window.history.pushState({}, '', url.pathname + url.search + url.hash); setPath(next);
  }
  let page: React.ReactNode;
  if (path === '/') page = <Home paused={paused} onPause={() => setPaused(value => !value)} />;
  else if (path === '/institute') page = <Institute />;
  else if (path === '/research') page = <Research />;
  else if (path.startsWith('/research/')) page = <ResearchArticle slug={path.split('/')[2]} />;
  else if (path === '/laboratory') page = <Laboratory />;
  else if (path === '/projects') page = <Projects />;
  else if (path === '/methods') page = <Methods />;
  else if (path === '/contact') page = <Contact />;
  else page = <NotFound />;
  return <div className="site-shell" data-motion={paused ? 'paused' : 'playing'} onClick={navigate}><a className="skip-link" href="#main">Skip to content</a><Header path={path} /><main id="main" tabIndex={-1} className="route-view" key={path}>{page}</main><Footer paused={paused} onPause={() => setPaused(value => !value)} /></div>;
}
export default App;
