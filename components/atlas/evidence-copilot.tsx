"use client";
import { useEffect, useRef, useState } from 'react';
import { Check, Download } from 'lucide-react';
import { evidenceSources, searchEvidence } from '@/lib/atlas-evidence';
import type { CopilotAnswer } from '@/lib/evidence-copilot';
import type { SourceReference, Retrieval } from '@/lib/research-assistant';
import './research-chat.css';
const prompts=['How does clinical PhenoAge differ from DunedinPACE?','What did CALERIE show about the pace of aging?','How is frailty measured in aging research?'];
type Turn={question:string;answer?:CopilotAnswer;message?:string;sources:SourceReference[];retrieval?:Retrieval};
export default function EvidenceCopilot({initialSource}:{initialSource?:string}){
  const [question,setQuestion]=useState(''),[turns,setTurns]=useState<Turn[]>([]);
  const [mode,setMode]=useState<'literature'|'curated'>(initialSource?'curated':'literature');
  const [selected,setSelected]=useState<string[]>(initialSource&&evidenceSources.some(s=>s.id===initialSource)?[initialSource]:[]);
  const [status,setStatus]=useState<'checking'|'ready'|'setup'|'error'>('checking');
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[provider,setProvider]=useState('');
  const controller=useRef<AbortController|null>(null),questionRef=useRef<HTMLTextAreaElement>(null),resultRef=useRef<HTMLElement|null>(null);
  const last=turns.at(-1);const matches=[...evidenceSources.filter(s=>selected.includes(s.id)),...searchEvidence(question).filter(s=>!selected.includes(s.id))];const full=turns.length>=4;
  async function checkStatus(signal?:AbortSignal){setStatus('checking');try{const response=await fetch('/api/evidence',{signal});if(!response.ok)throw new Error();const body=await response.json() as {configured?:boolean;provider?:string;authenticated?:boolean};setProvider(body.provider||'');setStatus(body.configured?'ready':'setup');}catch(e){if(!(e instanceof DOMException&&e.name==='AbortError'))setStatus('error');}}
  useEffect(()=>{const abort=new AbortController();void checkStatus(abort.signal);return()=>{abort.abort();controller.current?.abort();};},[]);
  function reset(){setTurns([]);setQuestion('');setSelected([]);setMode('literature');setError('');questionRef.current?.focus();}
  function suggest(value:string){setQuestion(value);if(mode==='curated')setSelected(searchEvidence(value).slice(0,4).map(s=>s.id));questionRef.current?.focus();}
  async function ask(event:React.FormEvent){
    event.preventDefault();if(busy||full)return;
    if(status!=='ready')return;
    if(question.trim().length<3||(mode==='curated'&&!selected.length)){setError('Write a question and, when using selected notes, choose at least one source.');return;}
    const abort=new AbortController();controller.current=abort;setBusy(true);setError('');const submitted=question.trim();
    try{
      const response=await fetch('/api/evidence',{method:'POST',headers:{'Content-Type':'application/json'},signal:abort.signal,body:JSON.stringify({question:submitted,mode,sourceIds:mode==='curated'?selected:[],history:turns.slice(-3).map(t=>({question:t.question,answer:t.answer?`${t.answer.title}\n${t.answer.paragraphs.map(p=>`${p.heading}: ${p.body}`).join('\n')}`.slice(0,4000):t.message||''}))})});
      const body=await response.json() as {kind?:string;error?:string;code?:string;answer?:CopilotAnswer;sources?:SourceReference[];retrieval?:Retrieval;message?:string};
      if(!response.ok){if(body.code==='AI_NOT_CONFIGURED')setStatus('setup');throw new Error(body.error||'This request could not be completed.');}
      if(body.kind==='boundary'&&body.message)setTurns(t=>[...t,{question:submitted,message:body.message,sources:[]}]);
      else if(body.kind==='answer'&&body.answer&&body.sources&&body.retrieval)setTurns(t=>[...t,{question:submitted,answer:body.answer,sources:body.sources!,retrieval:body.retrieval}]);
      else throw new Error('The response could not be verified. Please try again.');
      setQuestion('');requestAnimationFrame(()=>resultRef.current?.focus());
    }catch(e){setError(e instanceof DOMException&&e.name==='AbortError'?'Request cancelled. Your question is preserved.':e instanceof Error?e.message:'The request failed. Please try again.');}
    finally{setBusy(false);controller.current=null;}
  }
  function exportBrief(turn:Turn){
    if(!turn.answer)return;const a=turn.answer;
    const text=`# ${a.title}\n\nQuestion: ${turn.question}\n\n${a.paragraphs.map(p=>`## ${p.heading}\n\n${p.body}\n\nSources: ${p.sourceIds.map(id=>{const s=turn.sources.find(s=>s.id===id);return s?`[${s.title}](${s.url})`:id;}).join('; ')}`).join('\n\n')}\n\n## Limitations\n\n${a.limitations.map(x=>`- ${x}`).join('\n')}\n\n## Sources considered\n\n${turn.sources.map(s=>`- [${s.title}](${s.url}) — ${s.authors}, ${s.year}. ${s.studyType}. Basis: ${s.basis}.`).join('\n')}\n\nRetrieved: ${turn.retrieval?.at}\nSearch: ${turn.retrieval?.query}\n\nAI-generated research brief. Abstracts or curated notes only; not a systematic review or medical advice. Verify interpretations in the original papers.\n`;
    const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const aEl=document.createElement('a');aEl.href=url;aEl.download='proage-research-brief.md';aEl.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <div className="research-chat" data-has-answer={!!last?.answer}>
    {turns.length>0&&<div className="research-chat-toolbar"><span>{turns.length} of 4 questions in this conversation</span><button className="atlas-quiet" disabled={busy} onClick={reset}>Start a new question</button></div>}
    <div className="research-chat-layout"><div className="research-chat-main">
      <div className="research-chat-transcript" role="log" aria-label="Research conversation" aria-live="polite" aria-relevant="additions">
        {turns.map((turn,index)=><section key={index} className="research-chat-turn" ref={index===turns.length-1?resultRef:undefined} tabIndex={-1} aria-label={`Response to ${turn.question}`}><p className="research-chat-question">{turn.question}</p>{turn.answer?<><h2>{turn.answer.title}</h2>{turn.answer.paragraphs.map((p,i)=><article className="copilot-answer-section" key={i}><h3>{p.heading}</h3><p>{p.body}</p><div className="copilot-citations">{p.sourceIds.map(id=>{const source=turn.sources.find(s=>s.id===id);return source?<a href={source.url} title={source.title} key={id} target="_blank" rel="noreferrer">{source.authors.split(',')[0]} · {source.year}</a>:null;})}</div></article>)}<details className="research-chat-limits" open><summary>Limitations & uncertainty</summary><ul>{turn.answer.limitations.map(l=><li key={l}>{l}</li>)}</ul></details><button type="button" className="atlas-quiet" onClick={()=>exportBrief(turn)}><Download size={15}/>Download brief</button></>:<p className="research-chat-boundary">{turn.message}</p>}</section>)}
      </div>
      <form className="research-chat-composer" onSubmit={ask} aria-busy={busy}>
        <label htmlFor="research-question" className="research-question-label">{turns.length?'Your follow-up':'Your research question'}</label>
        <textarea ref={questionRef} id="research-question" maxLength={2000} rows={3} value={question} disabled={busy||full} onChange={e=>setQuestion(e.target.value)} placeholder={turns.length?'What would you like to understand next?':'What does the research say about healthy aging?'} aria-describedby="research-chat-scope"/>
        <div className="research-chat-submit"><span>{mode==='literature'?'Search biomedical literature':'Use selected source notes'}</span>{busy?<button className="atlas-action" type="button" onClick={()=>controller.current?.abort()}>Cancel</button>:<button type="submit" className="atlas-action atlas-action-primary" disabled={status!=='ready'||question.trim().length<3||full||(mode==='curated'&&!selected.length)}>{status==='checking'?'Connecting…':status==='ready'?'Ask a question':'Currently unavailable'}</button>}</div>
        <details className="research-source-settings" open={initialSource?true:undefined}><summary>Source settings{mode==='curated'?` · ${selected.length} ${selected.length===1?'note':'notes'} selected`:''}</summary>
          <fieldset disabled={busy||full} className="research-chat-mode"><legend className="atlas-sr-only">Evidence source</legend><label><input type="radio" name="evidence-mode" checked={mode==='literature'} onChange={()=>setMode('literature')}/><span>Biomedical literature</span></label><label><input type="radio" name="evidence-mode" checked={mode==='curated'} onChange={()=>setMode('curated')}/><span>Selected notes</span></label></fieldset>
          <p>Literature uses PubMed-indexed abstracts. Choose notes to work with specific references from our library.</p>
          {mode==='curated'&&<div className="research-chat-select"><p>Choose up to six source notes.</p><div>{matches.map(s=><label className="copilot-source-choice" key={s.id}><input type="checkbox" checked={selected.includes(s.id)} disabled={busy||full||(!selected.includes(s.id)&&selected.length>=6)} onChange={()=>setSelected(ids=>ids.includes(s.id)?ids.filter(id=>id!==s.id):[...ids,s.id])}/><span className="copilot-source-check" aria-hidden="true">{selected.includes(s.id)&&<Check size={13}/>}</span><span><small>{s.year} · {s.studyType}</small><strong>{s.title}</strong></span></label>)}</div></div>}
        </details>
        {busy&&<p role="status" className="research-chat-progress">Finding sources and preparing your answer…</p>}
        {full&&<p className="research-chat-progress">This conversation is complete. Download a brief or <button type="button" className="atlas-quiet" onClick={reset}>start a new question</button>.</p>}
        {error&&<p role="alert" className="atlas-error">{error}</p>}
        {(status==='error'||status==='setup')&&<p className="atlas-error">The assistant is temporarily unavailable. <button className="atlas-quiet" type="button" onClick={()=>void checkStatus()}>Try connecting again</button></p>}
      </form>
      {turns.length===0&&<div className="research-chat-prompts"><p>Or start with a question</p>{prompts.map(p=><button key={p} disabled={busy} onClick={()=>suggest(p)}>{p}</button>)}</div>}
      <p id="research-chat-scope" className="research-chat-scope">For research, not personal medical advice. Please leave out personal health details. Conversations clear when you reload. <a href="/privacy">Privacy</a></p>
      <details className="research-chat-method"><summary>How answers are prepared</summary><p>{provider?provider+'. ':''}The assistant checks the topic, searches Europe PMC or reads your selected notes, then prepares an answer with source links. It reads abstracts and summaries, not full papers. Check important interpretations against the original source.</p><p>A small daily allowance keeps the public assistant available. People on the same network share this allowance.</p><div><a href="/laboratory/ai-evaluation">Read the method</a><a href="/laboratory/evidence">Browse the evidence library</a></div></details>
      <noscript><p>JavaScript is needed for the assistant. You can still <a href="/laboratory/evidence">read the evidence library</a>.</p></noscript>
    </div>
    {last?.answer&&<aside className="research-chat-evidence" aria-label="Evidence for the latest answer">
      <div className="research-chat-evidence-heading"><h2>Sources</h2><span>{last.sources.length} considered</span></div><p>{last.retrieval?.mode==='literature'?`${last.retrieval.used} usable ${last.retrieval.used===1?'abstract':'abstracts'} from up to 12 search results.`:'Selected notes from the Atlas evidence library.'}</p>
      {last.sources.map(s=><article key={s.id}><small>{s.year} · {s.basis}</small><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a><details><summary>Source details</summary><p>{s.authors}</p><p>{s.studyType}</p><p>{s.limitation}</p></details></article>)}
      <details className="research-chat-search"><summary>Search record</summary><p>{last.retrieval?.query}</p><p>{last.retrieval?.at.slice(0,10)} · {last.retrieval?.total.toLocaleString()} matches</p><a href={last.retrieval?.url} target="_blank" rel="noreferrer">Open source search</a></details>
    </aside>}</div>
  </div>;
}
