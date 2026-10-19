import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numericInput } from '../lib/numeric-input.ts';
import { sampleBiomarkers, calculatePhenoAge } from '../lib/phenoage.ts';

test('custom numeric entry accepts decimal commas and pasted scientific notation without changing PhenoAge', () => {
  const entered = Object.fromEntries(Object.entries(sampleBiomarkers).map(([key, value]) => [key, numericInput(` ${String(value).replace('.', ',')} `)]));
  assert.equal(calculatePhenoAge(entered, 'si').phenotypicAge, calculatePhenoAge(sampleBiomarkers, 'si').phenotypicAge);
  assert.equal(numericInput('5e-2'), .05);
  assert.equal(numericInput('.5'), .5);
  assert.equal(numericInput('50.'), 50);
});

test('empty, partial and non-decimal entries never become plausible calculator values', () => {
  for (const text of ['', '  ', '.', '-', '+', '0x32', '1,000,000', '1.2.3', '50 years', 'Infinity', 'NaN', '5e']) {
    assert.ok(Number.isNaN(numericInput(text)), text);
  }
});
