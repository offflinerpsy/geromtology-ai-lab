"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
gsap.registerPlugin(ScrollTrigger,MorphSVGPlugin);

export function AtlasMotion(){
  const marker=useRef<HTMLSpanElement>(null);
  useEffect(()=>{const root=marker.current?.closest('main');if(!root)return;
    const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
      const context=gsap.context(()=>{
        root.querySelectorAll('.atlas-section-heading,.atlas-perspective-grid article,.atlas-reading-row,.atlas-method-grid article,.atlas-ai-principle').forEach(node=>{
          gsap.from(node,{y:24,autoAlpha:0,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:node,start:'top 94%',once:true}});
        });
        gsap.from('.atlas-heading h1,.atlas-heading .atlas-lead,.lab-hero-actions',{y:20,opacity:0,stagger:.11,duration:1.15,ease:'power3.out'});
        const glass=root.querySelector('.atlas-ai-feature-image');if(glass)gsap.fromTo(glass,{y:48},{y:-48,ease:'none',scrollTrigger:{trigger:glass,start:'top bottom',end:'bottom top',scrub:1.8}});
      },root);return()=>context.revert();
    });return()=>media.revert();
  },[]);return <span ref={marker} hidden/>;
}
export function AnimatedNumber({value,decimals=0,grouped=false}:{value:number;decimals?:number;grouped?:boolean}){
  const element=useRef<HTMLElement>(null);
  const formatted=value.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals,useGrouping:grouped});
  useEffect(()=>{if(!element.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const tween=gsap.fromTo(element.current,{opacity:.65},{opacity:1,duration:.18,ease:'power1.out'});return()=>{tween.revert();};
  },[value,decimals,grouped]);
  return <b className="atlas-animated-number" ref={element}>{formatted}</b>;
}

export function MorphPath({d,...props}:{d:string;fill?:string;stroke?:string;strokeWidth?:string;opacity?:string;className?:string}){
  const node=useRef<SVGPathElement>(null);const first=useRef(d);
  useEffect(()=>{if(!node.current)return;const element=node.current;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){element.setAttribute('d',d);return;}
    const tween=gsap.to(element,{morphSVG:{shape:d,shapeIndex:0},duration:.75,ease:'power2.out'});return()=>{tween.kill();};
  },[d]);return <path ref={node} d={first.current} {...props}/>;
}
export function ModelSignal({completion=10}:{completion?:number}){
  const shape=useRef<SVGPathElement>(null);
  useEffect(()=>{if(!shape.current)return;
    const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
      const node=shape.current!;const tween=gsap.to(node,{morphSVG:'M35,130 C30,62 95,30 156,38 C226,47 266,72 266,131 C266,202 225,215 156,220 C84,225 39,190 35,130 Z',duration:5.5,ease:'sine.inOut',repeat:-1,yoyo:true});
      let visible=false;const sync=()=>{if(visible&&!document.hidden)tween.resume();else tween.pause();};
      const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(node);document.addEventListener('visibilitychange',sync);sync();
      return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);tween.kill();};
    });return()=>media.revert();
  },[]);
  return <div className="model-signal" aria-hidden="true"><svg viewBox="0 0 300 260"><defs><radialGradient id="model-signal-light"><stop stopColor="#d5e6ba" stopOpacity=".16"/><stop offset=".7" stopColor="#87c8a4" stopOpacity=".05"/><stop offset="1" stopColor="#8acdba" stopOpacity="0"/></radialGradient></defs><path ref={shape} d="M30,130 C36,74 91,44 154,30 C212,17 264,69 271,132 C277,194 221,223 153,226 C86,229 25,198 30,130 Z" fill="url(#model-signal-light)" stroke="#c7e4bd" strokeOpacity=".22"/><circle cx="150" cy="130" r="76" fill="none" stroke="#c5ddaa" strokeOpacity=".1"/><circle cx="150" cy="130" r="76" fill="none" stroke="#c5ddaa" strokeOpacity=".65" strokeDasharray={`${Math.min(10,completion)/10*477.52} 477.52`} transform="rotate(-90 150 130)" style={{transition:'stroke-dasharray .9s ease'}}/><line x1="150" y1="118" x2="150" y2="142" stroke="#c8e3b7" strokeOpacity=".6"/><line x1="138" y1="130" x2="162" y2="130" stroke="#c8e3b7" strokeOpacity=".6"/></svg></div>;
}
