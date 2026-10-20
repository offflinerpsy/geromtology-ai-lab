"use client";
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { planStudy, studyPower, validateStudy, type StudyInputs } from '@/lib/study-planner';
import { downloadJSON } from './export';
import { AnimatedNumber, MorphPath } from './motion';
import { ResearchNumber, ResearchSlider } from '@/components/ui/research-controls';
import { numericInput } from '@/lib/numeric-input';
const initial={difference:'5',sd:'10',alpha:'0.05',power:'80',ratio:'1',dropout:'15'};
export default function StudyPlanner() {
  const [fields,setFields]=useState(initial);
  const v:StudyInputs=useMemo(()=>({difference:numericInput(fields.difference),sd:numericInput(fields.sd),alpha:numericInput(fields.alpha),power:numericInput(fields.power)/100,ratio:numericInput(fields.ratio),dropout:numericInput(fields.dropout)/100}),[fields]);
  const calculation=useMemo(()=>{const issue=Object.values(fields).some(s=>s.trim()==='')?'Complete all numeric assumptions.':validateStudy(v);if(issue)return {error:issue,result:null};try{return {error:'',result:planStudy(v)};}catch(e){return {error:e instanceof Error?e.message:'Unable to calculate.',result:null};}},[fields,v]); // All assumptions are encoded in fields.
  const {result,error}=calculation;
  const curve=useMemo(()=>{if(!result)return [];const min=Math.max(2,Math.floor(result.nA*0.15)),max=Math.ceil(result.nA*2);return Array.from({length:33},(_,i)=>{const n=Math.max(2,Math.round(min+(max-min)*i/32));return {n,power:studyPower(n,Math.max(2,Math.ceil(n*v.ratio)),result.effect,v.alpha)};});},[result,v.ratio,v.alpha]);
  const set=(key:keyof typeof initial,value:string)=>setFields({...fields,[key]:value});
  return <div className="atlas-workbench study-workbench">
    <section className="atlas-panel atlas-input-panel research-input-panel" aria-label="Study design assumptions"><div className="atlas-panel-heading"><h2>Study assumptions</h2><span className="research-input-count">Live calculation</span></div>
      <div className="study-design"><span>Two independent groups</span><strong>Continuous outcome</strong><p>Two-sided, pooled-variance t test. Equal outcome variance and independent observations are assumed.</p></div>
      <div className="atlas-fields">
        <NumericField id="difference" label="Meaningful difference" unit="endpoint units" value={fields.difference} onChange={s=>set('difference',s)} detail="The difference you plan to detect"/>
        <NumericField id="sd" label="Common standard deviation" unit="same units" value={fields.sd} onChange={s=>set('sd',s)} detail="Use a defensible prior estimate"/>
      </div>
      <div className="study-effect"><span>Standardized effect · Cohen’s d</span><strong>{v.sd>0&&v.difference>0?(v.difference/v.sd).toFixed(2):'—'}</strong></div>
      <div className="study-slider"><label htmlFor="study-power">Target statistical power <strong>{fields.power}%</strong></label><ResearchSlider id="study-power" label="Target statistical power" min={50} max={99} value={numericInput(fields.power)} valueText={`${fields.power} percent`} onValueChange={value=>set('power',String(value))}/><div><span>50%</span><span>99%</span></div></div>
      <div className="atlas-fields study-statistics">
        <NumericField id="alpha" label="Significance level" unit="α" value={fields.alpha} onChange={s=>set('alpha',s)} detail="0.001–0.10; two-sided"/>
        <NumericField id="ratio" label="Allocation B : A" unit="ratio" value={fields.ratio} onChange={s=>set('ratio',s)} detail="1 is equal group allocation"/>
        <NumericField id="dropout" label="Expected dropout" unit="%" value={fields.dropout} onChange={s=>set('dropout',s)} detail="Recruitment inflated per group"/>
      </div>
      <p className="atlas-private-note">Starting values are an illustrative design, not parameters from a clinical study. Use a dot or comma for decimals, without thousands separators.</p><button type="button" className="atlas-quiet" onClick={()=>setFields(initial)}>Restore illustrative design</button>
    </section>
    <section className="atlas-panel study-result research-result-panel" aria-live="polite" aria-label="Study planning results"><div className="research-result-heading"><h2>Study estimate</h2><span>Two independent groups</span></div>
      {error||!result?<div className="atlas-result-empty"><span>Every assumption<br/>changes the study.</span><p className="atlas-error">{error}</p></div>:<><div className="study-result-top"><div><span className="atlas-result-context">Participants to recruit</span><p className="atlas-result-number"><AnimatedNumber value={result.recruitTotal} grouped/><span>total</span></p></div><div className="study-power-badge"><strong><AnimatedNumber value={result.achievedPower*100} decimals={1}/><small>%</small></strong><span>Achieved power</span></div></div>
        <div className="study-groups"><div><span>Group A</span><strong><AnimatedNumber value={result.recruitA} grouped/></strong><small>to recruit</small><small>{result.nA.toLocaleString('en-US')} evaluable</small></div><div><span>Group B</span><strong><AnimatedNumber value={result.recruitB} grouped/></strong><small>to recruit</small><small>{result.nB.toLocaleString('en-US')} evaluable</small></div></div>
        <p className="study-dropout-note">{result.nA + result.nB} evaluable participants · {fields.dropout}% expected dropout · {result.recruitTotal} to recruit.</p>
        <PowerCurve points={curve} planned={result.nA} plannedPower={result.achievedPower} target={v.power}/>
        <p className="atlas-interpretation">Power is the probability of detecting the assumed effect with this design. It does not estimate whether a treatment works. Multiplicity, clustering and unequal variance require a different analysis.</p>
        <button className="atlas-quiet atlas-export" type="button" onClick={()=>downloadJSON('proage-study-design.json',{tool:'Study Planner',method:'Two-sided pooled-variance t test; noncentral t numerical integration',assumptions:v,...result,source:'https://stat.ethz.ch/R-manual/R-devel/library/stats/html/power.t.test.html',limits:'Independent observations, normal outcomes, common variance; not paired, clustered or binary outcomes'})}><Download size={16}/>Export study design</button>
        <div className="atlas-result-foot"><span>Noncentral t model</span><span>Both rejection tails</span></div>
      </>}
    </section>
  </div>;
}
function NumericField({id,label,unit,value,onChange,detail}:{id:string;label:string;unit:string;value:string;onChange:(s:string)=>void;detail:string}){
  const error = !value.trim() ? 'Enter a value.' : !Number.isFinite(numericInput(value)) ? 'Enter a numeric value.' : undefined;
  return <ResearchNumber id={`study-${id}`} label={label} unit={unit} value={value} onChange={onChange} detail={detail} error={error}/>;
}
function PowerCurve({points,planned,plannedPower,target}:{points:{n:number;power:number}[];planned:number;plannedPower:number;target:number}){
  const signature=`${planned}:${plannedPower}:${target}`;
  const [explored,setExplored]=useState<{signature:string;index:number}|null>(null);
  const position=explored?.signature===signature?explored.index:null;
  const setPosition=(index:number|null)=>setExplored(index===null?null:{signature,index});
  if(!points.length)return null;
  const samples=[...points.filter(point=>point.n!==planned),{n:planned,power:plannedPower}].sort((a,b)=>a.n-b.n);
  const selected=position??samples.findIndex(point=>point.n===planned);
  const width=520,height=235,left=45,right=20,top=18,bottom=38,min=points[0].n,max=points.at(-1)!.n;
  const x=(n:number)=>left+(n-min)/(max-min)*(width-left-right),y=(p:number)=>height-bottom-p*(height-top-bottom);
  const line=samples.map((p,i)=>`${i?'L':'M'}${x(p.n).toFixed(2)},${y(p.power).toFixed(2)}`).join(' '),hover=samples[Math.min(selected,samples.length-1)],alternative=hover.n!==planned;
  return <figure className="study-curve"><div className="study-curve-title"><span>Power × evaluable sample</span><strong>{alternative?'Alternative sample':'Recommended sample'} · {hover.n} in group A · {(hover.power*100).toFixed(1)}%</strong></div><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Power curve: target ${(target*100).toFixed(0)} percent reached with ${planned} evaluable participants in group A`}>
    <defs><linearGradient id="power-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--workspace-accent)" stopOpacity=".2"/><stop offset="1" stopColor="var(--workspace-accent)" stopOpacity="0"/></linearGradient></defs>
    {[0,.25,.5,.75,1].map(p=><g key={p}><line x1={left} x2={width-right} y1={y(p)} y2={y(p)} stroke="currentColor" opacity=".1"/><text x={left-10} y={y(p)+4} textAnchor="end">{p*100}%</text></g>)}
    <MorphPath d={`${line} L${x(max)},${y(0)} L${x(min)},${y(0)} Z`} fill="url(#power-area)"/><MorphPath d={line} fill="none" stroke="var(--workspace-accent)" strokeWidth="2.2"/>
    <line x1={left} x2={width-right} y1={y(target)} y2={y(target)} stroke="var(--workspace-ink)" strokeDasharray="4 5" opacity=".7"/><line x1={x(planned)} x2={x(planned)} y1={top} y2={y(0)} stroke="var(--workspace-ink)" opacity=".4"/>
    <circle cx={x(hover.n)} cy={y(hover.power)} r="5" fill="var(--workspace-accent)"/>
    {[min,Math.round((min+max)/2),max].map(n=><text key={n} x={x(n)} y={height-10} textAnchor="middle">{n}</text>)}
  </svg><label className="atlas-sr-only" htmlFor="power-curve-explore">Explore power at different sample sizes</label><ResearchSlider id="power-curve-explore" label="Explore power at different sample sizes" min={0} max={samples.length-1} value={selected} valueText={`${hover.n} evaluable in group A, ${(hover.power*100).toFixed(1)} percent power, ${alternative?'alternative sample':'recommended sample'}`} onValueChange={value=>setPosition(value)}/><figcaption>Evaluable participants in group A · allocation held constant. {alternative?'Exploring an alternative; recruitment totals above remain the recommended design.':'Marker matches the recommended design. Drag to explore alternatives.'}</figcaption>{alternative&&<button type="button" className="atlas-quiet" onClick={()=>setPosition(null)}>Return to recommended sample</button>}</figure>;
}
