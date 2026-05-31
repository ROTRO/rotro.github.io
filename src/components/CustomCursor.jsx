import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Custom cursor — dot + ring that follows the mouse.
 * Rendered via portal to document.body to escape stacking contexts.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Position cursor at center initially
    pos.current = { mx: innerWidth / 2, my: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2 };
    dot.style.transform = `translate(${innerWidth / 2}px,${innerHeight / 2}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${innerWidth / 2}px,${innerHeight / 2}px) translate(-50%,-50%)`;

    const onMove = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      dot.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
    };

    const loop = () => {
      const p = pos.current;
      p.rx += (p.mx - p.rx) * 0.18;
      p.ry += (p.my - p.ry) * 0.18;
      ring.style.transform = `translate(${p.rx}px,${p.ry}px) translate(-50%,-50%)`;
      raf.current = requestAnimationFrame(loop);
    };

    const hotSelector = 'a, button, [data-magnetic], .chip, input, textarea';

    const onOver = (e) => {
      if (e.target.closest(hotSelector)) ring.classList.add('hot');
    };
    const onOut = (e) => {
      if (e.target.closest(hotSelector)) ring.classList.remove('hot');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return createPortal(
    <>
      <div ref={dotRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>,
    document.body
  );
}