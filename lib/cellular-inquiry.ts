import {inquirySprites} from "./inquiry-sprites";

export type InquiryController = {setPaused(value:boolean):void;destroy():void};
type Pose = {tile:number;x:number;y:number;width:number;height:number;angle:number;opacity:number;phase:number};
type Renderer = {resize(width:number,height:number,narrow:boolean):void;paint(poses:Pose[]):void;destroy():void};

const vertexSource = `
attribute vec2 aPosition;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform vec2 uSize;
uniform float uAngle;
varying vec2 vUv;
void main() {
  vUv = vec2(aPosition.x + 0.5, 0.5 - aPosition.y);
  vec2 p = aPosition * uSize;
  float c = cos(uAngle), s = sin(uAngle);
  p = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + uCenter;
  gl_Position = vec4(p.x / uResolution.x * 2.0 - 1.0, 1.0 - p.y / uResolution.y * 2.0, 0.0, 1.0);
}`;

const fragmentSource = `
precision highp float;
uniform sampler2D uAtlas;
uniform vec4 uCrop;
uniform float uOpacity;
uniform float uPhase;
varying vec2 vUv;
void main() {
  vec4 tissue = texture2D(uAtlas, uCrop.xy + vUv * uCrop.zw);
  vec2 edge = min(vUv, 1.0 - vUv);
  float feather = smoothstep(0.0, 0.045, edge.x) * smoothstep(0.0, 0.045, edge.y);
  float light = 1.0 + 0.018 * sin(vUv.x * 13.0 + vUv.y * 7.0 - uPhase);
  tissue.rgb *= light;
  gl_FragColor = tissue * uOpacity * feather;
}`;

function makeWebGL(canvas:HTMLCanvasElement,image:HTMLImageElement):Renderer|null {
  const gl=canvas.getContext("webgl",{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:"low-power"});
  if(!gl)return null;
  const program=gl.createProgram(),buffer=gl.createBuffer(),texture=gl.createTexture();
  const shaders:WebGLShader[]=[];
  const release=()=>{gl.deleteProgram(program);gl.deleteBuffer(buffer);gl.deleteTexture(texture);shaders.forEach(shader=>gl.deleteShader(shader));};
  if(!program||!buffer||!texture){release();throw new Error("Unable to allocate cellular planes");}
  try {
    for(const [kind,source] of [[gl.VERTEX_SHADER,vertexSource],[gl.FRAGMENT_SHADER,fragmentSource]] as const){
      const shader=gl.createShader(kind);if(!shader)throw new Error("Unable to allocate shader");
      shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)??"Shader compilation failed");
      gl.attachShader(program,shader);
    }
    gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error("Shader linking failed");
    gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,.5]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,"aPosition");gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
    gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
    const uniforms=Object.fromEntries(["uAtlas","uResolution","uCenter","uSize","uAngle","uCrop","uOpacity","uPhase"].map(name=>[name,gl.getUniformLocation(program,name)]));
    gl.uniform1i(uniforms.uAtlas,0);
    return {
      resize(width,height,narrow){
        const density=Math.min(window.devicePixelRatio||1,narrow?1.25:1.5,Math.sqrt((narrow?600_000:1_450_000)/(width*height)));
        canvas.width=Math.max(1,Math.round(width*density));canvas.height=Math.max(1,Math.round(height*density));
        gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(uniforms.uResolution,width,height);
      },
      paint(poses){
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(const p of poses){
          gl.uniform2f(uniforms.uCenter,p.x,p.y);gl.uniform2f(uniforms.uSize,p.width,p.height);
          gl.uniform1f(uniforms.uAngle,p.angle);gl.uniform1f(uniforms.uOpacity,p.opacity);gl.uniform1f(uniforms.uPhase,p.phase);
          gl.uniform4f(uniforms.uCrop,(p.tile%2)*.5,(1-Math.floor(p.tile/2))*.5,.5,.5);
          gl.drawArrays(gl.TRIANGLES,0,6);
        }
      },
      destroy:release,
    };
  }catch(error){release();throw error;}
}

function makeCanvas(canvas:HTMLCanvasElement,image:HTMLImageElement):Renderer {
  const context=canvas.getContext("2d",{alpha:true});if(!context)throw new Error("Canvas unavailable");const ctx=context;
  // Prepare the four source tiles once, preserving alpha at every edge.
  const tiles=Array.from({length:4},(_,tile)=>{
    const surface=document.createElement("canvas");surface.width=image.naturalWidth/2;surface.height=image.naturalHeight/2;
    const c=surface.getContext("2d");if(!c)throw new Error("Unable to prepare cellular texture");
    const w=surface.width,h=surface.height;c.drawImage(image,(tile%2)*w,Math.floor(tile/2)*h,w,h,0,0,w,h);
    c.globalCompositeOperation="destination-in";
    for(const axis of ["x","y"]){
      const gradient=c.createLinearGradient(0,0,axis==="x"?w:0,axis==="y"?h:0);
      gradient.addColorStop(0,"transparent");gradient.addColorStop(.045,"#000");gradient.addColorStop(.955,"#000");gradient.addColorStop(1,"transparent");
      c.fillStyle=gradient;c.fillRect(0,0,w,h);
    }
    return surface;
  });
  let width=1,height=1;
  return {
    resize(w,h,narrow){
      width=w;height=h;const density=Math.min(window.devicePixelRatio||1,1,Math.sqrt((narrow?500_000:1_000_000)/(w*h)));
      canvas.width=Math.max(1,Math.round(w*density));canvas.height=Math.max(1,Math.round(h*density));
      ctx.setTransform(canvas.width/w,0,0,canvas.height/h,0,0);ctx.imageSmoothingEnabled=true;
    },
    paint(poses){
      ctx.clearRect(0,0,width,height);
      for(const p of poses){ctx.save();ctx.globalAlpha=p.opacity;ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.drawImage(tiles[p.tile],-p.width/2,-p.height/2,p.width,p.height);ctx.restore();}
    },
    destroy(){tiles.forEach(tile=>{tile.width=1;tile.height=1;});},
  };
}

