"use client";

import { useEffect, useId, useRef, type CSSProperties } from 'react';

export type ScientificVariant = 'cell' | 'molecule';

/** A readable scientific plate first; a real three-dimensional study when available. */
export default function ScientificScene({ variant = 'cell', labels = false, className = '', caption = true }: {
  variant?: ScientificVariant; labels?: boolean; className?: string; caption?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const id = useId().replace(/:/g, '');
  useEffect(() => {
    const element = root.current, surface = canvas.current;
    if (!element || !surface) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, generation = 0, cleanup = () => {}, near = false;
    const initialize = async () => {
      const current = ++generation;
      cleanup(); cleanup = () => {};
      element.dataset.ready = 'false';
      if (!near || disposed || media.matches) return;
      try {
        const { mountScientificScene } = await import('@/lib/scientific-scene');
        if (disposed || current !== generation) return;
        cleanup = mountScientificScene(element, surface, variant);
      } catch { element.dataset.ready = 'false'; }
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !near) { near = true; void initialize(); }
    }, { rootMargin: '180px' });
    observer.observe(element);
    let onscreen = false;
    const updateVisibility = () => { element.dataset.visible = String(onscreen && !document.hidden); };
    const visibility = new IntersectionObserver(([entry]) => { onscreen = entry.isIntersecting; updateVisibility(); });
    visibility.observe(element);
    document.addEventListener('visibilitychange', updateVisibility);
    const changed = () => { void initialize(); };
    media.addEventListener('change', changed);
    return () => { disposed = true; generation++; cleanup(); observer.disconnect(); visibility.disconnect(); document.removeEventListener('visibilitychange', updateVisibility); media.removeEventListener('change', changed); };
  }, [variant]);

  return <figure className={`scientific-study scientific-${variant} ${className}`}>
    <div className="scientific-stage" ref={root} data-ready="false" data-visible="false">
      <svg className="scientific-plate" viewBox="0 0 620 560" role="img" aria-label={variant === 'cell' ? 'Illustrative animal cell in cutaway, showing a membrane, nucleus and mitochondria.' : 'Illustrative molecular double helix with paired strands and connecting bonds.'}>
        <defs><radialGradient id={`${id}-shell`}><stop stopColor="#6e8a93" stopOpacity=".02"/><stop offset=".78" stopColor="#56707a" stopOpacity=".08"/><stop offset="1" stopColor="#56707a" stopOpacity=".24"/></radialGradient><radialGradient id={`${id}-core`} cx="32%" cy="28%"><stop stopColor="#e2b98b"/><stop offset=".5" stopColor="#a9744c"/><stop offset="1" stopColor="#485b65"/></radialGradient></defs>
        {variant === 'cell' ? <g className="scientific-cell-plate">
          <ellipse cx="302" cy="278" rx="202" ry="199" fill={`url(#${id}-shell)`} stroke="#68818b" strokeOpacity=".58"/>
          <ellipse cx="302" cy="278" rx="192" ry="189" fill="none" stroke="#68818b" strokeOpacity=".17"/>
          {[0,1,2,3,4].map(i => <ellipse key={i} cx="282" cy="270" rx={92+i*13} ry={34+i*14} fill="none" stroke="#68818b" strokeOpacity={.3-i*.035} transform="rotate(-27 282 270)"/>)}
          <circle cx="274" cy="263" r="66" fill={`url(#${id}-core)`} stroke="#a87852" strokeOpacity=".7"/>
          <circle cx="259" cy="252" r="19" fill="#cc9568" opacity=".65"/>
          {[[403,206,-35],[362,376,32],[196,349,-24],[214,155,25],[418,310,52]].map(([x,y,r],i) => <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><rect x="-35" y="-14" width="70" height="28" rx="14" fill="#aa774e" fillOpacity=".18" stroke="#7c6959" strokeOpacity=".65"/><path d="M-25 0Q-18 -15 -11 0T3 0 17 0 25 0" fill="none" stroke="#a16f48" strokeOpacity=".6"/></g>)}
          {Array.from({length:26},(_,i) => { const a=i*2.3999,r=112+(i%5)*13; return <circle key={i} cx={302+Math.cos(a)*r} cy={278+Math.sin(a)*r} r={i%3+1.1} fill="#657f89" opacity=".45"/>; })}
        </g> : <g className="scientific-molecule-plate" transform="translate(310 55)">
          {Array.from({length:30},(_,i) => {const a=i*.43,x=Math.sin(a)*104,y=i*15.2;return <g className="scientific-helix-rung" key={i} transform={`translate(0 ${y})`} style={{'--helix-angle':`${a}rad`,'--helix-origin':`${x}px`} as CSSProperties}><line x1="-104" y1="0" x2="104" y2="4" transform={`scale(${Math.sin(a)} 1)`} stroke="#72858b" strokeWidth="1.7" opacity=".45"/><circle className="strand-a" cx={x} cy="0" r={7+Math.cos(a)*2} fill={`url(#${id}-core)`}/><circle className="strand-b" cx={-x} cy="4" r={7-Math.cos(a)*2} fill={`url(#${id}-core)`}/></g>;})}
        </g>}
      </svg>
      <canvas ref={canvas} aria-hidden="true"/>
      {labels && <div className="scientific-labels" aria-hidden="true"><span className="cell-label-membrane">Cell membrane</span><span className="cell-label-nucleus">Nucleus</span><span className="cell-label-mitochondria">Mitochondria</span></div>}
    </div>
    {caption && <figcaption>{variant === 'cell' ? 'Illustrative cell anatomy · not to scale' : 'Molecular architecture · conceptual study'}</figcaption>}
  </figure>;
}
