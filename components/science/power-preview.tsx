"use client";
import { useEffect, useRef } from 'react';
import { studyPower } from '@/lib/study-planner';
const curve=Array.from({length:61},(_,i)=>studyPower(4+i*2,4+i*2,.5,.05));
/** The plotted curve is a reproducible illustrative two-group study. */
export default function PowerPreview(){
  const canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const surface=canvas.current;if(!surface)return;
    const ctx=surface.getContext('2d');if(!ctx)return;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');let frame=0,width=0,height=0,visible=false,t=0,last=0;
    const draw=()=>{const dpr=Math.min(window.devicePixelRatio||1,1.5);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);const x=(i:number)=>10+i/60*(width-20),y=(p:number)=>height-12-p*(height-28);ctx.strokeStyle='#d7e4da';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(10,y(.8));ctx.lineTo(width-10,y(.8));ctx.stroke();ctx.beginPath();curve.forEach((p,i)=>i?ctx.lineTo(x(i),y(p)):ctx.moveTo(x(i),y(p)));ctx.strokeStyle='#286b56';ctx.lineWidth=2;ctx.stroke();const position=(Math.sin(t/3500)*.5+.5)*60,index=Math.floor(position),power=curve[index]+((curve[Math.min(index+1,60)]-curve[index])*(position-index));ctx.fillStyle='#286b56';ctx.beginPath();ctx.arc(x(position),y(power),4,0,Math.PI*2);ctx.fill();};
    const tick=(now:number)=>{if(last)t+=Math.min(now-last,50);last=now;draw();frame=requestAnimationFrame(tick);};
    const sync=()=>{cancelAnimationFrame(frame);last=0;draw();if(visible&&!document.hidden&&!media.matches)frame=requestAnimationFrame(tick);};
    const resize=new ResizeObserver(([entry])=>{width=entry.contentRect.width;height=entry.contentRect.height;const dpr=Math.min(window.devicePixelRatio||1,1.5);surface.width=Math.round(width*dpr);surface.height=Math.round(height*dpr);draw();});resize.observe(surface);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(surface);document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);
    return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync);};
  },[]);
  return <canvas ref={canvas} className="power-preview" aria-hidden="true" style={{width:'100%',height:145,display:'block'}}/>;
}
