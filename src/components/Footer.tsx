import React from "react";
import { Dna, ShieldCheck, ArrowUp, Lock, Bot } from "lucide-react";

interface FooterProps {
  onOpenDataRoom: () => void;
  onOpenCopilot: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDataRoom, onOpenCopilot }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#141716] text-[#FAF9F5] pt-16 pb-12 border-t border-[#2A2E2C]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Thesis */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#10B981] flex items-center justify-center text-white">
                <Dna className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-lg font-bold font-editorial tracking-tight text-white">
                ProAge Atlas
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                CLINICAL GRADE
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              The multi-omic longevity intelligence platform. Measuring 850,000+ epigenetic CpG sites,
              mitochondrial bioenergetics, and senescent cell burden to quantify biological aging pace
              and deploy verified reversal protocols.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-emerald-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> CLIA / CAP Sequencing
              </span>
              <span>•</span>
              <span>Series A Syndicate ($24M)</span>
            </div>
          </div>

          {/* Col 2: Navigation Pillars */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Biological Systems
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <a href="#systems" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                  Epigenetic Methylome (GrimAge & Horvath)
                </a>
              </li>
              <li>
                <a href="#systems" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                  Cellular Senescence (SASP Clearance)
                </a>
              </li>
              <li>
                <a href="#systems" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                  Mitochondrial Dynamics & NAD+ Flux
                </a>
              </li>
              <li>
                <a href="#systems" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                  Metabolic mTOR & Autophagy
                </a>
              </li>
              <li>
                <a href="#systems" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                  Arterial & Vascular Elasticity
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Actions */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Clinical & Investor Access
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={onOpenCopilot}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5" />
                  Launch Gemini Longevity Copilot
                </span>
                <span className="text-[10px] font-mono">Voice & Text</span>
              </button>

              <button
                onClick={onOpenDataRoom}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Series A Pitch & Data Room ($24M)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Accredited</span>
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-gray-500">
          <p className="max-w-2xl leading-relaxed">
            <strong>Investigational & Educational Biotechnology Disclaimer:</strong> ProAge Atlas
            algorithms and multi-omic epigenetic reports are designed for functional healthspan
            tracking and longitudinal biomarker monitoring. Statements have not been evaluated by the
            FDA. Interventions must be reviewed with your primary longevity physician.
          </p>

          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} ProAge Atlas Inc. All Rights Reserved.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
