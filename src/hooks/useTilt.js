import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Adds hover-tilt effect to [data-tilt] elements.
 * Re-attaches on route changes so elements created after navigation are covered.
 */
export function useTilt() {
  const pathname = useLocation().pathname;
  const cleanupsRef = useRef([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    // Clean up previous handlers
    cleanupsRef.current.forEach((fn) => fn());
    cleanupsRef.current = [];

    // Small delay to let the DOM render after route change
    const timer = setTimeout(() => {
      const els = Array.from(document.querySelectorAll('[data-tilt]'));

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
        cleanupsRef.current.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupsRef.current.forEach((fn) => fn());
      cleanupsRef.current = [];
    };
  }, [pathname]);
}