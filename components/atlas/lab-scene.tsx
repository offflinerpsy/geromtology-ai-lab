"use client";
import { useEffect, useRef } from 'react';

/** A photographic laboratory in three depth planes. Glass stays rigid; light moves. */
export default function LabScene({variant='bench'}:{variant?:'bench'|'glass'}) {
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const element=host.current;if(!element)return;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let destroy=()=>{};let generation=0;
    async function start(){
      destroy();const current=++generation;if(media.matches)return;
      const [THREE,{gsap},{ScrollTrigger}]=await Promise.all([import('three'),import('gsap'),import('gsap/ScrollTrigger')]);
      if(current!==generation)return;
      gsap.registerPlugin(ScrollTrigger);
      let renderer:InstanceType<typeof THREE.WebGLRenderer>;
      try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});}catch{return;}
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<760?1:1.5));
      renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.domElement.className='lab-webgl';renderer.domElement.setAttribute('aria-hidden','true');element!.appendChild(renderer.domElement);
      const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-8,8,4,-4,.1,40);camera.position.z=10;
      const uniforms={uTime:{value:0},uLight:{value:0},uImage:{value:null as import('three').Texture|null},uGlass:{value:variant==='glass'?1:0}};
      const material=(glass:boolean)=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{...uniforms,uImage:{value:null},uGlass:{value:glass?1:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
        uniform sampler2D uImage;uniform float uTime;uniform float uLight;uniform float uGlass;varying vec2 vUv;
        void main(){
          vec4 tex=texture2D(uImage,vUv);
          float sweep=pow(max(0.,1.-abs(vUv.x-(.5+.48*sin(uTime*.13)))*6.),4.);
          float liquid=sin(vUv.y*52.+sin(vUv.x*19.)-uTime*.7)*.5+.5;
          float bright=smoothstep(.35,.88,max(tex.r,max(tex.g,tex.b)));
          tex.rgb*=1.+bright*sweep*.075+uLight*.035;
          tex.rgb+=vec3(.008,.02,.012)*liquid*tex.a*uGlass;
          gl_FragColor=tex;
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`});
      const backMaterial=material(false),glassMaterial=material(true);
      const geometry=new THREE.PlaneGeometry(1,1);
      const back=new THREE.Mesh(geometry,backMaterial);back.position.z=-2;
      const glass=new THREE.Mesh(geometry,glassMaterial);glass.position.z=1;
      if(variant==='bench')scene.add(back);scene.add(glass);
      let disposed=false,visible=true,frame=0,elapsed=0,last=0,loaded=0;
      const textures:import('three').Texture[]=[];
      const loader=new THREE.TextureLoader();
      const load=(path:string,target:typeof glassMaterial)=>loader.load(path,texture=>{
        if(disposed){texture.dispose();return;}textures.push(texture);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;
        target.uniforms.uImage.value=texture;loaded++;if(loaded===(variant==='bench'?2:1)){element!.classList.add('lab-webgl-ready');render();}
      },undefined,()=>{element!.classList.remove('lab-webgl-ready');});
      if(variant==='bench')load('/images/lab-bench-v10.webp',backMaterial);load('/images/lab-glass-v10.webp',glassMaterial);
      const motion={scroll:0,pointerX:0,pointerY:0};
      const context=gsap.context(()=>{
        gsap.to(motion,{scroll:1,ease:'none',scrollTrigger:{trigger:element,start:'top bottom',end:'bottom top',scrub:1.6}});
      },element!);
      let aspect=2;const resize=()=>{const box=element!.getBoundingClientRect();if(!box.width||!box.height)return;aspect=box.width/box.height;camera.left=-aspect*4;camera.right=aspect*4;camera.updateProjectionMatrix();renderer.setSize(box.width,box.height);const w=Math.max(aspect*8,12);back.scale.set(w,w/1.5,1);const size=Math.min(8.5,aspect*7.2);glass.scale.set(size,size/1.5,1);};
      const observer=new ResizeObserver(resize);observer.observe(element!);resize();
      const pointer=(event:PointerEvent)=>{const rect=element!.getBoundingClientRect();gsap.to(motion,{pointerX:(event.clientX-rect.left)/rect.width-.5,pointerY:(event.clientY-rect.top)/rect.height-.5,duration:1.6,ease:'power2.out',overwrite:'auto'});};
      const leave=()=>{gsap.to(motion,{pointerX:0,pointerY:0,duration:1.8,overwrite:'auto'});};
      element!.parentElement?.addEventListener('pointermove',pointer);element!.parentElement?.addEventListener('pointerleave',leave);
      function render(now=0){
        frame=0;if(disposed||!visible||document.hidden||loaded<(variant==='bench'?2:1))return;
        if(now){elapsed+=last?Math.min((now-last)/1000,.05):0;last=now;}
        backMaterial.uniforms.uTime.value=elapsed;glassMaterial.uniforms.uTime.value=elapsed;
        back.position.y=-motion.scroll*.48;back.position.x=motion.pointerX*.12;
        glass.position.x=aspect<1?aspect*.2:aspect*1.48+motion.pointerX*.32;
        glass.position.y=-1.02+(motion.scroll-.5)*1.6+motion.pointerY*.17+Math.sin(elapsed*.27)*.055;
        glass.rotation.z=Math.sin(elapsed*.11)*.008;glass.rotation.y=motion.pointerX*.025;
        renderer.render(scene,camera);frame=requestAnimationFrame(render);
      }
      const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!frame){last=0;render();}else if(!visible){cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});intersection.observe(element!);
      const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(!frame){last=0;render();}};document.addEventListener('visibilitychange',visibility);
      const lost=(event:Event)=>{event.preventDefault();element!.classList.remove('lab-webgl-ready');cancelAnimationFrame(frame);frame=0;};renderer.domElement.addEventListener('webglcontextlost',lost);
      destroy=()=>{disposed=true;cancelAnimationFrame(frame);context.revert();gsap.killTweensOf(motion);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);element!.parentElement?.removeEventListener('pointermove',pointer);element!.parentElement?.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);textures.forEach(t=>t.dispose());geometry.dispose();backMaterial.dispose();glassMaterial.dispose();renderer.dispose();renderer.domElement.remove();element!.classList.remove('lab-webgl-ready');};
    }
    const change=()=>{void start().catch(()=>{destroy();});};change();media.addEventListener('change',change);
    return()=>{generation++;destroy();media.removeEventListener('change',change);};
  },[variant]);
  return <div ref={host} className={`lab-scene lab-scene-${variant}`} aria-hidden="true">
    {variant==='bench'&&<img className="lab-bench-fallback" src="/images/lab-bench-v10.webp" alt="" width="1536" height="1024" fetchPriority="high"/>}
    <img className="lab-glass-fallback" src="/images/lab-glass-v10.webp" alt="" width="1536" height="1024"/>
    <div className="lab-scene-shade"/>
  </div>;
}
