import {mountCanvasCellularHero} from "./cellular-hero-canvas";

/** A texture-based cellular study: the retained artwork supplies every visible form. */
const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const fragmentSource = `
precision highp float;
uniform sampler2D uImage;
uniform vec4 uCrop;
uniform vec2 uTexel;
uniform vec2 uPointer;
uniform float uPhase;
uniform float uStrength;
varying vec2 vUv;

float luminance(vec3 color) {
  return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

vec3 material(vec2 uv) {
  return texture2D(uImage, clamp(uv, uTexel, 1.0 - uTexel)).rgb;
}

// Two coherent, divergence-free currents. Integer harmonics close the 12-second loop.
vec2 current(vec2 p, float phase) {
  vec2 broad = vec2(
    0.71 * sin(p.x * 7.0 + phase) * cos(p.y * 5.0 - phase),
    -cos(p.x * 7.0 + phase) * sin(p.y * 5.0 - phase)
  );
  vec2 fine = vec2(
    0.82 * sin(p.x * 17.0 - 2.0 * phase) * cos(p.y * 14.0 + phase),
    -cos(p.x * 17.0 - 2.0 * phase) * sin(p.y * 14.0 + phase)
  );
  return broad * 0.76 + fine * 0.24;
}

void main() {
  vec2 uv = (vUv - 0.5) * uCrop.xy + 0.5 + uCrop.zw;
  vec3 original = material(uv);
  float depth = luminance(original);
  float tissue = smoothstep(0.032, 0.18, depth) * smoothstep(0.38, 0.51, uv.x);
  vec2 p = (uv - vec2(0.76, 0.5)) * vec2(1.776, 1.0);

  vec2 flow = current(p, uPhase);
  vec2 membrane = vec2(
    sin(p.y * 46.0 + p.x * 21.0 + 2.0 * uPhase),
    cos(p.x * 39.0 - p.y * 23.0 - 3.0 * uPhase)
  );
  vec2 displacement = (flow * 0.0105 + membrane * 0.00065) * tissue;
  // Brighter translucent folds and darker interiors respond at different depths.
  vec2 perspective = (uPointer - 0.5) * (depth - 0.20) * 0.019 * tissue;
  vec2 livingUv = uv + (displacement + perspective) * uStrength;
  vec3 color = material(livingUv);

  float dx = luminance(material(livingUv + vec2(uTexel.x * 2.0, 0.0)))
           - luminance(material(livingUv - vec2(uTexel.x * 2.0, 0.0)));
  float dy = luminance(material(livingUv + vec2(0.0, uTexel.y * 2.0)))
           - luminance(material(livingUv - vec2(0.0, uTexel.y * 2.0)));
  vec2 illumination = normalize(vec2(cos(uPhase) * 0.48 + 0.7, sin(uPhase) * 0.38 + 0.45));
  float fold = smoothstep(0.025, 0.18, length(vec2(dx, dy)));
  float reflection = max(0.0, dot(vec2(dx, dy), illumination)) * 0.36;
  float innerLight = sin(p.x * 7.0 - p.y * 4.0 + uPhase) * 0.028;
  color *= 1.0 + innerLight * tissue * uStrength;
  color += vec3(0.88, 0.92, 0.63) * reflection * fold * tissue * uStrength;
  gl_FragColor = vec4(color, 1.0);
}`;

type Scene = {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  texture: WebGLTexture;
  shaders: WebGLShader[];
  uniforms: Record<"uImage" | "uCrop" | "uTexel" | "uPointer" | "uPhase" | "uStrength", WebGLUniformLocation | null>;
};

export type CellularHeroController = { setPaused(value: boolean): void; destroy(): void };

