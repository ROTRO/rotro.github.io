import { useEffect } from 'react';

/**
 * Initializes scroll-reveal behavior for all [data-reveal] elements.
 * Uses scroll-position detection (like the original) for reliability.
 */
export function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vh = () => window.innerHeight || document.documentElement.clientHeight;

    const inView = (el, margin) => {
      const r = el.getBoundingClientRect();
      if (r.height === 0 && r.width === 0) return false;
      return r.top < vh() - (margin || 0) && r.bottom > 0;
    };

    let watchers = [];
    let ticking = false;

    const runWatchers = () => {
      watchers = watchers.filter((fn) => fn() !== true);
      ticking = false;
    };

    const scheduleWatchers = () => {
      if (ticking) return;
      ticking = true;
      setTimeout(runWatchers, 16);
    };

    const watch = (fn) => {
      watchers.push(fn);
      scheduleWatchers();
    };

    const initReveal = () => {
      const els = Array.from(document.querySelectorAll('[data-reveal]'));
      if (reduce) {
        els.forEach((el) => el.classList.add('in'));
        return;
      }
      els.forEach((el) => {
        watch(() => {
          if (inView(el, vh() * 0.08)) {
            el.classList.add('in');
            return true;
          }
          return false;
        });
      });
    };

    initReveal();

    window.addEventListener('scroll', scheduleWatchers, { passive: true });
    window.addEventListener('resize', scheduleWatchers);

    return () => {
      window.removeEventListener('scroll', scheduleWatchers);
      window.removeEventListener('resize', scheduleWatchers);
      watchers = [];
    };
  }, []);
}