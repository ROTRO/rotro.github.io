import { useLayoutEffect } from 'react';
import { gsap } from '../lib/gsapSetup';
import { getMotionPrefs } from '../lib/motionPrefs';

/**
 * Scroll-triggered fade + slide-in for `[data-reveal]` descendants.
 * Animates only transform + opacity (autoAlpha).
 */
export function useScrollReveal(containerRef, options = {}) {
  const {
    selector = '[data-reveal]',
    y = 26,
    duration = 0.62,
    stagger = 0.09,
    start = 'top 82%',
  } = options;

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const targets = root.querySelectorAll(selector);
    if (!targets.length) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const { reduce, coarse } = getMotionPrefs();
      if (reduce) {
        gsap.set(targets, { clearProps: 'all' });
        return;
      }

      const moveY = coarse ? Math.min(y, 10) : y;
      const dur = coarse ? 0.34 : duration;
      const st = coarse ? Math.min(stagger, 0.04) : stagger;

      gsap.from(targets, {
        autoAlpha: 0,
        y: moveY,
        duration: dur,
        ease: 'power2.out',
        stagger: st,
        immediateRender: false,
        scrollTrigger: {
          trigger: root,
          start,
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [containerRef, selector, y, duration, stagger, start]);
}
