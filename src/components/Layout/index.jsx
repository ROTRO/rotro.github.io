import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../../lib/gsapSetup';
import { getMotionPrefs } from '../../lib/motionPrefs';
import SiteHeader from '../site/SiteHeader';
import SiteFooter from '../site/SiteFooter';
import CustomCursor from '../site/CustomCursor';
import PageShell from '../transitions/PageShell';
import RouteProgressBar from '../transitions/RouteProgressBar';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = getMotionPrefs().reduce;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="site-main" role="main">
        <RouteProgressBar />
        <PageShell />
      </main>
      <SiteFooter />
      <CustomCursor />
    </>
  );
}
