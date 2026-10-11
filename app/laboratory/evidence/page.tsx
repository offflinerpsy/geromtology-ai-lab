import { pageMetadata } from '@/lib/seo';
import AtlasShell from '@/components/atlas/shell';
import AtlasEvidenceLibrary from '@/components/atlas/evidence-library';
export const metadata = pageMetadata('Evidence Library — ProAge Atlas', 'Explore original aging-clock research, human trials, functional assessment and statistical methods with curated notes and explicit limitations.', '/laboratory/evidence');
export default function Page(){return <AtlasShell active="/laboratory/evidence" eyebrow="ProAge Atlas · Primary sources" title={<>Follow the <em>evidence.</em></>} description="From molecular clocks to independence in everyday life. A considered research collection, with study types, methods and limitations kept visible."><AtlasEvidenceLibrary/></AtlasShell>}
