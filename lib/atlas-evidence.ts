import notes from './atlas-evidence.json' with { type: 'json' };
export type EvidenceSource={id:string;title:string;authors:string;year:number;url:string;category:string;studyType:string;summary:string;limitation:string;tags:string[]};
export const evidenceSourceTypes=['All source types','Original research','Review','Guidance & public health','Method documentation'] as const;
export type EvidenceSourceType=Exclude<(typeof evidenceSourceTypes)[number],'All source types'>;
const types:Record<string,EvidenceSourceType>={
  'hallmarks-2023':'Review',
  'who-ageing-health-2025':'Guidance & public health',
  'who-icope-2025':'Guidance & public health',
  'r-power-t-test':'Method documentation',
};
// Editorial introduction: clocks, their biological context, human outcomes, and methods.
// The R entry's year is an access year and must not outrank research by recency.
const editorialOrder=['levine-phenoage-2018','hallmarks-2023','dunedinpace-2022','horvath-clock-2013','calerie-dnam-2023','life-pahor-2014','bioage-kwon-2021','calerie-cardiometabolic-2019','do-health-dnam-2025','sppb-guralnik-1994','who-ageing-health-2025','who-icope-2025','gpower-faul-2007','r-power-t-test'];
export const evidenceSources:(EvidenceSource & {sourceType:EvidenceSourceType})[]=notes.map(source=>({...source,sourceType:types[source.id]??'Original research' as EvidenceSourceType})).sort((a,b)=>editorialOrder.indexOf(a.id)-editorialOrder.indexOf(b.id));
export const evidenceCategories=['All fields','Aging clocks','Human studies','Foundations','Function & care','Research methods'];
export const EVIDENCE_VERSION='2026-10-05';
export function searchEvidence(query:string,category='All fields',recent=false,sourceType:string='All source types') {
  const terms=query.toLowerCase().match(/[\p{L}\p{N}-]{2,}/gu)||[];
  const stop=new Set(['the','and','how','what','does','with','from','this','that','into','compare','between','differ','difference','can','are','for','not','why','tell','about','should','could']);
  const meaningful=terms.filter(t=>!stop.has(t));
  const ranked=evidenceSources.filter(s=>(category==='All fields'||s.category===category)&&(!recent||(s.year>=2020&&s.sourceType!=='Method documentation'))&&(sourceType==='All source types'||s.sourceType===sourceType)).map(s=>{
    const title=`${s.title} ${s.tags.join(' ')}`.toLowerCase();const all=`${title} ${s.authors} ${s.summary} ${s.limitation} ${s.category}`.toLowerCase();
    return {source:s,score:meaningful.reduce((n,t)=>n+(title.includes(t)?4:all.includes(t)?1:0),0)};
  });
  return ranked.filter(s=>!meaningful.length||s.score>0).sort((a,b)=>b.score-a.score).map(s=>s.source);
}
