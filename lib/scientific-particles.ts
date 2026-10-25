/** Deterministic illustrative geometry, shared by GPU and canvas renderers. */
export type ParticleVariant = 'cell' | 'molecule';
export type Particle = { x: number; y: number; z: number; size: number; tone: number; alpha: number };
export function scientificParticles(variant: ParticleVariant): Particle[] {
  const points: Particle[] = [];
  const add = (x:number,y:number,z:number,size=1,tone=0,alpha=.6) => points.push({x,y,z,size,tone,alpha});
  const sphere = (count:number,r:number,cx:number,cy:number,cz:number,sx:number,sy:number,sz:number,tone:number,alpha:number,texture:number) => {
    for(let i=0;i<count;i++) {
      const y=1-2*(i+.5)/count, a=i*2.399963229728653, q=Math.sqrt(1-y*y);
      const ripple=1+texture*(Math.sin(a*3.4)*Math.sin(y*8)+.3*Math.cos(a*9));
      add(cx+Math.cos(a)*q*r*sx*ripple,cy+y*r*sy*ripple,cz+Math.sin(a)*q*r*sz*ripple,.65+(i%7)*.08,tone,alpha);
    }
  };
  if(variant==='cell') {
    sphere(2900,1.77,0,0,0,1,1.04,.91,0,.48,.035);
    sphere(1700,.66,-.15,.02,.1,1.08,.95,1,1,.9,.1);
    sphere(400,.24,-.32,.13,.48,1,1,1,2,.86,.08);
    // Folded reticular lamellae encircle the nucleus.
    for(let band=0;band<7;band++) for(let i=0;i<180;i++) {
      const a=i/180*Math.PI*2, r=.78+band*.067+.08*Math.sin(a*5+band*.7);
      add(Math.cos(a)*r-.12,Math.sin(a)*r*.59+band*.045-.12,Math.sin(a*2)*.2-.26+band*.045,.73,1,.31);
    }
    for(let j=0;j<8;j++) {
      const a=j*2.39996, r=1.1+(j%3)*.12;
      const cx=Math.cos(a)*r,cy=Math.sin(a)*r,cz=Math.sin(a*1.5)*.45;
      sphere(150,.22,cx,cy,cz,1.4,.58,.64,2,.63,.05);
      for(let i=0;i<54;i++){const t=i/53*Math.PI*5;add(cx+(i/53-.5)*.5,cy+Math.sin(t)*.065,cz+Math.cos(t)*.07,.8,1,.8);}
    }
  } else {
    // Two continuous, finely sampled molecular ribbons, with paired bridges.
    for(let strand=0;strand<2;strand++) for(let i=0;i<230;i++) {
      const t=i/229, a=t*Math.PI*5.2+strand*Math.PI, r=.69;
      const x=Math.cos(a)*r, y=(t-.5)*4.1, z=Math.sin(a)*r;
      for(let k=0;k<12;k++) {
        const b=k/12*Math.PI*2, tube=.085;
        add(x+Math.cos(b)*Math.cos(a)*tube,y+Math.sin(b)*tube,z+Math.cos(b)*Math.sin(a)*tube,.85,strand,.65);
      }
    }
    for(let i=0;i<31;i++) {
      const t=(i+.5)/31,a=t*Math.PI*5.2,y=(t-.5)*4.1;
      for(let k=0;k<42;k++){const s=k/41*2-1;add(Math.cos(a)*.68*s,y,Math.sin(a)*.68*s,.69,2,.4);}
    }
  }
  return points;
}

export function projectParticle(p:Particle,phase:number,variant:ParticleVariant,px=0,py=0) {
  const ry=phase+(variant==='cell'?.35:0)+px, rx=(variant==='cell'?-.12:.12)+py;
  const c=Math.cos(ry),s=Math.sin(ry),cx=Math.cos(rx),sx=Math.sin(rx);
  const x=p.x*c+p.z*s,z=-p.x*s+p.z*c;
  const y=p.y*cx-z*sx,depth=p.y*sx+z*cx;
  const tilt=variant==='cell'?-.13:-.32;
  return {x:x*Math.cos(tilt)-y*Math.sin(tilt),y:x*Math.sin(tilt)+y*Math.cos(tilt),z:depth};
}

