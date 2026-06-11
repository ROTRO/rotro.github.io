'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis inertial scrolling, driven by the GSAP ticker so ScrollTrigger and
 * Lenis share one clock. Skipped under prefers-reduced-motion (native scroll
 * remains). On route change the page jumps to top instantly.
 */
export default function SmoothScroll({ pathname }: { pathname: string }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.05 });
    lenisRef.current = lenis;
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
