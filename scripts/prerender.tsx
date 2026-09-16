import React from 'react';
import { renderToString } from 'react-dom/server';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { App } from '../src/App';
import { routes, siteOrigin } from '../src/content';

const output = path.resolve('dist');
const template = await readFile(path.join(output, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('The prerender placeholder is missing from the built HTML.');
const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));

async function renderRoute(route: string, filename: string, notFound = false) {
  const meta = routes[route] || { title: 'Page not found — ProAge Atlas', description: 'Explore ProAge Atlas research, people and the AI laboratory.' };
  const html = template
    .replaceAll('__TITLE__', escape(meta.title))
    .replaceAll('__DESCRIPTION__', escape(meta.description))
    .replaceAll('__CANONICAL__', escape(siteOrigin + (notFound ? '/' : route)))
    .replace('index,follow', notFound ? 'noindex,follow' : 'index,follow')
    .replace('<!--app-html-->', renderToString(<App initialPath={route} />));
  const destination = path.join(output, filename);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}
for (const route of Object.keys(routes)) {
  await renderRoute(route, route === '/' ? 'index.html' : route.slice(1) + '.html');
}
await renderRoute('/page-not-found', '404.html', true);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + Object.keys(routes).map(route => `  <url><loc>${escape(siteOrigin + route)}</loc></url>`).join('\n') + '\n</urlset>\n';
await writeFile(path.join(output, 'sitemap.xml'), sitemap);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);
console.log(`Prerendered ${Object.keys(routes).length} pages, a real 404 document and the sitemap.`);
