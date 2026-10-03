import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import { setRequestLocale } from 'next-intl/server';
import Shell from '@/components/v2/Shell';
import { V2_ACTIVE } from '@/lib/version';

import '../../styles/v2.css';

const hanken = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-v2',
  display: 'swap',
});

// While v1 is live, /v2/* is a preview only: keep it out of search results.
export const metadata: Metadata = V2_ACTIVE ? {} : { robots: { index: false, follow: false } };

// Reveal targets start hidden via CSS; without JS they must stay visible.
const noJs = '[data-rv]{opacity:1!important;transform:none!important}';

export default function V2Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className={`v2 ${hanken.variable}`}>
      <noscript>
        <style>{noJs}</style>
      </noscript>
      <Shell>{children}</Shell>
    </div>
  );
}
