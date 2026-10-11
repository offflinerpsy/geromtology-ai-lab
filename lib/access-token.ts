export type AccessClaims = { sub: string; email: string; name?: string; iss: string; aud: string[]; exp: number; nbf?: number; iat?: number; type?: string };
type AccessKey = JsonWebKey & { kid: string };
const keyCache = new Map<string, { expires: number; keys: AccessKey[] }>();
function decode(part: string) { return Uint8Array.from(atob(part.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)); }
export function safeReturnPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) return '/laboratory/ask';
  const url = new URL(value, 'https://return.invalid');
  return url.origin === 'https://return.invalid' ? url.pathname + url.search + url.hash : '/laboratory/ask';
}
/** Verify the signature as well as issuer, app audience and validity. Headers alone are never identity. */
export async function verifyAccessToken(token: string, teamDomain: string, audiences: string[], options: { now?: number; fetchKeys?: () => Promise<AccessKey[]> } = {}): Promise<AccessClaims | null> {
  try {
    if (token.length > 16000 || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(teamDomain) || !audiences.length) return null;
    const parts = token.split('.'); if (parts.length !== 3) return null;
    const header = JSON.parse(new TextDecoder().decode(decode(parts[0]))) as { alg?: string; kid?: string };
    const claims = JSON.parse(new TextDecoder().decode(decode(parts[1]))) as AccessClaims;
    const now = options.now ?? Math.floor(Date.now()/1000);
    if (header.alg !== 'RS256' || !header.kid || claims.iss !== `https://${teamDomain}` || !Array.isArray(claims.aud) || !claims.aud.some(a => audiences.includes(a)) || !Number.isFinite(claims.exp) || claims.exp <= now || (claims.nbf !== undefined && claims.nbf > now + 30) || (claims.iat !== undefined && claims.iat > now + 30) || typeof claims.email !== 'string' || !claims.email.includes('@') || typeof claims.sub !== 'string' || !claims.sub || (claims.type && claims.type !== 'app')) return null;
    let keys: AccessKey[];
    if (options.fetchKeys) keys = await options.fetchKeys();
    else {
      const cached = keyCache.get(teamDomain);
      if (cached && cached.expires > Date.now()) keys = cached.keys;
      else {
        const response = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(8000) });
        if (!response.ok) return null;
        const body = await response.json() as { keys: AccessKey[] }; if (!Array.isArray(body.keys)) return null;
        keys = body.keys; keyCache.set(teamDomain, { expires: Date.now() + 300000, keys });
      }
    }
    const jwk = keys.find(k => k.kid === header.kid); if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const signature = decode(parts[2]); const message = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature.buffer as ArrayBuffer, message.buffer as ArrayBuffer) ? claims : null;
  } catch { return null; }
}
