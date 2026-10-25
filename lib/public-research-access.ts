import { isIP } from 'node:net';
import type { AIProvider } from './ai-provider.ts';
import type { EvidenceSource } from './atlas-evidence.ts';
import { readBoundedText } from './bounded-text.ts';
import { researchInput, runResearch } from './research-assistant.ts';

export const PUBLIC_RESEARCH_LIMITS = { perMinute: 3, perDay: 20, sitePerDay: 300 } as const;
export const researchResponseHeaders = { 'Cache-Control': 'no-store' };
type QuotaDatabase = {
  prepare(sql: string): {
    bind(...values: (string | number)[]): {
      run(): Promise<unknown>;
      first(): Promise<unknown>;
    };
  };
};
type ResearchDependencies = {
  config: AIProvider | null;
  db: QuotaDatabase | undefined;
  sources: EvidenceSource[];
  now?: () => number;
  research?: typeof runResearch;
};

export function publicResearchStatus(config: AIProvider | null, databaseAvailable: boolean, sourceCount: number, corpusVersion: string) {
  return {
    public: true,
    requiresSignIn: false,
    configured: !!config && databaseAvailable,
    provider: config?.label,
    sourceCount,
    corpusVersion,
    modes: ['literature', 'curated'],
    limits: { perMinute: PUBLIC_RESEARCH_LIMITS.perMinute, perDay: PUBLIC_RESEARCH_LIMITS.perDay },
  };
}

export function validResearchOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin && request.headers.get('sec-fetch-site') !== 'cross-site';
}

export function researchFailureDiagnostic(error: unknown) {
  // Log only these server-owned codes. Never log provider bodies, arbitrary messages,
  // request contents, credentials, source text, identities or a caught stack trace.
  const message = error instanceof Error ? error.message : '';
  const fixed = new Set(['RESEARCH_CONTEXT_UNAVAILABLE', 'RESEARCH_LIMITER_UNAVAILABLE', 'BODY_TOO_LARGE', 'LITERATURE_UNAVAILABLE', 'SCOPE_VALIDATION_FAILED', 'SEARCH_QUERY_INVALID', 'SYNTHESIS_CITATION_VALIDATION_FAILED']);
  const staged = /^(?:(?:SCOPE|SYNTHESIS)_AI_(?:NETWORK_FAILURE|READ_FAILURE|INVALID_JSON|INVALID_RESPONSE|INCOMPLETE_RESPONSE|PROVIDER_HTTP_[1-5]\d{2})|LITERATURE_(?:NETWORK_FAILURE|READ_FAILURE|INVALID_JSON|INVALID_RECORDS|HTTP_[1-5]\d{2}))$/;
  const names = new Set(['Error', 'TypeError', 'SyntaxError', 'ZodError', 'TimeoutError', 'AbortError']);
  return { code: fixed.has(message) || staged.test(message) ? message : 'UNEXPECTED_ERROR', errorType: error instanceof Error && names.has(error.name) ? error.name : 'UnknownError' };
}

function visitorNetwork(request: Request): string {
  // This Worker is served by Cloudflare. The edge supplies CF-Connecting-IP;
  // never fall back to a caller's forwarded IP, cookie, body or identity header.
  const ip = request.headers.get('cf-connecting-ip') || '';
  const family = isIP(ip);
  if (family === 4) return ip;
  if (family !== 6 || ip.includes('%')) throw new Error('RESEARCH_CONTEXT_UNAVAILABLE');
  const canonical = new URL(`https://[${ip}]`).hostname.slice(1, -1);
  const mapped = /^::ffff:([0-9a-f]+):([0-9a-f]+)$/i.exec(canonical);
  if (mapped) {
    const high = parseInt(mapped[1], 16), low = parseInt(mapped[2], 16);
    return [high >> 8, high & 255, low >> 8, low & 255].join('.');
  }
  // Temporary IPv6 address changes within the same /64 share an allowance.
  const [left, right = ''] = canonical.split('::');
  const start = left ? left.split(':') : [], end = right ? right.split(':') : [];
  const words = canonical.includes('::') ? [...start, ...Array(8 - start.length - end.length).fill('0'), ...end] : start;
  return `${words.slice(0, 4).map(word => parseInt(word, 16).toString(16)).join(':')}/64`;
}

const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');

