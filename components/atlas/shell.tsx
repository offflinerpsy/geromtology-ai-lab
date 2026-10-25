import { DocumentLink as Link } from '@/components/site/research-link';
import LabScene from './lab-scene';
import {AtlasMotion} from './motion';
export function AtlasLink({href,children,primary=false}:{href:string;children:React.ReactNode;primary?:boolean}) {
  return <Link className={`atlas-action ${primary?'atlas-action-primary':''}`} href={href}>{children}</Link>;
}
export default function AtlasShell({active,title,description,children,wide=false,cinematic,compact=false}:{active:string;eyebrow:string;title:React.ReactNode;description:string;children:React.ReactNode;wide?:boolean;cinematic?:'bench'|'glass';compact?:boolean}) {
  return <main id="main" className={`atlas ${wide?'atlas-hub':''} ${cinematic?'atlas-cinematic':''} ${compact?'atlas-compact':''}`}>
    <div className="atlas-container">
      {compact&&active==='/laboratory/ask'?<nav className="instrument-navigation" aria-label="Research workspace"><Link href="/laboratory">Research workspace</Link><div><Link href="/laboratory/evidence">Evidence library</Link><Link href="/laboratory/ai-evaluation">AI method</Link></div></nav>:compact&&<nav className="instrument-navigation" aria-label="Research instruments"><Link href="/tools">All instruments</Link><div><Link href="/tools/phenoage" aria-current={active==='/tools/phenoage'?'page':undefined}>PhenoAge Explorer</Link><Link href="/tools/study-planner" aria-current={active==='/tools/study-planner'?'page':undefined}>Study Planner</Link></div></nav>}
      <header className="atlas-heading">{cinematic&&<LabScene variant={cinematic}/>}<div className="atlas-heading-copy"><h1>{title}</h1><p className="atlas-lead">{description}</p>{cinematic&&<div className="lab-hero-actions"><AtlasLink href={cinematic==='bench'?'/tools':'/laboratory/ask'} primary>{cinematic==='bench'?'Open research instruments':'Ask Evidence Copilot'}</AtlasLink><AtlasLink href={cinematic==='bench'?'/laboratory/ask':'/laboratory/evidence'}>{cinematic==='bench'?'Explore the AI assistant':'Explore the evidence'}</AtlasLink></div>}</div></header>
      {children}
      <div className="atlas-endnote"><span>ProAge Atlas · Research software</span><p>Published methods. Traceable sources. Questions worth pursuing.</p><Link href="/contact">Collaborate with the laboratory</Link></div>
    </div>
    <AtlasMotion/>
  </main>;
}
export function MethodNotes({children,title='A clear view of the method'}:{children:React.ReactNode;title?:string}) {
  return <section className="atlas-method"><p className="atlas-kicker">Method & interpretation</p><h2>{title}</h2><div className="atlas-method-grid">{children}</div></section>;
}
