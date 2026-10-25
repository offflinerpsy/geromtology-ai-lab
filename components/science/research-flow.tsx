"use client";

import {useEffect, useRef} from 'react';

type Variant = 'evidence' | 'measurement' | 'study';
const descriptions: Record<Variant, string> = {
  evidence: 'Published abstracts enter a comparison step and remain connected to the resulting evidence brief. This is a process diagram, not research data.',
  measurement: 'Chronological age and nine blood biomarkers feed the published clinical PhenoAge model. This diagram explains the inputs, not a personal result.',
  study: 'Two overlapping distributions illustrate how an expected difference relates to variation in a two-group study. These are schematic distributions, not observed data.',
};
const labels: Record<Variant, string[]> = {
  evidence: ['Published abstracts', 'Findings & limitations', 'Source-linked brief'],
  measurement: ['Age + 9 biomarkers', 'Published model', 'Clinical PhenoAge'],
  study: ['Expected difference', 'Variation', 'Study assumptions'],
};

/** A transparent, deterministic process illustration. No real or invented study values. */
export default function ResearchFlow({variant = 'evidence'}: {variant?: Variant}) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const host = root.current, surface = canvas.current;
    const ctx = surface?.getContext('2d', {alpha: true});
    if (!host || !surface || !ctx) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, ratio = 1, frame = 0, time = 0, last = 0, visible = false;
    const ink = variant === 'evidence' ? '194,210,223' : '60,81,99';
    const line = (x1:number,y1:number,x2:number,y2:number,alpha=.25) => {
      ctx.strokeStyle = `rgba(${ink},${alpha})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.bezierCurveTo((x1+x2)/2,y1,(x1+x2)/2,y2,x2,y2); ctx.stroke();
    };
    const packet = (x1:number,y1:number,x2:number,y2:number,t:number) => {
      const q = (t % 1 + 1) % 1, m = (x1+x2)/2, u = 1-q;
      const x=u*u*u*x1+3*u*u*q*m+3*u*q*q*m+q*q*q*x2, y=u*u*u*y1+3*u*u*q*y1+3*u*q*q*y2+q*q*q*y2;
      const glow=ctx.createRadialGradient(x,y,0,x,y,10);glow.addColorStop(0,`rgba(${ink},.65)`);glow.addColorStop(1,`rgba(${ink},0)`);
      ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.fill();ctx.fillStyle=`rgba(${ink},.95)`;ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();
    };
    const paper = (x:number,y:number,w:number,h:number,alpha=1,brief=false) => {
      ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;
      ctx.shadowColor='rgba(0,0,0,.18)';ctx.shadowBlur=22;ctx.shadowOffsetY=12;
      const fill=ctx.createLinearGradient(0,0,w,h);
      fill.addColorStop(0,variant==='evidence'?'#43525e':'#faf9f5');fill.addColorStop(1,variant==='evidence'?'#23303a':'#dce1e2');
      ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,7);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
      ctx.strokeStyle=`rgba(${ink},.45)`;ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=`rgba(${ink},.85)`;ctx.fillRect(-w*.3,-h*.3,w*.42,3);
      for(let i=0;i<4;i++){ctx.fillStyle=`rgba(${ink},${i===3?.2:.35})`;ctx.fillRect(-w*.3,-h*.12+i*11,w*(i===3?.34:.6),2);}
      if(brief){for(let i=0;i<3;i++){ctx.strokeStyle=`rgba(${ink},.45)`;ctx.beginPath();ctx.roundRect(-w*.3+i*w*.23,h*.25,w*.17,13,3);ctx.stroke();}}
      ctx.restore();
    };
    const draw = () => {
      ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
      const w = 900, h = variant === 'evidence' ? 320 : 240;
      const scale = Math.min(width/w,height/h);ctx.translate((width-w*scale)/2,(height-h*scale)/2);ctx.scale(scale,scale);
      const t=time/14;
      if(variant==='study') {
        const baseline=185, center=450, offset=100+25*Math.sin(t*Math.PI*2);
        ctx.strokeStyle=`rgba(${ink},.22)`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(105,baseline);ctx.lineTo(795,baseline);ctx.stroke();
        for(let group=0;group<2;group++){
          const mean=center+(group?offset:-offset);
          const fill=ctx.createLinearGradient(0,35,0,baseline);fill.addColorStop(0,`rgba(${ink},${group?.23:.12})`);fill.addColorStop(1,`rgba(${ink},.015)`);
          ctx.beginPath();ctx.moveTo(105,baseline);
          for(let x=105;x<=795;x+=3){const y=baseline-145*Math.exp(-.5*((x-mean)/83)**2);ctx.lineTo(x,y);}
          ctx.lineTo(795,baseline);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
          ctx.beginPath();for(let x=105;x<=795;x+=3){const y=baseline-145*Math.exp(-.5*((x-mean)/83)**2);if(x===105)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(${ink},${group?.8:.42})`;ctx.lineWidth=2;ctx.stroke();
          ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(mean,40);ctx.lineTo(mean,baseline);ctx.strokeStyle=`rgba(${ink},.25)`;ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);
        }
        ctx.strokeStyle=`rgba(${ink},.55)`;ctx.beginPath();ctx.moveTo(center-offset,215);ctx.lineTo(center+offset,215);ctx.moveTo(center-offset,209);ctx.lineTo(center-offset,221);ctx.moveTo(center+offset,209);ctx.lineTo(center+offset,221);ctx.stroke();
      } else {
        const cy=h/2, left=165, middle=450, right=735;
        for(let i=0;i<5;i++){
          const y=cy+(i-2)*28;line(left+48,y,middle-70,cy,.22);packet(left+48,y,middle-70,cy,t+i*.19);
        }
        line(middle+70,cy,right-55,cy,.38);packet(middle+70,cy,right-55,cy,t*1.5);
        if(variant==='evidence'){
          paper(left-35,cy-40,78,103,.45);paper(left+30,cy+32,78,103,.62);paper(left,cy,85,114,1);
        } else {
          for(let i=0;i<10;i++){
            const x=left-36+(i%2)*48,y=cy-85+Math.floor(i/2)*40;
            const grad=ctx.createRadialGradient(x-4,y-4,0,x,y,14);grad.addColorStop(0,'#fcfcf9');grad.addColorStop(.55,'#a8b7c2');grad.addColorStop(1,'#697d8e');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();
          }
        }
        // Three offset translucent planes express comparison, not an AI orb.
        for(let i=2;i>=0;i--){
          const x=middle+(i-1)*13,y=cy+(i-1)*-11;
          ctx.save();ctx.translate(x,y);ctx.transform(1,.15,-.3,1,0,0);
          const gradient=ctx.createLinearGradient(-50,-55,50,55);gradient.addColorStop(0,`rgba(${ink},${i===0?.21:.08})`);gradient.addColorStop(1,`rgba(${ink},.02)`);
          ctx.fillStyle=gradient;ctx.strokeStyle=`rgba(${ink},${i===0?.7:.3})`;ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(-49,-56,98,112,8);ctx.fill();ctx.stroke();
          if(i===0){for(let row=0;row<4;row++){ctx.fillStyle=`rgba(${ink},${.25+.25*(.5+.5*Math.sin(time*.5-row))})`;ctx.fillRect(-28,-31+row*19,55,3);}}
          ctx.restore();
        }
        paper(right+8,cy-8,106,142,.28,true);paper(right,cy,106,142,1,true);
      }
      host.dataset.phase = time.toFixed(2);
    };
    const tick = (now:number) => {
      time += last ? Math.min(now-last,50)/1000 : 0;last=now;draw();
      if(visible && !document.hidden && !media.matches) frame=requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);last=0;
      host.dataset.motion = media.matches ? 'reduced' : visible && !document.hidden ? 'running' : 'paused';
      draw();if(visible&&!document.hidden&&!media.matches)frame=requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(([entry]) => {
      width=entry.contentRect.width;height=entry.contentRect.height;ratio=Math.min(devicePixelRatio||1,1.5);
      surface.width=Math.round(width*ratio);surface.height=Math.round(height*ratio);draw();
    });resize.observe(surface);
    const observer = new IntersectionObserver(([entry]) => {visible=entry.isIntersecting;sync();});observer.observe(host);
    media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
    host.dataset.ready='true';sync();
    return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
  },[variant]);
  return <figure className={`research-flow research-flow-${variant}`} ref={root} aria-label={descriptions[variant]}>
    <div className="research-flow-art"><canvas ref={canvas} aria-hidden="true"/><div className="research-flow-fallback" aria-hidden="true"><span/><span/><span/></div></div>
    <div className="research-flow-labels" aria-hidden="true">{labels[variant].map(label=><span key={label}>{label}</span>)}</div>
  </figure>;
}
