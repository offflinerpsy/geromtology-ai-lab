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
      },root);return()=>context.revert();
    });return()=>media.revert();
  },[]);return <span ref={marker} hidden/>;
}
export function AnimatedNumber({value,decimals=0,grouped=false}:{value:number;decimals?:number;grouped?:boolean}){
  const element=useRef<HTMLElement>(null);
  const previous=useRef(0);
  const format=(number:number)=>number.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals,useGrouping:grouped});
  const formatted=format(value);
  useEffect(()=>{
    const node=element.current;
    if(!node)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){node.textContent=formatted;previous.current=value;return;}
    const state={number:previous.current};
    const tween=gsap.to(state,{number:value,duration:.7,ease:'power2.out',onUpdate:()=>{previous.current=state.number;node.textContent=format(state.number);}});
    return()=>{tween.kill();};
  },[value,decimals,grouped]);
  return <><b className="atlas-animated-number" ref={element} aria-hidden="true">{formatted}</b><span className="atlas-sr-only">{formatted}</span></>;
}

export function MorphPath({d,...props}:{d:string;fill?:string;stroke?:string;strokeWidth?:string;opacity?:string;className?:string}){
  const node=useRef<SVGPathElement>(null);const first=useRef(d);
  useEffect(()=>{if(!node.current)return;const element=node.current;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){element.setAttribute('d',d);return;}
    const tween=gsap.to(element,{morphSVG:{shape:d,shapeIndex:0},duration:.75,ease:'power2.out'});return()=>{tween.kill();};
  },[d]);return <path ref={node} d={first.current} {...props}/>;
}
