"use client";
import { useMemo, useState } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import { planStudy, studyPower, validateStudy, type StudyInputs } from '@/lib/study-planner';
import { downloadJSON } from './export';
import { AnimatedNumber, MorphPath } from './motion';
const initial={difference:'5',sd:'10',alpha:'0.05',power:'80',ratio:'1',dropout:'15'};
export default function StudyPlanner() {
  const [fields,setFields]=useState(initial);
  const v:StudyInputs={difference:Number(fields.difference),sd:Number(fields.sd),alpha:Number(fields.alpha),power:Number(fields.power)/100,ratio:Number(fields.ratio),dropout:Number(fields.dropout)/100};
  const calculation=useMemo(()=>{const issue=Object.values(fields).some(s=>s.trim()==='')?'Complete all numeric assumptions.':validateStudy(v);if(issue)return {error:issue,result:null};try{return {error:'',result:planStudy(v)};}catch(e){return {error:e instanceof Error?e.message:'Unable to calculate.',result:null};}},[fields]); // All assumptions are encoded in fields.
  const {result,error}=calculation;
  const curve=useMemo(()=>{if(!result)return [];const min=Math.max(2,Math.floor(result.nA*0.15)),max=Math.ceil(result.nA*2);return Array.from({length:33},(_,i)=>{const n=Math.max(2,Math.round(min+(max-min)*i/32));return {n,power:studyPower(n,Math.max(2,Math.ceil(n*v.ratio)),result.effect,v.alpha)};});},[result,fields.ratio,fields.alpha]);
  const set=(key:keyof typeof initial,value:string)=>setFields({...fields,[key]:value});
  return <div className="atlas-workbench study-workbench">
    <section className="atlas-panel atlas-input-panel" aria-label="Study design assumptions"><div className="atlas-panel-heading"><div><p className="atlas-kicker">Define the question</p><h2>Study assumptions</h2></div><span className="atlas-completion">Live calculation</span></div>
      <div className="study-design"><span>Two independent groups</span><strong>Continuous outcome</strong><p>Two-sided, pooled-variance t test. Equal outcome variance and independent observations are assumed.</p></div>
      <div className="atlas-fields">
        <NumericField id="difference" label="Meaningful difference" unit="endpoint units" value={fields.difference} onChange={s=>set('difference',s)} detail="The difference you plan to detect"/>
        <NumericField id="sd" label="Common standard deviation" unit="same units" value={fields.sd} onChange={s=>set('sd',s)} detail="Use a defensible prior estimate"/>
      </div>
      <div className="study-effect"><span>Standardized effect · Cohen’s d</span><strong>{v.sd>0&&v.difference>0?(v.difference/v.sd).toFixed(2):'—'}</strong></div>
      <div className="study-slider"><label htmlFor="study-power">Target statistical power <strong>{fields.power}%</strong></label><input type="range" id="study-power" min="50" max="99" value={fields.power} onChange={e=>set('power',e.target.value)}/><div><span>50%</span><span>99%</span></div></div>
      <div className="atlas-fields">
        <NumericField id="alpha" label="Significance level" unit="α" value={fields.alpha} onChange={s=>set('alpha',s)} detail="0.001–0.10; two-sided"/>
        <NumericField id="ratio" label="Allocation B : A" unit="ratio" value={fields.ratio} onChange={s=>set('ratio',s)} detail="1 is equal group allocation"/>
        <NumericField id="dropout" label="Expected dropout" unit="%" value={fields.dropout} onChange={s=>set('dropout',s)} detail="Recruitment inflated per group"/>
      </div>
      <p className="atlas-private-note">Starting values are an illustrative design, not parameters from a clinical study.</p><button type="button" className="atlas-quiet" onClick={()=>setFields(initial)}>Restore illustrative design</button>
    </section>
    <section className="atlas-panel study-result" aria-live="polite" aria-label="Study planning results"><p className="atlas-kicker">Your design, made visible</p>
      {error||!result?<div className="atlas-result-empty"><span>Every assumption<br/>changes the study.</span><p className="atlas-error">{error}</p></div>:<><div className="study-result-top"><div><span className="atlas-result-context">Participants to recruit</span><p className="atlas-result-number"><AnimatedNumber value={result.recruitTotal} grouped/><span>total</span></p></div><div className="study-power-badge"><strong><AnimatedNumber value={result.achievedPower*100} decimals={1}/><small>%</small></strong><span>Achieved power</span></div></div>
        <div className="study-groups"><div><span>Group A</span><strong><AnimatedNumber value={result.recruitA} grouped/></strong><small>to recruit</small><small>{result.nA.toLocaleString('en-US')} evaluable</small></div><ArrowRight size={20} aria-hidden="true"/><div><span>Group B</span><strong><AnimatedNumber value={result.recruitB} grouped/></strong><small>to recruit</small><small>{result.nB.toLocaleString('en-US')} evaluable</small></div></div>
        <p className="study-dropout-note">{result.nA + result.nB} evaluable participants · {fields.dropout}% expected dropout · {result.recruitTotal} to recruit.</p>
        <PowerCurve key={JSON.stringify(fields)} points={curve} planned={result.nA} plannedPower={result.achievedPower} target={v.power}/>
        <p className="atlas-interpretation">Power is the probability of detecting the assumed effect with this design. It does not estimate whether a treatment works. Multiplicity, clustering and unequal variance require a different analysis.</p>
        <button className="atlas-quiet atlas-export" type="button" onClick={()=>downloadJSON('proage-study-design.json',{tool:'Study Planner',method:'Two-sided pooled-variance t test; noncentral t numerical integration',assumptions:v,...result,source:'https://stat.ethz.ch/R-manual/R-devel/library/stats/html/power.t.test.html',limits:'Independent observations, normal outcomes, common variance; not paired, clustered or binary outcomes'})}><Download size={16}/>Export study design</button>
        <div className="atlas-result-foot"><span>Noncentral t model</span><span>Both rejection tails</span></div>
      </>}
    </section>
  </div>;
}
function NumericField({id,label,unit,value,onChange,detail}:{id:string;label:string;unit:string;value:string;onChange:(s:string)=>void;detail:string}){return <div className="atlas-field"><label htmlFor={`study-${id}`}>{label}<span>{unit}</span></label><input id={`study-${id}`} type="number" inputMode="decimal" step="any" value={value} onChange={e=>onChange(e.target.value)} aria-describedby={`study-help-${id}`}/><small id={`study-help-${id}`}>{detail}</small></div>;}
function PowerCurve({points,planned,plannedPower,target}:{points:{n:number;power:number}[];planned:number;plannedPower:number;target:number}){
  const [position,setPosition]=useState<number|null>(null);if(!points.length)return null;
  const samples=[...points.filter(point=>point.n!==planned),{n:planned,power:plannedPower}].sort((a,b)=>a.n-b.n);
  const selected=position??samples.findIndex(point=>point.n===planned);
  const width=520,height=235,left=45,right=20,top=18,bottom=38,min=points[0].n,max=points.at(-1)!.n;
  const x=(n:number)=>left+(n-min)/(max-min)*(width-left-right),y=(p:number)=>height-bottom-p*(height-top-bottom);
  const line=samples.map((p,i)=>`${i?'L':'M'}${x(p.n).toFixed(2)},${y(p.power).toFixed(2)}`).join(' '),hover=samples[Math.min(selected,samples.length-1)],alternative=hover.n!==planned;
  return <figure className="study-curve"><div className="study-curve-title"><span>Power × evaluable sample</span><strong>{alternative?'Alternative sample':'Recommended sample'} · {hover.n} in group A · {(hover.power*100).toFixed(1)}%</strong></div><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Power curve: target ${(target*100).toFixed(0)} percent reached with ${planned} evaluable participants in group A`}>
    <defs><linearGradient id="power-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a2dbbd" stopOpacity=".2"/><stop offset="1" stopColor="#a2dbbd" stopOpacity="0"/></linearGradient></defs>
    {[0,.25,.5,.75,1].map(p=><g key={p}><line x1={left} x2={width-right} y1={y(p)} y2={y(p)} stroke="currentColor" opacity=".1"/><text x={left-10} y={y(p)+4} textAnchor="end">{p*100}%</text></g>)}
    <MorphPath d={`${line} L${x(max)},${y(0)} L${x(min)},${y(0)} Z`} fill="url(#power-area)"/><MorphPath d={line} fill="none" stroke="#b3e4b8" strokeWidth="2.2"/>
    <line x1={left} x2={width-right} y1={y(target)} y2={y(target)} stroke="#d7dfb2" strokeDasharray="4 5" opacity=".7"/><line x1={x(planned)} x2={x(planned)} y1={top} y2={y(0)} stroke="#d7dfb2" opacity=".4"/>
    <circle cx={x(hover.n)} cy={y(hover.power)} r="5" fill="#e2ecc7"/>
    {[min,Math.round((min+max)/2),max].map(n=><text key={n} x={x(n)} y={height-10} textAnchor="middle">{n}</text>)}
  </svg><label className="atlas-sr-only" htmlFor="power-curve-explore">Explore power at different sample sizes</label><input type="range" id="power-curve-explore" min="0" max={samples.length-1} value={selected} aria-valuetext={`${hover.n} evaluable in group A, ${(hover.power*100).toFixed(1)} percent power, ${alternative?'alternative sample':'recommended sample'}`} onChange={e=>setPosition(Number(e.target.value))}/><figcaption>Evaluable participants in group A · allocation held constant. {alternative?'Exploring an alternative; recruitment totals above remain the recommended design.':'Marker matches the recommended design. Drag to explore alternatives.'}</figcaption>{alternative&&<button type="button" className="atlas-quiet" onClick={()=>setPosition(null)}>Return to recommended sample</button>}</figure>;
}
