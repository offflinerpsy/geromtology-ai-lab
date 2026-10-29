import type { Metadata } from 'next';

export const SITE_ORIGIN = 'https://gerontology.app';
const brand = 'ProAge Atlas';

// The root template adds the brand to ordinary titles. Avoid repeating it on
// routes whose editorial title already names the project.
function documentTitle(title: string): Metadata['title'] {
  return title.toLowerCase().includes(brand.toLowerCase()) ? { absolute: title } : title;
}

export const editorialTitles: Record<string, string> = {
  institute: 'Open Institute of Age and Aging — Gerontology & Education',
  research: 'Healthy Aging Research — Gerontology, Methods & AI',
  'research/longevity': 'Healthy Longevity Research Across the Life Course',
  'research/geriatrics': 'Geriatric Medicine — Function & Independent Living',
  'research/clinical-peptidology': 'Clinical Peptidology — Research & Evidence',
  education: 'Gerontology Education — Professional Learning',
  projects: 'Gerontology Projects & Education',
  people: 'Scientific Leadership & Founder',
  contact: 'Contact ProAge Atlas — Research Collaboration',
};

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  name: brand,
  url: `${SITE_ORIGIN}/`,
  description: 'Research software for healthy aging, scientific evidence and study planning.',
  inLanguage: 'en',
};
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: documentTitle(title), description,
    alternates: { canonical: new URL(path, SITE_ORIGIN).href },
    openGraph: { type: 'website', siteName: 'ProAge Atlas', title, description,
      url: new URL(path, SITE_ORIGIN).href,
      images: [{url: `${SITE_ORIGIN}/images/proage-atlas-share.png`, width: 1200, height: 630, alt: 'ProAge Atlas — research workspace for healthy aging'}] },
    twitter: {card: 'summary_large_image', title, description, images: [`${SITE_ORIGIN}/images/proage-atlas-share.png`]},
  };
}
