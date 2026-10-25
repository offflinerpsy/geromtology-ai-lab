import Link from './research-link';
const navigation = [
  { title: 'Explore', links: [['Ask AI','/laboratory/ask'],['Health check-ins','/tools/check-ins'],['Research tools','/tools'],['Evidence library','/laboratory/evidence']] },
  { title: 'Project', links: [['About Atlas','/about'],['Investors','/investors'],['Roadmap','/roadmap'],['Contact','/contact']] },
];
export default function Footer() {
  return <footer className="footer premium-footer global-footer"><div className="container">
    <div className="footer-composition"><div className="footer-signature"><Link className="footer-brand" href="/" aria-label="ProAge Atlas home"><span className="brand-symbol" aria-hidden="true">a</span><span>ProAge <em>Atlas</em></span></Link><p>Scientific evidence. Clearer methods.<br/>A better starting point for research.</p><a className="footer-email" href="mailto:hello@gerontology.app">hello@gerontology.app</a></div><div className="footer-primary-nav">{navigation.map(group=><nav key={group.title} aria-label={`Footer ${group.title}`}><h2>{group.title}</h2>{group.links.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</nav>)}</div></div>
    <details className="footer-directory"><summary>Institute & research</summary><nav aria-label="Institute and research directory"><Link href="/institute">About the institute</Link><Link href="/people">Our people</Link><Link href="/education">Professional education</Link><Link href="/projects">Projects & initiatives</Link><Link href="/research">Research overview</Link><Link href="/research/longevity">Longevity medicine</Link><Link href="/research/geriatrics">Geriatric medicine</Link><Link href="/research/clinical-peptidology">Clinical peptidology</Link><Link href="/laboratory/biomarkers">Measurement methods</Link><Link href="/laboratory/ai-evaluation">AI evaluation</Link><Link href="/contact?type=research">Research collaboration</Link><Link href="/contact?type=pilot">Product pilots</Link><Link href="/contact?type=investment">Investment enquiries</Link></nav></details>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} ProAge Atlas</span><span>Scientific context · Open Institute of Age and Aging</span><Link href="/privacy">Privacy & data</Link></div>
  </div></footer>;
}
