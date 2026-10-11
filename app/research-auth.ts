import { env } from 'cloudflare:workers';
import { headers } from 'next/headers';
import { safeReturnPath, verifyAccessToken } from '@/lib/access-token';
export async function getResearchUser() {
  const values = env as unknown as Record<string, string | undefined>;
  const requestHeaders = await headers();
  const cookie = requestHeaders.get('cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith('CF_Authorization='))?.slice('CF_Authorization='.length);
  const token = requestHeaders.get('cf-access-jwt-assertion') || cookie;
  if (!token || !values.ACCESS_TEAM_DOMAIN) return null;
  const claims = await verifyAccessToken(token, values.ACCESS_TEAM_DOMAIN, (values.ACCESS_AUDIENCES || '').split(',').filter(Boolean));
  return claims ? { userId: claims.sub, email: claims.email, displayName: claims.name || claims.email } : null;
}
export function researchSignInPath(returnTo: string) { return `/auth/login?return_to=${encodeURIComponent(safeReturnPath(returnTo))}`; }
