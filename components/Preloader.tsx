'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';

/**
 * Cinematic first-visit preloader: counts to 100 (paced over ~1.4s, holding
 * at 99 until window load), then slides away and fires `preloader:done` so
 * hero animations start in sync with the reveal. Shown once per session;
 * skipped entirely under prefers-reduced-motion.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const skip =
      sessionStorage.getItem('nv-preloaded') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (skip) {
      sessionStorage.setItem('nv-preloaded', '1');
      document.documentElement.classList.remove('is-preloading');
      window.dispatchEvent(new Event('preloader:done'));
      setVisible(false);
      return;
    }

    document.documentElement.classList.add('is-preloading');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const started = performance.now();
    const MIN = 1400; // pacing duration
    const MAX = 4000; // give up waiting for window load after this
    let loaded = document.readyState === 'complete';
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener('load', onLoad);

    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setPct(100);
      setExiting(true);
      window.setTimeout(() => {
        sessionStorage.setItem('nv-preloaded', '1');
        document.documentElement.classList.remove('is-preloading');
        document.body.style.overflow = prevOverflow;
        window.dispatchEvent(new Event('preloader:done'));
        setVisible(false);
      }, 700); // matches the CSS exit transition
    };

    const tick = (now: number) => {
      const elapsed = now - started;
      if (elapsed > MAX) loaded = true;
      const eased = Math.min(elapsed / MIN, 1);
      const v = Math.min(Math.round(eased * 100), loaded ? 100 : 99);
      setPct(v);
      if (v >= 100) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove('is-preloading');
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`preloader${exiting ? ' is-exiting' : ''}`} aria-hidden="true">
      <div className="preloader__inner">
        <span className="preloader__brand">{SITE.brandName}</span>
        <span className="preloader__pct">
          {pct}
          <em>%</em>
        </span>
        <span className="preloader__bar">
          <span className="preloader__fill" style={{ transform: `scaleX(${pct / 100})` }} />
        </span>
        <span className="preloader__hint">Initialising systems</span>
      </div>
    </div>
  );
}