export function mountCanvasScience(element:HTMLElement,canvas:HTMLCanvasElement,variant:ParticleVariant) {
  const context=canvas.getContext('2d',{alpha:true});
  if(!context) return ()=>{};
  const points=scientificParticles(variant),media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,ratio=1,frame=0,phase=0,last=0,visible=false,disposed=false,px=0,py=0,targetX=0,targetY=0;
  const draw=()=>{
    context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width,height);
    const scale=Math.min(width/(variant==='cell'?4.2:3.4),height/4.8);
    if(variant==='cell') {
      const radius=scale*1.79;
      const glass=context.createRadialGradient(width/2-radius*.3,height/2-radius*.35,radius*.15,width/2,height/2,radius);
      glass.addColorStop(0,'rgba(94,121,143,0)');glass.addColorStop(.76,'rgba(108,137,158,.015)');glass.addColorStop(.92,'rgba(76,109,136,.08)');glass.addColorStop(1,'rgba(76,109,136,0)');
      context.fillStyle=glass;context.beginPath();context.ellipse(width/2,height/2,radius,radius*1.04,0,0,Math.PI*2);context.fill();
      const core=projectParticle({x:-.15,y:.02,z:.1,size:1,tone:1,alpha:1},phase,variant,px,py),cx=width/2+core.x*scale,cy=height/2-core.y*scale,cr=scale*.67;
      const volume=context.createRadialGradient(cx-cr*.4,cy-cr*.4,0,cx,cy,cr);
      volume.addColorStop(0,'rgba(138,163,183,.15)');volume.addColorStop(.55,'rgba(49,81,108,.12)');volume.addColorStop(1,'rgba(36,65,88,.02)');
      context.fillStyle=volume;context.beginPath();context.arc(cx,cy,cr,0,Math.PI*2);context.fill();
    }
    const projected=points.map(p=>({p,...projectParticle(p,phase,variant,px,py)}));
    projected.sort((a,b)=>a.z-b.z);
    for(const point of projected) {
      const {p,x,y,z}=point,perspective=7/(7-z),size=p.size*perspective*Math.max(.7,scale/130);
      const depth=(z+2)/4,opacity=p.alpha*(.36+depth*.64);
      context.globalAlpha=opacity;
      context.fillStyle=p.tone===0?'#567a95':p.tone===1?'#304e66':'#94a8b6';
      context.beginPath();context.arc(width/2+x*scale*perspective,height/2-y*scale*perspective,size,0,Math.PI*2);context.fill();
    }
    context.globalAlpha=1;
    element.dataset.phase=phase.toFixed(3);
    element.dataset.renderer='canvas';
  };
  const tick=(time:number)=>{
    if(disposed)return;
    const elapsed=last?Math.min(time-last,50):0;last=time;
    if(!media.matches)phase=(phase+elapsed/1000*Math.PI*2/52)%(Math.PI*2);
    px+=(targetX-px)*.035;py+=(targetY-py)*.035;draw();
    if(visible&&!document.hidden&&!media.matches)frame=requestAnimationFrame(tick);
  };
  const sync=()=>{cancelAnimationFrame(frame);last=0;element.dataset.visible=String(visible&&!document.hidden);if(visible&&!document.hidden){draw();if(!media.matches)frame=requestAnimationFrame(tick);}};
  const resize=new ResizeObserver(([entry])=>{width=entry.contentRect.width;height=entry.contentRect.height;ratio=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);draw();});resize.observe(element);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(element);
  const move=(event:PointerEvent)=>{const rect=element.getBoundingClientRect();targetX=(event.clientX-rect.left)/rect.width*.14-.07;targetY=(event.clientY-rect.top)/rect.height*.1-.05;};
  const leave=()=>{targetX=0;targetY=0;};
  element.addEventListener('pointermove',move);element.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);
  return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync);};
}
