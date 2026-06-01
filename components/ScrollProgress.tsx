'use client';

import { useEffect, useRef } from 'react';

/** Thin gradient progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = fillRef.current!;
    const update = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = `${h > 0 ? (st / h) * 100 : 0}%`;
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
    <div className="scroll-prog" aria-hidden="true">
      <div ref={fillRef} className="scroll-prog__fill" />
    </div>
  );
}
