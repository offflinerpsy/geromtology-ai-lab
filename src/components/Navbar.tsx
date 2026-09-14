import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import {
  Menu,
  X,
  Sparkles,
  Lock,
  Dna,
  Bot,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Activity,
  Flame,
  FlaskConical,
  Zap,
  Layers,
  HeartPulse,
  Brain,
  Sliders,
} from "lucide-react";
import { LONGEVITY_PILLARS, INTERVENTION_PROTOCOLS, PRESET_SIMULATION_PROFILES } from "../data/proageData";

interface NavbarProps {
  onOpenDataRoom: () => void;
  onOpenCopilot: () => void;
  activeSection: string;
  onSelectBiomarker?: (code: string) => void;
  onSelectPillar?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDataRoom,
  onOpenCopilot,
  activeSection,
  onSelectPillar,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const navBoxRef = useRef<HTMLDivElement>(null);
  const brandSubRef = useRef<HTMLSpanElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // GSAP Morphic Scroll Animation
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 35;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Tween on isScrolled state change
  useEffect(() => {
    if (!navBoxRef.current) return;

    const ctx = gsap.context(() => {
      if (isScrolled) {
        gsap.to(navBoxRef.current, {
          height: 56,
          paddingTop: "0.4rem",
          paddingBottom: "0.4rem",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
          backgroundColor: "rgba(250, 249, 245, 0.94)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 10px 28px -6px rgba(20, 23, 22, 0.08), 0 2px 6px -1px rgba(20, 23, 22, 0.04)",
          borderRadius: "1rem",
          borderColor: "#D8D6CE",
          duration: 0.35,
          ease: "power2.out",
        });

        if (brandSubRef.current) {
          gsap.to(brandSubRef.current, {
            opacity: 0,
            height: 0,
            y: -4,
            duration: 0.2,
            ease: "power2.out",
          });
        }
      } else {
        gsap.to(navBoxRef.current, {
          height: 76,
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          backgroundColor: "rgba(250, 249, 245, 0.96)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          borderRadius: "0rem",
          borderColor: "#E2E0D8",
          duration: 0.35,
          ease: "power2.out",
        });

        if (brandSubRef.current) {
          gsap.to(brandSubRef.current, {
            opacity: 1,
            height: "auto",
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          });
        }
      }
    }, headerRef);

    return () => ctx.revert();
  }, [isScrolled]);

