import type {CellularHeroController} from "./cellular-hero";

type Vertex = {sx: number;sy: number;x: number;y: number;depth: number;mask: number};

/** CPU texture deformation for browsers without WebGL; no replacement illustration. */
export function mountCanvasCellularHero(root: HTMLDivElement, image: HTMLImageElement, canvas: HTMLCanvasElement, onReady: (ready: boolean) => void): CellularHeroController {
  const context = canvas.getContext("2d", {alpha: false});
  if (!context) throw new Error("Canvas is unavailable");
  const ctx = context;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hero = root.closest("section") ?? root;
  const sampler = document.createElement("canvas");
  sampler.width = 84; sampler.height = 48;
  const sampling = sampler.getContext("2d", {willReadFrequently: true});
  if (!sampling) throw new Error("Unable to sample the original artwork");
  sampling.drawImage(image, 0, 0, sampler.width, sampler.height);
  const pixels = sampling.getImageData(0, 0, sampler.width, sampler.height).data;
  const pointer = [0.5, 0.5];
  const target = [0.5, 0.5];
  let vertices: Vertex[] = [];
  let columns = 22;
  let rows = 12;
  let frame = 0;
  let lastPaint = 0;
  let elapsed = 0;
  let visible = true;
  let paused = false;
  let destroyed = false;
  let ready = false;
  let narrow = false;
  let cropX = 1;
  let cropY = 1;
  let offsetX = 0;
  let offsetY = 0;
  let width = 1;
  let height = 1;
  root.dataset.renderer = "canvas2d";

  const smoothstep = (a: number, b: number, value: number) => {const t = Math.max(0, Math.min(1, (value - a) / (b - a)));return t * t * (3 - 2 * t);};
  function reveal(value: boolean) {
    if (root.dataset.ready !== String(value)) root.dataset.ready = String(value);
    if (ready !== value) {ready = value;onReady(value);}
  }
  function depthAt(x: number, y: number) {
    const px = Math.max(0, Math.min(sampler.width - 1, Math.round(x * (sampler.width - 1))));
    const py = Math.max(0, Math.min(sampler.height - 1, Math.round(y * (sampler.height - 1))));
    const index = (py * sampler.width + px) * 4;
    return (pixels[index] * .2126 + pixels[index + 1] * .7152 + pixels[index + 2] * .0722) / 255;
  }
  function resize() {
    if (destroyed) return;
    width = root.clientWidth; height = root.clientHeight;
    if (!width || !height) return;
    narrow = window.innerWidth < 768;
    columns = narrow ? 16 : 22; rows = narrow ? 10 : 12;
    const density = Math.min(window.devicePixelRatio || 1, 1, Math.sqrt((narrow ? 650_000 : 1_250_000) / (width * height)));
    canvas.width = Math.max(1, Math.round(width * density));
    canvas.height = Math.max(1, Math.round(height * density));
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    ctx.imageSmoothingEnabled = true;
    const originalAspect = image.naturalWidth / image.naturalHeight;
    cropX = Math.min(1, width / height / originalAspect);
    cropY = Math.min(1, originalAspect / (width / height));
    const alignment = getComputedStyle(image).objectPosition.split(/\s+/).map(value => value.endsWith("%") ? parseFloat(value) / 100 : .5);
    offsetX = (1 - cropX) * ((alignment[0] ?? .5) - .5);
    offsetY = (1 - cropY) * ((alignment[1] ?? .5) - .5);
    vertices = [];
    for (let y = 0; y <= rows; y++) for (let x = 0; x <= columns; x++) {
      const u = (x / columns - .5) * cropX + .5 + offsetX;
      const v = (y / rows - .5) * cropY + .5 + offsetY;
      const depth = depthAt(u, v);
      vertices.push({sx: u * image.naturalWidth, sy: v * image.naturalHeight, x: x / columns * width, y: y / rows * height, depth, mask: smoothstep(.032, .18, depth) * smoothstep(.38, .51, u)});
    }
  }

  function triangle(a: Vertex, b: Vertex, c: Vertex) {
    const denominator = a.sx * (c.sy - b.sy) + b.sx * (a.sy - c.sy) + c.sx * (b.sy - a.sy);
    if (Math.abs(denominator) < .0001) return;
    const m11 = (a.x * (c.sy - b.sy) + b.x * (a.sy - c.sy) + c.x * (b.sy - a.sy)) / denominator;
    const m12 = (a.y * (c.sy - b.sy) + b.y * (a.sy - c.sy) + c.y * (b.sy - a.sy)) / denominator;
    const m21 = (a.x * (b.sx - c.sx) + b.x * (c.sx - a.sx) + c.x * (a.sx - b.sx)) / denominator;
    const m22 = (a.y * (b.sx - c.sx) + b.y * (c.sx - a.sx) + c.y * (a.sx - b.sx)) / denominator;
    const dx = (a.x * (c.sx * b.sy - b.sx * c.sy) + b.x * (a.sx * c.sy - c.sx * a.sy) + c.x * (b.sx * a.sy - a.sx * b.sy)) / denominator;
    const dy = (a.y * (c.sx * b.sy - b.sx * c.sy) + b.y * (a.sx * c.sy - c.sx * a.sy) + c.y * (b.sx * a.sy - a.sx * b.sy)) / denominator;
    const cx = (a.x + b.x + c.x) / 3;
    const cy = (a.y + b.y + c.y) / 3;
    // Subpixel overlap covers anti-aliased mesh seams without visible grid lines.
    const expand = (v: Vertex) => {const x = v.x - cx;const y = v.y - cy;const length = Math.hypot(x, y) || 1;return [v.x + x / length * .65, v.y + y / length * .65];};
    const pa = expand(a), pb = expand(b), pc = expand(c);
    ctx.save();
    ctx.beginPath();ctx.moveTo(pa[0], pa[1]);ctx.lineTo(pb[0], pb[1]);ctx.lineTo(pc[0], pc[1]);ctx.closePath();ctx.clip();
    ctx.transform(m11, m12, m21, m22, dx, dy);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  }

  function paint() {
    if (destroyed || !vertices.length) return;
    const phase = elapsed / 12_000 * Math.PI * 2;
    const strength = narrow ? .72 : 1;
    const imageWidth = width / cropX;
    const imageHeight = height / cropY;
    ctx.drawImage(image, -imageWidth * ((1 - cropX) * .5 + offsetX), -imageHeight * ((1 - cropY) * .5 + offsetY), imageWidth, imageHeight);
    for (let y = 0; y <= rows; y++) for (let x = 0; x <= columns; x++) {
      const vertex = vertices[y * (columns + 1) + x];
      const u = vertex.sx / image.naturalWidth;
      const v = 1 - vertex.sy / image.naturalHeight;
      const px = (u - .76) * 1.776;
      const py = v - .5;
      const flowX = .76 * .71 * Math.sin(px * 7 + phase) * Math.cos(py * 5 - phase) + .24 * .82 * Math.sin(px * 17 - 2 * phase) * Math.cos(py * 14 + phase);
      const flowY = -.76 * Math.cos(px * 7 + phase) * Math.sin(py * 5 - phase) - .24 * Math.cos(px * 17 - 2 * phase) * Math.sin(py * 14 + phase);
      const dx = (flowX * .0105 + (pointer[0] - .5) * (vertex.depth - .2) * .019) * vertex.mask * strength;
      const dy = (flowY * .0105 + (pointer[1] - .5) * (vertex.depth - .2) * .019) * vertex.mask * strength;
      // The perimeter stays attached; only material inside the image deforms.
      const edge = Math.min(1, Math.min(x, columns - x, y, rows - y));
      vertex.x = x / columns * width - dx * imageWidth * edge;
      vertex.y = y / rows * height + dy * imageHeight * edge;
    }
    for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
      const index = y * (columns + 1) + x;
      const a = vertices[index], b = vertices[index + 1], c = vertices[index + columns + 1], d = vertices[index + columns + 2];
      if (Math.max(a.mask, b.mask, c.mask, d.mask) < .02) continue;
      triangle(a, b, c);triangle(b, d, c);
    }
    reveal(true);
  }
  const canRun = () => !destroyed && visible && !paused && !document.hidden && !media.matches;
  function tick(now: number) {
    frame = 0;
    if (!canRun()) return;
    frame = requestAnimationFrame(tick);
    const interval = 1000 / 30;
    if (lastPaint && now - lastPaint < interval - 1) return;
    const delta = lastPaint ? Math.min(now - lastPaint, 80) : interval;
    elapsed = (elapsed + delta) % 12_000;
    const smoothing = 1 - Math.exp(-delta / 420);
    pointer[0] += (target[0] - pointer[0]) * smoothing;pointer[1] += (target[1] - pointer[1]) * smoothing;
    lastPaint = now;
    paint();
  }
  function sync() {
    if (destroyed) return;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;lastPaint = 0;
    root.dataset.animationState = media.matches ? "reduced" : paused ? "paused" : document.hidden ? "hidden" : !visible ? "offscreen" : "running";
    if (media.matches) reveal(false);
    if (paused && !ready && !media.matches && visible && !document.hidden) paint();
    if (canRun()) frame = requestAnimationFrame(tick);
  }
  function onPointer(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !canRun()) return;
    const box = root.getBoundingClientRect();
    target[0] = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
    target[1] = 1 - Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
  }
  const leave = () => {target[0] = .5;target[1] = .5;};
  function onResize() {resize();if (visible && !document.hidden && !media.matches) paint();else reveal(false);sync();}
  resize();
  const observer = new IntersectionObserver(entries => {visible = entries[0]?.isIntersecting ?? false;sync();}, {threshold: 0});
  const resizer = new ResizeObserver(onResize);
  observer.observe(hero);resizer.observe(root);
  hero.addEventListener("pointermove", onPointer as EventListener, {passive: true});
  hero.addEventListener("pointerleave", leave);
  media.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", onResize, {passive: true});
  sync();
  return {
    setPaused(value) {paused = value;sync();},
    destroy() {
      destroyed = true;if (frame) cancelAnimationFrame(frame);
      observer.disconnect();resizer.disconnect();
      hero.removeEventListener("pointermove", onPointer as EventListener);hero.removeEventListener("pointerleave", leave);
      media.removeEventListener("change", sync);document.removeEventListener("visibilitychange", sync);window.removeEventListener("resize", onResize);
      root.dataset.ready = "false";root.dataset.animationState = "static";
      canvas.width = 1;canvas.height = 1;sampler.width = 1;sampler.height = 1;vertices = [];
    },
  };
}
