import { useEffect } from 'react';

/**
 * Adds hover-tilt effect to [data-tilt] elements.
 */
export function useTilt() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    const els = Array.from(document.querySelectorAll('[data-tilt]'));
    const cleanups = [];

    els.forEach((el) => {
      const max = parseFloat(el.getAttribute('data-tilt')) || 8;
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'transform 0.3s var(--ease)';

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = 'transform 0.08s linear';
        el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
      };

      const onLeave = () => {
        el.style.transition = 'transform 0.5s var(--ease)';
        el.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);
}