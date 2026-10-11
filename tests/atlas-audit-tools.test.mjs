import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evidenceSources, searchEvidence } from '../lib/atlas-evidence.ts';
import { biomarkerFields, sampleBiomarkers, validateBiomarkers, calculatePhenoAge, convertUnits } from '../lib/phenoage.ts';

test('editorial entry points distinguish original work, reviews, guidance and documentation', () => {
  assert.equal(searchEvidence('')[0].id, 'levine-phenoage-2018');
  assert.equal(searchEvidence('').at(-1).id, 'r-power-t-test');
  const review = searchEvidence('', 'All fields', false, 'Review');
  assert.deepEqual(review.map(s => s.id), ['hallmarks-2023']);
  assert.equal(searchEvidence('', 'All fields', false, 'Guidance & public health').length, 2);
  assert.equal(evidenceSources.find(s => s.id === 'r-power-t-test').sourceType, 'Method documentation');
  assert.ok(!searchEvidence('', 'All fields', false, 'Original research').some(s => s.id.startsWith('who-') || s.id === 'hallmarks-2023'));
});
test('field, publication date and document type filters combine without treating an access date as publication', () => {
  const clocks = searchEvidence('methylation', 'Aging clocks', true, 'Original research');
  assert.ok(clocks.length > 0);
  assert.ok(clocks.every(s => s.category === 'Aging clocks' && s.year >= 2020 && s.sourceType === 'Original research'));
  assert.equal(searchEvidence('', 'All fields', true, 'Method documentation').length, 0);
  assert.equal(searchEvidence('unmatchablewordxyz').length, 0);
});
test('every PhenoAge field rejects empty, nonfinite and out-of-range values in both unit systems', () => {
  for (const field of biomarkerFields) {
    for (const invalid of [NaN, Infinity, field.min - 1, field.max + 1]) {
      const input = { ...sampleBiomarkers, [field.key]: invalid };
      for (const units of ['si', 'conventional']) {
        const converted = convertUnits(input, 'si', units);
        assert.ok(validateBiomarkers(converted, units)[field.key], `${field.key} ${units} ${invalid}`);
        assert.throws(() => calculatePhenoAge(converted, units));
      }
    }
  }
});
