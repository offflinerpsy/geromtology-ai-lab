import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SystemsAtlas } from "./components/SystemsAtlas";
import { EpigeneticSimulator } from "./components/EpigeneticSimulator";
import { ProtocolMatrix } from "./components/ProtocolMatrix";
import { DiagnosticKitShowcase } from "./components/DiagnosticKitShowcase";
import { InvestorDeck } from "./components/InvestorDeck";
import { Footer } from "./components/Footer";
import { DataRoomModal } from "./components/DataRoomModal";
import { LongevityCopilot } from "./components/LongevityCopilot";
import { HiFiLabBackground } from "./components/HiFiLabBackground";
import { Bot, Sparkles } from "lucide-react";

export function App() {
  const [activeSection, setActiveSection] = useState<string>("systems");
  const [dataRoomOpen, setDataRoomOpen] = useState<boolean>(false);
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [copilotPrompt, setCopilotPrompt] = useState<string | null>(null);

  // Scroll listener to update active section in header
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["systems", "simulator", "protocols", "kit", "investors"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -76;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleOpenCopilotWithCustomPrompt = (prompt: string) => {
    setCopilotPrompt(prompt);
    setCopilotOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141716] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 relative">
      {/* High-Fidelity Laboratory Background & Optics Canvas */}
      <HiFiLabBackground />

      {/* Navigation Header */}
      <Navbar
        onOpenDataRoom={() => setDataRoomOpen(true)}
        onOpenCopilot={() => {
          setCopilotPrompt(null);
          setCopilotOpen(true);
        }}
        activeSection={activeSection}
      />

      {/* Main Content Modules */}
      <main className="flex-1 relative z-10">
        {/* Editorial Longevity Hero */}
        <Hero
          onOpenSimulator={() => handleScrollToSection("simulator")}
          onOpenCopilot={() => {
            setCopilotPrompt(null);
            setCopilotOpen(true);
          }}
          onOpenDataRoom={() => setDataRoomOpen(true)}
        />

        {/* 01. Systems Atlas (6 Longevity Pillars & Biomarker Inspector) */}
        <SystemsAtlas
          onSelectBiomarkerForSimulation={(code) => handleScrollToSection("simulator")}
          onOpenCopilotWithTopic={(topic) => handleOpenCopilotWithCustomPrompt(topic)}
        />

        {/* 02. Epigenetic Biological Age & DunedinPACE Simulator */}
        <EpigeneticSimulator
          onOpenCopilotWithProfile={(summary) => handleOpenCopilotWithCustomPrompt(summary)}
          onOpenDataRoom={() => setDataRoomOpen(true)}
        />

        {/* 03. Clinical Longevity Protocols & Evidence Matrix */}
        <ProtocolMatrix
          onOpenCopilotWithProtocol={(protocolTitle) =>
            handleOpenCopilotWithCustomPrompt(
              `Объясни клиническую доказательную базу протокола: "${protocolTitle}". Каковы механизмы и подтвержденные исследования?`
            )
          }
        />

        {/* 04. Consumer & Clinic Diagnostic Kit Showcase */}
        <DiagnosticKitShowcase
          onOpenDataRoom={() => setDataRoomOpen(true)}
          onOpenSimulator={() => handleScrollToSection("simulator")}
        />

        {/* 05. Series A Investor Deck & Longevity TAM ($640B) */}
        <InvestorDeck onOpenDataRoom={() => setDataRoomOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        onOpenDataRoom={() => setDataRoomOpen(true)}
        onOpenCopilot={() => {
          setCopilotPrompt(null);
          setCopilotOpen(true);
        }}
      />

      {/* Persistent Floating AI Copilot Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setCopilotPrompt(null);
            setCopilotOpen(true);
          }}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#141716] text-[#FAF9F5] hover:bg-[#252827] border border-emerald-500/40 shadow-xl transition-all active:scale-95 hover:shadow-2xl hover:border-emerald-400"
          title="Open ProAge Longevity Copilot (Voice & Text)"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5" />
          </div>
          <span className="text-xs font-semibold font-editorial hidden sm:inline">
            Longevity Copilot
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hidden sm:inline">
            Voice AI
          </span>
        </button>
      </div>

      {/* Confidential Data Room Modal */}
      <DataRoomModal
        isOpen={dataRoomOpen}
        onClose={() => setDataRoomOpen(false)}
      />

      {/* Gemini Longevity Copilot Drawer (Voice + Text) */}
      <LongevityCopilot
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        initialPrompt={copilotPrompt}
      />
    </div>
  );
}

export default App;
