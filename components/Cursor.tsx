'use client';

import { useEffect, useRef } from 'react';

/** Custom dot + trailing ring cursor. No-op on touch / reduced-motion. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const hot = 'a, button, [data-magnetic], .chip, input, textarea';
    const onOver = (e: Event) => {
      if ((e.target as Element).closest(hot)) ring.classList.add('hot');
    };
    const onOut = (e: Event) => {
      if ((e.target as Element).closest(hot)) ring.classList.remove('hot');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