export async function publicResearchQuota(request: Request, db: QuotaDatabase, serverKey: string, now: number) {
  const network = visitorNetwork(request);
  const minute = Math.floor(now / 60000), day = Math.floor(now / 86400000);
  // Keyed and day-scoped: DB rows contain no raw IP or reusable visitor identifier.
  // Domain separation keeps this use distinct from the server-only provider key.
  const hmac = await crypto.subtle.importKey('raw', new TextEncoder().encode(serverKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const visitor = hex(await crypto.subtle.sign('HMAC', hmac, new TextEncoder().encode(`proage-public-research:v1:${day}:${network}`)));
  const buckets = [
    { key: `research-public:minute:${minute}:${visitor}`, limit: PUBLIC_RESEARCH_LIMITS.perMinute, expires: (minute + 1) * 60000, type: 'minute' },
    { key: `research-public:day:${day}:${visitor}`, limit: PUBLIC_RESEARCH_LIMITS.perDay, expires: (day + 1) * 86400000, type: 'day' },
    // Preserve the existing site-wide bucket, including usage before this release.
    { key: 'research:' + hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`day:${day}:site`))), limit: PUBLIC_RESEARCH_LIMITS.sitePerDay, expires: (day + 1) * 86400000, type: 'site' },
  ];
  try {
    await db.prepare('DELETE FROM contact_rate_limits WHERE expires_at <= ?').bind(now).run();
    for (const bucket of buckets) {
      // SQLite atomically refuses an increment at the ceiling, including concurrent requests.
      const row = await db.prepare('INSERT INTO contact_rate_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(bucket.key, bucket.expires, bucket.limit).first();
      if (row === null) return { allowed: false as const, type: bucket.type, retryAfter: Math.max(1, Math.ceil((bucket.expires - now) / 1000)) };
      if (!row || typeof row !== 'object' || !('count' in row) || typeof row.count !== 'number' || row.count < 1 || row.count > bucket.limit) throw new Error('Invalid quota response');
    }
  } catch {
    throw new Error('RESEARCH_LIMITER_UNAVAILABLE');
  }
  return { allowed: true as const };
}

export async function handlePublicResearch(request: Request, dependencies: ResearchDependencies): Promise<Response> {
  const headers = researchResponseHeaders;
  if (!validResearchOrigin(request)) return Response.json({ error: 'Ask your question from this website.' }, { status: 403, headers });
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return Response.json({ error: 'Use the research question form.' }, { status: 415, headers });
  const { config, db, sources, research = runResearch, now = Date.now } = dependencies;
  if (!config) return Response.json({ error: 'The AI connection is unavailable. The evidence library remains accessible.', code: 'AI_NOT_CONFIGURED' }, { status: 503, headers });
  if (!db) return Response.json({ error: 'Research assistance is temporarily unavailable.' }, { status: 503, headers });
  try {
    const raw = await readBoundedText(request, 32000);
    let value: unknown;
    try { value = JSON.parse(raw); } catch { return Response.json({ error: 'The request could not be read.' }, { status: 400, headers }); }
    const parsed = researchInput.safeParse(value);
    if (!parsed.success) return Response.json({ error: 'Enter a research question of 3–2,000 characters. Use up to three previous turns.' }, { status: 400, headers });
    const data = parsed.data;
    const selected = sources.filter(source => data.sourceIds.includes(source.id));
    if (data.mode === 'curated' && (!selected.length || selected.length !== new Set(data.sourceIds).size)) return Response.json({ error: 'Choose one to six sources from the current library.' }, { status: 400, headers });
    const quota = await publicResearchQuota(request, db, config.key, now());
    if (!quota.allowed) {
      const error = quota.type === 'minute' ? 'Please wait a moment before asking again.' : quota.type === 'site' ? 'Today’s research allowance has been reached. Please return tomorrow.' : 'This network has reached today’s research allowance. Please return tomorrow.';
      return Response.json({ error, code: 'RESEARCH_LIMIT' }, { status: 429, headers: { ...headers, 'Retry-After': String(quota.retryAfter) } });
    }
    const result = await research(data, config, selected, AbortSignal.any([AbortSignal.timeout(90000), request.signal]));
    return Response.json(result, { headers });
  } catch (error) {
    console.warn('Research request failed', researchFailureDiagnostic(error));
    if (error instanceof Error && (error.message === 'RESEARCH_CONTEXT_UNAVAILABLE' || error.message === 'RESEARCH_LIMITER_UNAVAILABLE')) return Response.json({ error: 'Research assistance is temporarily unavailable. Please try again shortly.' }, { status: 503, headers });
    if (error instanceof Error && error.message === 'BODY_TOO_LARGE') return Response.json({ error: 'The request or retrieved material exceeded the supported size. Try a narrower question.' }, { status: 413, headers });
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) return Response.json({ error: 'This request timed out or was cancelled. Your question is preserved; try a narrower question.' }, { status: 504, headers });
    if (error instanceof Error && /^(?:LITERATURE_UNAVAILABLE|LITERATURE_(?:NETWORK_FAILURE|READ_FAILURE|INVALID_JSON|INVALID_RECORDS|HTTP_[1-5]\d{2}))$/.test(error.message)) return Response.json({ error: 'The literature search is temporarily unavailable. Try again, or choose curated notes. No answer was generated from model memory.' }, { status: 502, headers });
    return Response.json({ error: 'We could not complete a verified, source-linked answer. Please retry with a focused research question.' }, { status: 502, headers });
  }
}
