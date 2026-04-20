import React, { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { gsap } from '../../lib/gsapSetup';
import { getMotionPrefs } from '../../lib/motionPrefs';
import { routeSlideDirection } from '../../config/navigation';

/**
 * Route-level enter animation (opacity + translateY only).
 * Direction follows nav order for a subtle app-like cue.
 */
export default function PageShell() {
  const location = useLocation();
  const shellRef = useRef(null);
  const prevPath = useRef(location.pathname);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = shellRef.current;
    if (!el) return undefined;

    const { reduce, coarse } = getMotionPrefs();
    if (reduce) {
      gsap.set(el, { clearProps: 'all' });
      prevPath.current = location.pathname;
      first.current = false;
      return undefined;
    }

    const yAmount = coarse ? 14 : 34;
    const duration = coarse ? 0.32 : Math.min(0.85, 0.72);

    if (first.current) {
      first.current = false;
      prevPath.current = location.pathname;
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: yAmount * 0.6 },
        { autoAlpha: 1, y: 0, duration, ease: 'expo.out' },
      );
      return undefined;
    }

    if (prevPath.current === location.pathname) {
      return undefined;
    }

    const dir = routeSlideDirection(prevPath.current, location.pathname);
    prevPath.current = location.pathname;

    gsap.fromTo(
      el,
      { autoAlpha: 0, y: dir * yAmount },
      { autoAlpha: 1, y: 0, duration, ease: 'expo.out' },
    );

    return undefined;
  }, [location.pathname]);

  return (
    <div ref={shellRef} className="page-shell">
      <Outlet />
    </div>
  );
}
