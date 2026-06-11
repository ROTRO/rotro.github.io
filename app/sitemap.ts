import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { projects } from '@/lib/projects';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: '/', priority: 1.0, freq: 'monthly' as const },
    { path: '/about', priority: 0.8, freq: 'monthly' as const },
    { path: '/experience', priority: 0.8, freq: 'monthly' as const },
    { path: '/projects', priority: 0.9, freq: 'monthly' as const },
    ...projects.map((p) => ({
      path: `/projects/${p.id}`,
      priority: 0.7,
      freq: 'monthly' as const,
    })),
    { path: '/contact', priority: 0.6, freq: 'yearly' as const },
    { path: '/play', priority: 0.5, freq: 'yearly' as const },
  ];
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
