import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapSetup';
import { getMotionPrefs } from '../../lib/motionPrefs';

export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useLayoutEffect(() => {
    if (!getMotionPrefs().allowCursor) return undefined;

    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return undefined;

    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: 0, y: 0 });
    document.body.classList.add('has-custom-cursor');

    const onMove = (e) => {
      gsap.to(d, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(r, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.42,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!getMotionPrefs().allowCursor) {
    return null;
  }

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div ref={ring} className="custom-cursor__ring" />
      <div ref={dot} className="custom-cursor__dot" />
    </div>
  );
}
