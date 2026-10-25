"use client";

import { DocumentLink as Link } from "./research-link";
import {useEffect, useRef} from "react";
import type {CellularHeroController} from "@/lib/cellular-hero";

export default function HomeHeroAnimated() {
  const artRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<CellularHeroController | null>(null);

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
        controllerRef.current = mountCellularHero(root, image, canvas, () => {});
      } catch {
        if (!disposed) { root.dataset.animationState = "static"; root.dataset.ready = "false"; }
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


  return (
    <section className="hero hero-animated" id="top" aria-labelledby="hero-title">
      <div className="hero-art hero-art-live" ref={artRef} aria-hidden="true">
        <img ref={imageRef} src="/images/cellular-hero.webp" alt="" fetchPriority="high" width="1672" height="941" />
        <canvas ref={canvasRef} className="hero-cellular-canvas" aria-hidden="true" />
      </div>
      <div className="hero-shade" />
      <div className="hero-content container">
        <p className="eyebrow hero-eyebrow">ProAge Atlas · AI for aging research</p>
        <h1 id="hero-title">AI research.<br />Built for<br /><span>healthy aging.</span></h1>
        <div className="hero-intro"><p>An AI evidence workspace for geroscience teams. Find biomedical research, compare what studies support and turn a question into a source-linked brief.</p><div className="hero-product-actions"><Link className="text-link" href="/laboratory/ask">Ask a question</Link><Link className="text-link" href="/about">How Atlas works</Link></div></div>
      </div>
      <div className="hero-bottom container">
        <Link href="#platform" className="scroll-link">Find your starting point</Link>
        <span>GERONTOLOGY &nbsp; / &nbsp; HUMAN POTENTIAL</span>

      </div>
    </section>
  );
}
