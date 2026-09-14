import { EpigeneticSimulationInput, EpigeneticSimulationOutput } from "../types";

export function calculateEpigeneticProfile(
  input: EpigeneticSimulationInput
): EpigeneticSimulationOutput {
  const {
    chronologicalAge,
    grimAgeIndex,
    hsCrp,
    fastingInsulin,
    vo2Max,
    deepSleepPercent,
    telomereRatio,
  } = input;

  // 1. Biological Age Differential Calculation
  // DNAm GrimAge weighting
  const grimAgeDelta = (grimAgeIndex - 1.0) * 11.5;

  // Inflammation impact (hs-CRP optimal is < 0.5 mg/L)
  const crpDelta = (hsCrp - 0.5) * 1.3;

  // Metabolic impact (Fasting insulin optimal is ~3.5 uIU/mL)
  const insulinDelta = (fastingInsulin - 3.5) * 0.55;

  // Cardiorespiratory fitness (VO2 max benchmark ~38)
  const vo2Delta = -(vo2Max - 38) * 0.22;

  // Deep sleep architecture (benchmark ~16%)
  const sleepDelta = -(deepSleepPercent - 16) * 0.25;

  // Telomere integrity (benchmark 1.0 ratio)
  const telomereDelta = -(telomereRatio - 1.0) * 4.2;

  const totalAgeDelta = Number(
    (grimAgeDelta + crpDelta + insulinDelta + vo2Delta + sleepDelta + telomereDelta).toFixed(1)
  );

  const biologicalAge = Number(
    Math.max(18, chronologicalAge + totalAgeDelta).toFixed(1)
  );

  // 2. DunedinPACE Rate of Aging (years per calendar year)
  // 1.00 = aging at exactly 1 biological year per calendar year
  // < 0.85 = slow ager, > 1.10 = accelerated ager
  const basePace = 0.98;
  const paceFromGrim = (grimAgeIndex - 1.0) * 0.42;
  const paceFromCrp = (hsCrp - 0.5) * 0.05;
  const paceFromInsulin = (fastingInsulin - 3.5) * 0.02;
  const paceFromVo2 = -(vo2Max - 38) * 0.007;
  const paceFromSleep = -(deepSleepPercent - 16) * 0.008;
  const paceFromTelomere = -(telomereRatio - 1.0) * 0.15;

  const rawPace = basePace + paceFromGrim + paceFromCrp + paceFromInsulin + paceFromVo2 + paceFromSleep + paceFromTelomere;
  const dunedinPace = Number(Math.max(0.62, Math.min(1.48, rawPace)).toFixed(2));

  // 3. Healthspan Extension / Loss
  // Expected extension in quality disease-free years
  const paceBenefit = (1.0 - dunedinPace) * 22;
  const ageBenefit = -totalAgeDelta * 0.85;
  const healthspanExtensionYears = Number(
    Math.max(-12, Math.min(22, paceBenefit + ageBenefit)).toFixed(1)
  );

  // 4. Overall Longevity Score (0 - 100)
  let score = 75 - totalAgeDelta * 2.8 - (dunedinPace - 1.0) * 45;
  score = Math.max(15, Math.min(99, Math.round(score)));

  // 5. Tier classification
  let tier: EpigeneticSimulationOutput["tier"] = "Normative";
  if (dunedinPace <= 0.78 && totalAgeDelta <= -3.5) {
    tier = "Super-Ager";
  } else if (dunedinPace <= 0.90 && totalAgeDelta <= -0.5) {
    tier = "Optimized";
  } else if (dunedinPace > 1.08 || totalAgeDelta > 3.0) {
    tier = "Accelerated";
  }

  // 6. Projected Lifespan (assuming normative 80 baseline)
  const projectedLifespan = Math.round(80 + healthspanExtensionYears * 0.75);

  // 7. Weakest Biomarker Identification & Action Items
  const risks: { factor: string; severity: number; action: string }[] = [];

  if (hsCrp > 1.2) {
    risks.push({
      factor: "Systemic Micro-inflammation (hs-CRP)",
      severity: hsCrp * 2,
      action: "Initiate pulsed Fisetin senolytic protocol and high-potency DHA/EPA (>2000 mg/day).",
    });
  }
  if (fastingInsulin > 7.0) {
    risks.push({
      factor: "Subclinical Insulin Resistance (Fasting Insulin)",
      severity: fastingInsulin * 1.5,
      action: "Adopt 16:8 circadian time-restricted feeding and postprandial 15-minute walks.",
    });
  }
  if (vo2Max < 36) {
    risks.push({
      factor: "Cardiorespiratory Capacity (VO2 Max)",
      severity: (45 - vo2Max) * 1.2,
      action: "Incorporate 150 min/week Zone 2 aerobic base + 1 weekly session of Norwegian 4x4 intervals.",
    });
  }
  if (grimAgeIndex > 1.05) {
    risks.push({
      factor: "Epigenetic Methylation Acceleration (GrimAge)",
      severity: (grimAgeIndex - 1.0) * 40,
      action: "Combine NMN/NR (850 mg/day) with TMG to replenish intracellular NAD+ and sirtuin activity.",
    });
  }
  if (deepSleepPercent < 15) {
    risks.push({
      factor: "Impaired Glymphatic Clearance (Deep Sleep < 15%)",
      severity: (18 - deepSleepPercent) * 2.5,
      action: "Target 18°C bedroom temperature, cut blue light 90 min pre-bed, and supplement Magnesium L-Threonate.",
    });
  }

  risks.sort((a, b) => b.severity - a.severity);

  const primaryRiskFactor =
    risks.length > 0 ? risks[0].factor : "None detected (All biomarkers within optimal longevity zone)";

  const topActionItems =
    risks.length > 0
      ? risks.slice(0, 3).map((r) => r.action)
      : [
          "Maintain current Zone 2 base and nutritional circadian rhythm.",
          "Perform follow-up 850k CpG Epigenetic re-test in 6 months to measure longevity trajectory.",
          "Explore intermittent thermal hormesis (Finnish sauna 4x/week) for heat shock protein maintenance.",
        ];

  return {
    biologicalAge,
    ageDelta: totalAgeDelta,
    dunedinPace,
    healthspanExtensionYears,
    overallScore: score,
    tier,
    projectedLifespan,
    primaryRiskFactor,
    topActionItems,
  };
}
