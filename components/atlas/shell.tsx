import { DocumentLink as Link } from '@/components/site/research-link';
import Atmosphere from './atmosphere';
import LabScene from './lab-scene';
import WorkflowPreview from './workflow-preview';
import {AtlasMotion} from './motion';
export function AtlasLink({href,children,primary=false}:{href:string;children:React.ReactNode;primary?:boolean}) {
  return <Link className={`atlas-action ${primary?'atlas-action-primary':''}`} href={href}>{children}</Link>;
}
export default function AtlasShell({title,description,children,wide=false,cinematic,compact=false}:{active:string;eyebrow:string;title:React.ReactNode;description:string;children:React.ReactNode;wide?:boolean;cinematic?:'bench'|'glass';compact?:boolean}) {
  return <main id="main" className={`atlas ${wide?'atlas-hub':''} ${cinematic?'atlas-cinematic':''} ${compact?'atlas-compact':''}`}>
    <Atmosphere/>
    <div className="atlas-container">
      <header className="atlas-heading">{cinematic&&<LabScene variant={cinematic}/>}<div className="atlas-heading-copy"><h1>{title}</h1><p className="atlas-lead">{description}</p>{cinematic&&<div className="lab-hero-actions"><AtlasLink href={cinematic==='bench'?'/tools':'/laboratory/ask'} primary>{cinematic==='bench'?'Open research instruments':'Ask Evidence Copilot'}</AtlasLink><AtlasLink href={cinematic==='bench'?'/laboratory/ask':'/laboratory/evidence'}>{cinematic==='bench'?'Explore the AI assistant':'Explore the evidence'}</AtlasLink></div>}</div></header>
      {cinematic==='bench'&&<WorkflowPreview/>}
      {children}
      <div className="atlas-endnote"><span>Open Institute of Age and Aging</span><p>Published methods. Traceable sources. Questions worth pursuing.</p><Link href="/contact">Collaborate with the laboratory</Link></div>
    </div>
    <AtlasMotion/>
  </main>;
}
export function MethodNotes({children,title='A clear view of the method'}:{children:React.ReactNode;title?:string}) {
  return <section className="atlas-method"><p className="atlas-kicker">Method & interpretation</p><h2>{title}</h2><div className="atlas-method-grid">{children}</div></section>;
}
