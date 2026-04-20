import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../../lib/gsapSetup';
import { getMotionPrefs } from '../../lib/motionPrefs';

/** Top micro-progress during route changes (scaleX on transform only). */
export default function RouteProgressBar() {
  const location = useLocation();
  const barRef = useRef(null);
  const prev = useRef(location.pathname);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    if (prev.current === location.pathname) {
      prev.current = location.pathname;
      return undefined;
    }
    prev.current = location.pathname;

    const { reduce, coarse } = getMotionPrefs();
    if (reduce) return undefined;

    gsap.killTweensOf(bar);
    const fill = coarse ? 0.38 : 0.52;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo(
      bar,
      { scaleX: 0, transformOrigin: '0% 50%', autoAlpha: 1 },
      { scaleX: 1, duration: fill },
    ).to(bar, {
      scaleX: 0,
      transformOrigin: '100% 50%',
      duration: coarse ? 0.22 : 0.32,
      ease: 'power2.in',
    });

    return () => tl.kill();
  }, [location.pathname]);

  return (
    <div
      className="route-progress"
      aria-hidden="true"
    >
      <div ref={barRef} className="route-progress__bar" />
    </div>
  );
}
