"use client";
import { useEffect, useRef } from 'react';
import { mountCanvasScience, type ParticleVariant } from '@/lib/scientific-particles';

/** Transparent volumetric studies. The same geometry is used on every device. */
export default function ScientificScene({variant='cell',className=''}:{variant?:ParticleVariant;labels?:boolean;caption?:boolean;className?:string}) {
  const root=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!root.current||!canvas.current)return;
    return mountCanvasScience(root.current,canvas.current,variant);
  },[variant]);
  return <figure className={`scientific-study scientific-${variant} ${className}`} aria-label={variant==='cell'?'Illustrative three-dimensional cellular structure; not microscopy data.':'Illustrative three-dimensional molecular architecture; not a measured structure.'}>
    <div className="scientific-stage" ref={root}><canvas ref={canvas} aria-hidden="true"/></div>
  </figure>;
}
