import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsapSetup';
import { getMotionPrefs } from '../../lib/motionPrefs';
import { profile } from '../../data/profile';

const MIN_MS = 480;

export default function InitialLoader({ onDone }) {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const textRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const exited = useRef(false);

  useLayoutEffect(() => {
    if (hidden) return undefined;

    const { reduce } = getMotionPrefs();
    const root = rootRef.current;
    const line = lineRef.current;
    const label = textRef.current;

    if (reduce) {
      document.body.classList.remove('is-booting');
      setHidden(true);
      onDone?.();
      return undefined;
    }

    document.body.classList.add('is-booting');

    let alive = true;
    const t0 = performance.now();

    const fadeOut = () => {
      if (!alive || exited.current || !root) return;
      exited.current = true;
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.52,
        ease: 'power2.inOut',
        onComplete: () => {
          if (!alive) return;
          document.body.classList.remove('is-booting');
          setHidden(true);
          onDone?.();
        },
      });
    };

    const scheduleExit = () => {
      if (!alive) return;
      const elapsed = performance.now() - t0;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => {
        if (alive) fadeOut();
      }, wait);
    };

    gsap.set(root, { autoAlpha: 1 });
    if (line) {
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: '0% 50%' },
        { scaleX: 1, duration: 0.95, ease: 'expo.out', delay: 0.06 },
      );
    }
    if (label) {
      gsap.fromTo(
        label,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 },
      );
    }

    const onReady = () => {
      if (alive) scheduleExit();
    };

    if (document.readyState === 'complete') {
      onReady();
    } else {
      window.addEventListener('load', onReady, { once: true });
    }

    return () => {
      alive = false;
      window.removeEventListener('load', onReady);
    };
  }, [hidden, onDone]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="initial-loader" role="status" aria-live="polite">
      <div className="initial-loader__inner">
        <p className="initial-loader__brand">{profile.siteName}</p>
        <p ref={textRef} className="initial-loader__hint">
          Loading experience…
        </p>
        <div className="initial-loader__track">
          <div ref={lineRef} className="initial-loader__line" />
        </div>
      </div>
    </div>
  );
}
