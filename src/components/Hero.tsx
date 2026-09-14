import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  Sparkles,
  Dna,
  ShieldCheck,
  TrendingDown,
  Activity,
  Layers,
  Bot,
  Zap,
} from "lucide-react";
import { luxuryEase, sectionHeaderVariants } from "../utils/motion";
import { ParallaxImageCard, ParallaxLayer } from "./ParallaxImageCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroProps {
  onOpenSimulator: () => void;
  onOpenCopilot: () => void;
  onOpenDataRoom: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenSimulator,
  onOpenCopilot,
  onOpenDataRoom,
}) => {
  const [activePin, setActivePin] = useState<number | null>(0);
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Cinematic Aperture Headline Entrance
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 36, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.25,
            ease: "power3.out",
          }
        );
      }

      // 2. ScrollTrigger Parallax Depth on Hero Image Canvas
      if (imageContainerRef.current && heroRef.current) {
        gsap.to(imageContainerRef.current, {
          yPercent: 10,
          scale: 0.98,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // 3. ScrollTrigger Cinematic Reveal on Live Cohort Metrics Ticker
      if (statsRowRef.current) {
        gsap.fromTo(
          statsRowRef.current.children,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRowRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const pins = [
    {
      title: "DNAm DunedinPACE",
      value: "0.76 yr/yr",
      desc: "Instantaneous biological pace of multi-organ aging",
      pos: "top-[18%] left-[18%]",
    },
    {
      title: "Intracellular NAD+",
      value: "+62.4% Elevation",
      desc: "SIRT1 & mitochondrial ATP biogenesis restored",
      pos: "top-[42%] right-[16%]",
    },
    {
      title: "p16INK4a Senescent Clearance",
      value: "-38% SASP Burden",
      desc: "Pulsed senolytics eliminating inflammatory cell clusters",
      pos: "bottom-[24%] left-[28%]",
    },
  ];

  return (
    <section ref={heroRef} className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-[#E2E0D8] bg-[#FAF9F5] overflow-hidden">
      {/* Subtle organic background mesh grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        {/* Top Tagline & Trust Badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionHeaderVariants}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#064E3B] text-[11px] font-mono tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Next-Gen Epigenetic Intelligence & Multi-Omics</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#6A6860]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>CLIA / CAP Certified Sequencing • 850k+ CpG Methylome</span>
          </div>
        </motion.div>

        {/* Master Headline */}
        <div className="max-w-4xl mb-8">
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-6xl lg:text-7xl font-light text-[#141716] tracking-tight leading-[1.08] font-editorial"
          >
            Decouple Chronological Time from{" "}
            <span className="italic font-normal text-[#064E3B] underline decoration-emerald-300 decoration-1 underline-offset-8">
              Biological Reality
            </span>
            .
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#46453E] leading-relaxed max-w-3xl">
            ProAge Atlas bridges clinical epigenetics, mitochondrial bioenergetics, and targeted intervention matrices. By measuring hundreds of thousands of DNA methylation switches, we quantify the true rate of human aging and deploy personalized, evidence-based protocols to systematically roll back biological age.
          </p>
        </div>

        {/* Action Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: luxuryEase, delay: 0.2 }}
          className="flex flex-wrap items-center gap-3.5 mb-14"
        >
          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#141716] text-[#FAF9F5] hover:bg-[#252827] transition-all active:scale-[0.98] shadow-md group"
          >
            <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Simulate Biological Age & DunedinPACE</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono ml-1">
              Interactive
            </span>
          </button>

          <button
            onClick={onOpenCopilot}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-emerald-50 text-[#064E3B] hover:bg-emerald-100 border border-emerald-200/80 transition-all active:scale-[0.98]"
          >
            <Bot className="w-4 h-4 text-emerald-700" />
            <span>Consult Longevity AI Copilot</span>
          </button>

          <button
            onClick={onOpenDataRoom}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-[#525048] hover:text-[#141716] hover:bg-[#F2EFE8] border border-[#E2E0D8] transition-all"
          >
            <span>Series A Investor Deck ($24M)</span>
          </button>
        </motion.div>

        {/* High-Definition Visual Canvas with Interactive Biological Pins & Parallax Hover */}
        <div
          ref={imageContainerRef}
          className="mb-14 will-change-transform"
        >
          <ParallaxImageCard
            imageSrc="/src/assets/images/proage_hero_biotech_1789390656972.jpg"
            imageAlt="ProAge Atlas Epigenetic Molecular Visualization"
            className="rounded-3xl border border-white/60 bg-[#141716] shadow-2xl h-[340px] sm:h-[480px] lg:h-[560px] lab-reticle-box overflow-hidden"
            imageClassName="object-center opacity-85"
            maxTilt={3.5}
            imageParallaxFactor={2.2}
            glareTone="dark"
          >
            {/* Gradient Lighting Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141716] via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141716]/60 via-transparent to-[#141716]/60 pointer-events-none" />

            {/* Subtle Optical Laser Scan Sweep Line */}
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent pointer-events-none animate-[pulse_3s_ease-in-out_infinite] top-1/4" />

            {/* Interactive Biological Data Hotspots floating with 3D Parallax */}
            {pins.map((pin, idx) => (
              <ParallaxLayer
                key={idx}
                depth={activePin === idx ? 48 : 32}
                className={`absolute ${pin.pos} z-20 cursor-pointer`}
              >
                <div
                  className="transition-all"
                  onClick={() => setActivePin(activePin === idx ? null : idx)}
                >
                  <div className="relative">
                    <span className="flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-md" />
                    </span>

                    {/* Hotspot Floating Glass Card */}
                    <div
                      className={`mt-2.5 backdrop-blur-xl bg-[#141716]/92 border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl min-w-[210px] max-w-[270px] transition-all duration-300 lab-reticle-box ${
                        activePin === idx
                          ? "opacity-100 scale-100 block"
                          : "opacity-85 hover:opacity-100 hidden sm:block"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                          {pin.title}
                        </span>
                        <Zap className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">{pin.value}</div>
                      <p className="text-[11px] text-gray-300 mt-1 leading-snug">{pin.desc}</p>
                    </div>
                  </div>
                </div>
              </ParallaxLayer>
            ))}

            {/* Bottom Bar on Canvas Floating Layer */}
            <ParallaxLayer depth={18} className="absolute bottom-0 inset-x-0">
              <div className="p-4 sm:p-6 bg-gradient-to-t from-[#141716]/95 via-[#141716]/80 to-transparent flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-300 uppercase tracking-wider">
                    Live Cohort Feed • 850k+ CpG Chromatin Map Active
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono hidden md:block">
                  Bioinformatic Pipeline: DunedinPACE • GrimAge v2 • PhenoAge
                </div>
              </div>
            </ParallaxLayer>
          </ParallaxImageCard>
        </div>

        {/* Live Cohort Metrics Ticker Grid */}
        <div
          ref={statsRowRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <div className="lab-glass-card rounded-2xl p-5 sm:p-6 lab-reticle-box specular-shine">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6A6860]">
                Avg Age Reversal
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-light text-[#141716] font-editorial">
              -4.8 Years
            </div>
            <p className="text-xs text-[#6A6860] mt-1.5 leading-snug">
              Verified across 1,840+ longitudinal 12-month patient cohorts
            </p>
          </div>

          <div className="lab-glass-card rounded-2xl p-5 sm:p-6 lab-reticle-box specular-shine">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6A6860]">
                DunedinPACE Pace
              </span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-light text-[#141716] font-editorial">
              0.78 yr/yr
            </div>
            <p className="text-xs text-[#6A6860] mt-1.5 leading-snug">
              22% reduction in biological decay speed vs normative 1.00
            </p>
          </div>

          <div className="lab-glass-card rounded-2xl p-5 sm:p-6 lab-reticle-box specular-shine">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6A6860]">
                CpG Methylome
              </span>
              <Dna className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-light text-[#141716] font-editorial">
              850,000+
            </div>
            <p className="text-xs text-[#6A6860] mt-1.5 leading-snug">
              Microarray methylation array coverage for deep epigenetics
            </p>
          </div>

          <div className="lab-glass-card rounded-2xl p-5 sm:p-6 lab-reticle-box specular-shine">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6A6860]">
                Market Opportunity
              </span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-light text-[#141716] font-editorial">
              $640 Billion
            </div>
            <p className="text-xs text-[#6A6860] mt-1.5 leading-snug">
              Global Longevity & Preventive Biotech TAM by 2030
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
