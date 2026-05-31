import { useEffect, useRef } from 'react';

/**
 * Scroll progress bar at the top of the page.
 */
export default function ScrollProgress() {
  const fillRef = useRef(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const update = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="scroll-prog">
      <div ref={fillRef} className="scroll-prog__fill" />
    </div>
  );
}