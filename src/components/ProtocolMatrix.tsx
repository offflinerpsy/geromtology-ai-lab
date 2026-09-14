import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Plus,
  Check,
  FlaskConical,
  Flame,
  Clock,
  Moon,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { INTERVENTION_PROTOCOLS } from "../data/proageData";
import { InterventionCategory, InterventionProtocol } from "../types";
import { luxuryEase, sectionHeaderVariants } from "../utils/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProtocolMatrixProps {
  onOpenCopilotWithProtocol: (protocolTitle: string) => void;
}

export const ProtocolMatrix: React.FC<ProtocolMatrixProps> = ({
  onOpenCopilotWithProtocol,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<InterventionCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProtocolIds, setSavedProtocolIds] = useState<string[]>([
    "proto-nmn-nad",
    "proto-zone2-biogenesis",
  ]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory, searchQuery]);

  const toggleProtocol = (id: string) => {
    setSavedProtocolIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filteredProtocols = INTERVENTION_PROTOCOLS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mechanism.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.targetBiomarkers.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: InterventionProtocol["category"]) => {
    switch (cat) {
      case "molecular":
        return <FlaskConical className="w-3.5 h-3.5" />;
      case "hormetic":
        return <Flame className="w-3.5 h-3.5" />;
      case "metabolic":
        return <Clock className="w-3.5 h-3.5" />;
      case "sleep-neuro":
        return <Moon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section ref={sectionRef} id="protocols" className="py-20 sm:py-28 border-b border-[#E2E0D8] bg-[#FAF9F5]/70 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionHeaderVariants}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A6860]">
              Targeted Longevity Therapeutics
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono text-emerald-800 font-medium">
              Evidence-Based Human RCTs
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light text-[#141716] tracking-tight font-editorial">
            Clinical Longevity Protocols
          </h2>
          <p className="mt-4 text-base text-[#46453E] leading-relaxed">
            Every therapeutic vector is benchmarked against human multi-omic trials. We filter out unverified longevity trends and curate only protocols demonstrating quantifiable shifts in biological age clocks and functional biomarker panels.
          </p>
        </motion.div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E2E0D8]">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Interventions" },
              { id: "molecular", label: "Molecular & Peptides" },
              { id: "hormetic", label: "Hormetic & Thermal" },
              { id: "metabolic", label: "Metabolic Chronobiology" },
              { id: "sleep-neuro", label: "Sleep & Neuro-Glymphatic" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as InterventionCategory)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === tab.id
                    ? "bg-[#141716] text-[#FAF9F5] shadow-xs"
                    : "bg-white/80 text-[#525048] hover:bg-white border border-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Active Protocol Counter */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#7A7870] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search biomarkers, molecules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white/90 backdrop-blur-md border border-white text-[#141716] placeholder-[#8A8880] focus:outline-emerald-600 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 border border-emerald-200/80 text-xs font-mono text-[#064E3B] shadow-2xs">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                <strong>{savedProtocolIds.length}</strong> Selected
              </span>
            </div>
          </div>
        </div>

        {/* Protocols Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProtocols.map((protocol) => {
              const isSaved = savedProtocolIds.includes(protocol.id);
              return (
                <motion.div
                  key={protocol.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: luxuryEase }}
                  className={`lab-glass-card rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between shadow-xs group lab-reticle-box ${
                    isSaved ? "border-emerald-500/90 ring-1 ring-emerald-400/40 bg-white/90" : "hover:border-emerald-300"
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200">
                        {getCategoryIcon(protocol.category)}
                        <span className="capitalize">{protocol.category}</span>
                      </span>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {protocol.evidenceTier}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-[#141716] font-editorial leading-snug group-hover:text-emerald-900 transition-colors">
                      {protocol.title}
                    </h3>

                    {/* Target Biomarkers */}
                    <div className="flex flex-wrap gap-1.5 my-3">
                      {protocol.targetBiomarkers.map((bm, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F4F2EB] text-[#525048] border border-[#E2E0D8]"
                        >
                          {bm}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-[#525048] leading-relaxed mt-2 line-clamp-3">
                      {protocol.mechanism}
                    </p>

                    {/* Regimen Dosage */}
                    <div className="mt-4 p-3 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[#7A7870] block">
                        Clinical Dosage & Cadence:
                      </span>
                      <span className="text-xs font-medium text-[#141716] block leading-snug">
                        {protocol.dosageSchedule}
                      </span>
                    </div>

                    {/* Age Reversal Metric */}
                    <div className="mt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#6A6860]">Observed Impact:</span>
                      <span className="text-emerald-700 font-bold">
                        {protocol.ageReversalImpact}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleProtocol(protocol.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSaved
                          ? "bg-emerald-600 text-white"
                          : "bg-[#F4F2EB] text-[#141716] hover:bg-[#ECE8DE]"
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>In My Protocol</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Protocol</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        onOpenCopilotWithProtocol(
                          `Расскажи подробно про клинический протокол "${protocol.title}". Какие исследования подтверждают его эффективность и есть ли противопоказания?`
                        )
                      }
                      className="p-1.5 text-[#6A6860] hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Ask AI Copilot about this protocol"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
