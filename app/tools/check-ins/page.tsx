import {pageMetadata} from '@/lib/seo';
import Link from '@/components/site/research-link';
import {CheckInCollection} from '@/components/atlas/health-checkins';
export const metadata=pageMetadata('Health check-ins','Short English questionnaires for wellbeing, strength and changes in everyday health. Private, account-free check-ins with clear methods.','/tools/check-ins');
export default function Page(){return <main id="main" className="atlas checkin-page"><div className="atlas-container"><nav className="checkin-breadcrumb" aria-label="Tools navigation"><Link href="/tools">All tools</Link></nav><header className="checkin-heading"><h1>A moment to<br/><em>check in.</em></h1><p>Choose what you want to understand. Answer one question at a time, then keep a clear summary of your responses.</p></header><CheckInCollection/></div></main>;}
