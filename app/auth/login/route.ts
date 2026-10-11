import { getResearchUser } from '@/app/research-auth';
import { safeReturnPath } from '@/lib/access-token';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const user = await getResearchUser();
  if (!user) return new Response('A verified research session is required.', { status: 401, headers: { 'Cache-Control': 'no-store' } });
  const target = new URL(safeReturnPath(new URL(request.url).searchParams.get('return_to')), request.url);
  return Response.redirect(target.href, 303);
}
