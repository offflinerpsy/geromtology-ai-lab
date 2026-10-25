import {notFound} from 'next/navigation';
import {pageMetadata} from '@/lib/seo';
import {getCheckIn,healthCheckIns} from '@/lib/health-checkins';
import Link from '@/components/site/research-link';
import {CheckInQuestionnaire} from '@/components/atlas/health-checkins';
export function generateStaticParams(){return healthCheckIns.map(check=>({slug:check.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const check=getCheckIn(slug);return check?pageMetadata(`${check.title} check-in`,check.description,`/tools/check-ins/${check.slug}`):{};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const check=getCheckIn(slug);if(!check)notFound();return <main id="main" className="atlas checkin-page checkin-detail"><div className="atlas-container"><nav className="checkin-breadcrumb" aria-label="Check-in navigation"><Link href="/tools/check-ins">All check-ins</Link><Link href="/tools">Tools</Link></nav><header className="checkin-heading"><h1>{check.title}<em> check-in.</em></h1><p>{check.description}</p></header><CheckInQuestionnaire check={check}/></div></main>;}
