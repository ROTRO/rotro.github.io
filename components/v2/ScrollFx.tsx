'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-linked effects for v2 pages, bound by data attributes and rebuilt
 * on every route change. GSAP owns scroll; motion owns presence.
 *
 * - `data-rv`          fade/slide in once when entering the viewport
 * - `data-words`       sentence brightens word by word, scrubbed to scroll
 * - `data-kinetic="±1"` display line pans horizontally while its section passes
 * - `data-parallax`    gentle vertical drift for media
 * - `data-hero-out`    hero scene recedes as the page scrolls past it
 *
 * Skipped entirely under prefers-reduced-motion (content is visible by default).
 */
export default function ScrollFx({ pathname }: { pathname: string }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-rv]', {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.w'),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-kinetic]').forEach((el) => {
        const dir = Number(el.dataset.kinetic) || 1;
        gsap.fromTo(
          el,
          { xPercent: dir > 0 ? -6 : 6 },
          {
            xPercent: dir > 0 ? 6 : -6,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -5 },
          { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-hero-out]').forEach((el) => {
        gsap.to(el, {
          opacity: 0.2,
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    });

    // late images/fonts shift layout; re-measure once everything has settled
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
