"use client";
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Download, RotateCcw } from 'lucide-react';
import { biomarkerFields, sampleBiomarkers, convertUnits, calculatePhenoAge, validateBiomarkers, type BiomarkerKey, type BiomarkerValues, type UnitSystem } from '@/lib/phenoage';
import { downloadJSON } from './export';
import { AnimatedNumber } from './motion';
import { ResearchNumber, ResearchSegment } from '@/components/ui/research-controls';
import { numericInput } from '@/lib/numeric-input';
type Result=ReturnType<typeof calculatePhenoAge>;
const empty=()=>Object.fromEntries(biomarkerFields.map(f=>[f.key,''])) as Record<BiomarkerKey,string>;
export default function PhenoAgeExplorer() {
  const [fields,setFields]=useState(empty);const [units,setUnits]=useState<UnitSystem>('si');const [errors,setErrors]=useState<Partial<Record<BiomarkerKey,string>>>({});
  const resultPanel=useRef<HTMLElement>(null);
  const [result,setResult]=useState<Result|null>(null);const [sample,setSample]=useState(false);
  const complete=biomarkerFields.filter(f=>fields[f.key].trim()!=='').length;
  function sampleData(){const values=convertUnits(sampleBiomarkers,'si',units);setFields(Object.fromEntries(Object.entries(values).map(([k,v])=>[k,String(Number(v.toFixed(5)))])) as Record<BiomarkerKey,string>);setSample(true);setResult(null);setErrors({});}
  function changeUnits(next:UnitSystem){if(next===units)return;const values=Object.fromEntries(biomarkerFields.map(f=>[f.key,fields[f.key]===''?NaN:numericInput(fields[f.key])])) as BiomarkerValues;const converted=convertUnits(values,units,next);setFields(Object.fromEntries(Object.entries(converted).map(([k,v])=>[k,Number.isFinite(v)?String(Number(v.toFixed(6))):''])) as Record<BiomarkerKey,string>);setUnits(next);setErrors({});setResult(null);}
  function calculate(e:React.FormEvent){e.preventDefault();const values=Object.fromEntries(biomarkerFields.map(f=>[f.key,fields[f.key].trim()===''?NaN:numericInput(fields[f.key])])) as BiomarkerValues;const invalid=validateBiomarkers(values,units);setErrors(invalid);if(Object.keys(invalid).length){setResult(null);const first=biomarkerFields.find(f=>invalid[f.key]);if(first)document.getElementById(`pheno-${first.key}`)?.focus();return;}setResult(calculatePhenoAge(values,units));requestAnimationFrame(()=>resultPanel.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));}
  const field = (key: BiomarkerKey) => {
    const item = biomarkerFields.find(item => item.key === key)!;
    return <ResearchNumber key={key} id={`pheno-${key}`} label={item.label}
      unit={units === 'si' ? item.si : item.conventional} detail={item.detail}
      value={fields[key]} error={errors[key]} onChange={value => {
        setFields(previous => ({...previous, [key]: value})); setResult(null);
        if (sample) setSample(false);
        if (errors[key]) setErrors(previous => ({...previous, [key]: undefined}));
      }}/>;
  };
  const groups: { title: string; keys: BiomarkerKey[] }[] = [
    {title: 'Test context', keys: ['age']},
    {title: 'Blood chemistry', keys: ['albumin', 'creatinine', 'glucose', 'crp', 'alp']},
    {title: 'Blood cell profile', keys: ['lymphocytes', 'mcv', 'rdw', 'wbc']},
  ];
  return <div className="atlas-workbench pheno-workbench">
    <form className="atlas-panel atlas-input-panel research-input-panel" onSubmit={calculate} noValidate>
      <div className="atlas-panel-heading"><h2>Blood biomarkers</h2><span className="research-input-count">{complete} of 10 entered</span></div>
      <div className="research-progress" role="progressbar" aria-label="Blood panel input completion" aria-valuemin={0} aria-valuemax={10} aria-valuenow={complete}><span style={{width: `${complete * 10}%`}}/></div>
      <div className="atlas-form-toolbar">
        <ResearchSegment label="Laboratory unit system" value={units} onValueChange={next=>changeUnits(next as UnitSystem)} options={[{value:'si',label:'SI units'},{value:'conventional',label:'Conventional'}]}/>
        <button type="button" className="research-example-button" onClick={sampleData}>Use example data</button>
      </div>
      <p className="research-form-note" id="pheno-units-note">Switching units converts your values. Dot or comma decimals; no thousands separators.</p>
      {sample && <p className="atlas-sample-note">Synthetic example loaded. Reset to start with an independent dataset.</p>}
      {Object.values(errors).some(Boolean) && <p className="atlas-error atlas-validation-summary" role="alert">Check the highlighted inputs and their units. All ten values are required.</p>}
      <div aria-describedby="pheno-units-note">{groups.map(group => <fieldset className="research-field-group" key={group.title}>
        <legend>{group.title}</legend><div className="atlas-fields">{group.keys.map(field)}</div>
      </fieldset>)}</div>
      <div className="atlas-form-actions">
        <button className="atlas-action atlas-action-primary" type="submit">Calculate PhenoAge</button>
        <button className="atlas-quiet atlas-reset" type="button" onClick={() => {setFields(empty()); setErrors({}); setResult(null); setSample(false);}}><RotateCcw size={15}/>Reset all inputs</button>
      </div>
      <p className="research-form-note research-local-note">Calculated on this device. Blood values stay in your browser.</p>
    </form>
    <section ref={resultPanel} className={`atlas-panel atlas-result-panel research-result-panel ${result ? 'has-result' : ''}`} aria-label="Phenotypic age result" aria-live="polite">
      <div className="research-result-heading"><h2>PhenoAge estimate</h2><span>Levine · 2018</span></div>
      {result ? <>
        <span className="atlas-result-context">{sample ? 'Example-derived calculation' : 'Clinical phenotypic age estimate'}</span>
        <p className="atlas-result-number"><AnimatedNumber value={result.phenotypicAge} decimals={1}/><span>years</span></p>
        <div className="pheno-comparison">
          <div><span>Chronological age</span><strong>{result.chronologicalAge.toFixed(1)} <small>years</small></strong></div>
          <div><span>Model difference</span><strong>{result.difference > 0 ? '+' : ''}{result.difference.toFixed(1)} <small>years</small></strong></div>
        </div>
        <AgeComparison chronological={result.chronologicalAge} phenotypic={result.phenotypicAge}/>
        <p className="atlas-interpretation">The difference compares two age values. It is not an estimate of your aging speed, remaining lifespan or the effect of a treatment.</p>
        {(result.phenotypicAge < 0 || result.phenotypicAge > 120) && <p className="atlas-error">This result is outside a usual human age range. Recheck units and values; the model can extrapolate.</p>}
        <CalculationTrace terms={result.terms}/>
        <button type="button" className="atlas-quiet atlas-export" onClick={() => downloadJSON('proage-phenoage-result.json', {
          tool: 'Clinical PhenoAge', version: result.version, exampleDerived: sample, enteredUnits: units,
          enteredInputs: Object.fromEntries(biomarkerFields.map(item => [item.key, {value: numericInput(fields[item.key]), unit: units === 'si' ? item.si : item.conventional}])),
          inputsInSI: result.normalized, normalizedUnits: Object.fromEntries(biomarkerFields.map(item => [item.key, item.si])),
          outputUnits: {phenotypicAge: 'years', chronologicalAge: 'years', difference: 'years'},
          phenotypicAge: result.phenotypicAge, chronologicalAge: result.chronologicalAge, difference: result.difference,
          source: 'https://doi.org/10.18632/aging.101414', purpose: 'Research and education; not a diagnosis or pace-of-aging measure'
        })}><Download size={16}/>Export calculation</button>
      </> : <div className="atlas-result-empty">
        <div className="result-placeholder-number" aria-hidden="true">—<span>years</span></div>
        <h3>Your panel. In perspective.</h3>
        <p>Enter all ten inputs or load the synthetic example. Compare the model estimate with chronological age and inspect every coefficient.</p>
        <div className="research-result-readiness"><span>{complete} of 10 inputs entered</span><div className="readiness-ticks" aria-hidden="true">{Array.from({length:10},(_,i)=><i key={i} data-complete={i<complete}/>)}</div></div>
      </div>}
      <div className="atlas-result-foot"><span>Published clinical model</span><span>Research & education</span></div>
    </section>
  </div>;
}

