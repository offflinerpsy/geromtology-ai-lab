import { readBoundedText } from '@/lib/bounded-text';
import { env } from 'cloudflare:workers';
import { getResearchUser } from '@/app/research-auth';
import { evidenceSources, EVIDENCE_VERSION } from '@/lib/atlas-evidence';
import { resolveAIProvider } from '@/lib/ai-provider';
import { researchInput, runResearch } from '@/lib/research-assistant';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
function settings(){return resolveAIProvider(env as unknown as Record<string,string|undefined>);}
export async function GET(){const config=settings();const user=await getResearchUser();return Response.json({authenticated:!!user,configured:!!config,provider:config?.label,sourceCount:evidenceSources.length,corpusVersion:EVIDENCE_VERSION,modes:['literature','curated']},{headers});}
export async function POST(request:Request){
  const user=await getResearchUser();if(!user)return Response.json({error:'Sign in to use the research assistant.'},{status:401,headers});
  const config=settings();if(!config)return Response.json({error:'The AI connection is unavailable. The evidence library remains accessible.',code:'AI_NOT_CONFIGURED'},{status:503,headers});
  const origin=request.headers.get('origin');if(origin!==new URL(request.url).origin)return Response.json({error:'This request must originate from the laboratory.'},{status:403,headers});
  try{
    const raw=await readBoundedText(request,32000);
    let value:unknown;try{value=JSON.parse(raw);}catch{return Response.json({error:'The request could not be read.'},{status:400,headers});}
    const parsed=researchInput.safeParse(value);if(!parsed.success)return Response.json({error:'Enter a research question of 8–2,000 characters. Use up to three previous turns.'},{status:400,headers});
    const data=parsed.data;
    const selected=evidenceSources.filter(s=>data.sourceIds.includes(s.id));
    if(data.mode==='curated'&&(!selected.length||selected.length!==new Set(data.sourceIds).size))return Response.json({error:'Choose one to six sources from the current library.'},{status:400,headers});
    const db=env.DB;if(!db)return Response.json({error:'Research assistance is temporarily unavailable.'},{status:503,headers});
    const now=Date.now(),minute=Math.floor(now/60000),day=Math.floor(now/86400000);
    await db.prepare('DELETE FROM contact_rate_limits WHERE expires_at < ?').bind(now).run();
    // Durable per-user and site-wide ceilings also bound off-topic classification costs.
    for(const [identity,bucket,limit,expiry] of [[user.userId,`minute:${minute}`,6,(minute+2)*60000],[user.userId,`day:${day}`,40,(day+1)*86400000],['site',`day:${day}`,300,(day+1)*86400000]] as const){
      const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${bucket}:${identity}`));
      const key='research:'+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
      const quota=await db.prepare('INSERT INTO contact_rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(key,expiry,limit).first();
      if(!quota)return Response.json({error:limit===6?'Please wait a minute before asking again.':'The daily research allowance has been reached. Please return tomorrow.',code:'RESEARCH_LIMIT'},{status:429,headers:{...headers,'Retry-After':String(Math.max(1,Math.ceil((expiry-now)/1000)))}});
    }
    const result=await runResearch(data,config,selected,AbortSignal.any([AbortSignal.timeout(90000),request.signal]));
    return Response.json(result,{headers});
  }catch(error){
    if(error instanceof Error&&error.message==='BODY_TOO_LARGE')return Response.json({error:'The request or retrieved material exceeded the supported size. Try a narrower question.'},{status:413,headers});
    if(error instanceof Error&&(error.name==='TimeoutError'||error.name==='AbortError'))return Response.json({error:'This request timed out or was cancelled. Your question is preserved; try a narrower question.'},{status:504,headers});
    if(error instanceof Error&&error.message==='LITERATURE_UNAVAILABLE')return Response.json({error:'The literature search is temporarily unavailable. Try again, or choose curated notes. No answer was generated from model memory.'},{status:502,headers});
    return Response.json({error:'We could not complete a verified, source-linked answer. Please retry with a focused research question.'},{status:502,headers});
  }
}
