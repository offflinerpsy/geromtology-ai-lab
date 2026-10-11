import Link from "./research-link";

const columns = [
  { title: "Institute", links: [["About the institute", "/institute"], ["Our people", "/people"], ["Professional education", "/education"], ["Projects & initiatives", "/projects"]] },
  { title: "Research", links: [["Research overview", "/research"], ["Longevity medicine", "/research/longevity"], ["Geriatric medicine", "/research/geriatrics"], ["Clinical peptidology", "/research/clinical-peptidology"]] },
  { title: "ProAge Atlas", links: [["Explore the prototype", "/laboratory"], ["About Atlas", "/about"], ["Investors", "/investors"], ["Roadmap", "/roadmap"], ["Evidence library", "/laboratory/evidence"], ["Biomarkers & measurement", "/laboratory/biomarkers"], ["AI evaluation", "/laboratory/ai-evaluation"]] },
];

export default function Footer() {
  return <footer className="footer premium-footer">
    <div className="container">
      <div className="footer-masthead">
        <Link href="/" className="footer-brand" aria-label="ProAge Atlas home"><span className="brand-symbol" aria-hidden="true">a</span><span>ProAge <em>Atlas</em><small>A research workspace in development</small></span></Link>
        <div className="footer-purpose"><p>Scientific evidence. Clearer methods.<br />A better starting point for research.</p><Link href="/contact" className="footer-contact-link">Start a conversation</Link></div>
      </div>
      <div className="footer-navigation">
        {columns.map(column => <nav aria-label={`Footer ${column.title}`} key={column.title}><h2>{column.title}</h2>{column.links.map(([label, href]) => <Link href={href} key={href}><span>{label}</span></Link>)}</nav>)}
        <nav className="footer-correspondence" aria-label="Contact routes"><h2>Start a conversation</h2><a href="mailto:hello@gerontology.app">hello@gerontology.app</a><Link href="/contact?type=research">Research collaboration</Link><Link href="/contact?type=pilot">Product pilots</Link><Link href="/contact?type=investment">Investment enquiries</Link><Link href="/contact">General enquiries</Link><Link href="/privacy">Privacy & data</Link></nav>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} ProAge Atlas</span><span>Scientific context · Open Institute of Age and Aging</span></div>
    </div>
  </footer>;
}
