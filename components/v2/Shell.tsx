'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SmoothScroll from '@/components/SmoothScroll';
import Header from './Header';
import ScrollFx from './ScrollFx';

/** Client chrome for v2 routes: skip link, header/menu, Lenis, scroll effects. */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('v2.common');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#content">
        {t('skip')}
      </a>
      <Header />
      {children}
      <SmoothScroll pathname={pathname} />
      <ScrollFx pathname={pathname} />
    </>
  );
}
