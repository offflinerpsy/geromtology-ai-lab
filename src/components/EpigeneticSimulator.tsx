import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  Sparkles,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { EpigeneticSimulationInput } from "../types";
import { calculateEpigeneticProfile } from "../utils/epigeneticCalculator";
import { PRESET_SIMULATION_PROFILES } from "../data/proageData";
import { luxuryEase, sectionHeaderVariants } from "../utils/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EpigeneticSimulatorProps {
  onOpenCopilotWithProfile: (summary: string) => void;
  onOpenDataRoom: () => void;
}

export const EpigeneticSimulator: React.FC<EpigeneticSimulatorProps> = ({
  onOpenCopilotWithProfile,
  onOpenDataRoom,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<EpigeneticSimulationInput>({
    chronologicalAge: 46,
    grimAgeIndex: 0.96,
    hsCrp: 0.6,
    fastingInsulin: 4.2,
    vo2Max: 44,
    deepSleepPercent: 19,
    telomereRatio: 1.08,
  });

  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftColRef.current && rightColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          rightColRef.current,
          { opacity: 0, x: 30, scale: 0.98 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rightColRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const results = useMemo(() => calculateEpigeneticProfile(inputs), [inputs]);

  const handleSliderChange = (key: keyof EpigeneticSimulationInput, value: number) => {
    setActivePreset(null);
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESET_SIMULATION_PROFILES.find((p) => p.id === presetId);
    if (preset) {
      setActivePreset(presetId);
      setInputs(preset.values);
    }
  };

  const resetToBaseline = () => {
    setActivePreset(null);
    setInputs({
      chronologicalAge: 45,
      grimAgeIndex: 1.0,
      hsCrp: 1.0,
      fastingInsulin: 6.0,
      vo2Max: 36,
      deepSleepPercent: 15,
      telomereRatio: 1.0,
    });
  };

  // Generate copilot prompt summary
  const handleConsultCopilot = () => {
    const summary = `Мой расчет ProAge Atlas: Календарный возраст ${inputs.chronologicalAge} лет. Рассчитанный биологический возраст: ${results.biologicalAge} лет (дельта ${results.ageDelta > 0 ? "+" : ""}${results.ageDelta} лет). Темп старения DunedinPACE: ${results.dunedinPace} года в год. Показатели: GrimAge индекс ${inputs.grimAgeIndex}, hs-CRP ${inputs.hsCrp} мг/л, инсулин ${inputs.fastingInsulin} мкМЕ/мл, VO2 max ${inputs.vo2Max} мл/кг/мин, глубокий сон ${inputs.deepSleepPercent}%. Главный фактор риска: ${results.primaryRiskFactor}. Какие клинические протоколы мне начать в первую очередь?`;
    onOpenCopilotWithProfile(summary);
  };

  const isYounger = results.ageDelta < 0;

  return (
    <section ref={sectionRef} id="simulator" className="py-20 sm:py-28 border-b border-[#E2E0D8] bg-[#F4F2EB]/80 relative">
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
              Epigenetic Clock Calibration
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono text-emerald-800 font-medium">
              DunedinPACE & GrimAge v2
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light text-[#141716] tracking-tight font-editorial">
            Epigenetic Biological Age Simulator
          </h2>
          <p className="mt-4 text-base text-[#46453E] leading-relaxed">
            Calibrate multi-omic biomarkers to observe instantaneous shifts in DNA methylation age,
            cellular decay velocity (DunedinPACE), and projected disease-free healthspan extension.
          </p>
        </motion.div>

        {/* Presets Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 lab-glass p-3.5 rounded-2xl border border-white/90 shadow-sm lab-reticle-box">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#7A7870] flex items-center gap-1.5 mr-1">
              <Sliders className="w-3.5 h-3.5" /> Clinical Presets:
            </span>
            {PRESET_SIMULATION_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activePreset === p.id
                    ? "bg-[#141716] text-white shadow-xs"
                    : "bg-[#FAF9F5] text-[#141716] hover:bg-[#ECE8DE] border border-[#E2E0D8]"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <button
            onClick={resetToBaseline}
            className="inline-flex items-center gap-1.5 text-xs text-[#6A6860] hover:text-[#141716] px-2.5 py-1 rounded hover:bg-[#FAF9F5] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to 50th Percentile</span>
          </button>
        </div>

        {/* 2-Column Interactive Workspace: Left Sliders, Right Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Biomarker Sliders Column */}
          <div ref={leftColRef} className="lg:col-span-7 lab-glass-card rounded-3xl p-6 sm:p-8 border border-white/90 shadow-md space-y-6 lab-reticle-box">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#141716] font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700" />
                Laboratory Biomarker Inputs
              </h3>
              <span className="text-xs text-emerald-700 font-mono font-medium">
                Real-Time Bio-Algorithmic Coupling
              </span>
            </div>

            {/* Slider 1: Chronological Age */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-[#141716]">
                  Chronological Calendar Age
                </label>
                <span className="font-mono font-bold text-sm text-[#141716]">
                  {inputs.chronologicalAge} <span className="text-xs font-normal text-[#6A6860]">years</span>
                </span>
              </div>
              <input
                type="range"
                min={25}
                max={80}
                step={1}
                value={inputs.chronologicalAge}
                onChange={(e) => handleSliderChange("chronologicalAge", Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-[#FAF9F5] rounded-lg cursor-pointer border border-[#E2E0D8]"
              />
              <div className="flex justify-between text-[10px] text-[#7A7870] font-mono">
                <span>25 yrs</span>
                <span>Baseline chronological timeline</span>
                <span>80 yrs</span>
              </div>
            </div>

            {/* Slider 2: GrimAge Index */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <label className="font-medium text-[#141716]">
                    DNAm GrimAge Methylation Score
                  </label>
                  <span className="text-[10px] text-[#7A7870] block">
                    Epigenetic CpG surrogate mortality index (1.0 = population median)
                  </span>
                </div>
                <span className="font-mono font-bold text-sm text-emerald-800">
                  {inputs.grimAgeIndex.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.7}
                max={1.3}
                step={0.01}
                value={inputs.grimAgeIndex}
                onChange={(e) => handleSliderChange("grimAgeIndex", Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-[#FAF9F5] rounded-lg cursor-pointer border border-[#E2E0D8]"
              />
              <div className="flex justify-between text-[10px] text-[#7A7870] font-mono">
                <span className="text-emerald-700">0.70 (Elite Super-Ager)</span>
                <span>1.00 Normative</span>
                <span className="text-amber-700">1.30 (Accelerated)</span>
              </div>
            </div>

            {/* Slider 3: hs-CRP */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <label className="font-medium text-[#141716]">
                    High-Sensitivity CRP (hs-CRP)
                  </label>
                  <span className="text-[10px] text-[#7A7870] block">
                    Systemic vascular and cellular micro-inflammation
                  </span>
                </div>
                <span className="font-mono font-bold text-sm text-[#141716]">
                  {inputs.hsCrp.toFixed(1)} <span className="text-xs font-normal text-[#6A6860]">mg/L</span>
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={5.0}
                step={0.1}
                value={inputs.hsCrp}
                onChange={(e) => handleSliderChange("hsCrp", Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-[#FAF9F5] rounded-lg cursor-pointer border border-[#E2E0D8]"
              />
              <div className="flex justify-between text-[10px] text-[#7A7870] font-mono">
                <span className="text-emerald-700">&lt; 0.5 (Optimal)</span>
                <span>1.0 Average</span>
                <span className="text-amber-700">&gt; 3.0 (High Risk)</span>
              </div>
            </div>

            {/* Slider 4: Fasting Insulin */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <label className="font-medium text-[#141716]">
                    Fasting Insulin
                  </label>
                  <span className="text-[10px] text-[#7A7870] block">
                    Nutrient sensing & autophagy inhibition threshold
                  </span>
                </div>
                <span className="font-mono font-bold text-sm text-[#141716]">
                  {inputs.fastingInsulin.toFixed(1)} <span className="text-xs font-normal text-[#6A6860]">μIU/mL</span>
                </span>
              </div>
              <input
                type="range"
                min={1.5}
                max={20.0}
                step={0.5}
                value={inputs.fastingInsulin}
                onChange={(e) => handleSliderChange("fastingInsulin", Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-[#FAF9F5] rounded-lg cursor-pointer border border-[#E2E0D8]"
              />
              <div className="flex justify-between text-[10px] text-[#7A7870] font-mono">
                <span className="text-emerald-700">2.0 – 4.5 (Peak Longevity)</span>
                <span>8.0 Normative</span>
                <span className="text-amber-700">&gt; 12.0 (Resistance)</span>
              </div>
            </div>

            {/* Slider 5: VO2 Max */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <label className="font-medium text-[#141716]">
                    VO2 Max (Cardiorespiratory Peak)
                  </label>
                  <span className="text-[10px] text-[#7A7870] block">
                    Mitochondrial cristae density and oxygen delivery capacity
                  </span>
                </div>
                <span className="font-mono font-bold text-sm text-[#141716]">
                  {inputs.vo2Max} <span className="text-xs font-normal text-[#6A6860]">mL/kg/min</span>
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={65}
                step={1}
                value={inputs.vo2Max}
                onChange={(e) => handleSliderChange("vo2Max", Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-[#FAF9F5] rounded-lg cursor-pointer border border-[#E2E0D8]"
              />
              <div className="flex justify-between text-[10px] text-[#7A7870] font-mono">
                <span className="text-amber-700">25 (Sedentary)</span>
                <span>38 Average</span>
                <span className="text-emerald-700">&gt; 50 (Top Decile)</span>
              </div>
            </div>

            {/* Two-Column Mini Sliders: Deep Sleep & Telomere */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E2E0D8]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#141716]">Deep Sleep (N3)</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {inputs.deepSleepPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={30}
                  step={1}
                  value={inputs.deepSleepPercent}
                  onChange={(e) => handleSliderChange("deepSleepPercent", Number(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 bg-white rounded cursor-pointer"
                />
                <span className="text-[10px] text-[#7A7870] block">
                  Glymphatic toxin flush: {inputs.deepSleepPercent >= 18 ? "Optimal" : "Suboptimal"}
                </span>
              </div>

              <div className="space-y-2 bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E2E0D8]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#141716]">Telomere T/S Ratio</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {inputs.telomereRatio.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.6}
                  max={1.5}
                  step={0.05}
                  value={inputs.telomereRatio}
                  onChange={(e) => handleSliderChange("telomereRatio", Number(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 bg-white rounded cursor-pointer"
                />
                <span className="text-[10px] text-[#7A7870] block">
                  Replicative buffer capacity: {inputs.telomereRatio > 1.1 ? "Protected" : "Average"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Biological Age Output Dashboard */}
          <div ref={rightColRef} className="lg:col-span-5 space-y-6">
            {/* Primary Biological Age Card */}
            <div className="lab-glass-dark rounded-3xl p-6 sm:p-8 text-white border border-white/20 shadow-2xl relative overflow-hidden lab-reticle-box specular-shine">
              <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10">
                <Activity className="w-32 h-32 text-emerald-400" />
              </div>

              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                  Computed Biological Age
                </span>
                <span
                  className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                    results.tier === "Super-Ager"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                      : results.tier === "Optimized"
                      ? "bg-emerald-900/40 text-emerald-200 border-emerald-500/30"
                      : "bg-gray-800 text-gray-300 border-gray-700"
                  }`}
                >
                  {results.tier} Phenotype
                </span>
              </div>

              {/* Big Numbers */}
              <div className="flex items-baseline gap-3 my-2">
                <span className="text-5xl sm:text-6xl font-light font-editorial text-white tracking-tight">
                  {results.biologicalAge}
                </span>
                <span className="text-lg text-gray-400 font-light">years old</span>

                <div
                  className={`ml-auto flex items-center gap-1 text-sm font-mono font-bold px-3 py-1 rounded-lg ${
                    isYounger
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  }`}
                >
                  {isYounger ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span>
                    {results.ageDelta > 0 ? "+" : ""}
                    {results.ageDelta} yrs
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-300 mt-2">
                Chronological Age: <strong className="text-white">{inputs.chronologicalAge} yrs</strong>.{" "}
                {isYounger ? (
                  <span className="text-emerald-300 font-medium">
                    You are functioning {Math.abs(results.ageDelta)} years younger than your calendar age.
                  </span>
                ) : (
                  <span className="text-amber-300 font-medium">
                    Epigenetic methylation indicates accelerated cellular aging.
                  </span>
                )}
              </p>

              {/* DunedinPACE Speedometer Gauge */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    DunedinPACE Pace of Aging:
                  </span>
                  <span className="text-emerald-300 text-base font-bold">
                    {results.dunedinPace} <span className="text-xs text-gray-400 font-normal">yr/cal yr</span>
                  </span>
                </div>

                {/* Progress bar visualizer */}
                <div className="relative h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(10, ((results.dunedinPace - 0.6) / 0.8) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span className="text-emerald-400">0.70 (Slow Aging)</span>
                  <span className="text-gray-300">1.00 (Normative)</span>
                  <span className="text-amber-400">1.30 (Accelerated)</span>
                </div>
              </div>

              {/* Key Healthspan Yield Ticker */}
              <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                    Healthspan Gain
                  </span>
                  <div className="text-xl font-light text-emerald-300 font-editorial mt-0.5">
                    +{results.healthspanExtensionYears} Years
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Disease-free vitality</span>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                    ProAge Longevity Index
                  </span>
                  <div className="text-xl font-light text-white font-editorial mt-0.5">
                    {results.overallScore} / 100
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Multi-omic composite</span>
                </div>
              </div>
            </div>

            {/* Actionable Tailored Plan Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E0D8] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#141716] font-mono">
                  Targeted Protocol Interventions
                </h4>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#7A7870] uppercase block">
                  Primary Rate-Limiting Factor:
                </span>
                <div className="text-sm font-medium text-[#141716] mt-0.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{results.primaryRiskFactor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#7A7870] uppercase block">
                  Clinically Indicated Steps:
                </span>
                <ul className="space-y-1.5 text-xs text-[#525048]">
                  {results.topActionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleConsultCopilot}
                className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-50 text-[#064E3B] hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2 group"
              >
                <Bot className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                <span>Ask Gemini Copilot to Analyze My Results</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
