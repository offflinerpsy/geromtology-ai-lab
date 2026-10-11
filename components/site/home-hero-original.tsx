import Link from "next/link";

// Preserved original hero. Add animated alternatives in separate components.
export default function HomeHeroOriginal() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-art" data-parallax="0.12"><img src="/images/cellular-hero.webp" alt="" fetchPriority="high" width="1672" height="941" /></div>
        <div className="hero-shade" />
        <div className="hero-content container">
          <p className="eyebrow hero-eyebrow">Gerontology · Medical expertise · Applied AI</p>
          <h1 id="hero-title">A deeper<br />understanding.<br /><span>A longer horizon.</span></h1>
          <div className="hero-intro"><p>Advancing healthy aging through gerontology,<br className="desktop-break" /> medical expertise and artificial intelligence.</p><Link className="text-link" href="/research">Explore our work</Link></div>
        </div>
        <div className="hero-bottom container"><Link href="/institute" className="scroll-link">Discover the institute</Link><span>GERONTOLOGY &nbsp; / &nbsp; HUMAN POTENTIAL</span><span className="art-label">Conceptual cellular study</span></div>
      </section>
  );
}
