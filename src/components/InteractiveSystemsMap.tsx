import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Info,
  ChevronRight,
  Activity,
  Zap,
  Dna,
  ShieldAlert,
  HeartPulse,
  Shield,
  Layers,
  Search,
  Maximize2,
  RefreshCw,
  Sliders,
  ExternalLink,
  HelpCircle,
  TrendingDown,
  Atom,
} from "lucide-react";
import { LONGEVITY_PILLARS } from "../data/proageData";
import { LongevityPillar, BiomarkerDefinition, LongevityPillarId } from "../types";
import { luxuryEase } from "../utils/motion";

// Graph Node Data Interfaces
export interface SystemGraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: "system" | "biomarker" | "mechanism";
  pillarId: LongevityPillarId;
  label: string;
  code?: string;
  optimalRange?: string;
  unit?: string;
  clinicalBenchmark?: string;
  agingImpact?: string;
  interventions?: string[];
  hallmark?: string;
  reversalPotential?: string;
  clinicalPriority?: string;
  color: string;
  radius: number;
  description?: string;
  fx?: number | null;
  fy?: number | null;
}

export interface SystemGraphLink extends d3.SimulationLinkDatum<SystemGraphNode> {
  source: string | SystemGraphNode;
  target: string | SystemGraphNode;
  label?: string;
  synergyType: "regulates" | "potentiates" | "accelerates" | "biomarker-of";
  strength: number;
}

interface InteractiveSystemsMapProps {
  selectedPillarId: LongevityPillarId;
  onSelectPillar: (pillarId: LongevityPillarId) => void;
  onOpenCopilotWithTopic: (topic: string) => void;
  onSelectBiomarkerForSimulation?: (code: string) => void;
}

