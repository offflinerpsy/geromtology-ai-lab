import {DocumentLink as Link} from './research-link';
const paths=[
  {href:'/laboratory/ask',title:'Ask a question',description:'Explore aging research with an AI answer and links to the evidence.',action:'Ask AI'},
  {href:'/tools/check-ins',title:'Take a health check-in',description:'Short questionnaires about how you feel and function in everyday life.',action:'Choose a check-in'},
  {href:'/tools',title:'Use a research tool',description:'Explore a clinical age model or work through the assumptions of a study.',action:'Explore tools'},
];
export default function StartPaths(){return <div className="start-paths">{paths.map(p=><Link key={p.href} href={p.href} className="start-path"><h3>{p.title}</h3><p>{p.description}</p><span>{p.action}</span></Link>)}</div>}
