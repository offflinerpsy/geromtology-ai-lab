"use client";

import { DocumentLink as Link } from "./research-link";
import {useEffect, useRef, useState} from "react";
import type {CellularHeroController} from "@/lib/cellular-hero";

export default function HomeHeroAnimated() {
  const artRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<CellularHeroController | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = artRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!root || !image || !canvas) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let loading = false;
    const initialize = async () => {
      if (disposed || loading || controllerRef.current || media.matches) return;
      loading = true;
      try {
        const [{mountCellularHero}] = await Promise.all([import("@/lib/cellular-hero"), image.decode()]);
        if (disposed || media.matches) return;
        controllerRef.current = mountCellularHero(root, image, canvas, value => { if (!disposed) setReady(value); });
      } catch {
        if (!disposed) { root.dataset.animationState = "static"; root.dataset.ready = "false"; setReady(false); }
      } finally { loading = false; }
    };
    media.addEventListener("change", initialize);
    void initialize();
    return () => {
      disposed = true;
      media.removeEventListener("change", initialize);
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  const toggleMotion = () => {
    const next = !paused;
    controllerRef.current?.setPaused(next);
    setPaused(next);
  };

  return (
    <section className="hero hero-animated" id="top" aria-labelledby="hero-title">
      <div className="hero-art hero-art-live" ref={artRef} aria-hidden="true">
        <img ref={imageRef} src="/images/cellular-hero.webp" alt="" fetchPriority="high" width="1672" height="941" />
        <canvas ref={canvasRef} className="hero-cellular-canvas" aria-hidden="true" />
      </div>
      <div className="hero-shade" />
      <div className="hero-content container">
        <p className="eyebrow hero-eyebrow">ProAge Atlas · Longevity research platform</p>
        <h1 id="hero-title">A research<br />workspace for<br /><span>healthy aging.</span></h1>
        <div className="hero-intro"><p>Scientific evidence, aging measurements and study planning for longevity research teams. Explore the prototype and help shape what comes next.</p><div className="hero-product-actions"><Link className="text-link" href="/laboratory">Explore the prototype</Link><Link className="text-link" href="/contact?type=research">Become a research partner</Link></div></div>
      </div>
      <div className="hero-bottom container">
        <Link href="/institute" className="scroll-link">Discover the institute</Link>
        <span>GERONTOLOGY &nbsp; / &nbsp; HUMAN POTENTIAL</span>
        <div className="art-label hero-art-meta"><span>Conceptual cellular study</span><button className="hero-motion-control" type="button" hidden={!ready} aria-pressed={paused} onClick={toggleMotion}>{paused ? "Resume motion" : "Pause motion"}</button></div>
      </div>
    </section>
  );
}
