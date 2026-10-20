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
  const formatted=value.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals,useGrouping:grouped});
  return <b className="atlas-animated-number">{formatted}</b>;
}

export function MorphPath({d,...props}:{d:string;fill?:string;stroke?:string;strokeWidth?:string;opacity?:string;className?:string}){
  const node=useRef<SVGPathElement>(null);const first=useRef(d);
  useEffect(()=>{if(!node.current)return;const element=node.current;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){element.setAttribute('d',d);return;}
    const tween=gsap.to(element,{morphSVG:{shape:d,shapeIndex:0},duration:.75,ease:'power2.out'});return()=>{tween.kill();};
  },[d]);return <path ref={node} d={first.current} {...props}/>;
}
