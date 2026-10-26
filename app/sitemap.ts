import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

// /account/* is deliberately absent (noindex, nofollow).
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/store', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/quote', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/loyalty', priority: 0.9, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((r) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${r.path}`,
      lastModified: new Date(),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${r.path}`])) },
    })),
  );
}
