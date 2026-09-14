import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  FileText,
  Lock,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Mail,
  User,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { SERIES_A_TERMS } from "../data/proageData";
import { luxuryEase } from "../utils/motion";

interface DataRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataRoomModal: React.FC<DataRoomModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"documents" | "request">("documents");
  const [formData, setFormData] = useState({
    name: "",
    fund: "",
    email: "",
    allocation: "$1,000,000",
    isAccredited: true,
  });
  const [submitted, setSubmitted] = useState(false);

  const documents = [
    {
      id: "doc-1",
      title: "ProAge Atlas Series A Confidential Information Memorandum (CIM)",
      size: "4.8 MB",
      format: "PDF",
      classification: "Highly Confidential",
      desc: "Full institutional overview, 1,840-patient cohort validation, multi-omic platform defensibility, and IP portfolio.",
    },
    {
      id: "doc-2",
      title: "Consolidated Financial Model & 5-Year Forecast (2026-2030)",
      size: "2.4 MB",
      format: "XLSX",
      classification: "Financial Audit",
      desc: "Detailed unit economics, CLIA sequencing COGS curve, B2B clinic subscription cohorts, and break-even milestones.",
    },
    {
      id: "doc-3",
      title: "CLIA/CAP Multi-Omic Benchmarking & DunedinPACE Validation",
      size: "6.1 MB",
      format: "PDF",
      classification: "Clinical & Scientific",
      desc: "Comparative analytical validity against Illumina Infinium MethylationEPIC arrays and independent academic cohorts.",
    },
    {
      id: "doc-4",
      title: "Series A Term Sheet & Cap Table Pro-Forma ($24M Round)",
      size: "1.2 MB",
      format: "PDF",
      classification: "Legal & Corporate",
      desc: "Series A Preferred stock terms, liquidation preferences, voting rights, and post-round equity capitalization.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.3, ease: luxuryEase }}
          className="w-full max-w-3xl bg-[#FAF9F5] rounded-3xl border border-[#E2E0D8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 bg-white border-b border-[#E2E0D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#141716] flex items-center justify-center text-white">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#141716] font-editorial">
                    ProAge Atlas Institutional Data Room
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-200">
                    Series A ($24M)
                  </span>
                </div>
                <span className="text-xs text-[#6A6860]">
                  Confidential materials for accredited institutional and strategic investors
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-4 border-b border-[#E2E0D8] bg-[#F4F2EB] flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab("documents")}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === "documents"
                  ? "border-[#141716] text-[#141716] font-semibold"
                  : "border-transparent text-[#6A6860] hover:text-[#141716]"
              }`}
            >
              Due Diligence Repository ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab("request")}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === "request"
                  ? "border-[#141716] text-[#141716] font-semibold"
                  : "border-transparent text-[#6A6860] hover:text-[#141716]"
              }`}
            >
              Syndicate Allocation Request
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {activeTab === "documents" ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Accreditation Access Notice</span>
                    <span>
                      These documents contain proprietary multi-omic data, CLIA clinical trials, and
                      forward financial plans for the $24M Series A round.
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl p-5 border border-[#E2E0D8] hover:border-emerald-300 transition-all shadow-2xs flex flex-wrap sm:flex-nowrap items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] flex items-center justify-center text-[#141716] shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-[#141716] font-editorial">
                              {doc.title}
                            </h4>
                          </div>
                          <p className="text-xs text-[#525048] mt-1 leading-snug">{doc.desc}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-[#7A7870]">
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">
                              {doc.format} • {doc.size}
                            </span>
                            <span className="text-emerald-700">{doc.classification}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab("request")}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-medium bg-[#FAF9F5] text-[#141716] hover:bg-[#ECE8DE] border border-[#E2E0D8] transition-all shrink-0 flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-light text-[#141716] font-editorial">
                      Allocation Request Registered
                    </h3>
                    <p className="text-xs sm:text-sm text-[#525048] max-w-md mx-auto leading-relaxed">
                      Thank you, <strong>{formData.name}</strong>. Our Investor Relations partner has
                      been dispatched your interest for <strong>{formData.allocation}</strong> on behalf of{" "}
                      <strong>{formData.fund}</strong>. Confidential access credentials will be delivered
                      to <strong>{formData.email}</strong> within 2 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#141716] text-white hover:bg-[#252827]"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#141716] mb-1">
                          Full Legal Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Dr. Alexander Vance"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#E2E0D8] text-[#141716] focus:outline-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#141716] mb-1">
                          Fund / Family Office Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Apex Longevity Ventures"
                          value={formData.fund}
                          onChange={(e) => setFormData({ ...formData, fund: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#E2E0D8] text-[#141716] focus:outline-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#141716] mb-1">
                          Institutional Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="avance@apexlongevity.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#E2E0D8] text-[#141716] focus:outline-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#141716] mb-1">
                          Target Allocation Bracket
                        </label>
                        <select
                          value={formData.allocation}
                          onChange={(e) =>
                            setFormData({ ...formData, allocation: e.target.value })
                          }
                          className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#E2E0D8] text-[#141716] focus:outline-emerald-600"
                        >
                          <option value="$250,000 - $500,000">$250,000 – $500,000 (Angel/Strategic)</option>
                          <option value="$1,000,000">$1,000,000 (Institutional Co-investor)</option>
                          <option value="$2,500,000">$2,500,000 (Major Syndicate Member)</option>
                          <option value="$5,000,000+">$5,000,000+ (Anchor Syndicate)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-[#E2E0D8] flex items-center gap-2.5 text-xs text-[#525048]">
                      <input
                        type="checkbox"
                        id="accredited-check"
                        checked={formData.isAccredited}
                        onChange={(e) =>
                          setFormData({ ...formData, isAccredited: e.target.checked })
                        }
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                      <label htmlFor="accredited-check" className="cursor-pointer">
                        I confirm that I represent an accredited investor or institutional fund.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-[#141716] text-white hover:bg-[#252827] transition-all shadow-sm"
                    >
                      Request Series A Data Room Key
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
