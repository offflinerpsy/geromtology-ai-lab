export type LongevityPillarId =
  | "epigenetics"
  | "senescence"
  | "mitochondria"
  | "metabolic"
  | "vascular"
  | "immune";

export interface BiomarkerDefinition {
  name: string;
  code: string;
  unit: string;
  optimalRange: string;
  clinicalBenchmark: string;
  agingImpact: string;
  interventions: string[];
}

export interface LongevityPillar {
  id: LongevityPillarId;
  title: string;
  subtitle: string;
  hallmark: string;
  description: string;
  keyBiomarkers: BiomarkerDefinition[];
  reversalPotential: string;
  clinicalPriority: "Critical" | "High" | "Moderate";
  iconName: string;
  accentColor: string;
}

export interface EpigeneticSimulationInput {
  chronologicalAge: number;
  grimAgeIndex: number; // 0.70 to 1.30 (1.0 = average)
  hsCrp: number; // 0.1 to 5.0 mg/L
  fastingInsulin: number; // 1.5 to 20.0 uIU/mL
  vo2Max: number; // 20 to 65 mL/kg/min
  deepSleepPercent: number; // 8% to 30%
  telomereRatio: number; // 0.6 to 1.5 T/S ratio
}

export interface EpigeneticSimulationOutput {
  biologicalAge: number;
  ageDelta: number;
  dunedinPace: number; // Pace of aging per calendar year (e.g. 0.78 yr/yr)
  healthspanExtensionYears: number;
  overallScore: number; // 0 - 100
  tier: "Super-Ager" | "Optimized" | "Normative" | "Accelerated";
  projectedLifespan: number;
  primaryRiskFactor: string;
  topActionItems: string[];
}

export type InterventionCategory =
  | "all"
  | "molecular"
  | "hormetic"
  | "metabolic"
  | "sleep-neuro";

export interface InterventionProtocol {
  id: string;
  title: string;
  category: "molecular" | "hormetic" | "metabolic" | "sleep-neuro";
  evidenceTier: "Tier 1: Human RCT" | "Tier 2: Clinical Cohort" | "Tier 3: Multi-Omic Validated";
  targetBiomarkers: string[];
  mechanism: string;
  dosageSchedule: string;
  ageReversalImpact: string;
  humanTrialsCount: number;
  clinicalSummary: string;
  featured?: boolean;
}

export interface MarketBreakdown {
  tier: "TAM" | "SAM" | "SOM";
  title: string;
  figure: string;
  cagr: string;
  description: string;
  keyDrivers: string[];
}

export interface UnitEconomicMetric {
  label: string;
  value: string;
  subtext: string;
  trend: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  source?: string;
}