export function mountCellularHero(
  root: HTMLDivElement,
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  onReady: (ready: boolean) => void,
): CellularHeroController {
  const gl = canvas.getContext("webgl", {
    alpha: false, antialias: false, depth: false, stencil: false,
    preserveDrawingBuffer: false, powerPreference: "low-power",
  });
  if (!gl) return mountCanvasCellularHero(root, image, canvas, onReady);
  root.dataset.renderer = "webgl";
  const context = gl;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hero = root.closest("section") ?? root;
  let scene: Scene | null = null;
  let frame = 0;
  let elapsed = 0;
  let lastPaint = 0;
  let visible = true;
  let paused = false;
  let lost = false;
  let destroyed = false;
  let failed = false;
  let ready = false;
  let narrow = false;
  let resolution = 1;
  let slowFrames = 0;
  let paintedFrames = 0;
  const pointer = [0.5, 0.5];
  const target = [0.5, 0.5];

  function reveal(value: boolean) {
    if (root.dataset.ready !== String(value)) root.dataset.ready = String(value);
    if (ready !== value) { ready = value; onReady(value); }
  }

  function release() {
    if (!scene) return;
    context.deleteTexture(scene.texture);
    context.deleteBuffer(scene.buffer);
    context.deleteProgram(scene.program);
    scene.shaders.forEach(shader => context.deleteShader(shader));
    scene = null;
  }

  function createScene() {
    const shaders: WebGLShader[] = [];
    const program = context.createProgram();
    const buffer = context.createBuffer();
    const texture = context.createTexture();
    if (!program || !buffer || !texture) {
      context.deleteProgram(program); context.deleteBuffer(buffer); context.deleteTexture(texture);
      throw new Error("Unable to allocate the cellular renderer");
    }
    try {
      for (const [type, source] of [[context.VERTEX_SHADER, vertexSource], [context.FRAGMENT_SHADER, fragmentSource]] as const) {
        const shader = context.createShader(type);
        if (!shader) throw new Error("Unable to allocate shader");
        shaders.push(shader);
        context.shaderSource(shader, source);
        context.compileShader(shader);
        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) throw new Error(context.getShaderInfoLog(shader) ?? "Shader compilation failed");
        context.attachShader(program, shader);
      }
      context.linkProgram(program);
      if (!context.getProgramParameter(program, context.LINK_STATUS)) throw new Error("Shader linking failed");
      context.useProgram(program);
      context.bindBuffer(context.ARRAY_BUFFER, buffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW);
      const position = context.getAttribLocation(program, "aPosition");
      context.enableVertexAttribArray(position);
      context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
      context.activeTexture(context.TEXTURE0);
      context.bindTexture(context.TEXTURE_2D, texture);
      context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
      context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
      const names = ["uImage", "uCrop", "uTexel", "uPointer", "uPhase", "uStrength"] as const;
      const uniforms = Object.fromEntries(names.map(name => [name, context.getUniformLocation(program, name)])) as Scene["uniforms"];
      scene = {program, buffer, texture, shaders, uniforms};
      context.uniform1i(uniforms.uImage, 0);
      context.uniform2f(uniforms.uTexel, 1 / image.naturalWidth, 1 / image.naturalHeight);
    } catch (error) {
      shaders.forEach(shader => context.deleteShader(shader));
      context.deleteProgram(program); context.deleteBuffer(buffer); context.deleteTexture(texture);
      throw error;
    }
  }

  function resize() {
    if (!scene || lost || destroyed) return;
    const width = root.clientWidth;
    const height = root.clientHeight;
    if (!width || !height) return;
    narrow = window.innerWidth < 768;
    const pixelBudget = narrow ? 900_000 : 1_650_000;
    const density = Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5, Math.sqrt(pixelBudget / (width * height))) * resolution;
    canvas.width = Math.max(1, Math.round(width * density));
    canvas.height = Math.max(1, Math.round(height * density));
    context.viewport(0, 0, canvas.width, canvas.height);
    const aspect = width / height;
    const originalAspect = image.naturalWidth / image.naturalHeight;
    const scaleX = Math.min(1, aspect / originalAspect);
    const scaleY = Math.min(1, originalAspect / aspect);
    const objectPosition = getComputedStyle(image).objectPosition.split(/\s+/);
    const alignment = objectPosition.map(value => value.endsWith("%") ? parseFloat(value) / 100 : 0.5);
    context.uniform4f(scene.uniforms.uCrop, scaleX, scaleY, (1 - scaleX) * ((alignment[0] ?? 0.5) - 0.5), (1 - scaleY) * ((alignment[1] ?? 0.5) - 0.5));
    context.uniform1f(scene.uniforms.uStrength, narrow ? 0.72 : 1);
  }

  function paint() {
    if (!scene || lost || destroyed) return;
    context.uniform1f(scene.uniforms.uPhase, elapsed / 12_000 * Math.PI * 2);
    context.uniform2f(scene.uniforms.uPointer, pointer[0], pointer[1]);
    context.drawArrays(context.TRIANGLES, 0, 3);
    reveal(true);
  }

  function canRun() { return !destroyed && !failed && !lost && !paused && visible && !document.hidden && !media.matches; }

  function tick(now: number) {
    frame = 0;
    if (!canRun()) return;
    frame = requestAnimationFrame(tick);
    const interval = narrow ? 1000 / 30 : 1000 / 60;
    if (lastPaint && now - lastPaint < interval - 1) return;
    const delta = lastPaint ? Math.min(now - lastPaint, 80) : interval;
    elapsed = (elapsed + delta) % 12_000;
    const smoothing = 1 - Math.exp(-delta / 420);
    pointer[0] += (target[0] - pointer[0]) * smoothing;
    pointer[1] += (target[1] - pointer[1]) * smoothing;
    paintedFrames++;
    if (lastPaint && now - lastPaint > 55) slowFrames++;
    lastPaint = now;
    // A slow renderer gets one bounded resolution reduction, without a React render.
    if (paintedFrames === 150 && slowFrames > 45 && resolution === 1) { resolution = 0.72; resize(); }
    paint();
  }

  function sync() {
    if (destroyed) return;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastPaint = 0;
    const state = failed || lost ? "static" : media.matches ? "reduced" : paused ? "paused" : document.hidden ? "hidden" : !visible ? "offscreen" : "running";
    root.dataset.animationState = state;
    if (failed || lost || media.matches) reveal(false);
    if (paused && !ready && !failed && !lost && !media.matches && visible && !document.hidden) paint();
    if (canRun()) frame = requestAnimationFrame(tick);
  }

  function onPointer(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !canRun()) return;
    const box = root.getBoundingClientRect();
    target[0] = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
    target[1] = 1 - Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
  }
  function onLeave() { target[0] = 0.5; target[1] = 0.5; }
  function onResize() {
    resize();
    if (visible && !document.hidden && !media.matches && !lost && !failed) paint();
    else reveal(false);
    sync();
  }
  function onLoss(event: Event) { event.preventDefault(); lost = true; sync(); }
  function onRestore() {
    lost = false;
    scene = null;
    try { createScene(); resize(); } catch { failed = true; }
    sync();
  }

  createScene();
  resize();
  const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync(); }, {threshold: 0});
  const resizer = new ResizeObserver(onResize);
  observer.observe(hero);
  resizer.observe(root);
  hero.addEventListener("pointermove", onPointer as EventListener, {passive: true});
  hero.addEventListener("pointerleave", onLeave);
  document.addEventListener("visibilitychange", sync);
  media.addEventListener("change", sync);
  window.addEventListener("resize", onResize, {passive: true});
  canvas.addEventListener("webglcontextlost", onLoss);
  canvas.addEventListener("webglcontextrestored", onRestore);
  sync();

  return {
    setPaused(value) { paused = value; sync(); },
    destroy() {
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect(); resizer.disconnect();
      hero.removeEventListener("pointermove", onPointer as EventListener);
      hero.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLoss);
      canvas.removeEventListener("webglcontextrestored", onRestore);
      release();
      root.dataset.ready = "false";
      root.dataset.animationState = "static";
      canvas.width = 1; canvas.height = 1;
    },
  };
}
