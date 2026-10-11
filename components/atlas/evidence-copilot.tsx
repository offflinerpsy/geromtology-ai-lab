"use client";
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Download, Search, X } from 'lucide-react';
import { evidenceSources, searchEvidence, type EvidenceSource } from '@/lib/atlas-evidence';
import type { CopilotAnswer } from '@/lib/evidence-copilot';
import { downloadJSON } from './export';
const prompts=['How does clinical PhenoAge differ from DunedinPACE?','What did CALERIE measure, and what remains uncertain?','Compare molecular aging measures with functional outcomes.'];
export default function EvidenceCopilot({initialSource}:{initialSource?:string}){
  const [question,setQuestion]=useState('');const [matches,setMatches]=useState<EvidenceSource[]>(initialSource?evidenceSources.filter(s=>s.id===initialSource):[]);
  const [selected,setSelected]=useState<string[]>(initialSource&&evidenceSources.some(s=>s.id===initialSource)?[initialSource]:[]);
  const [status,setStatus]=useState<'checking'|'ready'|'setup'|'error'>('checking');const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const [answer,setAnswer]=useState<CopilotAnswer|null>(null),[answerSources,setAnswerSources]=useState<string[]>([]),[answeredQuestion,setAnsweredQuestion]=useState('');
  const [provider,setProvider]=useState('');const [authenticated,setAuthenticated]=useState(false);
  const [searched,setSearched]=useState(!!initialSource);const controller=useRef<AbortController|null>(null);
  async function checkStatus(signal?:AbortSignal){setStatus('checking');try{const response=await fetch('/api/evidence',{signal});if(!response.ok)throw new Error();const body=await response.json() as {configured?:boolean;provider?:string;authenticated?:boolean};setProvider(body.provider||'');setAuthenticated(body.authenticated===true);setStatus(body.configured?'ready':'setup');}catch(e){if(!(e instanceof DOMException&&e.name==='AbortError'))setStatus('error');}}
  useEffect(()=>{const statusController=new AbortController();void checkStatus(statusController.signal);return()=>{statusController.abort();controller.current?.abort();};},[]);
  function discover(q=question){const found=searchEvidence(q);setMatches(found);setSelected(found.slice(0,4).map(s=>s.id));setSearched(true);setError('');setAnswer(null);}
  function suggest(q:string){setQuestion(q);discover(q);}
  function toggle(id:string){if(busy)return;setSelected(s=>s.includes(id)?s.filter(x=>x!==id):s.length<6?[...s,id]:s);setAnswer(null);setError('');}
  async function synthesize(e:React.FormEvent){e.preventDefault();if(status!=='ready'||busy)return;if(question.trim().length<8||selected.length===0){setError('Write a research question and select at least one source.');return;}
    const abort=new AbortController();controller.current=abort;setBusy(true);setError('');setAnswer(null);
    try{const response=await fetch('/api/evidence',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,sourceIds:selected}),signal:abort.signal});const body=await response.json() as {code?:string;error?:string;answer?:CopilotAnswer;sourceIds?:string[]};if(!response.ok){if(body.code==='AI_NOT_CONFIGURED')setStatus('setup');throw new Error(body.error||'Unable to complete this synthesis.');}if(!body.answer||!Array.isArray(body.sourceIds))throw new Error('The answer could not be verified. Please try again.');setAnswer(body.answer);setAnswerSources(body.sourceIds);setAnsweredQuestion(question);}
    catch(e){if(e instanceof DOMException&&e.name==='AbortError')setError('Synthesis cancelled. Your question and sources are preserved.');else setError(e instanceof Error?e.message:'Unable to complete this synthesis.');}
    finally{setBusy(false);controller.current=null;}
  }
  return <div className="atlas-copilot">
    <div className="copilot-intro-line"><span className="copilot-status"><i data-ready={status==='ready'}/>{status==='checking'?'Checking connection':status==='ready'?'Research assistant ready':status==='setup'?'Source discovery active · AI setup pending':'Connection unavailable'}</span><span>{evidenceSources.length} curated sources · public research only</span></div>
    <div className="copilot-layout"><div className="atlas-panel copilot-question-panel">
      <form onSubmit={synthesize}><label className="atlas-kicker" htmlFor="research-question">Begin with a question</label><textarea id="research-question" maxLength={2000} rows={4} value={question} disabled={busy} onChange={e=>{setQuestion(e.target.value);setAnswer(null);}} placeholder="What does this evidence support—and where does it stop?" aria-describedby="copilot-scope"/>
      <p id="copilot-scope" className="atlas-private-note">Use a scientific question. Do not enter patient names, medical records or personal blood results.</p>
      <div className="copilot-composer-actions"><button type="button" className="atlas-action" disabled={busy||question.trim().length<2} onClick={()=>discover()}><Search size={16}/>Find sources</button><button type="submit" className="atlas-action atlas-action-primary" disabled={status!=='ready'||!authenticated||busy||!selected.length||question.trim().length<8}>{busy?'Synthesizing…':'Ask Evidence Copilot'}<ArrowRight size={16}/></button></div>
      {status==='ready'&&!authenticated&&<p className="copilot-connection-note"><a className="atlas-quiet" href="/auth/login?return_to=%2Flaboratory%2Fask" target="_top">Sign in securely to ask the assistant ↗</a> Source discovery is available without sign-in.</p>}
      {status==='setup'&&<p className="copilot-connection-note">AI synthesis awaits a server-side connection. You can search, select and read sources now; no generated answer is shown until a model is connected.</p>}
      {status==='error'&&<button className="atlas-quiet" type="button" onClick={()=>void checkStatus()}>Retry connection check</button>}
      </form>
      {!searched&&<div className="copilot-starters"><p className="atlas-kicker">Questions to explore</p>{prompts.map(q=><button key={q} type="button" onClick={()=>suggest(q)}>{q}<ArrowUpRight size={15}/></button>)}</div>}
      {searched&&<div className="copilot-selected"><div className="atlas-panel-heading"><h2>Build your source set</h2><span>{selected.length} / 6 selected</span></div><p className="atlas-private-note">Lexical matches from the curated library. Select the sources you want the model to use.</p>
        {!matches.length&&<p className="atlas-error">No matching notes. Try “PhenoAge”, “function” or “calorie restriction”.</p>}
        {matches.map(s=><label className="copilot-source-choice" key={s.id}><input type="checkbox" checked={selected.includes(s.id)} disabled={busy||(!selected.includes(s.id)&&selected.length>=6)} onChange={()=>toggle(s.id)}/><span className="copilot-source-check" aria-hidden="true">{selected.includes(s.id)&&<Check size={13}/>}</span><span><small>{s.category} · {s.year}</small><strong>{s.title}</strong><em>{s.studyType}</em></span></label>)}
      </div>}
      <a className="copilot-pubmed" href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(question||'biological aging biomarkers')}`} target="_blank" rel="noreferrer">Continue this search on PubMed <ArrowUpRight size={16}/></a>
    </div>
    <section className="atlas-panel copilot-answer-panel" aria-live="polite" aria-label="Research synthesis"><p className="atlas-kicker">Source-grounded synthesis</p>
      {busy?<div className="copilot-loading"><div className="copilot-breath" aria-hidden="true"/><h2>Reading the selected notes.</h2><p>Comparing methods, findings and their limits.</p><button type="button" className="atlas-quiet" onClick={()=>controller.current?.abort()}><X size={16}/>Cancel synthesis</button></div>:answer?<><h2 className="copilot-answer-title">{answer.title}</h2><p className="copilot-answer-question">{answeredQuestion}</p>{answer.paragraphs.map((p,i)=><article className="copilot-answer-section" key={i}><h3>{p.heading}</h3><p>{p.body}</p><div className="copilot-citations">{p.sourceIds.map(id=>{const s=evidenceSources.find(s=>s.id===id);return s?<a key={id} href={s.url} target="_blank" rel="noreferrer">{s.authors.split(',')[0]} · {s.year}<ArrowUpRight size={12}/></a>:null;})}</div></article>)}<div className="copilot-limitations"><h3>What remains uncertain</h3><ul>{answer.limitations.map(l=><li key={l}>{l}</li>)}</ul></div><button className="atlas-quiet atlas-export" type="button" onClick={()=>downloadJSON('proage-evidence-synthesis.json',{question:answeredQuestion,answer,sources:evidenceSources.filter(s=>answerSources.includes(s.id)),scope:'AI synthesis of curated source notes, not original full texts; scientific research use'})}><Download size={16}/>Export source-linked synthesis</button></>:<div className="copilot-empty"><div className="copilot-evidence-art" aria-hidden="true"><img src="/images/lab-glass-v10.webp" width="1536" height="1024" alt="" loading="lazy"/></div><h2>A good answer starts<br/>with <em>good sources.</em></h2><p>Select research notes and ask a focused question. A connected model can compare the evidence with links to every cited source.</p><div className="copilot-empty-principles"><span>Findings & context</span><span>Methods & populations</span><span>Limitations & disagreement</span></div></div>}
      {error&&<p className="atlas-error copilot-error" role="alert">{error}</p>}
      <div className="atlas-result-foot"><details><summary>Source scope & connection</summary><p>Answers use selected curated notes, not full texts. {provider ? `Connection: ${provider}.` : "Connection details unavailable."}</p></details><span>Research assistance</span></div>
    </section></div>
  </div>;
}
