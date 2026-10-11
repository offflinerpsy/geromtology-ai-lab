import type { ReactNode } from 'react';
import { DocumentLink as Link } from './research-link';
import '@/app/product-pages.css';

type Section = { id: string; label: string; title: string; children: ReactNode };
export default function ProductPage({ eyebrow, title, lead, sections, action, secondary, children }: {
  eyebrow: string; title: ReactNode; lead: string; sections: Section[];
  action: { href: string; label: string }; secondary?: { href: string; label: string }; children?: ReactNode;
}) {
  return <main id="main" className="product-editorial">
    <section className="product-intro"><div className="container">
      <nav className="product-crumb" aria-label="Breadcrumb"><Link href="/">ProAge Atlas</Link><span aria-hidden="true">/</span><span>{eyebrow}</span></nav>
      <p className="eyebrow">{eyebrow} · Research software</p><h1>{title}</h1>
      <div className="product-intro-bottom"><p className="product-lead">{lead}</p><div className="product-intro-actions"><Link className="text-link" href={action.href}>{action.label}<span aria-hidden="true">↗</span></Link>{secondary && <Link className="text-link" href={secondary.href}>{secondary.label}<span aria-hidden="true">↗</span></Link>}</div></div>
      <p className="product-stage">Current stage <span>Working prototype · Product discovery</span></p>
    </div></section>
    <div className="container product-body"><aside className="product-index"><p className="eyebrow">In perspective</p><nav aria-label="On this page">{sections.map(section => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}</nav></aside>
      <div className="product-sections">{sections.map(section => <section className="product-section" id={section.id} key={section.id}><p className="eyebrow">{section.label}</p><h2>{section.title}</h2>{section.children}</section>)}</div>
    </div>{children}
    <section className="product-closing"><div className="container"><div><p className="eyebrow">From idea to a working question</p><h2>Explore it.<br/><em>Help shape what follows.</em></h2></div><div><p>Bring a research question, a method to compare or a workflow worth improving.</p><Link className="text-link" href={action.href}>{action.label}<span aria-hidden="true">↗</span></Link></div></div></section>
  </main>;
}

export function WorkflowLinks() {
  const steps = [
    { href: '/laboratory/evidence', title: 'Explore the evidence', body: 'Start with curated references and the research question each source can inform.' },
    { href: '/laboratory/biomarkers', title: 'Understand the measurement', body: 'Compare the inputs, intended outcomes and interpretation of different aging methods.' },
    { href: '/tools/study-planner', title: 'Plan a study', body: 'Explore sample size and power for a supported two-group study design.' },
  ];
  return <div className="product-workflow">{steps.map(step => <Link href={step.href} key={step.href}><h3>{step.title}<span aria-hidden="true">↗</span></h3><p>{step.body}</p></Link>)}</div>;
}