function AgeComparison({chronological,phenotypic}:{chronological:number;phenotypic:number}){
  const marker=useRef<SVGCircleElement>(null);
  const lo=Math.floor(Math.min(chronological,phenotypic)-10),hi=Math.ceil(Math.max(chronological,phenotypic)+10);
  const chronologicalX=30+(chronological-lo)/(hi-lo)*420,modelX=30+(phenotypic-lo)/(hi-lo)*420;
  useEffect(()=>{
    if(!marker.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const tween=gsap.fromTo(marker.current,{attr:{cx:chronologicalX},opacity:.4},{attr:{cx:modelX},opacity:1,duration:1.1,ease:'power3.out'});
    return()=>{tween.kill();};
  },[chronologicalX,modelX]);
  return <figure className="pheno-age-axis"><svg viewBox="0 0 480 110" role="img" aria-label={`Chronological age ${chronological.toFixed(1)} years; model age ${phenotypic.toFixed(1)} years`}><line x1="30" y1="50" x2="450" y2="50" stroke="currentColor" opacity=".25"/><line x1={chronologicalX} y1="25" x2={chronologicalX} y2="75" stroke="var(--workspace-ink)"/><circle ref={marker} cx={modelX} cy="50" r="6" fill="var(--workspace-accent)"/><text x="30" y="100">{lo} years</text><text x="450" y="100" textAnchor="end">{hi} years</text></svg><figcaption><span><i/>PhenoAge estimate</span><span><b/>Chronological age</span></figcaption></figure>;
}

function CalculationTrace({terms}:{terms:Result['terms']}){return <details className="pheno-calculation-trace"><summary>Inspect the calculation</summary><p>Fixed model terms, not clinical reference ranges or causal effects. CRP uses ln(mg/dL).</p><div className="pheno-trace-scroll research-table" tabIndex={0} role="region" aria-label="PhenoAge coefficient trace"><table><thead><tr><th>Input</th><th>Model value</th><th>Coefficient</th></tr></thead><tbody>{terms.map(term=><tr key={term.key}><th scope="row">{biomarkerFields.find(f=>f.key===term.key)?.label}</th><td>{term.value.toFixed(3)}</td><td>{term.coefficient.toPrecision(6)}</td></tr>)}</tbody></table></div><p>Intercept −19.90667. Original Levine model; coefficients retain full precision in the calculation.</p></details>;}
