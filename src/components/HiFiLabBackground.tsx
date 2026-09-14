import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, Radio, Eye, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
  isCpG: boolean;
}

export const HiFiLabBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [laserScanActive, setLaserScanActive] = useState(true);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [opticalMode, setOpticalMode] = useState<"confocal" | "cytometry">("confocal");
  const scanBeamYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create laboratory particles (cellular nodes, chromatin CpG markers)
    const particleCount = Math.min(65, Math.floor(width / 22));
    const particles: Particle[] = [];

    const colors = [
      "rgba(16, 185, 129, ", // Emerald
      "rgba(5, 150, 105, ",  // Deep emerald
      "rgba(45, 212, 191, ", // Teal/Cyan
      "rgba(52, 211, 153, ", // Mint
      "rgba(180, 205, 195, " // Specimen gray-green
    ];

    for (let i = 0; i < particleCount; i++) {
      const isCpG = Math.random() > 0.65;
      const baseR = isCpG ? Math.random() * 2.2 + 1.8 : Math.random() * 1.5 + 0.8;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: baseR,
        baseRadius: baseR,
        alpha: Math.random() * 0.45 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        isCpG,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let lastTime = performance.now();
    let scanBeamY = 0;

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Render ultra-subtle laboratory Cartesian coordinate grid
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(16, 185, 129, 0.028)";
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update scan beam position (simulating a confocal laser pass)
      if (laserScanActive) {
        scanBeamY += 70 * dt;
        if (scanBeamY > height + 40) {
          scanBeamY = -40;
        }
        scanBeamYRef.current = scanBeamY;

        // Draw laser scan line
        const grad = ctx.createLinearGradient(0, scanBeamY, width, scanBeamY);
        grad.addColorStop(0, "rgba(16, 185, 129, 0)");
        grad.addColorStop(0.2, "rgba(52, 211, 153, 0.08)");
        grad.addColorStop(0.5, "rgba(16, 185, 129, 0.22)");
        grad.addColorStop(0.8, "rgba(52, 211, 153, 0.08)");
        grad.addColorStop(1, "rgba(16, 185, 129, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, scanBeamY);
        ctx.lineTo(width, scanBeamY);
        ctx.stroke();

        // Laser scan soft glow
        const glowGrad = ctx.createLinearGradient(0, scanBeamY - 24, 0, scanBeamY + 24);
        glowGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
        glowGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.04)");
        glowGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, scanBeamY - 24, width, 48);
      }

      // Update and draw particles & connective molecular strands
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;

        // Wrap boundaries smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse gentle repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 120) {
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * (120 - distToMouse) * 0.02;
          p.y -= Math.sin(angle) * (120 - distToMouse) * 0.02;
        }

        // Particle radius pulse
        const dynamicRadius = p.baseRadius + Math.sin(p.pulsePhase) * 0.5;

        // Check distance to laser scan line for excitation glow
        const distToLaser = Math.abs(p.y - scanBeamYRef.current);
        const isLaserExcited = laserScanActive && distToLaser < 35;
        const laserBoost = isLaserExcited ? (1 - distToLaser / 35) * 0.45 : 0;

        // Draw particle body
        ctx.beginPath();
        ctx.arc(p.x, p.y, dynamicRadius + (isLaserExcited ? 1 : 0), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.min(0.9, p.alpha + laserBoost)})`;
        ctx.fill();

        // Draw CpG nucleotide marker halo
        if (p.isCpG || isLaserExcited) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, dynamicRadius * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = `${p.color}${Math.min(0.35, 0.12 + laserBoost)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        // Draw connections between nearby particles (multi-omic network)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (dist < 105) {
            const linkAlpha = (1 - dist / 105) * 0.14 * (1 + laserBoost);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${linkAlpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [laserScanActive, opticalMode]);

  // Scroll listener for real-time Z-scan telemetry
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollDepth(Math.round(progress));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Hardware-Accelerated Micro-Specimen Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70 transition-opacity duration-700"
      />

      {/* 2. Crystalline Glass Caustics & Optical Refraction Orbs */}
      <div className="absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-emerald-100/35 via-teal-50/20 to-transparent blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-emerald-200/25 via-emerald-100/15 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-teal-100/25 via-emerald-50/20 to-transparent blur-[140px] pointer-events-none" />

      {/* 3. Hi-Fi Laboratory Specimen Vignette & Lens Rim */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(20,23,22,0.035)] pointer-events-none" />

      {/* 4. Precision Laboratory Etched Corner Telemetry Marks */}
      <div className="hidden xl:flex items-center justify-between absolute top-20 left-8 right-8 text-[10px] font-mono text-[#7A7870]/70 tracking-wider">
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/60 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-900 font-semibold">LAB: ILLUMINA-EPIC-850K</span>
          <span className="text-[#A3A096]">|</span>
          <span>OPTICAL PASS: 400nm</span>
        </div>

        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/60 shadow-2xs">
          <span>SAMPLE BUFFER: pH 7.38</span>
          <span className="text-[#A3A096]">|</span>
          <span className="text-emerald-900 font-semibold">REFRACTIVE INDEX: 1.520 ηD</span>
        </div>
      </div>

      {/* Bottom Telemetry Coordinates */}
      <div className="hidden xl:flex items-center justify-between absolute bottom-6 left-8 right-8 text-[10px] font-mono text-[#7A7870]/70 tracking-wider">
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/60 shadow-2xs">
          <Activity className="w-3 h-3 text-emerald-600" />
          <span>CLIA PIPELINE REPRODUCIBILITY: 99.8%</span>
        </div>

        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/60 shadow-2xs">
          <span className="text-emerald-800 font-medium">SCAN DEPTH:</span>
          <span className="font-bold text-[#141716] font-mono">{scrollDepth}%</span>
          <span className="text-[#A3A096]">|</span>
          <span className="text-emerald-700">DUNEDINPACE CALIBRATED</span>
        </div>
      </div>

      {/* 5. Interactive Laboratory Optics Control Pill (Pointer events enabled for this button) */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-auto hidden md:block">
        <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)]">
          <button
            onClick={() => setLaserScanActive(!laserScanActive)}
            title="Toggle Confocal Laser Scan Beam"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
              laserScanActive
                ? "bg-emerald-950 text-emerald-300 font-semibold shadow-xs"
                : "text-[#6A6860] hover:text-[#141716] bg-[#FAF9F5]"
            }`}
          >
            <Radio className={`w-3 h-3 ${laserScanActive ? "animate-pulse text-emerald-400" : ""}`} />
            <span>Laser Beam: {laserScanActive ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={() =>
              setOpticalMode(opticalMode === "confocal" ? "cytometry" : "confocal")
            }
            title="Switch Optical Microscopy Filter"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#525048] hover:text-[#141716] bg-[#FAF9F5] border border-[#E2E0D8]/60 transition-colors"
          >
            <Eye className="w-3 h-3 text-emerald-700" />
            <span className="capitalize">{opticalMode}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