export const InteractiveSystemsMap: React.FC<InteractiveSystemsMapProps> = ({
  selectedPillarId,
  onSelectPillar,
  onOpenCopilotWithTopic,
  onSelectBiomarkerForSimulation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [selectedNode, setSelectedNode] = useState<SystemGraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SystemGraphNode | null>(null);
  const [filterType, setFilterType] = useState<"all" | "systems" | "biomarkers">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"force" | "orbit">("force");

  // Build Graph Data
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, SystemGraphNode>();
    const linkList: SystemGraphLink[] = [];

    // System pillar colors
    const pillarColors: Record<LongevityPillarId, string> = {
      epigenetics: "#10B981", // Emerald
      senescence: "#F59E0B", // Amber
      mitochondria: "#059669", // Dark Emerald
      metabolic: "#0D9488", // Teal
      vascular: "#EC4899", // Rose / Pink
      immune: "#6366F1", // Indigo
    };

    // 1. Add 6 Main System Hub Nodes
    LONGEVITY_PILLARS.forEach((pillar) => {
      const pNode: SystemGraphNode = {
        id: `sys-${pillar.id}`,
        type: "system",
        pillarId: pillar.id,
        label: pillar.title,
        hallmark: pillar.hallmark,
        reversalPotential: pillar.reversalPotential,
        clinicalPriority: pillar.clinicalPriority,
        description: pillar.description,
        color: pillarColors[pillar.id],
        radius: 36,
      };
      nodeMap.set(pNode.id, pNode);

      // 2. Add Biomarker Leaf Nodes for each system
      pillar.keyBiomarkers.forEach((bm) => {
        const bmNode: SystemGraphNode = {
          id: `bm-${bm.code}`,
          type: "biomarker",
          pillarId: pillar.id,
          label: bm.name,
          code: bm.code,
          optimalRange: bm.optimalRange,
          unit: bm.unit,
          clinicalBenchmark: bm.clinicalBenchmark,
          agingImpact: bm.agingImpact,
          interventions: bm.interventions,
          color: pillarColors[pillar.id],
          radius: 20,
        };
        nodeMap.set(bmNode.id, bmNode);

        // Link biomarker to its parent system hub
        linkList.push({
          source: pNode.id,
          target: bmNode.id,
          label: "Direct Assay",
          synergyType: "biomarker-of",
          strength: 0.9,
        });
      });
    });

    // 3. Add Cross-System Biological Interconnections (Mechanistic Crosstalk)
    const crosstalkEdges: Array<{
      s: string;
      t: string;
      label: string;
      type: "regulates" | "potentiates" | "accelerates";
      str: number;
    }> = [
      {
        s: "sys-senescence",
        t: "sys-epigenetics",
        label: "SASP accelerates epigenetic GrimAge clock",
        type: "accelerates",
        str: 0.6,
      },
      {
        s: "sys-mitochondria",
        t: "sys-epigenetics",
        label: "NAD+ fuels Sirtuins & TET demethylases",
        type: "regulates",
        str: 0.7,
      },
      {
        s: "sys-metabolic",
        t: "sys-mitochondria",
        label: "AMPK activates PGC-1α biogenesis",
        type: "potentiates",
        str: 0.65,
      },
      {
        s: "sys-senescence",
        t: "sys-vascular",
        label: "p16INK4a drives endothelial nitric oxide loss",
        type: "accelerates",
        str: 0.55,
      },
      {
        s: "sys-immune",
        t: "sys-senescence",
        label: "Cytotoxic T & NK cells clear senescent cells",
        type: "regulates",
        str: 0.75,
      },
      {
        s: "sys-vascular",
        t: "sys-metabolic",
        label: "Microvascular capillary density regulates insulin uptake",
        type: "regulates",
        str: 0.5,
      },
      {
        s: "bm-PACE-DNAm",
        t: "bm-hs-CRP",
        label: "Systemic inflammation drives DunedinPACE velocity",
        type: "accelerates",
        str: 0.4,
      },
      {
        s: "bm-NAD-WB",
        t: "bm-INS-FAST",
        label: "SIRT1 activation restores insulin sensitivity",
        type: "regulates",
        str: 0.45,
      },
    ];

    crosstalkEdges.forEach((e) => {
      if (nodeMap.has(e.s) && nodeMap.has(e.t)) {
        linkList.push({
          source: e.s,
          target: e.t,
          label: e.label,
          synergyType: e.type,
          strength: e.str,
        });
      }
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links: linkList,
    };
  }, []);

  // Filtered nodes based on active filters
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (filterType === "systems" && n.type !== "system") return false;
      if (filterType === "biomarkers" && n.type !== "biomarker") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = n.label.toLowerCase().includes(q);
        const matchesCode = n.code?.toLowerCase().includes(q);
        const matchesHallmark = n.hallmark?.toLowerCase().includes(q);
        const matchesIntervention = n.interventions?.some((i) => i.toLowerCase().includes(q));
        return matchesName || matchesCode || matchesHallmark || matchesIntervention;
      }
      return true;
    });
  }, [nodes, filterType, searchQuery]);

  // Handle Initial selection to match the active pillar
  useEffect(() => {
    const targetSystemNode = nodes.find((n) => n.id === `sys-${selectedPillarId}`);
    if (targetSystemNode && !selectedNode) {
      setSelectedNode(targetSystemNode);
    }
  }, [selectedPillarId, nodes]);

  // D3 Simulation Lifecycle
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 560;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Responsive viewBox
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Definitions (Markers, gradients, glows)
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrow markers for relationships
    const createMarker = (id: string, color: string) => {
      defs
        .append("marker")
        .attr("id", id)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 26)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L9,0L0,4")
        .attr("fill", color)
        .attr("opacity", 0.7);
    };

    createMarker("arrow-crosstalk", "#10B981");
    createMarker("arrow-accent", "#F59E0B");

    // Background Container with Zoom Behavior
    const zoomGroup = svg.append("g").attr("class", "zoom-container");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.55, 2.2])
      .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Initial positioning: layout systems in a harmonic pentagonal/hexagonal ring
    const systemCount = 6;
    const ringRadius = Math.min(width, height) * 0.34;
    const centerX = width / 2;
    const centerY = height / 2;

    const simulationNodes = nodes.map((d) => ({ ...d }));
    const simulationLinks = links.map((d) => ({ ...d }));

    simulationNodes.forEach((node) => {
      if (node.type === "system") {
        const sysIndex = LONGEVITY_PILLARS.findIndex((p) => p.id === node.pillarId);
        const angle = (sysIndex / systemCount) * 2 * Math.PI - Math.PI / 2;
        node.x = centerX + ringRadius * Math.cos(angle);
        node.y = centerY + ringRadius * Math.sin(angle);
      } else {
        // Position biomarker near its parent
        const sysIndex = LONGEVITY_PILLARS.findIndex((p) => p.id === node.pillarId);
        const angle = (sysIndex / systemCount) * 2 * Math.PI - Math.PI / 2;
        const bmOffset = 55 + Math.random() * 30;
        const subAngle = angle + (Math.random() - 0.5) * 0.7;
        node.x = centerX + (ringRadius + bmOffset) * Math.cos(subAngle);
        node.y = centerY + (ringRadius + bmOffset) * Math.sin(subAngle);
      }
    });

    // Force Simulation Setup
    const simulation = d3
      .forceSimulation<SystemGraphNode>(simulationNodes)
      .force(
        "link",
        d3
          .forceLink<SystemGraphNode, SystemGraphLink>(simulationLinks)
          .id((d) => d.id)
          .distance((d) => (d.synergyType === "biomarker-of" ? 64 : 140))
          .strength((d) => d.strength)
      )
      .force("charge", d3.forceManyBody().strength((d: any) => (d.type === "system" ? -380 : -90)))
      .force("center", d3.forceCenter(centerX, centerY).strength(0.08))
      .force("collision", d3.forceCollide<SystemGraphNode>().radius((d) => d.radius + 14))
      .alphaDecay(0.035);

    // Links Render
    const linkGroup = zoomGroup.append("g").attr("class", "links-group");
    const link = linkGroup
      .selectAll("line")
      .data(simulationLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => (d.synergyType === "biomarker-of" ? "#D1CFC7" : "#059669"))
      .attr("stroke-opacity", (d) => (d.synergyType === "biomarker-of" ? 0.45 : 0.6))
      .attr("stroke-width", (d) => (d.synergyType === "biomarker-of" ? 1.5 : 2))
      .attr("stroke-dasharray", (d) => (d.synergyType === "biomarker-of" ? "none" : "4,3"))
      .attr("marker-end", (d) => (d.synergyType === "biomarker-of" ? "" : "url(#arrow-crosstalk)"));

    // Nodes Render Group
    const nodeGroup = zoomGroup.append("g").attr("class", "nodes-group");

    const node = nodeGroup
      .selectAll(".node")
      .data(simulationNodes)
      .enter()
      .append("g")
      .attr("class", "node cursor-pointer")
      .call(
        d3
          .drag<SVGGElement, SystemGraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Outer Aura Ring for System Nodes
    node
      .filter((d) => d.type === "system")
      .append("circle")
      .attr("r", (d) => d.radius + 6)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.5);

    // Main Node Circle
    node
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => (d.type === "system" ? "#141716" : "#FFFFFF"))
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", (d) => (d.type === "system" ? 2.5 : 2))
      .attr("filter", "drop-shadow(0px 2px 4px rgba(0,0,0,0.08))")
      .style("transition", "all 0.2s ease");

    // Inner indicator dot
    node
      .append("circle")
      .attr("r", (d) => (d.type === "system" ? 5 : 3.5))
      .attr("fill", (d) => d.color);

    // Node Labels
    node
      .append("text")
      .text((d) => (d.type === "system" ? d.label.split(" ")[0] : d.code || d.label.slice(0, 8)))
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.type === "system" ? 18 : 14))
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", (d) => (d.type === "system" ? "9px" : "8px"))
      .attr("font-weight", "600")
      .attr("fill", (d) => (d.type === "system" ? "#FAF9F5" : "#141716"))
      .style("pointer-events", "none");

    // Click & Hover Interactions
    node
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        if (d.type === "system") {
          onSelectPillar(d.pillarId);
        }
      })
      .on("mouseenter", (event, d) => {
        setHoveredNode(d);
        // Highlight active connections
        link
          .attr("stroke-opacity", (l: any) =>
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.15
          )
          .attr("stroke-width", (l: any) =>
            l.source.id === d.id || l.target.id === d.id ? 2.5 : 1
          );
      })
      .on("mouseleave", () => {
        setHoveredNode(null);
        link
          .attr("stroke-opacity", (l: any) => (l.synergyType === "biomarker-of" ? 0.45 : 0.6))
          .attr("stroke-width", (l: any) => (l.synergyType === "biomarker-of" ? 1.5 : 2));
      });

    // Reset selection when clicking on background
    svg.on("click", () => {
      // do not clear selection, maintain focus on active pillar
    });

    // Simulation Tick Updates
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, onSelectPillar]);

  // Synchronize Active Node Selection with Selected Pillar from props
  useEffect(() => {
    if (selectedPillarId && (!selectedNode || selectedNode.pillarId !== selectedPillarId)) {
      const pNode = nodes.find((n) => n.id === `sys-${selectedPillarId}`);
      if (pNode) {
        setSelectedNode(pNode);
      }
    }
  }, [selectedPillarId, nodes]);

  return (
    <div className="bg-[#FAF9F5] border border-[#E2E0D8] rounded-3xl overflow-hidden shadow-xs">
      {/* Top Controller Bar */}
      <div className="p-4 sm:p-5 bg-white border-b border-[#E2E0D8] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#141716] flex items-center justify-center text-emerald-400">
            <Atom className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#141716] font-editorial tracking-tight">
                Interactive Biological Topology Map
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-200">
                Live D3.js Force Physics
              </span>
            </div>
            <p className="text-xs text-[#6A6860]">
              Click biological nodes to inspect molecular pathways, optimal ranges, and cross-system cascades
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A7870]" />
            <input
              type="text"
              placeholder="Search biomarker (e.g. NAD+, CRP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] text-xs text-[#141716] placeholder-[#8A8880] focus:outline-emerald-600 w-44 sm:w-56"
            />
          </div>

          <div className="bg-[#F4F2EB] p-0.5 rounded-xl border border-[#E2E0D8] flex items-center">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                filterType === "all" ? "bg-white font-medium text-[#141716] shadow-2xs" : "text-[#6A6860]"
              }`}
            >
              All (24)
            </button>
            <button
              onClick={() => setFilterType("systems")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                filterType === "systems" ? "bg-white font-medium text-[#141716] shadow-2xs" : "text-[#6A6860]"
              }`}
            >
              6 Systems
            </button>
            <button
              onClick={() => setFilterType("biomarkers")}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                filterType === "biomarkers" ? "bg-white font-medium text-[#141716] shadow-2xs" : "text-[#6A6860]"
              }`}
            >
              18 Biomarkers
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Left Canvas + Right Slide-out Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative min-h-[580px]">
        {/* Left: D3 Visualization Stage */}
        <div
          ref={containerRef}
          className="lg:col-span-7 xl:col-span-8 bg-[#FAF9F5] relative overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#E2E0D8]"
        >
          {/* Subtle Grid Watermark */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#141716 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          <svg ref={svgRef} className="w-full h-[540px] sm:h-[580px] select-none" />

          {/* Canvas Floating Legend */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#E2E0D8] text-[11px] font-mono space-y-1 shadow-2xs pointer-events-none">
            <div className="flex items-center gap-2 text-[#525048]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#141716] border border-emerald-500" />
              <span>Primary Organ / System Hub</span>
            </div>
            <div className="flex items-center gap-2 text-[#525048]">
              <span className="w-2 h-2 rounded-full bg-white border border-emerald-500" />
              <span>Diagnostic Multi-Omic Marker</span>
            </div>
            <div className="flex items-center gap-2 text-[#525048]">
              <span className="w-3.5 h-0.5 bg-[#059669] inline-block" />
              <span>Crosstalk Pathway</span>
            </div>
          </div>

          {/* Quick Interaction Helper */}
          <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[#7A7870] flex items-center gap-1.5 bg-[#FAF9F5]/90 px-2.5 py-1 rounded-md border border-[#E2E0D8] pointer-events-none">
            <HelpCircle className="w-3 h-3 text-emerald-600" />
            <span>Drag nodes to explore topology • Scroll to zoom</span>
          </div>
        </div>

        {/* Right: Dynamic Deep Data Inspector Panel */}
        <div className="lg:col-span-5 xl:col-span-4 p-6 sm:p-7 bg-white flex flex-col justify-between overflow-y-auto max-h-[640px]">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: luxuryEase }}
                className="space-y-5"
              >
                {/* Node Classification Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6A6860]">
                      {selectedNode.type === "system" ? "Longevity Operating System" : "CLIA-Validated Biomarker"}
                    </span>
                  </div>
                  {selectedNode.clinicalPriority && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-200">
                      Priority: {selectedNode.clinicalPriority}
                    </span>
                  )}
                  {selectedNode.code && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-800 border border-gray-200">
                      [{selectedNode.code}]
                    </span>
                  )}
                </div>

                {/* Node Title */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#141716] font-editorial tracking-tight">
                    {selectedNode.label}
                  </h3>
                  {selectedNode.hallmark && (
                    <p className="text-xs font-mono text-emerald-800 mt-1">
                      Hallmark: {selectedNode.hallmark}
                    </p>
                  )}
                </div>

                {/* System-Specific View */}
                {selectedNode.type === "system" && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 bg-[#FAF9F5] rounded-xl border border-[#E2E0D8] text-[#525048] leading-relaxed">
                      {selectedNode.description}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-wider block">
                          Reversal Potential
                        </span>
                        <span className="text-base font-semibold text-[#064E3B] font-editorial mt-0.5 block">
                          {selectedNode.reversalPotential}
                        </span>
                      </div>
                      <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E2E0D8]">
                        <span className="text-[10px] font-mono text-[#6A6860] uppercase tracking-wider block">
                          Associated Markers
                        </span>
                        <span className="text-base font-semibold text-[#141716] font-mono mt-0.5 block">
                          3 Primary Assays
                        </span>
                      </div>
                    </div>

                    {/* Associated Biomarkers Quick-Click Pills */}
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A6860] block mb-2">
                        Inspect Nested Biomarkers:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {nodes
                          .filter((n) => n.type === "biomarker" && n.pillarId === selectedNode.pillarId)
                          .map((bm) => (
                            <button
                              key={bm.id}
                              onClick={() => setSelectedNode(bm)}
                              className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] hover:bg-emerald-50 text-[#141716] hover:text-emerald-900 border border-[#E2E0D8] hover:border-emerald-300 transition-all font-mono text-xs flex items-center gap-1"
                            >
                              <span>{bm.label}</span>
                              <ChevronRight className="w-3 h-3 text-emerald-600" />
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Biomarker-Specific Deep Clinical Dossier */}
                {selectedNode.type === "biomarker" && (
                  <div className="space-y-4 text-xs">
                    {/* Clinical Ranges Box */}
                    <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E2E0D8] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E2E0D8]">
                        <span className="text-xs text-[#6A6860]">Optimal Longevity Range:</span>
                        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                          {selectedNode.optimalRange} {selectedNode.unit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6A6860]">Standard Population Benchmark:</span>
                        <span className="text-xs font-mono text-gray-700">
                          {selectedNode.clinicalBenchmark}
                        </span>
                      </div>
                    </div>

                    {/* Aging Mechanism Impact */}
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A6860] block mb-1">
                        Molecular Aging Mechanism:
                      </span>
                      <p className="text-xs text-[#141716] leading-relaxed bg-white p-3 rounded-xl border border-[#E2E0D8]">
                        {selectedNode.agingImpact}
                      </p>
                    </div>

                    {/* Validated Interventions */}
                    {selectedNode.interventions && (
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#6A6860] block mb-1.5">
                          Evidence-Based Interventions:
                        </span>
                        <div className="space-y-1.5">
                          {selectedNode.interventions.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5] border border-[#E2E0D8] text-xs text-[#141716]"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {selectedNode.type === "biomarker" && onSelectBiomarkerForSimulation && (
                    <button
                      onClick={() => onSelectBiomarkerForSimulation(selectedNode.code || "")}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#141716] text-[#FAF9F5] hover:bg-[#252827] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                      Simulate in Biological Age Calculator
                    </button>
                  )}

                  <button
                    onClick={() =>
                      onOpenCopilotWithTopic(
                        `Проанализируй клиническую значимость биомаркера/системы: "${selectedNode.label}" (${selectedNode.code || selectedNode.pillarId}). Какие механизмы омоложения подтверждены?`
                      )
                    }
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    Consult Gemini AI Copilot
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-16 text-[#6A6860] space-y-2">
                <Info className="w-8 h-8 mx-auto text-gray-300" />
                <p className="text-xs">Click any node on the canvas to inspect clinical data</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
