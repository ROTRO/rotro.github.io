'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Cursor from './Cursor';
import ScrollProgress from './ScrollProgress';
import SectionDots from './SectionDots';
import { usePageEffects } from './usePageEffects';

/**
 * Client shell mounted once in the root layout. Renders global chrome
 * (scroll progress, header, cursor, section dots), scrolls to top on
 * navigation, and re-binds the reveal / magnetic / tilt effects whenever
 * the route changes. Page content is passed through as `children` (which
 * may be server components and still stream/SSR normally).
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  usePageEffects(pathname);

  return (
    <>
      <ScrollProgress />
      <Header />
      {children}
      <Cursor />
      <SectionDots />
    </>
  );
}
