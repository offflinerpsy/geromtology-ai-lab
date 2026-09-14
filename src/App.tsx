import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileSearch,
  FlaskConical,
  Layers3,
  Menu,
  Microscope,
  Network,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const sourceMarks = [
  { name: "WHO", detail: "Healthy aging & ICOPE" },
  { name: "PLOS Medicine", detail: "Published aging methods" },
  { name: "eLife", detail: "Biomarker science" },
  { name: "Europe PMC", detail: "Literature infrastructure" },
];

const researchTracks = [
  {
    id: "ATLAS-01",
    title: "When do aging signals disagree?",
    text: "Compare age estimates, pace measures and functional outcomes without assuming that one score is a universal biological age.",
    note: "Measurement & transportability",
  },
  {
    id: "ATLAS-02",
    title: "Which findings survive comparison?",
    text: "Build a correction-aware map of interventions, populations, outcomes and limitations before turning papers into product claims.",
    note: "Evidence synthesis",
  },
  {
    id: "ATLAS-03",
    title: "Can domain AI reduce review burden?",
    text: "Test prompting, source-grounded retrieval and conditional model adaptation on the same held-out tasks with expert review.",
    note: "Auditable AI evaluation",
  },
];

const proofPoints = [
  { value: "12", label: "research reference records", detail: "Source-linked and inspectable" },
  { value: "120", label: "synthetic cohort rows", detail: "No patient data" },
  { value: "11", label: "AI development seeds", detail: "Explicitly unreviewed" },
  { value: "0", label: "clinical claims", detail: "Research-stage by design" },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M23.5 43C8.5 33.5 5.5 18.5 15.8 4.5c8.6 7.6 13.2 20.2 7.7 38.5Z" fill="currentColor" opacity=".95" />
        <path d="M26 42C18.7 25 28.7 7.8 42 4.8c2.4 18.5-4.5 31.8-16 37.2Z" fill="currentColor" opacity=".48" />
        <path d="M23.5 42 17.5 13M25.7 39.7 35.5 13" stroke="#F6F1E8" strokeWidth="1.35" />
      </svg>
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span />
      {children}
    </div>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#top" onClick={closeMenu} aria-label="ProAge Atlas home">
            <BrandMark />
            <span className="brand-copy">
              <strong>ProAge Atlas</strong>
              <small>Research software for healthy aging</small>
            </span>
          </a>

          <nav className={`nav-links ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
            <a href="#research" onClick={closeMenu}>Research</a>
            <a href="#product" onClick={closeMenu}>Product</a>
            <a href="#team" onClick={closeMenu}>People</a>
            <a href="#roadmap" onClick={closeMenu}>Roadmap</a>
            <a className="nav-external" href="https://proage.online/" target="_blank" rel="noreferrer">
              OIAA <ArrowUpRight size={14} />
            </a>
          </nav>

          <div className="header-actions">
            <a className="button button-dark header-cta" href="mailto:hello@base2026.dev?subject=ProAge%20Atlas%20research%20pilot">
              Discuss a pilot <ArrowRight size={15} />
            </a>
            <button
              className="menu-button"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero-section" id="top">
          <div className="hero-noise" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <SectionLabel>Independent research prototype · 2026</SectionLabel>
              <h1>
                Understand aging.<br />
                <em>Show the evidence.</em>
              </h1>
              <p className="hero-lede">
                ProAge Atlas helps healthy-aging research teams turn scattered papers and measurements into traceable evidence,
                reproducible workflows and independently evaluated AI.
              </p>
              <div className="hero-actions">
                <a className="button button-dark" href="#product">
                  See what exists today <ArrowRight size={16} />
                </a>
                <a className="button button-ghost" href="#research">
                  Research program <ChevronRight size={16} />
                </a>
              </div>
              <div className="hero-trust-row" aria-label="Prototype boundaries">
                <span><Check size={15} /> Source-linked methods</span>
                <span><Check size={15} /> Synthetic data only</span>
                <span><Check size={15} /> Human review gates</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Illustrative ProAge Atlas research workspace">
              <div className="paper-orbit orbit-one" />
              <div className="paper-orbit orbit-two" />
              <div className="workspace-window">
                <div className="workspace-topbar">
                  <div className="traffic-dots"><i /><i /><i /></div>
                  <span>atlas / evidence engine</span>
                  <span className="workspace-status"><i /> research-stage</span>
                </div>
                <div className="workspace-body">
                  <div className="workspace-kicker">Evidence record · AGE04</div>
                  <h2>Clinical Phenotypic Age</h2>
                  <p className="workspace-copy">
                    Correction-aware implementation with explicit units, provenance and a visible boundary between a research score and a clinical claim.
                  </p>
                  <div className="workspace-meta-grid">
                    <div><small>Source</small><strong>PLOS Medicine</strong></div>
                    <div><small>Status</small><strong>Method pinned</strong></div>
                    <div><small>Use</small><strong>Research only</strong></div>
                  </div>
                  <div className="review-strip">
                    <div className="review-icon"><ClipboardCheck size={20} /></div>
                    <div>
                      <strong>Context before conclusions.</strong>
                      <span>Every output keeps its method, source and review state attached.</span>
                    </div>
                    <span className="tiny-pill">auditable</span>
                  </div>
                </div>
              </div>

              <div className="floating-card floating-card-top">
                <span className="floating-icon"><FileSearch size={16} /></span>
                <span><strong>12</strong> source records</span>
              </div>
              <div className="floating-card floating-card-bottom">
                <span className="floating-icon"><ShieldCheck size={16} /></span>
                <span><strong>0</strong> patient records</span>
              </div>
            </div>
          </div>
        </section>

        <section className="source-strip" aria-label="Scientific reference points">
          <div className="wrap source-strip-inner">
            <p>Reference points, not endorsements.</p>
            <div className="source-marks">
              {sourceMarks.map((source) => (
                <div className="source-mark" key={source.name}>
                  <strong>{source.name}</strong>
                  <span>{source.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-intro" id="research">
          <div className="wrap">
            <div className="section-heading two-column-heading">
              <div>
                <SectionLabel>01 / Research program</SectionLabel>
                <h2>Investigate signals.<br />Preserve uncertainty.</h2>
              </div>
              <p>
                The goal is not to manufacture one magical age number. The program is designed to make conflicting signals, method limitations and reviewer decisions visible.
              </p>
            </div>

            <div className="research-grid">
              {researchTracks.map((track, index) => (
                <article className="research-card" key={track.id}>
                  <div className="research-card-top">
                    <span className="research-index">0{index + 1}</span>
                    <span className="research-code">{track.id}</span>
                  </div>
                  <h3>{track.title}</h3>
                  <p>{track.text}</p>
                  <div className="research-note"><Microscope size={16} /> {track.note}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-ink" id="product">
          <div className="wrap product-grid">
            <div className="product-copy">
              <SectionLabel>02 / What exists today</SectionLabel>
              <h2>A working prototype,<br />not a fictional biotech company.</h2>
              <p className="product-lede">
                The current artifact is useful because its boundaries are explicit: a standalone research frontend, source records,
                synthetic cohort analytics and development fixtures for AI evaluation.
              </p>
              <div className="product-principles">
                <div><ShieldCheck size={20} /><span><strong>No patient data</strong><small>Synthetic examples only.</small></span></div>
                <div><BookOpen size={20} /><span><strong>Methods stay inspectable</strong><small>Sources and correction notes travel with the record.</small></span></div>
                <div><Sparkles size={20} /><span><strong>AI claims need evaluation</strong><small>RAG and adaptation are experiments, not achievements.</small></span></div>
              </div>
            </div>

            <div className="proof-panel">
              <div className="proof-panel-head">
                <span>Current prototype inventory</span>
                <span className="tiny-pill light">v0.3</span>
              </div>
              <div className="proof-grid">
                {proofPoints.map((point) => (
                  <div className="proof-item" key={point.label}>
                    <strong>{point.value}</strong>
                    <span>{point.label}</span>
                    <small>{point.detail}</small>
                  </div>
                ))}
              </div>
              <div className="proof-footer">
                <span><Database size={17} /> Versioned methods register</span>
                <span><Layers3 size={17} /> Local validation harness</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section workflow-section">
          <div className="wrap">
            <div className="section-heading two-column-heading">
              <div>
                <SectionLabel>03 / Product thesis</SectionLabel>
                <h2>From a paper<br />to a reviewable record.</h2>
              </div>
              <p>
                The first buyer hypothesis is a research team with recurring evidence-review work. The product should earn trust by reducing review burden without hiding where an answer came from.
              </p>
            </div>

            <div className="workflow-board">
              <div className="workflow-step">
                <span className="workflow-number">01</span>
                <div className="workflow-icon"><BookOpen size={22} /></div>
                <h3>Collect</h3>
                <p>Capture papers, methods and structured observations with stable source IDs.</p>
              </div>
              <div className="workflow-arrow"><ArrowRight size={24} /></div>
              <div className="workflow-step">
                <span className="workflow-number">02</span>
                <div className="workflow-icon"><Network size={22} /></div>
                <h3>Structure</h3>
                <p>Extract population, study design, finding, limitation and method version.</p>
              </div>
              <div className="workflow-arrow"><ArrowRight size={24} /></div>
              <div className="workflow-step">
                <span className="workflow-number">03</span>
                <div className="workflow-icon"><ClipboardCheck size={22} /></div>
                <h3>Review</h3>
                <p>Keep unsupported fields and model errors visible for expert correction.</p>
              </div>
              <div className="workflow-arrow"><ArrowRight size={24} /></div>
              <div className="workflow-step">
                <span className="workflow-number">04</span>
                <div className="workflow-icon"><FlaskConical size={22} /></div>
                <h3>Evaluate</h3>
                <p>Compare AI workflows on the same held-out tasks and measure correction time.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section team-section" id="team">
          <div className="wrap">
            <div className="section-heading two-column-heading">
              <div>
                <SectionLabel>04 / Scientific context</SectionLabel>
                <h2>Medical expertise.<br />Hands-on engineering.</h2>
              </div>
              <p>
                The startup direction is informed by Alex Yarosh’s collaboration with specialists from the Open Institute of Age and Aging. Formal startup appointments and institutional responsibilities still require written agreements.
              </p>
            </div>

            <div className="people-grid">
              <article className="person-card person-card-photo">
                <div className="person-photo-wrap">
                  <img src="https://proage.online/assets/proage/card1-portrait-crop.png" alt="Prof. Andrei Ilnitski" loading="lazy" referrerPolicy="no-referrer" />
                  <span>Portrait source: OIAA</span>
                </div>
                <div className="person-body">
                  <small>Academic Director · OIAA</small>
                  <h3>Prof. Andrei Ilnitski</h3>
                  <p>Gerontology, geriatrics, healthy longevity, rehabilitation, preventive medicine and digital platforms in aging.</p>
                  <a href="https://proage.online/" target="_blank" rel="noreferrer">Institutional profile <ArrowUpRight size={15} /></a>
                </div>
              </article>

              <article className="person-card person-card-photo">
                <div className="person-photo-wrap">
                  <img src="https://proage.online/assets/proage/card2-portrait-crop.png" alt="Prof. Kiryl Prashchayeu" loading="lazy" referrerPolicy="no-referrer" />
                  <span>Portrait source: OIAA</span>
                </div>
                <div className="person-body">
                  <small>Director · OIAA</small>
                  <h3>Prof. Kiryl Prashchayeu</h3>
                  <p>Gerontology, geriatrics, biomarkers of aging, functional capacity and evidence-informed preventive technologies.</p>
                  <a href="https://proage.online/" target="_blank" rel="noreferrer">Institutional profile <ArrowUpRight size={15} /></a>
                </div>
              </article>

              <article className="person-card founder-card">
                <div className="founder-visual" aria-hidden="true">
                  <span className="founder-ring ring-a" />
                  <span className="founder-ring ring-b" />
                  <span className="founder-initials">AY</span>
                  <small>PRODUCT × WEB × AI</small>
                </div>
                <div className="person-body">
                  <small>Founder / technical builder</small>
                  <h3>Alex Yarosh</h3>
                  <p>Product, web engineering and AI workflows: turning the research direction into a usable, testable product.</p>
                  <a href="https://base2026.dev/founder" target="_blank" rel="noreferrer">Selected work <ArrowUpRight size={15} /></a>
                </div>
              </article>
            </div>

            <div className="team-note">
              <ShieldCheck size={18} />
              <span>OIAA titles and research interests are attributed to the institute’s public profiles. ProAge Atlas is presented here as an independent research-stage startup prototype.</span>
            </div>
          </div>
        </section>

        <section className="section roadmap-section" id="roadmap">
          <div className="wrap roadmap-grid">
            <div className="roadmap-copy">
              <SectionLabel>05 / Next value proof</SectionLabel>
              <h2>Less theatre.<br />More evidence of use.</h2>
              <p>
                The next milestone is not another polished mockup. It is a formal scientific collaboration plus two independent paying research pilots with measurable review outcomes.
              </p>
              <a className="button button-dark" href="mailto:hello@base2026.dev?subject=ProAge%20Atlas%20research%20collaboration">
                Discuss collaboration <ArrowRight size={16} />
              </a>
            </div>

            <div className="roadmap-list">
              <div className="roadmap-item">
                <span>01</span>
                <div><small>Foundation</small><h3>Rights-cleared registry + expert protocol</h3><p>Define source rights, reviewer rules, baselines and a reproducible task set.</p></div>
              </div>
              <div className="roadmap-item">
                <span>02</span>
                <div><small>Evaluation</small><h3>Compare simple baselines with AI workflows</h3><p>Measure numerical fidelity, extraction accuracy, unsupported claims and expert correction time.</p></div>
              </div>
              <div className="roadmap-item">
                <span>03</span>
                <div><small>Proof of demand</small><h3>Two independent paying research pilots</h3><p>Track repeat use, errors, review burden and cost per accepted evidence record.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="wrap closing-grid">
            <div>
              <SectionLabel>Research partners · design partners · technology sponsors</SectionLabel>
              <h2>Build a healthier aging research stack<br />that can show its working.</h2>
            </div>
            <div className="closing-actions">
              <a className="button button-light" href="mailto:hello@base2026.dev?subject=ProAge%20Atlas">Start a conversation <ArrowRight size={16} /></a>
              <a className="button button-outline-light" href="https://proage.online/" target="_blank" rel="noreferrer">Open Institute of Age and Aging <ExternalLink size={15} /></a>
              <p>Research-stage prototype · synthetic data · not medical advice or a diagnostic service.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <BrandMark />
              <span className="brand-copy"><strong>ProAge Atlas</strong><small>Research software for healthy aging</small></span>
            </a>
            <p>Traceable evidence, reproducible methods and auditable AI for healthy-aging research.</p>
          </div>
          <div className="footer-links">
            <a href="#research">Research</a><a href="#product">Product</a><a href="#team">People</a><a href="#roadmap">Roadmap</a>
          </div>
          <div className="footer-meta">
            <a href="mailto:hello@base2026.dev">hello@base2026.dev</a>
            <a href="https://base2026.dev/founder" target="_blank" rel="noreferrer">Founder profile <ArrowUpRight size={13} /></a>
            <span>© 2026 ProAge Atlas · Startup MVP v0.3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