  // Click outside mega-menu handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        activeMegaMenu &&
        navBoxRef.current &&
        !navBoxRef.current.contains(e.target as Node)
      ) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMegaMenu]);

  const handleScrollTo = (id: string) => {
    setActiveMegaMenu(null);
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = isScrolled ? -72 : -88;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const navLinks = [
    {
      id: "systems",
      label: "Systems Atlas",
      hasMega: true,
      badge: "6 Networks",
    },
    {
      id: "simulator",
      label: "Biological Age Clock",
      hasMega: true,
      badge: "DunedinPACE",
    },
    {
      id: "protocols",
      label: "Clinical Protocols",
      hasMega: true,
      badge: "RCT",
    },
    {
      id: "kit",
      label: "Diagnostic Kit",
      hasMega: false,
    },
    {
      id: "investors",
      label: "Thesis & Syndicate",
      hasMega: false,
    },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "pt-2 sm:pt-3 px-3 sm:px-6 pointer-events-none" : "pt-0 px-0"
      }`}
    >
      <div
        ref={navBoxRef}
        className={`mx-auto transition-all border pointer-events-auto relative ${
          isScrolled
            ? "max-w-6xl rounded-2xl bg-[#FAF9F5]/90 border-[#D8D6CE] shadow-md"
            : "w-full bg-[#FAF9F5]/95 border-b border-[#E2E0D8]"
        }`}
      >
        <div className="flex items-center justify-between h-full">
          {/* Brand Wordmark & Biotech Identity */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#064E3B] via-[#059669] to-[#10B981] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <Dna className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-medium tracking-tight text-[#141716] block leading-none font-editorial">
                  ProAge Atlas
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  CLINICAL
                </span>
              </div>
              <span
                ref={brandSubRef}
                className="text-[10px] text-[#6A6860] tracking-tight block overflow-hidden leading-tight font-sans"
              >
                Longevity & Epigenetic Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Nav Items with Mega-Menu Triggers */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 relative">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              const isMegaOpen = activeMegaMenu === item.id;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.hasMega) setActiveMegaMenu(item.id);
                  }}
                >
                  <button
                    onClick={() => {
                      if (item.hasMega) {
                        setActiveMegaMenu(isMegaOpen ? null : item.id);
                      } else {
                        handleScrollTo(item.id);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive || isMegaOpen
                        ? "text-[#064E3B] bg-emerald-50/80 font-semibold border border-emerald-200/60"
                        : "text-[#525048] hover:text-[#141716] hover:bg-[#ECE8DE]/60 border border-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasMega && (
                      <ChevronDown
                        className={`w-3 h-3 text-[#7A7870] transition-transform duration-200 ${
                          isMegaOpen ? "rotate-180 text-emerald-700" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Action CTAs: AI Copilot & Series A Pitch Room */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenCopilot}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium text-[#064E3B] bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 transition-all active:scale-[0.98] shadow-2xs"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span>Longevity Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              onClick={onOpenDataRoom}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium bg-[#141716] text-[#FAF9F5] hover:bg-[#252827] transition-all active:scale-[0.98] shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Room</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={onOpenCopilot}
              className="p-2 text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200 sm:hidden"
              aria-label="Open Longevity Copilot"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#141716] hover:bg-[#ECE8DE] rounded-lg transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Interactive Mega-Menu Drawer */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.99 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onMouseLeave={() => setActiveMegaMenu(null)}
              className="absolute top-full left-0 right-0 mt-2 bg-[#FAF9F5] rounded-2xl border border-[#D8D6CE] shadow-xl p-6 overflow-hidden z-50 text-[#141716]"
            >
              {/* Mega-Menu Panel 1: Systems Atlas */}
              {activeMegaMenu === "systems" && (
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8">
                    <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#E2E0D8]">
                      <div className="flex items-center gap-2">
                        <Dna className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-mono uppercase tracking-wider text-[#6A6860] font-semibold">
                          The Six Biological Longevity Pillars
                        </span>
                      </div>
                      <button
                        onClick={() => handleScrollTo("systems")}
                        className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 group"
                      >
                        Explore Complete Atlas
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {LONGEVITY_PILLARS.map((pillar) => (
                        <div
                          key={pillar.id}
                          onClick={() => {
                            if (onSelectPillar) onSelectPillar(pillar.id);
                            handleScrollTo("systems");
                          }}
                          className="p-3 rounded-xl bg-white hover:bg-emerald-50/50 border border-[#E2E0D8] hover:border-emerald-300 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-100 font-medium">
                              {pillar.reversalPotential}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-[#141716] group-hover:text-emerald-800 transition-colors font-editorial">
                            {pillar.title}
                          </h4>
                          <p className="text-[11px] text-[#6A6860] line-clamp-1 mt-0.5">
                            {pillar.subtitle}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mega-Menu Right Sidebar: Laboratory Grade Multi-Omics */}
                  <div className="col-span-4 bg-[#F4F2EB] rounded-xl p-4 border border-[#E2E0D8] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 font-semibold mb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Clinical Benchmarking
                      </div>
                      <p className="text-xs text-[#525048] leading-relaxed">
                        Every system is calibrated against a cohort of 12,000+ patients across 850,000+ epigenetic CpG sites on the Illumina Infinium platform.
                      </p>

                      <div className="mt-4 space-y-1.5 text-xs text-[#6A6860]">
                        <div className="flex items-center justify-between py-1 border-b border-[#E2E0D8]">
                          <span>Sequencing Standard:</span>
                          <span className="font-mono text-[#141716] font-medium">CLIA / CAP Certified</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#E2E0D8]">
                          <span>Pace Metric:</span>
                          <span className="font-mono text-[#141716] font-medium">DunedinPACE</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleScrollTo("systems")}
                      className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#141716] text-[#FAF9F5] hover:bg-[#252827] transition-colors text-center"
                    >
                      Open Interactive Network Map
                    </button>
                  </div>
                </div>
              )}

              {/* Mega-Menu Panel 2: Biological Age Clock */}
              {activeMegaMenu === "simulator" && (
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2E0D8]">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-mono uppercase tracking-wider text-[#6A6860] font-semibold">
                          Multi-Omic Age Calibration
                        </span>
                      </div>
                      <span className="text-xs text-[#6A6860] font-mono">
                        DunedinPACE & GrimAge Model
                      </span>
                    </div>

                    <p className="text-xs text-[#525048]">
                      Select a clinical preset to immediately observe shifts in cellular decay velocity, biological age delta, and projected healthspan:
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-1">
                      {PRESET_SIMULATION_PROFILES.map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() => handleScrollTo("simulator")}
                          className="p-3.5 rounded-xl bg-white hover:bg-emerald-50/50 border border-[#E2E0D8] hover:border-emerald-300 transition-all cursor-pointer group"
                        >
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 block mb-1">
                            Preset
                          </span>
                          <h4 className="text-xs font-semibold text-[#141716] group-hover:text-emerald-800 transition-colors font-editorial">
                            {preset.name}
                          </h4>
                          <p className="text-[11px] text-[#6A6860] line-clamp-2 mt-1">
                            {preset.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 bg-[#F4F2EB] rounded-xl p-4 border border-[#E2E0D8] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-[#6A6860] uppercase tracking-wider block">
                        Algorithm Performance
                      </span>
                      <div className="text-2xl font-light text-[#064E3B] font-editorial mt-1">
                        0.76 yr/yr
                      </div>
                      <p className="text-xs text-[#525048] mt-1">
                        Average biological aging pace achievable via verified clinical interventions.
                      </p>
                    </div>

                    <button
                      onClick={() => handleScrollTo("simulator")}
                      className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#141716] text-[#FAF9F5] hover:bg-[#252827] transition-colors text-center"
                    >
                      Calibrate Biological Age
                    </button>
                  </div>
                </div>
              )}

              {/* Mega-Menu Panel 3: Clinical Protocols */}
              {activeMegaMenu === "protocols" && (
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2E0D8] mb-3">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-mono uppercase tracking-wider text-[#6A6860] font-semibold">
                          Targeted Therapeutic Vectors
                        </span>
                      </div>
                      <button
                        onClick={() => handleScrollTo("protocols")}
                        className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 group"
                      >
                        View All Interventions
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {INTERVENTION_PROTOCOLS.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleScrollTo("protocols")}
                          className="p-3 rounded-xl bg-white hover:bg-emerald-50/50 border border-[#E2E0D8] hover:border-emerald-300 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-100">
                              {p.evidenceTier}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                              {p.ageReversalImpact}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-[#141716] group-hover:text-emerald-800 transition-colors font-editorial">
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-[#6A6860] line-clamp-1 mt-0.5">
                            {p.mechanism}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 bg-[#F4F2EB] rounded-xl p-4 border border-[#E2E0D8] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 font-semibold mb-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        Evidence-Based Standard
                      </div>
                      <p className="text-xs text-[#525048] leading-relaxed mt-1">
                        We systematically reject unverified longevity claims. All protocols require published human randomized controlled trials (RCTs).
                      </p>
                    </div>

                    <button
                      onClick={() => handleScrollTo("protocols")}
                      className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#141716] text-[#FAF9F5] hover:bg-[#252827] transition-colors text-center"
                    >
                      Filter Protocols Matrix
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-t border-[#E2E0D8] bg-[#FAF9F5] px-6 py-4 space-y-3 mt-2 rounded-2xl shadow-lg mx-3 pointer-events-auto"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScrollTo(item.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-[#141716] hover:bg-[#ECE8DE] transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-[#E2E0D8] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenCopilot();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-medium text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4 text-emerald-700" />
                Launch Longevity Copilot
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenDataRoom();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-medium bg-[#141716] text-[#FAF9F5] text-center"
              >
                Access Series A Data Room
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

