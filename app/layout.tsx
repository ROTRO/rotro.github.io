import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { SITE, SITE_URL } from '@/lib/site';
import SiteChrome from '@/components/SiteChrome';

import './styles/global.css';
import './styles/pages.css';
import './styles/showcase.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.personName} — ${SITE.role}`,
    template: `%s — ${SITE.personName}`,
  },
  description:
    'Full-stack engineer, technical lead, and cloud solutions specialist building secure, scalable systems on AWS — from architecture to deployment.',
  applicationName: SITE.brandName,
  authors: [{ name: SITE.personName }],
  creator: SITE.personName,
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: `${SITE.brandName} — ${SITE.personName}`,
    title: `${SITE.personName} — ${SITE.role}`,
    description:
      'Building secure, scalable systems on AWS — from architecture to deployment.',
    url: SITE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE.personName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.personName} — ${SITE.role}`,
    description:
      'Building secure, scalable systems on AWS — from architecture to deployment.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0e14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
