"use client";
import { useEffect, useId, useRef } from 'react';
import { gsap } from 'gsap';
import { studyPower } from '@/lib/study-planner';

const power = Array.from({length:29},(_,i)=>`${i?'L':'M'}${28+i*10},${128-studyPower(5+i*4,5+i*4,.5,.05)*103}`).join(' ');

export default function WorkflowVisual({ kind, completion = 10 }: { kind: 'evidence' | 'biomarkers' | 'power'; completion?: number }) {
  const root = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g,'');
  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
    const paths = [...svg.querySelectorAll<SVGPathElement>('[data-draw]')];
    let observer: IntersectionObserver;
    const context = gsap.context(() => {
      const motion = gsap.timeline({paused:true});
      paths.forEach((path,index) => {const length=path.getTotalLength(); motion.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:2,ease:'power2.out'},index*.12);});
      observer = new IntersectionObserver(([entry])=>{if(entry.isIntersecting){motion.play();observer.disconnect();}},{threshold:.2});
      observer.observe(svg);
    },svg);
    return () => { observer?.disconnect(); context.revert(); };
    });
    return ()=>media.revert();
  },[kind]);
  return <svg ref={root} className={`workflow-art workflow-art-${kind}`} viewBox="0 0 340 160" aria-hidden="true">
    <defs><linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c5beb2" stopOpacity=".16"/><stop offset="1" stopColor="#c5beb2" stopOpacity="0"/></linearGradient></defs>
    {kind==='evidence' && <g fill="none" stroke="currentColor">
      {[0,1,2].map(i=><g key={i} transform={`translate(${i*22} ${-i*12})`}><path d="M85 49H228V135H85Z" strokeOpacity={.2+i*.12}/><path data-draw="" d="M105 72H173M105 86H201M105 100H187" strokeOpacity={.25+i*.15}/></g>)}
      <path data-draw="" d="M62 94C44 94 44 31 94 31H254C284 31 286 100 265 100" strokeOpacity=".26"/>
    </g>}
    {kind==='biomarkers' && <g fill="none" stroke="currentColor">
      {[0,1,2,3].map(i=><ellipse key={i} cx="170" cy="82" rx={88-i*9} ry={32+i*9} strokeOpacity={.17+i*.06} transform={`rotate(${i*32-47} 170 82)`}/>)}
      {Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2;return <g key={i} opacity={i<completion?1:.18}><path data-draw="" d={`M170 82L${170+Math.cos(a)*78} ${82+Math.sin(a)*56}`} strokeOpacity=".25"/><circle cx={170+Math.cos(a)*78} cy={82+Math.sin(a)*56} r={i<completion?3.3:2.4} fill="currentColor" stroke="none"/></g>;})}
      <circle cx="170" cy="82" r="12" strokeOpacity=".65"/><circle cx="170" cy="82" r="4" fill="currentColor" stroke="none"/>
    </g>}
    {kind==='power' && <g><path d={`${power}L308 128H28Z`} fill={`url(#${id}-area)`}/><path d="M28 128H308M28 46H308" stroke="currentColor" strokeOpacity=".13" fill="none"/><path data-draw="" d={power} stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="176" cy={128-studyPower(64,64,.5,.05)*103} r="3.7" fill="currentColor"/></g>}
  </svg>;
}
