import { SITE_ORIGIN } from '@/lib/seo';
export function GET(){return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /manage/\nDisallow: /auth/\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
