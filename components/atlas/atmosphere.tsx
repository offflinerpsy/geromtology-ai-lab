"use client";
import { useEffect, useRef } from 'react';

/** Restrained light drift and scroll depth, isolated from the approved home visuals. */
export default function Atmosphere() {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
    const update=()=>{frame=0;el.style.setProperty('--atlas-depth',`${media.matches?0:Math.min(180,window.scrollY*0.12)}px`);};
    const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',scroll,{passive:true});media.addEventListener('change',update);update();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);media.removeEventListener('change',update);};
  },[]);
  return <div ref={ref} className="atlas-atmosphere" aria-hidden="true"><div className="atlas-deep-field"/><div className="atlas-light-drift"/><div className="atlas-grain"/></div>;
}
