import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SITE, SITE_URL } from '@/lib/site';
import { routing } from '@/i18n/routing';

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE.personName} — ${t('role')}`,
      template: `%s — ${SITE.personName}`,
    },
    description: t('siteDescription'),
    applicationName: SITE.brandName,
    authors: [{ name: SITE.personName }],
    creator: SITE.personName,
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
    alternates: {
      canonical: locale === routing.defaultLocale ? '/' : `/${locale}`,
      languages: {
        en: '/',
        fr: '/fr',
      },
    },
    openGraph: {
      type: 'website',
      siteName: `${SITE.brandName} — ${SITE.personName}`,
      title: `${SITE.personName} — ${t('role')}`,
      description: t('ogDescription'),
      url: locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: SITE.personName }],
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE.personName} — ${t('role')}`,
      description: t('ogDescription'),
      images: ['/og-image.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#0a0e14',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
