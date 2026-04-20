import { useLayoutEffect } from 'react';
import { gsap } from '../lib/gsapSetup';
import { getMotionPrefs } from '../lib/motionPrefs';

/**
 * Staggered hero intro (opacity + translateY only).
 */
export function useHomeHeroIntro(scopeRef) {
  useLayoutEffect(() => {
    const root = scopeRef.current;
    if (!root) return undefined;

    const lines = root.querySelectorAll('[data-hero-line]');
    const actions = root.querySelectorAll('[data-hero-actions] > *');

    const ctx = gsap.context(() => {
      const { reduce, coarse } = getMotionPrefs();
      if (reduce) {
        gsap.set([...lines, ...actions], { clearProps: 'all' });
        return;
      }

      const yFrom = coarse ? 10 : 20;
      gsap.set([...lines, ...actions], { autoAlpha: 0, y: yFrom });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(lines, {
        autoAlpha: 1,
        y: 0,
        duration: coarse ? 0.4 : 0.72,
        stagger: coarse ? 0.05 : 0.1,
      });

      tl.to(
        actions,
        {
          autoAlpha: 1,
          y: 0,
          duration: coarse ? 0.32 : 0.5,
          stagger: coarse ? 0.04 : 0.07,
        },
        coarse ? '-=0.15' : '-=0.35',
      );
    }, root);

    return () => ctx.revert();
  }, [scopeRef]);
}
