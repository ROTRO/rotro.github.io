'use client';

import { useEffect } from 'react';
import { animate } from 'motion';

/**
 * Re-applies the site's progressive-enhancement effects after each route
 * render: [data-reveal] entrance via IntersectionObserver, [data-magnetic]
 * hover pull, and [data-tilt] 3D hover. Pass the current pathname as `key`
 * so effects re-bind to the freshly mounted page.
 */
export function usePageEffects(key: string) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const cleanups: Array<() => void> = [];

    /* ---------- scroll reveal ---------- */
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    if (prefersReduced) {
      revealEls.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    /* ---------- magnetic hover ---------- */
    if (!prefersReduced && !isCoarse) {
      document
        .querySelectorAll<HTMLElement>('[data-magnetic]')
        .forEach((el) => {
          const strength = parseFloat(el.getAttribute('data-magnetic') || '0.35');
          const onMove = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            animate(
              el,
              { x: x * strength, y: y * strength },
              { type: 'spring', stiffness: 380, damping: 28 }
            );
          };
          const onLeave = () => {
            animate(el, { x: 0, y: 0 }, { type: 'spring', stiffness: 220, damping: 16 });
          };
          el.addEventListener('mousemove', onMove);
          el.addEventListener('mouseleave', onLeave);
          cleanups.push(() => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
            el.style.transform = '';
          });
        });

      /* ---------- hover tilt ---------- */
      document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
        const max = parseFloat(el.getAttribute('data-tilt') || '8');
        el.style.transformStyle = 'preserve-3d';
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transition = 'transform 0.08s linear';
          el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
        };
        const onLeave = () => {
          el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
          el.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