export function mountCellularInquiry(root:HTMLDivElement,image:HTMLImageElement,canvas:HTMLCanvasElement,onReady:(value:boolean)=>void):InquiryController {
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const elements=[...root.querySelectorAll<HTMLElement>("[data-inquiry-sprite]")];
  let bases:Pose[]=[];
  let renderer=makeWebGL(canvas,image);const webgl=!!renderer;if(!renderer)renderer=makeCanvas(canvas,image);
  root.dataset.renderer=webgl?"webgl":"canvas2d";
  let frame=0,lastPaint=0,elapsed=0,scroll=0,scrollTarget=0;
  let visible=false,paused=false,destroyed=false,lost=false,failed=false,ready=false,narrow=false,scrollDirty=true;
  function reveal(value:boolean){if(root.dataset.ready!==String(value))root.dataset.ready=String(value);if(ready!==value){ready=value;onReady(value);}}
  function updateScroll(){
    if(destroyed||media.matches)return;
    const box=root.getBoundingClientRect();scrollTarget=Math.max(-1,Math.min(1,(window.innerHeight*.5-box.top-box.height*.5)/(window.innerHeight*.5+box.height*.5)));scrollDirty=false;
  }
  function paint(){
    const phase=elapsed/120_000*Math.PI*2,strength=narrow?.48:1;
    const poses=bases.map((base,i)=>{
      const data=inquirySprites[i],p=phase*data.rate+data.seed;
      return {...base,x:base.x+(Math.sin(p*.5+data.seed)*6+Math.cos(p)*2)*strength,y:base.y+(Math.sin(p)*data.drift+scroll*data.depth)*strength,angle:data.angle+Math.sin(p+1.2)*.022*strength,phase:p};
    });
    renderer?.paint(poses);reveal(true);
  }
  const canRun=()=>!destroyed&&!failed&&!lost&&!paused&&visible&&!document.hidden&&!media.matches;
  function tick(now:number){
    frame=0;if(!canRun())return;frame=requestAnimationFrame(tick);
    const interval=webgl&&!narrow?1000/60:1000/30;if(lastPaint&&now-lastPaint<interval-1)return;
    const delta=lastPaint?Math.min(now-lastPaint,80):interval;lastPaint=now;
    elapsed=(elapsed+delta)%240_000;
    if(scrollDirty)updateScroll();scroll+=(scrollTarget-scroll)*(1-Math.exp(-delta/340));paint();
  }
  function sync(){
    if(destroyed)return;if(frame)cancelAnimationFrame(frame);frame=0;lastPaint=0;
    if(visible&&!media.matches)updateScroll();
    root.dataset.animationState=failed||lost?"static":media.matches?"reduced":paused?"paused":document.hidden?"hidden":!visible?"offscreen":"running";
    if(failed||lost||media.matches)reveal(false);
    if(paused&&!ready&&!failed&&!lost&&!media.matches&&visible&&!document.hidden)paint();
    if(canRun())frame=requestAnimationFrame(tick);
  }
  function resize(){
    if(destroyed||lost||failed)return;narrow=window.innerWidth<=800;
    bases=elements.map((element,i)=>({tile:inquirySprites[i].tile,x:element.offsetLeft,y:element.offsetTop,width:element.clientWidth,height:element.clientHeight,angle:inquirySprites[i].angle,opacity:parseFloat(getComputedStyle(element).opacity),phase:0}));
    renderer?.resize(Math.max(1,root.clientWidth),Math.max(1,root.clientHeight),narrow);updateScroll();
    if(visible&&!media.matches&&!document.hidden)paint();else reveal(false);sync();
  }
  function onScroll(){scrollDirty=true;}
  function onLoss(event:Event){event.preventDefault();lost=true;sync();}
  function onRestore(){try{renderer?.destroy();renderer=makeWebGL(canvas,image);if(!renderer)throw new Error("WebGL unavailable");lost=false;resize();}catch{failed=true;sync();}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync();},{threshold:0});
  const resizer=new ResizeObserver(resize);resize();observer.observe(root);resizer.observe(root);
  window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",resize,{passive:true});media.addEventListener("change",sync);document.addEventListener("visibilitychange",sync);
  canvas.addEventListener("webglcontextlost",onLoss);canvas.addEventListener("webglcontextrestored",onRestore);
  return {
    setPaused(value){paused=value;sync();},
    destroy(){
      destroyed=true;if(frame)cancelAnimationFrame(frame);observer.disconnect();resizer.disconnect();
      window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",resize);media.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync);
      canvas.removeEventListener("webglcontextlost",onLoss);canvas.removeEventListener("webglcontextrestored",onRestore);renderer?.destroy();renderer=null;bases=[];canvas.width=1;canvas.height=1;
      root.dataset.ready="false";root.dataset.animationState="static";
    },
  };
}
