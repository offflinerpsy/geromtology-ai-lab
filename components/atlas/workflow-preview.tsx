import { DocumentLink as Link } from '@/components/site/research-link';
import { calculatePhenoAge, sampleBiomarkers } from '@/lib/phenoage';

/** Real, reproducible calculator output; clearly identified as a synthetic example. */
export default function WorkflowPreview() {
  const result = calculatePhenoAge(sampleBiomarkers, 'si');
  return <aside className="workflow-preview" aria-label="Explore a research workflow">
    <div className="workflow-preview-heading"><span>Inside the prototype</span><span>Synthetic example</span></div>
    <Link href="/tools/phenoage" className="workflow-measure">
      <span className="atlas-kicker">Clinical PhenoAge · published model</span>
      <p><strong>{result.phenotypicAge.toFixed(1)}</strong><span>model years<br/>at age 50</span></p>
      <svg viewBox="0 0 360 60" aria-hidden="true"><path d="M0 47H360" stroke="currentColor" strokeOpacity=".18"/><path d="M0 47C60 47 65 44 100 24S143 10 172 28 213 43 260 27 300 17 360 20" fill="none" stroke="currentColor" strokeWidth="1.7"/><circle cx="160" cy="22" r="4" fill="currentColor"/></svg>
      <small>Illustrative signal · Open the calculator</small>
    </Link>
    <Link className="workflow-source" href="/laboratory/evidence#levine-phenoage-2018"><span>Read the method</span><h2>What does this measure actually capture?</h2><p>Compare inputs, populations and outcomes before interpreting a result.</p><small>Explore evidence & methods</small></Link>
    <Link href="/tools/study-planner" className="workflow-plan"><span>Plan the next study</span><span>Sample size & power</span></Link>
  </aside>;
}
