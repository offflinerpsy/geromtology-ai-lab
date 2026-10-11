import type { Metadata } from 'next';

// Change this one authority when a custom domain is connected and verified.
export const SITE_ORIGIN = 'https://proage-atlas.offflinerpsy.workers.dev';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: { canonical: new URL(path, SITE_ORIGIN).href },
    openGraph: { type: 'website', siteName: 'ProAge Atlas', title, description,
      url: new URL(path, SITE_ORIGIN).href,
      images: [{url: `${SITE_ORIGIN}/images/proage-atlas-share.png`, width: 1200, height: 630, alt: 'ProAge Atlas — research workspace for healthy aging'}] },
    twitter: {card: 'summary_large_image', title, description, images: [`${SITE_ORIGIN}/images/proage-atlas-share.png`]},
  };
}
