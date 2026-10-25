import {pageMetadata} from '@/lib/seo';
import AtlasShell from '@/components/atlas/shell';
import EvidenceCopilot from '@/components/atlas/evidence-copilot';
export const metadata=pageMetadata('Ask AI — Evidence Copilot','Ask a question about aging research and explore an answer with scientific sources. No account required.','/laboratory/ask');
export default async function Page({searchParams}:{searchParams:Promise<{source?:string}>}){
  const {source}=await searchParams;
  return <AtlasShell compact active="/laboratory/ask" eyebrow="" title={<>Ask a better<br/><em>research question.</em></>} description="Explore aging research with Evidence Copilot. Ask, read the sources, then follow up. No account needed."><EvidenceCopilot initialSource={source}/></AtlasShell>;
}
