"use client";
import { useState } from 'react';
import { DocumentLink as Link } from '@/components/site/research-link';
import { Search, X } from 'lucide-react';
import { evidenceSources, evidenceCategories, evidenceSourceTypes, searchEvidence } from '@/lib/atlas-evidence';
import { ResearchSelect } from '@/components/ui/research-controls';
export default function AtlasEvidenceLibrary(){
  const [query,setQuery]=useState(''),[category,setCategory]=useState('All fields'),[recent,setRecent]=useState(false),[sourceType,setSourceType]=useState('All source types');
  const filtered=searchEvidence(query,category,recent,sourceType);
  return <section className="atlas-library" aria-label="Curated research library">
    <div className="atlas-library-toolbar"><div className="atlas-search"><Search size={20}/><label className="atlas-sr-only" htmlFor="atlas-source-search">Search the evidence library</label><input id="atlas-source-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="A question, an author, a research field…"/>{query&&<button type="button" aria-label="Clear search" onClick={()=>setQuery('')}><X size={18}/></button>}</div><label className="atlas-check"><input type="checkbox" checked={recent} onChange={e=>setRecent(e.target.checked)}/>Published 2020 onwards</label></div>
    <div className="atlas-filter-tabs" role="group" aria-label="Filter by research field">{evidenceCategories.map(c=><button type="button" aria-pressed={category===c} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
    <div className="atlas-source-type-filter"><label htmlFor="atlas-source-type">Source type</label><ResearchSelect id="atlas-source-type" label="Source type" value={sourceType} onValueChange={setSourceType} options={evidenceSourceTypes.map(type=>({value:type,label:type}))}/><span>Editorial selection · relevance when searching</span></div>
    <div className="atlas-library-meta"><span aria-live="polite">{filtered.length} of {evidenceSources.length} sources</span><span>Curated source notes · October 2026</span></div>
    <div className="atlas-source-list">{filtered.map(s=><article key={s.id} className="atlas-source-item" id={s.id}><div className="atlas-source-meta"><span>{s.category}</span><strong>{s.sourceType==='Method documentation'?'Accessed ':''}{s.year}</strong></div><div className="atlas-source-body"><span className="atlas-study-type">{s.sourceType} · {s.studyType}</span><h2><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></h2><p className="atlas-source-author">{s.authors}</p><p>{s.summary}</p><details className="atlas-source-detail"><summary>Interpretation & limitations</summary><p>{s.limitation}</p><div className="atlas-tags">{s.tags.map(tag=><span key={tag}>{tag}</span>)}</div></details><div className="atlas-source-actions"><a href={s.url} target="_blank" rel="noreferrer">Open source </a><Link href={`/laboratory/ask?source=${encodeURIComponent(s.id)}`}>Use in research assistant </Link></div></div></article>)}</div>
    {!filtered.length&&<div className="atlas-panel atlas-empty"><h2>No sources match this view.</h2><p>Try a broader term or remove a filter.</p><button type="button" className="atlas-quiet" onClick={()=>{setQuery('');setCategory('All fields');setRecent(false);setSourceType('All source types');}}>Reset the library</button></div>}
  </section>;
}
