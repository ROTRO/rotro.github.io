'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP scroll scenes, re-created per route:
 *  - hero video parallax + cinematic fade-out of hero copy
 *  - dotted-grid backdrop drift tied to document scroll
 *  - staggered entrance for featured cards / stat counters
 * Everything is skipped under prefers-reduced-motion.
 */
export default function ScrollFx({ pathname }: { pathname: string }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* hero headline: per-character blur-fade stagger (replaces the CSS
       animation, which stays as the no-JS / reduced-motion fallback) */
    let split: SplitType | null = null;
    const title = document.querySelector<HTMLElement>('.cine__title');
    if (title) {
      split = new SplitType(title, { types: 'words,chars' });
      title.classList.remove('animate-blur-fade-up');
      title.style.animation = 'none';
      title.style.opacity = '1';
      gsap.from(split.chars, {
        y: '0.55em',
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.04,
        delay: 0.35,
      });
    }

    const ctx = gsap.context(() => {
      /* hero parallax (home only — guarded by element presence) */
      if (document.querySelector('.cine')) {
        gsap.to('.cine__video', {
          yPercent: 16,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: '.cine', start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.cine__inner', {
          yPercent: -12,
          autoAlpha: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: '.cine', start: '20% top', end: 'bottom top', scrub: true },
        });
      }

      /* dotted-grid backdrop drifts slowly with scroll */
      gsap.to(document.body, {
        '--grid-y': '64px',
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1.2 },
      });

      /* featured cards stagger in as a batch */
      const cards = gsap.utils.toArray<HTMLElement>('.feat__card');
      if (cards.length) {
        gsap.set(cards, { y: 30, autoAlpha: 0 });
        ScrollTrigger.batch(cards, {
          start: 'top 88%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.09,
            }),
        });
      }

      /* stat numbers count up when scrolled into view */
      document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = parseFloat(el.dataset.count || '0');
        const obj = { v: 0 };
        el.textContent = '0'; // SSR markup holds the final value for no-JS

        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });
    });

    // Re-measure once everything (fonts, images, video poster) has loaded.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      split?.revert();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
