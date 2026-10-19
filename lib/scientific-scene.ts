import * as THREE from 'three';
import { gsap } from 'gsap';

/** Etched, sectional geometry. No photographic planes or endlessly floating props. */
export function mountScientificScene(root: HTMLElement, canvas: HTMLCanvasElement, kind: 'cell' | 'molecule') {
  const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});
  if(!context)throw new Error('The scientific SVG plate is retained when WebGL is unavailable.');
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.35 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 60);
  camera.position.set(0, 0, kind === 'cell' ? 10.7 : 10.2);
  scene.add(new THREE.AmbientLight(0xcfcbd0, 1.9));
  const key = new THREE.DirectionalLight(0xfff3e0, 4.2); key.position.set(-3, 4, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xdce6ef, 3.5); rim.position.set(4, 1, -2); scene.add(rim);
  const group = new THREE.Group(); scene.add(group);
  const metal = new THREE.MeshStandardMaterial({ color: 0x9c785c, metalness: .4, roughness: .37 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x485e6a, metalness: .3, roughness: .42 });
  const core = new THREE.MeshStandardMaterial({ color: 0xb67a4c, metalness: .3, roughness: .4 });
  const fine = new THREE.LineBasicMaterial({ color: 0x637c87, transparent: true, opacity: .38 });
  const bond = new THREE.MeshStandardMaterial({ color: 0x6c8590, metalness: .3, roughness: .42, transparent: true, opacity: .55 });
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>([metal, darkMetal, core, fine, bond]);
  const geometry = <T extends THREE.BufferGeometry>(value: T) => { geometries.add(value); return value; };
  const sphere = geometry(new THREE.SphereGeometry(1, 36, 24));
  const addSphere = (parent: THREE.Object3D, radius: number, at: THREE.Vector3, material: THREE.Material) => {
    const mesh = new THREE.Mesh(sphere, material); mesh.scale.setScalar(radius); mesh.position.copy(at); parent.add(mesh); return mesh;
  };
  const connect = (a: THREE.Vector3, b: THREE.Vector3, radius: number, parent: THREE.Object3D) => {
    const delta = b.clone().sub(a);
    const mesh = new THREE.Mesh(geometry(new THREE.CylinderGeometry(radius, radius, delta.length(), 8)), bond);
    mesh.position.copy(a).add(b).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), delta.normalize()); parent.add(mesh);
  };
  if (kind === 'cell') {
    const membrane = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      vertexShader: `varying vec3 vNormal;varying vec3 vView;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`,
      fragmentShader: `varying vec3 vNormal;varying vec3 vView;void main(){float edge=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.5);gl_FragColor=vec4(vec3(.27,.37,.42),.025+edge*.38);}`,
    }); materials.add(membrane);
    const shell = geometry(new THREE.SphereGeometry(2.16, 64, 40, .25, Math.PI*1.62));
    group.add(new THREE.Mesh(shell, membrane));
    const boundary = geometry(new THREE.EdgesGeometry(shell, 22)); group.add(new THREE.LineSegments(boundary, fine));
    const nucleus = addSphere(group, .72, new THREE.Vector3(-.4,.05,.35), darkMetal);
    addSphere(nucleus, .27, new THREE.Vector3(-.27,.19,.78), core);
    for (let i=0;i<7;i++) {
      const reticulum = new THREE.Mesh(geometry(new THREE.TorusGeometry(.9+i*.062, .025, 7, 80, 4.7)), metal);
      reticulum.position.set(-.4,.05,.09-i*.07); reticulum.rotation.set(.45+i*.06,-.4,.65+i*.12); reticulum.scale.y=.65; group.add(reticulum);
    }
    const sites = [[1.13,.77,.4,.7],[.88,-1.15,.35,-.8],[-1.25,-.7,.4,.9],[-.85,1.28,.3,-.8],[1.45,-.12,-.1,.35]];
    const capsule = geometry(new THREE.CapsuleGeometry(.14,.4,6,20));
    sites.forEach(([x,y,z,angle]) => {
      const body = new THREE.Group(); body.position.set(x,y,z); body.rotation.z=angle; group.add(body);
      body.add(new THREE.Mesh(capsule, darkMetal));
      const points = Array.from({length:41},(_,i) => new THREE.Vector3(Math.sin(i/40*Math.PI*6)*.105,-.27+i/40*.54,.142));
      body.add(new THREE.Mesh(geometry(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),40,.012,5,false)),metal));
    });
    const dots = geometry(new THREE.SphereGeometry(.018,6,5));
    const ribosomes = new THREE.InstancedMesh(dots,metal,80); const transform=new THREE.Object3D();
    for(let i=0;i<80;i++){const a=i*2.39996,r=1.35+(i%7)*.07;transform.position.set(Math.cos(a)*r,Math.sin(a)*r,.15+Math.sin(i*1.7)*.65);transform.updateMatrix();ribosomes.setMatrixAt(i,transform.matrix);}
    group.add(ribosomes); group.rotation.set(.08,-.35,-.08);
  } else {
    const helix = new THREE.Group(); group.add(helix);
    let previous: THREE.Vector3[] | null=null;
    for(let i=0;i<34;i++) {
      const angle=i*.41, y=(i-16.5)*.132;
      const pair=[new THREE.Vector3(Math.cos(angle)*.88,y,Math.sin(angle)*.88),new THREE.Vector3(-Math.cos(angle)*.88,y,-Math.sin(angle)*.88)];
      addSphere(helix,.085,pair[0],metal);addSphere(helix,.085,pair[1],darkMetal);connect(pair[0],pair[1],.013,helix);
      if(previous){connect(previous[0],pair[0],.027,helix);connect(previous[1],pair[1],.027,helix);}previous=pair;
    }
    helix.rotation.z=-.38;group.rotation.y=-.4;
    for(let i=0;i<3;i++){
      const ring = new THREE.LineLoop(geometry(new THREE.BufferGeometry().setFromPoints(Array.from({length:128},(_,n)=>{const a=n/128*Math.PI*2;return new THREE.Vector3(Math.cos(a)*(1.7+i*.28),Math.sin(a)*(.7+i*.1),0);}))),fine);
      ring.rotation.x=.6+i*.25;ring.rotation.z=-.4;group.add(ring);
    }
  }
  let disposed=false, visible=false, frame=0;
  const state={ reveal:0, scroll:0, phase:0 };
  const draw=()=>{
    frame=0;if(disposed||!visible||document.hidden)return;
    group.rotation.y=(kind==='cell'?-.35+Math.sin(state.phase)*.25:-.4+state.phase)+(1-state.reveal)*-.45+state.scroll*.13;
    group.rotation.z=kind==='cell'?-.08+Math.sin(state.phase)*.04:Math.sin(state.phase)*.025;
    group.position.y=(1-state.reveal)*-.15;
    renderer.render(scene,camera);
  };
  const requestDraw=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(draw);};
  const resize=()=>{const bounds=root.getBoundingClientRect();if(!bounds.width||!bounds.height)return;camera.aspect=bounds.width/bounds.height;camera.position.z=(kind==='cell'?10.7:10.2)*Math.max(1,1/camera.aspect*.9);camera.updateProjectionMatrix();renderer.setSize(bounds.width,bounds.height,false);requestDraw();};
  const observer=new ResizeObserver(resize);observer.observe(root);resize();
  const entrance=gsap.to(state,{reveal:1,duration:4.2,ease:'power2.out',paused:true,onUpdate:requestDraw});
  const loop=gsap.to(state,{phase:Math.PI*2,duration:24,ease:'none',repeat:-1,paused:true,onUpdate:requestDraw});
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){if(!document.hidden){entrance.resume();loop.resume();}requestDraw();}else {entrance.pause();loop.pause();}},{threshold:.05});intersection.observe(root);
  const visibility=()=>{if(document.hidden){entrance.pause();loop.pause();}else if(visible){entrance.resume();loop.resume();requestDraw();}};
  const scroll=()=>{if(!visible)return;const bounds=root.getBoundingClientRect();state.scroll=Math.max(-1,Math.min(1,(innerHeight/2-bounds.top-bounds.height/2)/innerHeight));requestDraw();};
  const lost=(event:Event)=>{event.preventDefault();root.dataset.ready='false';entrance.pause();loop.pause();};
  document.addEventListener('visibilitychange',visibility);window.addEventListener('scroll',scroll,{passive:true});canvas.addEventListener('webglcontextlost',lost);
  root.dataset.ready='true';
  return ()=>{disposed=true;cancelAnimationFrame(frame);entrance.kill();loop.kill();observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('scroll',scroll);canvas.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();root.dataset.ready='false';};
}
