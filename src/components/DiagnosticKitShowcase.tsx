import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  Dna,
  Truck,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Droplets,
  Microscope,
  Cpu,
  FileSpreadsheet,
} from "lucide-react";
import { luxuryEase, sectionHeaderVariants } from "../utils/motion";
import { ParallaxImageCard, ParallaxLayer } from "./ParallaxImageCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface DiagnosticKitShowcaseProps {
  onOpenDataRoom: () => void;
  onOpenSimulator: () => void;
}

export const DiagnosticKitShowcase: React.FC<DiagnosticKitShowcaseProps> = ({
  onOpenDataRoom,
  onOpenSimulator,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  const [activeMediaView, setActiveMediaView] = useState<"kit" | "sequencer">("kit");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageColRef.current && textColRef.current) {
        gsap.fromTo(
          imageColRef.current,
          { opacity: 0, x: -40, scale: 0.97 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: imageColRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          textColRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: textColRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      icon: <Droplets className="w-4 h-4 text-emerald-700" />,
      title: "Capillary Micro-Collection",
      desc: "Single-use painless lancet collecting 3 dried blood spots on stabilization matrix cards.",
    },
    {
      icon: <Microscope className="w-4 h-4 text-emerald-700" />,
      title: "CLIA High-Throughput Run",
      desc: "Illumina Infinium MethylationEPIC BeadChip profiling 850,000+ epigenetic CpGs.",
    },
    {
      icon: <Cpu className="w-4 h-4 text-emerald-700" />,
      title: "Algorithmic Clock Deconvolution",
      desc: "DunedinPACE, GrimAge v2, and multi-organ functional decline rates computed.",
    },
    {
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-700" />,
      title: "Precision Longevity Protocol",
      desc: "Full interactive digital dashboard + physician-grade actionable clinical guidance.",
    },
  ];

  return (
    <section ref={sectionRef} id="kit" className="py-20 sm:py-28 border-b border-[#E2E0D8] bg-[#F4F2EB]/80 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Product Image & Interactive Switcher */}
          <div
            ref={imageColRef}
            className="lg:col-span-5 relative space-y-3"
          >
            {/* Media Selector Tabs */}
            <div className="flex items-center justify-between lab-glass px-3.5 py-2 rounded-2xl border border-white/90 shadow-sm lab-reticle-box">
              <span className="text-[11px] font-mono text-[#6A6860] uppercase tracking-wider font-semibold">
                Diagnostic Pipeline
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveMediaView("kit")}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    activeMediaView === "kit"
                      ? "bg-[#141716] text-white shadow-xs"
                      : "text-[#6A6860] hover:text-[#141716] bg-white/70"
                  }`}
                >
                  Collection Kit
                </button>
                <button
                  onClick={() => setActiveMediaView("sequencer")}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    activeMediaView === "sequencer"
                      ? "bg-[#141716] text-white shadow-xs"
                      : "text-[#6A6860] hover:text-[#141716] bg-white/70"
                  }`}
                >
                  NGS Sequencer Lab
                </button>
              </div>
            </div>

            <ParallaxImageCard
              imageSrc={
                activeMediaView === "kit"
                  ? "/src/assets/images/proage_test_kit_1789390734930.jpg"
                  : "/src/assets/images/epigenetic_sequencer_1789393650422.jpg"
              }
              imageAlt={
                activeMediaView === "kit"
                  ? "ProAge Atlas Epigenetic Diagnostic Kit"
                  : "Illumina High-Throughput DNA Methylation Sequencer"
              }
              className="rounded-3xl border border-white/80 bg-[#141716] shadow-xl h-[360px] sm:h-[440px] lab-reticle-box"
              imageClassName="object-cover"
              maxTilt={4.5}
              imageParallaxFactor={2.5}
              glareTone="light"
            >
              {/* Floating Certification Badge with 3D Depth */}
              <ParallaxLayer depth={30} className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-sm flex items-center gap-2 text-xs font-mono text-[#141716]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {activeMediaView === "kit"
                      ? "CLIA & CAP Accredited"
                      : "Illumina EPIC 850k BeadChip"}
                  </span>
                </div>
              </ParallaxLayer>

              {/* Bottom Specs Box with 3D Depth */}
              <ParallaxLayer depth={36} className="absolute bottom-4 inset-x-4">
                <div className="bg-[#141716]/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      {activeMediaView === "kit" ? "Turnaround Speed" : "Technical Reproducibility"}
                    </span>
                    <span className="text-sm font-semibold">
                      {activeMediaView === "kit" ? "12-14 Business Days" : "99.8% Precision Matrix"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      CpG Coverage
                    </span>
                    <span className="text-sm font-semibold text-emerald-300 font-mono">
                      850,000+ Switches
                    </span>
                  </div>
                </div>
              </ParallaxLayer>
            </ParallaxImageCard>
          </div>

          {/* Right: Copy & Steps */}
          <div
            ref={textColRef}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A6860]">
                  Diagnostic Hardware & NGS Laboratory
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono text-emerald-800 font-medium">
                  Laboratory Micro-Collection
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#141716] tracking-tight font-editorial">
                The ProAge Epigenetic Methylome Collection Kit
              </h2>
              <p className="mt-4 text-base text-[#46453E] leading-relaxed">
                Hospital-grade multi-omics delivered directly to your home. Eliminating painful venous blood draws or clinic appointments. Our proprietary micro-fluidic collection card stabilizes intact DNA methylation signatures at ambient temperature across global logistics networks.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className="lab-glass-card rounded-2xl p-4 sm:p-5 border border-white/90 shadow-2xs space-y-2 hover:border-emerald-300 transition-all group lab-reticle-box"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
                      {s.icon}
                    </div>
                    <span className="text-[#141716] font-editorial text-sm font-semibold">
                      {s.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#525048] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Commercial Unit Economics Highlight */}
            <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-900 block font-semibold">
                  Commercial Retail Pricing
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-[#064E3B] font-editorial">$399</span>
                  <span className="text-xs text-[#525048]">per single diagnostic kit</span>
                  <span className="text-xs text-[#6A6860] font-mono">| COGS: $98 (75.4% Margin)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenSimulator}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#141716] text-white hover:bg-[#252827] transition-all"
                >
                  Test Sample Profile
                </button>
                <button
                  onClick={onOpenDataRoom}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#141716] bg-white border border-[#E2E0D8] hover:bg-[#F2EFE8] transition-all"
                >
                  CLIA Lab Specs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
