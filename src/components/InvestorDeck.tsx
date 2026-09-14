import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Lock,
  TrendingUp,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Users,
  FileCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { MARKET_DATA, UNIT_ECONOMICS, SERIES_A_TERMS } from "../data/proageData";
import { luxuryEase, sectionHeaderVariants } from "../utils/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface InvestorDeckProps {
  onOpenDataRoom: () => void;
}

export const InvestorDeck: React.FC<InvestorDeckProps> = ({ onOpenDataRoom }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const marketBoxRef = useRef<HTMLDivElement>(null);
  const metricsGridRef = useRef<HTMLDivElement>(null);

  const [selectedMarketTier, setSelectedMarketTier] = useState<"TAM" | "SAM" | "SOM">("TAM");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (marketBoxRef.current) {
        gsap.fromTo(
          marketBoxRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: marketBoxRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (metricsGridRef.current) {
        gsap.fromTo(
          metricsGridRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: metricsGridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentMarket =
    MARKET_DATA.find((m) => m.tier === selectedMarketTier) || MARKET_DATA[0];

  return (
    <section ref={sectionRef} id="investors" className="py-20 sm:py-28 border-b border-[#E2E0D8] bg-[#FAF9F5]/70 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionHeaderVariants}
          className="max-w-3xl mb-14"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A6860]">
              Institutional Capital Syndicate
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono text-emerald-800 font-medium">
              Series A Financing ($24M)
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light text-[#141716] tracking-tight font-editorial">
            The Longevity Biotechnology Thesis
          </h2>
          <p className="mt-4 text-base text-[#46453E] leading-relaxed">
            By transforming biological aging from an unmeasurable decay curve into a quantifiable,
            treatable software-driven metric, ProAge Atlas captures high-margin recurring revenues
            across the global longevity transition.
          </p>
        </motion.div>

        {/* 1. Market Opportunity: TAM / SAM / SOM Concentric Dynamic Architecture */}
        <div ref={marketBoxRef} className="lab-glass rounded-3xl p-6 sm:p-10 border border-white/90 shadow-sm mb-12 lab-reticle-box">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2E0D8]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#6A6860] block">
                Total Addressable Opportunity
              </span>
              <h3 className="text-2xl font-light text-[#141716] font-editorial mt-1">
                Global Longevity Market Sizing
              </h3>
            </div>

            {/* Segment Toggle */}
            <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-2xl border border-white shadow-2xs">
              {(["TAM", "SAM", "SOM"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedMarketTier(tier)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedMarketTier === tier
                      ? "bg-[#141716] text-[#FAF9F5] shadow-xs"
                      : "text-[#525048] hover:text-[#141716]"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Value Callout */}
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 font-mono text-xs font-semibold">
                {currentMarket.tier} Segment Analysis
              </div>
              <div className="text-4xl sm:text-5xl font-light text-[#064E3B] font-editorial tracking-tight">
                {currentMarket.figure}
              </div>
              <div className="text-sm font-mono text-emerald-800 font-medium">
                Compound Annual Growth: {currentMarket.cagr}
              </div>
              <p className="text-sm text-[#525048] leading-relaxed pt-2">
                {currentMarket.description}
              </p>
            </div>

            {/* Catalysts List */}
            <div className="lg:col-span-7 lab-glass-card rounded-2xl p-6 border border-white/90 space-y-3 shadow-2xs lab-reticle-box">
              <span className="text-xs font-mono uppercase tracking-wider text-[#141716] block font-semibold">
                Structural Industry Growth Drivers:
              </span>
              <div className="space-y-2.5">
                {currentMarket.keyDrivers.map((driver, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#525048]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="leading-snug">{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Elite Unit Economics Metrics Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141716] font-mono">
              B2C / B2B SaaS Unit Economics
            </h3>
            <span className="text-xs text-emerald-700 font-mono font-medium">
              Top Decile Biotech Efficiency
            </span>
          </div>

          <div ref={metricsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {UNIT_ECONOMICS.map((metric, idx) => (
              <div
                key={idx}
                className="lab-glass-card rounded-2xl p-5 sm:p-6 border border-white/90 shadow-2xs space-y-2 lab-reticle-box"
              >
                <span className="text-xs text-[#6A6860] font-mono block">
                  {metric.label}
                </span>
                <div className="text-3xl font-light text-[#141716] font-editorial">
                  {metric.value}
                </div>
                <p className="text-xs text-[#525048] leading-snug">{metric.subtext}</p>
                <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{metric.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Series A Syndicate Allocation & Use of Proceeds */}
        <div className="lab-glass-dark text-white rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl space-y-8 lab-reticle-box specular-shine">
          <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-mono mb-2">
                Active Financing Syndicate
              </div>
              <h3 className="text-2xl sm:text-3xl font-light font-editorial text-white">
                Series A Preferred Equity Round
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                $14M of $24M allocated by Tier-1 Biotech Longevity Lead Fund. $10M remaining
                available for accredited institutional and strategic co-investors.
              </p>
            </div>

            <button
              onClick={onOpenDataRoom}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold bg-emerald-500 text-emerald-950 hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-md"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Enter Confidential Data Room</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-gray-400 block text-[10px] uppercase">Target Round Size</span>
              <span className="text-xl font-bold text-white block mt-1">
                {SERIES_A_TERMS.roundSize}
              </span>
              <span className="text-[10px] text-emerald-400 mt-1 block">Lead: $14M Allocated</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-gray-400 block text-[10px] uppercase">Post-Money Valuation</span>
              <span className="text-xl font-bold text-white block mt-1">
                {SERIES_A_TERMS.postMoneyValuation}
              </span>
              <span className="text-[10px] text-gray-400 mt-1 block">Pre: $71M</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-gray-400 block text-[10px] uppercase">Security Type</span>
              <span className="text-sm font-semibold text-white block mt-1">
                Series A Preferred
              </span>
              <span className="text-[10px] text-gray-400 mt-1 block">1x Non-Participating</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-gray-400 block text-[10px] uppercase">Open Allocation</span>
              <span className="text-xl font-bold text-emerald-300 block mt-1">
                {SERIES_A_TERMS.availableSyndicateAllocation}
              </span>
              <span className="text-[10px] text-emerald-400 mt-1 block">Closing Q4 2026</span>
            </div>
          </div>

          {/* Use of Proceeds Distribution Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-gray-300">
              <span>Capital Deployment Breakdown ($24M):</span>
              <span className="text-emerald-400">Audited Milestone Plan</span>
            </div>

            <div className="h-3 rounded-full bg-gray-800 overflow-hidden flex">
              {SERIES_A_TERMS.useOfProceeds.map((item, idx) => (
                <div
                  key={idx}
                  style={{ width: `${item.share}%`, backgroundColor: item.color }}
                  title={`${item.title}: ${item.share}% (${item.amount})`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {SERIES_A_TERMS.useOfProceeds.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="text-white font-medium block leading-snug">{item.title}</span>
                    <span className="text-[11px] font-mono text-gray-400">
                      {item.share}% • {item.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
