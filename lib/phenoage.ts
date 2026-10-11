/** Published clinical PhenoAge, Levine et al. (2018), original fixed coefficients.
 * Source: doi:10.18632/aging.101414; original precision reproduced by the
 * authors' BioAge project (phenoage_calc.R, orig=TRUE). Independent implementation.
 * CRP is raw mg/dL, transformed with the natural logarithm exactly once.
 */
export const PHENOAGE_VERSION = 'Levine 2018 · original coefficients';
export type BiomarkerKey = 'age' | 'albumin' | 'creatinine' | 'glucose' | 'crp' | 'lymphocytes' | 'mcv' | 'rdw' | 'alp' | 'wbc';
export type BiomarkerValues = Record<BiomarkerKey, number>;
export type UnitSystem = 'si' | 'conventional';
export const biomarkerFields: { key: BiomarkerKey; label: string; si: string; conventional: string; min: number; max: number; detail: string }[] = [
  {key:'age',label:'Chronological age',si:'years',conventional:'years',min:20,max:100,detail:'Age on the date of the blood test'},
  {key:'albumin',label:'Albumin',si:'g/L',conventional:'g/dL',min:1,max:80,detail:'Serum albumin'},
  {key:'creatinine',label:'Creatinine',si:'µmol/L',conventional:'mg/dL',min:1,max:2000,detail:'Serum creatinine'},
  {key:'glucose',label:'Glucose',si:'mmol/L',conventional:'mg/dL',min:0.1,max:60,detail:'Serum glucose'},
  {key:'crp',label:'C-reactive protein',si:'mg/L',conventional:'mg/dL',min:0.00001,max:1000,detail:'Enter a measured value greater than zero'},
  {key:'lymphocytes',label:'Lymphocytes',si:'%',conventional:'%',min:0,max:100,detail:'Percentage, not absolute cell count'},
  {key:'mcv',label:'Mean cell volume',si:'fL',conventional:'fL',min:10,max:200,detail:'MCV'},
  {key:'rdw',label:'Red cell distribution width',si:'%',conventional:'%',min:1,max:50,detail:'RDW-CV percentage, not RDW-SD'},
  {key:'alp',label:'Alkaline phosphatase',si:'U/L',conventional:'U/L',min:1,max:3000,detail:'ALP enzyme activity'},
  {key:'wbc',label:'White blood cells',si:'10⁹/L',conventional:'10³/µL',min:0.01,max:200,detail:'Equivalent numeric units in both systems'},
];
export const sampleBiomarkers: BiomarkerValues = {age:50,albumin:44,creatinine:80,glucose:5.1,crp:1,lymphocytes:32,mcv:90,rdw:13,alp:65,wbc:5.5};
export function convertUnits(values: BiomarkerValues, from: UnitSystem, to: UnitSystem): BiomarkerValues {
  if (from === to) return {...values};
  const f = from === 'si' ? -1 : 1;
  return {...values,albumin:values.albumin * 10 ** f,creatinine:values.creatinine * 88.4 ** f,glucose:values.glucose * 18.0182 ** -f,crp:values.crp * 10 ** f};
}
export function validateBiomarkers(values: Partial<BiomarkerValues>, units: UnitSystem): Partial<Record<BiomarkerKey,string>> {
  const errors: Partial<Record<BiomarkerKey,string>> = {};
  const normalized = units === 'si' ? values : convertUnits(values as BiomarkerValues, 'conventional', 'si');
  for (const field of biomarkerFields) {
    const v = normalized[field.key];
    if (values[field.key] === undefined || !Number.isFinite(values[field.key])) errors[field.key] = 'Enter a numeric value.';
    else if (v === undefined || v < field.min || v > field.max) errors[field.key] = field.key === 'crp' ? 'CRP must be measured and greater than zero. Values below detection cannot be used directly.' : `Check the value and its unit (${field.si}).`;
  }
  return errors;
}
export function calculatePhenoAge(values: BiomarkerValues, units: UnitSystem) {
  if (Object.keys(validateBiomarkers(values, units)).length) throw new Error('Incomplete or invalid biomarker data');
  const v = units === 'si' ? {...values} : convertUnits(values,'conventional','si');
  const terms = [
    {key:'albumin',coefficient:-0.03359355,value:v.albumin},
    {key:'creatinine',coefficient:0.009506491,value:v.creatinine},
    {key:'glucose',coefficient:0.1953192,value:v.glucose},
    {key:'crp',coefficient:0.09536762,value:Math.log(v.crp / 10)},
    {key:'lymphocytes',coefficient:-0.01199984,value:v.lymphocytes},
    {key:'mcv',coefficient:0.02676401,value:v.mcv},
    {key:'rdw',coefficient:0.3306156,value:v.rdw},
    {key:'alp',coefficient:0.001868778,value:v.alp},
    {key:'wbc',coefficient:0.05542406,value:v.wbc},
    {key:'age',coefficient:0.08035356,value:v.age},
  ];
  const xb = -19.90667 + terms.reduce((total,term)=>total + term.coefficient * term.value,0);
  // Algebraic log-hazard form avoids numerical cancellation at extreme inputs.
  const phenotypicAge = 141.50225 + (Math.log(0.0055305 * 1.51714 / 0.007692696) + xb) / 0.090165;
  return {phenotypicAge,chronologicalAge:v.age,difference:phenotypicAge-v.age,normalized:v,terms,version:PHENOAGE_VERSION};
}
