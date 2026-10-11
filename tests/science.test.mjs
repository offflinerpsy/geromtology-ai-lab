import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculatePhenoAge, sampleBiomarkers, convertUnits, validateBiomarkers } from '../lib/phenoage.ts';
import { planStudy, studyPower, validateStudy } from '../lib/study-planner.ts';
import { parseCitedAnswer, buildCopilotRequest } from '../lib/evidence-copilot.ts';
import { resolveAIProvider, providerHeaders } from '../lib/ai-provider.ts';

const close=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} differs from ${expected} by ${Math.abs(actual-expected)}`);
test('clinical PhenoAge agrees with independently evaluated original Gompertz probability formula',()=>{
  // Oracle evaluated in Python using the original probability-space formulation,
  // not the algebraic log-hazard expression used in application code.
  close(calculatePhenoAge(sampleBiomarkers,'si').phenotypicAge,41.75015731945774);
  close(calculatePhenoAge({...sampleBiomarkers,age:75,crp:18,albumin:38,rdw:15.5,creatinine:115},'si').phenotypicAge,82.17952969749547);
});
test('unit conversion preserves the model and CRP mg/L is divided by ten before taking its logarithm',()=>{
  const conventional=convertUnits(sampleBiomarkers,'si','conventional');
  close(conventional.albumin,4.4);close(conventional.creatinine,80/88.4);close(conventional.glucose,5.1*18.0182);close(conventional.crp,.1);
  close(calculatePhenoAge(conventional,'conventional').phenotypicAge,calculatePhenoAge(sampleBiomarkers,'si').phenotypicAge);
  const back=convertUnits(conventional,'conventional','si');for(const key of Object.keys(sampleBiomarkers))close(back[key],sampleBiomarkers[key]);
});
test('missing, nonfinite, zero-CRP and impossible percentage inputs are blocked',()=>{
  for(const values of [{...sampleBiomarkers,crp:0},{...sampleBiomarkers,albumin:NaN},{...sampleBiomarkers,age:19},{...sampleBiomarkers,lymphocytes:101},{...sampleBiomarkers,creatinine:Infinity}]){
    assert.ok(Object.keys(validateBiomarkers(values,'si')).length);assert.throws(()=>calculatePhenoAge(values,'si'));
  }
  const missing={...sampleBiomarkers};delete missing.wbc;assert.ok(validateBiomarkers(missing,'si').wbc);
});
test('noncentral t power agrees with independent SciPy distribution fixtures',()=>{
  // SciPy 1.17.0: nct.sf(t.ppf(1-alpha/2,df),df,nc) + nct.cdf(-cut,df,nc).
  const fixtures=JSON.parse(readFileSync(new URL('./power-fixtures.json',import.meta.url)));
  for(const f of fixtures)close(studyPower(f.nA,f.nB,f.effect,f.alpha),f.expected,2e-5);
});
test('sample-size planning rounds up the minimum and inflates recruitment per group',()=>{
  const assumptions={difference:5,sd:10,alpha:.05,power:.8,ratio:1,dropout:.15};
  const plan=planStudy(assumptions);assert.equal(plan.nA,64);assert.equal(plan.nB,64);assert.equal(plan.recruitA,76);assert.equal(plan.recruitTotal,152);
  assert.ok(studyPower(plan.nA-1,plan.nB-1,.5,.05)<.8);assert.ok(plan.achievedPower>=.8);
  assert.equal(planStudy({...assumptions,difference:3,dropout:0}).nA,176);
  const unequal=planStudy({...assumptions,ratio:2});assert.equal(unequal.nB,unequal.nA*2);assert.ok(unequal.achievedPower>=.8);
  // Boundary oracle: SciPy noncentral-t power(.025, .01, .99) needs 76,902/arm.
  // Doubling must not reject a feasible design between 65,536 and 100,000.
  assert.equal(planStudy({difference:.025,sd:1,alpha:.01,power:.99,ratio:1,dropout:0}).nA,76902);
});
test('power rises with sample size and requested power, and invalid designs do not produce a result',()=>{
  assert.ok(studyPower(100,100,.5,.05)>studyPower(64,64,.5,.05));
  const v={difference:5,sd:10,alpha:.05,power:.8,ratio:1,dropout:0};assert.ok(planStudy({...v,power:.9}).nA>planStudy(v).nA);
  for(const change of [{difference:0},{sd:-1},{alpha:0},{ratio:0},{power:1},{dropout:.8}]){assert.ok(validateStudy({...v,...change}));assert.throws(()=>planStudy({...v,...change}));}
});
const source={id:'verified',title:'Research paper',authors:'Author',year:2020,url:'https://doi.org/10.test/source',category:'Aging clocks',studyType:'Observational',summary:'A source note.',limitation:'Observational only.',tags:[]};
const answer={title:'A qualified answer',paragraphs:[{heading:'Finding',body:'A research finding.',sourceIds:['verified']}],limitations:['Observational evidence cannot establish causality.']};
test('AI output rejects invented citations, uncited paragraphs and invalid structures',()=>{
  assert.deepEqual(parseCitedAnswer(answer,[source]),answer);
  assert.throws(()=>parseCitedAnswer({...answer,paragraphs:[{...answer.paragraphs[0],sourceIds:['invented']}]},[source]));
  assert.throws(()=>parseCitedAnswer({...answer,paragraphs:[{...answer.paragraphs[0],sourceIds:[]}]},[source]));
  assert.throws(()=>parseCitedAnswer({...answer,unexpected:true},[source]));
});
test('the model request includes only chosen public notes and a bounded citation schema',()=>{
  const request=buildCopilotRequest('Compare the model with chronological age.',[source],'gpt-4.1-mini');
  assert.equal(request.store,false);assert.equal(request.max_output_tokens,2000);assert.equal(request.text.format.strict,true);
  assert.deepEqual(request.text.format.schema.properties.paragraphs.items.properties.sourceIds.items.enum,['verified']);
  assert.equal(JSON.parse(request.input).sourceNotes.length,1);assert.ok(request.instructions.includes('not from memory'));
});
test('Azure uses the configured deployment and api-key header, rejects untrusted endpoints, and never falls back with an Azure secret',()=>{
  const config={AZURE_OPENAI_API_KEY:'test-secret',AZURE_OPENAI_RESPONSES_URL:'https://resource.services.ai.azure.com/openai/v1/responses',AZURE_OPENAI_DEPLOYMENT:'gpt-6-luna'};
  const provider=resolveAIProvider(config);assert.equal(provider.provider,'azure');assert.equal(provider.model,'gpt-6-luna');
  assert.equal(providerHeaders(provider)['api-key'],'test-secret');assert.equal(providerHeaders(provider).Authorization,undefined);
  for(const url of ['http://resource.services.ai.azure.com/openai/v1/responses','https://services.ai.azure.com.attacker.test/openai/v1/responses','https://resource.services.ai.azure.com/other','https://resource.services.ai.azure.com/openai/v1/responses?key=secret'])assert.equal(resolveAIProvider({...config,AZURE_OPENAI_RESPONSES_URL:url,OPENAI_API_KEY:'another-test-secret'}),null);
  assert.equal(resolveAIProvider({...config,AZURE_OPENAI_DEPLOYMENT:undefined}),null);
  assert.equal(resolveAIProvider({}),null);
  const luna=buildCopilotRequest('Compare these measurements.',[source],'gpt-6-luna');assert.equal(luna.max_output_tokens,5000);assert.equal(luna.reasoning.effort,'medium');assert.equal(luna.store,false);
});
