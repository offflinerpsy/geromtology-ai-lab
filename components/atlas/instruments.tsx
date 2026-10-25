import {DocumentLink as Link} from '@/components/site/research-link';
import ResearchFlow from '@/components/science/research-flow';
export default function Instruments(){return <section className="research-tools-section" aria-labelledby="research-tools-heading"><h2 id="research-tools-heading">Research <em>calculators.</em></h2><div className="research-tool-cards">
  <Link className="research-tool-card" href="/tools/phenoage"><div><h3>PhenoAge Explorer</h3><p>Explore clinical phenotypic age using chronological age and nine blood biomarkers.</p></div><ResearchFlow variant="measurement"/><p className="tool-requirement">You will need laboratory results and their units.</p><span>Open calculator</span></Link>
  <Link className="research-tool-card" href="/tools/study-planner"><div><h3>Study Planner</h3><p>Estimate sample size and statistical power for a two-group study.</p></div><ResearchFlow variant="study"/><p className="tool-requirement">Set the expected difference, variation and study assumptions.</p><span>Plan a study</span></Link>
</div></section>}
