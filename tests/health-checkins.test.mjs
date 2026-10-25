import {test} from 'node:test';
import assert from 'node:assert/strict';
import {healthCheckIns,getCheckIn,checkInResult,answeredCount} from '../lib/health-checkins.ts';
const answers=(check,value=0)=>Object.fromEntries(check.questions.map(q=>[q.id,value]));
const withTotal=(check,total)=>{const result=answers(check);for(const q of check.questions.filter(q=>q.scored)){const max=Math.max(...q.options.map(o=>o.value));result[q.id]=Math.min(max,total);total-=result[q.id];}return result;};
test('eleven distinct check-ins have complete English content and unique question identifiers',()=>{
  assert.equal(healthCheckIns.length,11);assert.equal(new Set(healthCheckIns.map(c=>c.slug)).size,11);
  for(const check of healthCheckIns){assert.ok(check.title&&check.description&&check.instructions&&check.attribution);assert.equal(new Set(check.questions.map(q=>q.id)).size,check.questions.length);for(const q of check.questions){assert.ok(q.text);assert.ok(q.options.length>=3);assert.equal(new Set(q.options.map(o=>o.value)).size,q.options.length);}}
  assert.equal(getCheckIn('unknown'),undefined);
});
test('missing, unknown, fractional or out-of-range answers never produce a plausible result',()=>{
  for(const check of healthCheckIns){assert.equal(answeredCount(check,{}),0);assert.throws(()=>checkInResult(check,{}));const base=answers(check);for(const bad of [NaN,Infinity,-1,.5,999])assert.throws(()=>checkInResult(check,{...base,[check.questions[0].id]:bad}));assert.throws(()=>checkInResult(check,{...base,invented:0}));assert.equal(answeredCount(check,base),check.questions.length);}
});
test('GAD-7 boundaries are 5,10,15 and daily impact does not change the 0–21 symptom sum',()=>{
  const check=getCheckIn('anxiety');
  for(const [total,band] of [[0,'Minimal'],[4,'Minimal'],[5,'Mild'],[9,'Mild'],[10,'Moderate'],[14,'Moderate'],[15,'Severe'],[21,'Severe']]){const input=withTotal(check,total);input.impact=3;const result=checkInResult(check,input);assert.equal(result.score,total);assert.equal(result.maximum,21);assert.ok(result.band.startsWith(band));}
});
test('PHQ-9 boundaries are 5,10,15,20 and item9 support is independent of total score',()=>{
  const check=getCheckIn('mood');
  for(const [total,band] of [[0,'Minimal'],[4,'Minimal'],[5,'Mild'],[9,'Mild'],[10,'Moderate symptom'],[14,'Moderate symptom'],[15,'Moderately severe'],[19,'Moderately severe'],[20,'Severe'],[27,'Severe']]){const result=checkInResult(check,withTotal(check,total));assert.equal(result.score,total);assert.equal(result.maximum,27);assert.ok(result.band.startsWith(band));}
  const low=answers(check);low.q9=1;const result=checkInResult(check,low);assert.equal(result.score,1);assert.equal(result.support,true);assert.equal(checkInResult(check,answers(check)).support,false);
});
test('SARC-F keeps original 0–10 scoring and threshold4 without claiming a diagnosis',()=>{
  const check=getCheckIn('muscle-function');assert.equal(check.questions.length,5);
  assert.equal(checkInResult(check,withTotal(check,3)).band,'Below the screening threshold');
  assert.equal(checkInResult(check,withTotal(check,4)).band,'Further assessment indicated');
  assert.equal(checkInResult(check,withTotal(check,10)).score,10);
  assert.match(check.interpretation,/does not rule out/);assert.match(check.interpretation,/does not measure muscle mass/);
});
test('original reflections return selected observations without invented totals, thresholds or biological age',()=>{
  for(const check of healthCheckIns.filter(c=>c.kind==='reflection')){const result=checkInResult(check,answers(check));assert.equal(result.score,null);assert.equal(result.maximum,null);assert.equal(result.band,null);assert.equal(result.summary.length,check.questions.length);assert.equal(result.support,false);}
  const pain=getCheckIn('pain');assert.equal(checkInResult(pain,{intensity:10,activities:3}).summary[0].detail,'Worst pain imaginable');
});
