import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.brandName} — ${SITE.personName}`,
    short_name: SITE.brandName,
    description:
      'Full-stack engineer & technical lead building secure, scalable systems on AWS.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e14',
    theme_color: '#0a0e14',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
