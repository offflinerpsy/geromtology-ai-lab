import { env } from 'cloudflare:workers';
import { getResearchUser } from '@/app/research-auth';
import { evidenceSources, EVIDENCE_VERSION } from '@/lib/atlas-evidence';
import { buildCopilotRequest, parseCitedAnswer } from '@/lib/evidence-copilot';
import { resolveAIProvider, providerHeaders } from '@/lib/ai-provider';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
function settings(){return resolveAIProvider(env as unknown as Record<string,string|undefined>);}
export async function GET(){const config=settings();const user=await getResearchUser();return Response.json({authenticated:!!user,configured:!!config,provider:config?.label,sourceCount:evidenceSources.length,corpusVersion:EVIDENCE_VERSION},{headers});}
export async function POST(request:Request){
  const user=await getResearchUser();if(!user)return Response.json({error:'Sign in to use AI synthesis.'},{status:401,headers});
  const config=settings();if(!config)return Response.json({error:'AI synthesis is not connected yet. Source discovery remains available.',code:'AI_NOT_CONFIGURED'},{status:503,headers});
  const {model}=config;
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'This request must originate from the laboratory.'},{status:403,headers});
  try{
    const raw=await request.text();if(raw.length>8000)return Response.json({error:'The question is too long.'},{status:413,headers});
    const data=JSON.parse(raw) as {question?:unknown;sourceIds?:unknown};
    if(typeof data.question!=='string'||data.question.trim().length<8||data.question.length>2000||!Array.isArray(data.sourceIds)||data.sourceIds.length<1||data.sourceIds.length>6||data.sourceIds.some(s=>typeof s!=='string'))return Response.json({error:'Enter a research question and select one to six sources.'},{status:400,headers});
    const selected=evidenceSources.filter(s=>(data.sourceIds as string[]).includes(s.id));
    if(selected.length!==new Set(data.sourceIds).size)return Response.json({error:'Select sources from the current library.'},{status:400,headers});
    const now=Date.now(); const minute=Math.floor(now/60000); const db=env.DB;
    if(!db)return Response.json({error:'Research assistance is temporarily unavailable.'},{status:503,headers});
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${minute}:${user.userId}`));
    const quotaKey='ai:'+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
    await db.prepare('DELETE FROM contact_rate_limits WHERE expires_at < ?').bind(now).run();
    const quota=await db.prepare('INSERT INTO contact_rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<8 RETURNING count').bind(quotaKey,(minute+3)*60000).first();
    if(!quota)return Response.json({error:'Please wait a minute before requesting another synthesis.'},{status:429,headers:{...headers,'Retry-After':'60'}});
    const response=await fetch(config.url,{method:'POST',headers:providerHeaders(config),body:JSON.stringify(buildCopilotRequest(data.question.trim(),selected,model)),signal:AbortSignal.any([AbortSignal.timeout(60000),request.signal])});
    if(!response.ok)return Response.json({error:response.status===429?'The AI provider is busy. Try again shortly.':'AI synthesis is temporarily unavailable. Your selected sources are still accessible.'},{status:502,headers});
    const payload=await response.json() as {status?:string;output?:{type:string;content?:{type:string;text?:string}[]}[]};
    if(payload.status!=='completed')return Response.json({error:'The provider did not complete this answer. Try a narrower question.'},{status:502,headers});
    const text=payload.output?.filter(o=>o.type==='message').flatMap(o=>o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text||'').join('');
    const answer=parseCitedAnswer(JSON.parse(text||'null'),selected);
    return Response.json({answer,sourceIds:selected.map(s=>s.id),corpusVersion:EVIDENCE_VERSION,model},{headers});
  }catch(error){if(error instanceof Error&&(error.name==='TimeoutError'||error.name==='AbortError'))return Response.json({error:'The answer timed out or was cancelled. Your question and sources are preserved.'},{status:504,headers});if(error instanceof SyntaxError)return Response.json({error:'The question or answer could not be read. Please try again.'},{status:400,headers});return Response.json({error:'We could not verify a complete source-linked answer. Try a narrower question.'},{status:502,headers});}
}
