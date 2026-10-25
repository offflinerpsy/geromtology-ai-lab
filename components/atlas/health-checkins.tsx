'use client';
import {useEffect,useRef,useState} from 'react';
import Link from '@/components/site/research-link';
import {answeredCount,checkInGroups,checkInResult,healthCheckIns,type CheckIn,type CheckInAnswers,type CheckInGroup} from '@/lib/health-checkins';
import './health-checkins.css';

export function CheckInCollection(){
  const [group,setGroup]=useState<CheckInGroup|'All'>('All');
  const selected=healthCheckIns.filter(check=>group==='All'||check.group===group);
  return <section className="checkin-collection" aria-label="Choose a health check-in">
    <div className="checkin-filters" role="group" aria-label="Filter check-ins by topic">{(['All',...checkInGroups] as const).map(label=><button key={label} type="button" aria-pressed={group===label} onClick={()=>setGroup(label)}>{label}</button>)}</div>
    <p className="atlas-sr-only" role="status">{selected.length} check-ins shown</p><div className="checkin-grid">{selected.map(check=><Link href={`/tools/check-ins/${check.slug}`} className="checkin-card" key={check.slug}><div className="checkin-card-meta"><span>{check.method}</span><span>{check.questions.length} {check.questions.length===1?'question':'questions'}</span></div><h2>{check.title}</h2><p>{check.description}</p><span className="checkin-card-action">Start check-in</span></Link>)}</div>
    <p className="checkin-privacy">For adults. No account needed. Answers stay in this tab and clear when you reload. <Link href="/privacy">Privacy</Link></p>
    <details className="checkin-method"><summary>Which check-ins have a clinical score?</summary><div><p>Anxiety uses GAD-7, mood uses PHQ-9, and muscle function uses SARC-F. Their published scores are screening information, not diagnoses. The other check-ins simply organize your own observations; they do not generate a health, immunity or biological-age score.</p></div></details>
    <noscript><p>JavaScript is needed to answer the questions. The check-in descriptions and source links on each page remain available.</p></noscript>
  </section>;
}
function SupportNote(){return <aside className="checkin-support" aria-label="Support for thoughts of self-harm"><h3>You deserve support with this.</h3><p>Your answer about thoughts of death or self-harm deserves a conversation with a qualified professional, regardless of your total score. Please contact someone who can support you today.</p><p>If you might act on these thoughts or cannot stay safe, contact local emergency services now. In the U.S. or Canada, call or text <a href="tel:988">988</a>. Elsewhere, <a href="https://findahelpline.com" target="_blank" rel="noreferrer">find a local crisis helpline</a>. Someone you trust can stay with you while you reach support.</p></aside>;}
export function CheckInQuestionnaire({check}:{check:CheckIn}){
  const [answers,setAnswers]=useState<CheckInAnswers>({}),[step,setStep]=useState(0),[complete,setComplete]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null),hasInteracted=useRef(false);
  useEffect(()=>{if(hasInteracted.current)heading.current?.focus();},[step,complete]);
  const question=check.questions[step],chosen=answers[question.id],answered=answeredCount(check,answers);
  const result=complete?checkInResult(check,answers):null;
  const showSupport=check.kind==='phq9'&&(answers.q9??0)>0;
  const move=(next:number)=>{hasInteracted.current=true;setStep(next);};
  function advance(){if(chosen===undefined)return;hasInteracted.current=true;if(step===check.questions.length-1)setComplete(true);else setStep(step+1);}
  function restart(){hasInteracted.current=true;setAnswers({});setStep(0);setComplete(false);}
  function download(){
    if(!result)return;
    const text=`# ${check.title} — ProAge Atlas\n\nMethod: ${check.method}\nPeriod: ${check.period}\nSaved: ${new Date().toISOString().slice(0,10)}\n\n${result.score===null?'Personal reflection; no clinical score.':`Score: ${result.score} / ${result.maximum}\n${result.band}`}\n\n${result.summary.map((row,i)=>`${i+1}. ${row.question}\n   ${row.answer}${row.detail?` — ${row.detail}`:''}`).join('\n\n')}\n\n## Interpretation\n\n${check.interpretation}\n\n${result.support?'An answer about thoughts of death or self-harm was recorded. Please seek professional support today. If you may act on these thoughts or cannot stay safe, contact local emergency services now. U.S. and Canada: call or text 988. Elsewhere: https://findahelpline.com\n\n':''}## Method\n\n${check.attribution}\n\n${check.sources.map(s=>`${s.label}: ${s.url}`).join('\n')}\n\nThis summary is not a diagnosis or treatment recommendation. Your answers were processed in your browser and were not sent to the AI assistant.\n`;
    const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`proage-${check.slug}-check-in.md`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <div className="checkin-workspace">
    <div className="checkin-context"><span>{check.method}</span><span>{check.period}</span></div>
    {!result?<section className="checkin-question-card" aria-label="Check-in questions">
      <div className="checkin-progress-heading"><span>Question {step+1} of {check.questions.length}</span><span>{answered} answered</span></div><progress className="checkin-progress" value={answered} max={check.questions.length} aria-label="Questions answered"/>
      <p className="checkin-period">{check.instructions}</p>
      <fieldset className="checkin-fieldset"><legend><h2 ref={heading} tabIndex={-1} data-long={question.text.length>130}>{question.text}</h2></legend>{question.help&&<p className="checkin-question-help" id={`help-${question.id}`}>{question.help}</p>}<div className={`checkin-options ${question.layout==='rating'?'checkin-rating':''}`}>{question.options.map(option=><label key={option.value} className="checkin-option" data-selected={chosen===option.value}><input type="radio" name={question.id} value={option.value} checked={chosen===option.value} onChange={()=>setAnswers(current=>({...current,[question.id]:option.value}))} aria-describedby={question.help?`help-${question.id}`:undefined}/><span>{option.label}{option.detail&&<small>{option.detail}</small>}</span></label>)}</div></fieldset>
      {showSupport&&<SupportNote/>}
      <div className="checkin-step-actions"><button className="checkin-button checkin-button-quiet" type="button" disabled={step===0} onClick={()=>move(step-1)}>Back</button><button className="checkin-button checkin-button-primary" type="button" onClick={advance} disabled={chosen===undefined}>{step===check.questions.length-1?'View my summary':'Continue'}</button></div>
    </section>:<section className="checkin-result" aria-label="Your check-in summary">
      <div className="checkin-result-heading"><div><p>Your check-in</p><h2 ref={heading} tabIndex={-1}>{result.score===null?'A clearer picture.':result.band}</h2></div>{result.score!==null&&<div className="checkin-score"><strong>{result.score}</strong><span>out of {result.maximum}</span></div>}</div>
      <p className="checkin-interpretation">{check.interpretation}</p>
      {showSupport&&<SupportNote/>}
      <dl className="checkin-answer-list">{result.summary.map((row,i)=><div key={check.questions[i].id}><dt>{row.question}</dt><dd>{row.answer}{row.detail&&<span> · {row.detail}</span>}</dd></div>)}</dl>
      <div className="checkin-result-actions"><button type="button" className="checkin-button checkin-button-primary" onClick={download}>Save summary</button><button type="button" className="checkin-button" onClick={()=>{hasInteracted.current=true;setStep(0);setComplete(false);}}>Review answers</button><button type="button" className="checkin-button checkin-button-quiet" onClick={restart}>Start again</button></div>
      <p className="checkin-next"><Link href="/tools/check-ins">Choose another check-in</Link></p>
    </section>}
    <p className="checkin-privacy">Your answers stay in this tab. They are not sent to the AI assistant or saved to an account. Reloading clears them.</p>
    <details className="checkin-method"><summary>About this check-in & sources</summary><div><p>{check.attribution}</p>{check.kind!=='reflection'&&<p>{check.kind==='sarcf'?'Five questions, scored 0–2 each. Total: 0–10. A score of 4 or more indicates a need for further assessment.':`${check.kind==='gad7'?'Seven':'Nine'} symptom questions, scored 0–3 each. The final daily-impact question is not part of the total.`}</p>}{check.sources.length>0&&<ul>{check.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>}<p>For adult self-reflection and screening information. A qualified health professional can interpret health concerns in context.</p></div></details>
    <noscript><p>JavaScript is needed to complete this check-in. You can read its method and original sources above.</p></noscript>
  </div>;
}
