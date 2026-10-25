import { SITE_ORIGIN } from '@/lib/seo';
import { pages } from '@/lib/site-content';
import { healthCheckIns } from '@/lib/health-checkins';
export const publicPaths = [...new Set(['/', '/about', '/investors', '/roadmap', '/privacy', ...Object.keys(pages).map(p=>'/'+p), '/tools', '/tools/phenoage', '/tools/study-planner', '/laboratory/ask', '/tools/check-ins', ...healthCheckIns.map(check=>'/tools/check-ins/'+check.slug)])];
export function GET(){return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPaths.map(path=>`<url><loc>${SITE_ORIGIN}${path}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}})}
