import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dna,
  ShieldAlert,
  Zap,
  Activity,
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Info,
  Network,
  LayoutGrid,
} from "lucide-react";
import { LONGEVITY_PILLARS } from "../data/proageData";
import { LongevityPillarId } from "../types";
import {
  luxuryEase,
  sectionHeaderVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "../utils/motion";
import { ParallaxImageCard, ParallaxLayer } from "./ParallaxImageCard";
import { InteractiveSystemsMap } from "./InteractiveSystemsMap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SystemsAtlasProps {
  onSelectBiomarkerForSimulation: (code: string) => void;
  onOpenCopilotWithTopic: (topic: string) => void;
}

export const SystemsAtlas: React.FC<SystemsAtlasProps> = ({
  onSelectBiomarkerForSimulation,
  onOpenCopilotWithTopic,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<LongevityPillarId>("epigenetics");
  const [atlasMode, setAtlasMode] = useState<"network" | "dossier">("network");
  const [activeMediaTab, setActiveMediaTab] = useState<"confocal" | "mitochondrial">("confocal");

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (ribbonRef.current) {
        gsap.fromTo(
          ribbonRef.current.children,
          { opacity: 0, y: 25, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ribbonRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [atlasMode]);

  const currentPillar =
    LONGEVITY_PILLARS.find((p) => p.id === selectedPillarId) || LONGEVITY_PILLARS[0];

  const getPillarIcon = (id: LongevityPillarId) => {
    switch (id) {
      case "epigenetics":
        return <Dna className="w-5 h-5" />;
      case "senescence":
        return <ShieldAlert className="w-5 h-5" />;
      case "mitochondria":
        return <Zap className="w-5 h-5" />;
      case "metabolic":
        return <Activity className="w-5 h-5" />;
      case "vascular":
        return <HeartPulse className="w-5 h-5" />;
      case "immune":
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <section ref={sectionRef} id="systems" className="py-20 sm:py-28 border-b border-[#E2E0D8] bg-[#FAF9F5]/70 relative">
      {/* Precision Corner Reticles for High-End Lab HUD */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        {/* Header with Mode Switcher */}
        <div ref={headerRef} className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A6860]">
                Biological Operating Systems
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono text-emerald-800 font-medium">
                Multi-Omic Network Architecture
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-[#141716] tracking-tight font-editorial">
              The Multi-Omic Longevity Atlas
            </h2>
            <p className="mt-3 text-base text-[#46453E] leading-relaxed">
              Aging is an interconnected biological network across six operating systems. Explore the molecular topology to examine targeted diagnostic panels, hallmarks of cellular decay, and cross-system cascades.
            </p>
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1 rounded-2xl border border-white shadow-xs">
            <button
              onClick={() => setAtlasMode("network")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                atlasMode === "network"
                  ? "bg-[#141716] text-[#FAF9F5] shadow-xs"
                  : "text-[#525048] hover:text-[#141716]"
              }`}
            >
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Map</span>
            </button>
            <button
              onClick={() => setAtlasMode("dossier")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                atlasMode === "dossier"
                  ? "bg-[#141716] text-[#FAF9F5] shadow-xs"
                  : "text-[#525048] hover:text-[#141716]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clinical Dossier</span>
            </button>
          </div>
        </div>

        {/* Dynamic View: D3 Interactive Systems Map or Tabbed Clinical Dossier */}
        {atlasMode === "network" ? (
          <InteractiveSystemsMap
            selectedPillarId={selectedPillarId}
            onSelectPillar={(id) => setSelectedPillarId(id)}
            onOpenCopilotWithTopic={onOpenCopilotWithTopic}
            onSelectBiomarkerForSimulation={onSelectBiomarkerForSimulation}
          />
        ) : (
          <div>
            {/* 6 Pillars Interactive Navigation Ribbon */}
            <div ref={ribbonRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-10">
              {LONGEVITY_PILLARS.map((pillar) => {
                const isSelected = pillar.id === selectedPillarId;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setSelectedPillarId(pillar.id)}
                    className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between relative lab-reticle-box ${
                      isSelected
                        ? "bg-[#141716] text-[#FAF9F5] border-[#141716] shadow-lg scale-[1.02]"
                        : "lab-glass-card text-[#141716] hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-white/10 text-emerald-300" : "bg-white text-emerald-700 shadow-2xs"
                        }`}
                      >
                        {getPillarIcon(pillar.id)}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-emerald-900/60 text-emerald-300"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {pillar.clinicalPriority}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold tracking-tight font-editorial leading-snug">
                        {pillar.title}
                      </h3>
                      <p
                        className={`text-[10px] mt-1 line-clamp-1 ${
                          isSelected ? "text-gray-300" : "text-[#6A6860]"
                        }`}
                      >
                        {pillar.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Deep-Dive Dynamic Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPillar.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: luxuryEase }}
                className="lab-glass rounded-3xl p-6 sm:p-10 border border-white/80 shadow-lg lab-reticle-box"
              >
                {/* Header of Active Pillar */}
                <div className="flex flex-wrap items-start justify-between gap-6 pb-8 border-b border-[#E2E0D8]">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#E2E0D8] text-[#141716] text-xs font-mono mb-3 shadow-2xs">
                      <span className="text-emerald-700 font-semibold">{currentPillar.hallmark}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-normal text-[#141716] font-editorial">
                      {currentPillar.title} — {currentPillar.subtitle}
                    </h3>
                    <p className="text-sm sm:text-base text-[#525048] mt-3 leading-relaxed">
                      {currentPillar.description}
                    </p>
                  </div>

                  <div className="lab-glass-card rounded-2xl p-5 border border-white min-w-[240px] shadow-sm lab-reticle-box">
                    <span className="text-[11px] font-mono text-[#6A6860] uppercase tracking-wider block">
                      Verified Reversal Potential
                    </span>
                    <div className="text-2xl font-light text-[#064E3B] font-editorial mt-1">
                      {currentPillar.reversalPotential}
                    </div>
                    <p className="text-xs text-[#6A6860] mt-1.5">
                      Multi-omic reduction observed over 12 months with targeted protocols.
                    </p>
                    <button
                      onClick={() =>
                        onOpenCopilotWithTopic(
                          `Расскажи подробнее про биологическую систему: ${currentPillar.title}. Как диагностировать и какие интервенции доказаны клинически?`
                        )
                      }
                      className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#141716] text-white hover:bg-[#252827] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Ask AI About This Pillar
                    </button>
                  </div>
                </div>

                {/* Pillar Content: Biomarker Grid + Cellular Image Showcase */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Key Biomarkers Table */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-[#141716] font-mono">
                        Diagnostic Multi-Omic Panel ({currentPillar.keyBiomarkers.length} Key Markers)
                      </h4>
                      <span className="text-xs text-[#6A6860] font-mono">
                        Benchmarked vs 12,000+ Patient Cohort
                      </span>
                    </div>

                    <div className="space-y-3">
                      {currentPillar.keyBiomarkers.map((bm, idx) => (
                        <div
                          key={idx}
                          className="lab-glass-card rounded-2xl p-4 sm:p-5 border border-white/90 hover:border-emerald-300 transition-all shadow-xs group lab-reticle-box"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                                {bm.code}
                              </span>
                              <span className="text-sm font-semibold text-[#141716] group-hover:text-emerald-800 transition-colors">
                                {bm.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200">
                                Optimal: <strong className="font-semibold">{bm.optimalRange}</strong> {bm.unit}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#525048] mt-3 pt-3 border-t border-gray-100">
                            <div>
                              <span className="text-[#7A7870] block text-[11px] font-mono">
                                Aging Mechanism:
                              </span>
                              <span className="leading-snug">{bm.agingImpact}</span>
                            </div>
                            <div>
                              <span className="text-[#7A7870] block text-[11px] font-mono">
                                Targeted Interventions:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {bm.interventions.map((int, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded text-[10px] bg-white border border-[#E2E0D8] text-[#141716]"
                                  >
                                    {int}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Visual System Render & Clinical Synthesis */}
                  <div className="lg:col-span-4 lab-glass-card rounded-2xl p-5 border border-white space-y-4 shadow-xs lab-reticle-box">
                    {/* Media Tabs Switcher */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2E0D8]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A6860] font-semibold">
                        Microscopy & Imaging
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setActiveMediaTab("confocal")}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                            activeMediaTab === "confocal"
                              ? "bg-[#141716] text-white"
                              : "text-[#6A6860] hover:text-[#141716] bg-[#F4F2EB]"
                          }`}
                        >
                          Confocal
                        </button>
                        <button
                          onClick={() => setActiveMediaTab("mitochondrial")}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                            activeMediaTab === "mitochondrial"
                              ? "bg-[#141716] text-white"
                              : "text-[#6A6860] hover:text-[#141716] bg-[#F4F2EB]"
                          }`}
                        >
                          Mito-Core
                        </button>
                      </div>
                    </div>

                    <ParallaxImageCard
                      imageSrc={
                        activeMediaTab === "confocal"
                          ? "/src/assets/images/cellular_longevity_1789393663268.jpg"
                          : "/src/assets/images/mitochondrial_core_1789390669618.jpg"
                      }
                      imageAlt={
                        activeMediaTab === "confocal"
                          ? "Confocal laser scanning microscopy of chromatin DNA repair"
                          : "Cellular and Mitochondrial Bioenergetics"
                      }
                      className="rounded-xl border border-white/40 h-48 bg-[#141716]"
                      imageClassName="object-cover"
                      maxTilt={4.5}
                      imageParallaxFactor={3}
                      glareTone="dark"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      <ParallaxLayer depth={26} className="absolute bottom-2.5 left-2.5 right-2.5">
                        <div className="bg-[#141716]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center justify-between shadow-sm">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {activeMediaTab === "confocal"
                              ? "Chromatin Repair Optical Track"
                              : "Mitochondrial Bioenergetics"}
                          </span>
                          <span className="text-gray-400 text-[9px]">400x Mag</span>
                        </div>
                      </ParallaxLayer>
                    </ParallaxImageCard>

                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-[#141716] font-mono">
                        System Interconnectivity
                      </h5>
                      <p className="text-xs text-[#525048] leading-relaxed">
                        Modulation of <strong>{currentPillar.title}</strong> directly alters chromatin methylation patterns. Clearing senescent burden or restoring NAD+ pools drives CpG methylation clocks back toward juvenile baseline.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#6A6860]">
                        <span>Standard Population Risk:</span>
                        <span className="font-mono text-amber-800 font-medium">Elevated past age 38</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#6A6860]">
                        <span>ProAge Clinical Protocol:</span>
                        <span className="font-mono text-emerald-700 font-medium">Reversal validated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
