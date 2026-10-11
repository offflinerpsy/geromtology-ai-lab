"use client";

import {useEffect,useRef,useState,type CSSProperties} from "react";
import type {InquiryController} from "@/lib/cellular-inquiry";
import {inquirySprites} from "@/lib/inquiry-sprites";

export default function InquiryCellularArt() {
  const artRef=useRef<HTMLDivElement>(null),imageRef=useRef<HTMLImageElement>(null),canvasRef=useRef<HTMLCanvasElement>(null);
  const controllerRef=useRef<InquiryController|null>(null);
  const [ready,setReady]=useState(false),[paused,setPaused]=useState(false);
  useEffect(()=>{
    const root=artRef.current,image=imageRef.current,canvas=canvasRef.current;
    if(!root||!image||!canvas)return;
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed=false,loading=false,near=false;
    const initialize=async()=>{
      if(disposed||loading||!near||media.matches||controllerRef.current)return;
      loading=true;
      image.loading="eager";
      try {
        const [{mountCellularInquiry}]=await Promise.all([import("@/lib/cellular-inquiry"),image.decode()]);
        if(disposed||media.matches)return;
        controllerRef.current=mountCellularInquiry(root,image,canvas,value=>{if(!disposed)setReady(value);});
      } catch {if(!disposed){root.dataset.ready="false";root.dataset.animationState="static";setReady(false);}}
      finally {loading=false;}
    };
    const observer=new IntersectionObserver(entries=>{near=entries[0]?.isIntersecting??false;if(near)void initialize();},{rootMargin:"250px"});
    observer.observe(root);media.addEventListener("change",initialize);
    return ()=>{disposed=true;observer.disconnect();media.removeEventListener("change",initialize);controllerRef.current?.destroy();controllerRef.current=null;};
  },[]);
  const toggle=()=>{const value=!paused;controllerRef.current?.setPaused(value);setPaused(value);};
  return <>
    <div className="inquiry-art" ref={artRef} aria-hidden="true">
      <div className="inquiry-still">{inquirySprites.map((sprite,index)=><div key={index} className="inquiry-sprite" data-inquiry-sprite={index} style={{"--x":`${sprite.x}%`,"--y":`${sprite.y}%`,"--size":`${sprite.size}%`,"--angle":`${sprite.angle}rad`,"--opacity":sprite.opacity} as CSSProperties}><img ref={index===0?imageRef:undefined} src="/images/cellular-inquiry-atlas.webp" alt="" width="1536" height="1024" loading="lazy" style={{left:`${-(sprite.tile%2)*100}%`,top:`${-Math.floor(sprite.tile/2)*100}%`}}/></div>)}</div>
      <canvas ref={canvasRef} />
    </div>
    <div className="research-visual inquiry-space">
      <div className="inquiry-caption"><p>From cellular processes<br/>to everyday function.</p><div><span>Conceptual cellular study</span><button type="button" className="inquiry-motion-control" hidden={!ready} aria-pressed={paused} aria-label={paused?"Resume cellular study":"Pause cellular study"} onClick={toggle}>{paused?"Resume motion":"Pause motion"}</button></div></div>
    </div>
  </>;
}
