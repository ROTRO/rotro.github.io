'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Dot {
  label: string;
}

/**
 * Right-rail section dots, derived from `main > section[data-screen-label]`.
 * Rebuilds whenever the route changes. Hidden under 1100px via CSS.
 */
export default function SectionDots() {
  const pathname = usePathname();
  const [dots, setDots] = useState<Dot[]>([]);
  const [active, setActive] = useState(0);
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Wait a frame for the new route's DOM to commit.
    const id = window.setTimeout(() => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('main > section[data-screen-label]')
      );
      sectionsRef.current = sections;
      setDots(
        sections.map((sec) => ({
          label: (sec.getAttribute('data-screen-label') || '')
            .split('—')
            .pop()!
            .trim(),
        }))
      );
      setActive(0);
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const sections = sectionsRef.current;
      if (!sections.length) return;
      const mid =
        (window.pageYOffset || document.documentElement.scrollTop) +
        window.innerHeight * 0.4;
      let a = 0;
      sections.forEach((sec, i) => {
        if (sec.offsetTop <= mid) a = i;
      });
      setActive(a);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [dots]);

  if (dots.length < 2) return null;

  const go = (i: number) => {
    const sec = sectionsRef.current[i];
    if (!sec) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const y = sec.getBoundingClientRect().top + window.pageYOffset - 60;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <nav className="sec-dots" aria-label="Section navigation">
      {dots.map((d, i) => (
        <button
          key={i}
          type="button"
          className={`sec-dot${i === active ? ' on' : ''}`}
          aria-label={d.label}
          onClick={() => go(i)}
        >
          <span className="sec-dot__lbl">{d.label}</span>
        </button>
      ))}
    </nav>
  );
}
