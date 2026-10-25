import {pageMetadata} from '@/lib/seo';
import {DocumentLink as Link} from '@/components/site/research-link';
import StartPaths from '@/components/site/start-paths';
export const metadata=pageMetadata('Where to start — ProAge Atlas','Ask about aging research, take a health check-in or use a research calculator. Choose a clear starting point.','/laboratory');
export default function Page(){return <main id="main" className="atlas workspace-start"><div className="atlas-container"><header className="atlas-heading"><h1>Where would you<br/><em>like to start?</em></h1><p className="atlas-lead">A question, a check-in or a calculation. Choose the path that fits what you need.</p></header><StartPaths/><p className="workspace-secondary">Looking for a particular study? <Link href="/laboratory/evidence">Browse the evidence library.</Link></p></div></main>}
