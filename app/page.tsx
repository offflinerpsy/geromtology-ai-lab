import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('ProAge Atlas — Research for healthy aging', 'Scientific evidence, aging measurements and study planning for longevity research teams. Explore the research prototype.', '/');
import Link from "@/components/site/research-link";
import HomeHeroAnimated from "@/components/site/home-hero-animated";
import ScientificScene from "@/components/science/scientific-scene";
import InquiryCellularArt from "@/components/site/inquiry-cellular-art";


export default function Home(){return <>
    <main id="main">
      <HomeHeroAnimated />
      <section className="institute section-light" id="platform">
        <div className="container intro-grid"><div><h2 className="statement reveal">From a question<br />to the next study.</h2><div className="intro-columns reveal"><p>Start with a research question. Find selected evidence, compare what a method measures and explore the design of the next study.</p><p>ProAge Atlas brings working research tools into one place. We are developing the connections between them so teams can prepare material they can inspect, export and review.</p></div></div></div>
        <div className="container workflow-collection"><Link href="/laboratory/evidence"><h3>Organize evidence</h3><p>Find a useful source set for a focused research question.</p></Link><Link href="/laboratory/biomarkers"><h3>Compare methods</h3><p>Connect the measurement with its inputs, population and outcome.</p></Link><Link href="/tools/study-planner"><h3>Plan the next study</h3><p>Explore power, recruitment and explicit design assumptions.</p></Link></div>
      </section>
      <section className="research section-light research-living" id="research">
        <div className="container"><div className="section-heading reveal"><h2>Research across<br /><span className="muted">the life course.</span></h2></div>
          <div className="research-layout">
            <InquiryCellularArt />
            <div className="research-list"><Link className="text-link research-index-link" href="/research">Research programs</Link>
              <details className="research-entry reveal" open><summary><span>Longevity medicine</span><span className="expand-mark" aria-hidden="true" /></summary><div className="entry-body"><p>Research into prevention, lifestyle and the biological processes associated with aging. Connecting questions about healthspan with the realities of individual lives.</p><p className="research-topics">Healthy longevity · Clinical peptidology · Prevention</p></div></details>
              <details className="research-entry reveal"><summary><span>Geriatric medicine</span><span className="expand-mark" aria-hidden="true" /></summary><div className="entry-body"><p>Clinical expertise centered on functional ability and autonomy. Areas of interest include frailty, sarcopenia, cognition, rehabilitation and comprehensive geriatric assessment.</p><p className="research-topics">Function · Independence · Individualized care</p></div></details>
              <details className="research-entry reveal"><summary><span>Research & education</span><span className="expand-mark" aria-hidden="true" /></summary><div className="entry-body"><p>Professional education and community initiatives that bring knowledge about aging into practice. Supporting clinicians, educators and organizations working with older people.</p><p className="research-topics">Clinical learning · Community projects · Public knowledge</p></div></details>
              <details className="research-entry reveal"><summary><span>Biomarkers & digital methods</span><span className="expand-mark" aria-hidden="true" /></summary><div className="entry-body"><p>Exploring how aging measurements, functional outcomes and digital tools can be interpreted together. Methods, populations and uncertainty remain part of the evidence.</p><p className="research-topics">Measurement · Evidence synthesis · AI evaluation</p></div></details>
            </div>
          </div>
        </div>
      </section>
      <section className="ai-lab" id="ai-lab">
        <div className="container">
          <div className="lab-heading reveal"><h2>Research tools.<br /><span>One purposeful workflow.</span></h2><p>For small research teams connecting evidence, aging measurements and study design.</p></div>
          <div className="lab-grid"><div className="lab-copy reveal"><h3>Evidence you can<br />follow back to its source.</h3><p>Use PhenoAge Explorer, plan sample sizes and compare selected scientific notes with Evidence Copilot. Each tool exposes the method or sources behind its output.</p><p>Next, we are working toward saved research packages and a connected review workflow. Explore what is available now, or help define a focused product pilot.</p><Link className="text-link" href="/laboratory">Explore ProAge Atlas</Link></div>
            <Link className="lab-photo-link" href="/laboratory"><ScientificScene variant="molecule" caption={false}/><span>Inside the AI laboratory</span></Link>
          </div>
          <p className="lab-note">ProAge Atlas · Research prototype. Saved projects and team collaboration are planned, not available yet.</p>
        </div>
      </section>
      <section className="people section-light" id="people">
        <div className="container"><div className="section-heading reveal"><h2>Scientific context.<br />Human expertise.</h2><p>The institute’s scientific leadership.<br />Independent product development at ProAge Atlas.</p></div>
          <Link className="section-link text-link" href="/people">Meet our people</Link><div className="people-grid">
            <article className="person reveal"><Link className="portrait portrait-link" href="/people/andrei-ilnitski" aria-label="Biography of Prof. Andrei Ilnitski"><img src="/images/andrei-ilnitski-portrait.webp" alt="Prof. Andrei Ilnitski" width="720" height="750" loading="lazy" /></Link><div className="person-title"><p className="eyebrow">Academic Director · OIAA</p><h3>Prof. Andrei Ilnitski</h3></div><p>Gerontology, geriatrics, preventive medicine and rehabilitation. Research and education shaped by the needs of older people.</p><details className="person-details"><summary>Biography <span aria-hidden="true">+</span></summary><div><p>Professor and Doctor of Medical Sciences. His interests include frailty, comprehensive geriatric assessment, healthy longevity and digital platforms in geriatrics.</p><p>Training includes the Saint Petersburg Institute of Bioregulation and Gerontology and the United Nations International Institute on Ageing in Malta.</p></div></details></article>
            <article className="person reveal"><Link className="portrait portrait-link" href="/people/kiryl-prashchayeu" aria-label="Biography of Prof. Kiryl Prashchayeu"><img src="/images/kiryl-prashchayeu-portrait.webp" alt="Prof. Kiryl Prashchayeu" width="760" height="750" loading="lazy" /></Link><div className="person-title"><p className="eyebrow">Director · OIAA</p><h3>Prof. Kiryl Prashchayeu</h3></div><p>Gerontology, clinical practice and functional capacity. Connecting scientific research with professional education.</p><details className="person-details"><summary>Biography <span aria-hidden="true">+</span></summary><div><p>Professor and Doctor of Medical Sciences. His research interests include biomarkers of aging, frailty, geriatric syndromes and evidence-informed preventive technologies.</p><p>His work includes developing educational standards in gerontology and geriatrics, and founding the international scientific and practical journal “Gerontology.”</p></div></details></article>
          </div>
          <article className="founder reveal"><Link className="founder-image portrait-link" href="/people/alex-yarosh" aria-label="Profile of Alex Yarosh"><img src="/images/alex-yarosh.webp" alt="Alex Yarosh" width="450" height="562" loading="lazy" /></Link><div className="founder-text"><p className="eyebrow">ProAge Atlas · Product & engineering</p><h3>Alex Yarosh</h3><p className="founder-role">Founder, ProAge Atlas</p><p>Alex leads product development, engineering and applied AI. His work spans web platforms, structured information systems and practical automation.</p><Link className="text-link" href="/people/alex-yarosh">Meet the founder</Link></div></article>
        </div>
      </section>
      <section className="initiatives section-light" id="initiatives"><div className="container"><div className="practice-heading reveal"><div><h2>Knowledge in practice.</h2></div><Link className="text-link" href="/projects">All initiatives</Link></div><div className="practice-grid">
        <Link className="practice-story reveal" href="/projects/peptide-platform"><div className="practice-image"><img src="/images/peptide-structure.webp" alt="Conceptual molecular study" width="1536" height="1024" loading="lazy" /></div><p className="story-meta">Digital initiative</p><h3>Peptide Platform</h3><p>Education and digital tools for exploring healthy aging and intrinsic capacity.</p><span className="story-link">Explore the project</span></Link>
        <Link className="practice-story reveal" href="/projects/congo"><div className="practice-image"><img src="/images/cellular-field.webp" alt="Conceptual biological tissue study" width="1400" height="933" loading="lazy" /></div><p className="story-meta">Community research · South Kivu</p><h3>Aging in the Democratic Republic of Congo</h3><p>A community project examining functional disorders among older people.</p><span className="story-link">Read the project report</span></Link>
        <Link className="practice-story reveal" href="/projects/cote-divoire"><div className="practice-image"><img src="/images/neural-tissue.webp" alt="Conceptual tissue architecture" width="1536" height="1024" loading="lazy" /></div><p className="story-meta">Professional education · 2026</p><h3>Gerontology in Côte d’Ivoire</h3><p>Learning focused on independence, dignity and the everyday environments of older people.</p><span className="story-link">Discover the initiative</span></Link>
      </div></div></section>
      <section className="contact prefooter" id="contact"><div className="container"><div className="prefooter-intro reveal"><h2>A better workspace<br /><em>starts with your question.</em></h2><p>Working on a recurring research task?<br className="desktop-break" /> Help us build around the work that matters.</p></div><div className="contact-grid reveal"><div><p>For research teams</p><Link href="/contact?type=pilot">Discuss a product pilot</Link></div><div><p>For partners & investors</p><Link href="/investors">Explore the opportunity</Link></div></div></div></section>
    </main>

</>;}
