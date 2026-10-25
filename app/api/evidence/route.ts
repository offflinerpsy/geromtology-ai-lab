import { env } from 'cloudflare:workers';
import { evidenceSources, EVIDENCE_VERSION } from '@/lib/atlas-evidence';
import { resolveAIProvider } from '@/lib/ai-provider';
import { handlePublicResearch, publicResearchStatus, researchResponseHeaders } from '@/lib/public-research-access';

export const dynamic = 'force-dynamic';
function settings() { return resolveAIProvider(env as unknown as Record<string, string | undefined>); }

export async function GET() {
  return Response.json(publicResearchStatus(settings(), !!env.DB, evidenceSources.length, EVIDENCE_VERSION), { headers: researchResponseHeaders });
}

export async function POST(request: Request) {
  return handlePublicResearch(request, { config: settings(), db: env.DB, sources: evidenceSources });
}
