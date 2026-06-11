'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import type { Project } from '@/lib/types';
import CaseModal from './CaseModal';

const pad = (n: number) => (n < 10 ? '0' : '') + n;

interface CarouselProps {
  items: Project[];
}

/** Horizontal, snap-scrolling project carousel; click a slide to open its case study. */
export default function Carousel({ items }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const urlSyncReady = useRef(false);

  const total = items.length;

  const computeActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bd = Infinity;
    slideRefs.current.forEach((s, i) => {
      if (!s) return;
      const c = s.offsetLeft + s.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    return best;
  }, []);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    const s = slideRefs.current[Math.max(0, Math.min(i, slideRefs.current.length - 1))];
    if (!track || !s) return;
    const left = s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
  }, []);

  // Deep link: ?case=<id> opens that case study on load; the param is kept
  // in sync (replaceState, so Back still leaves the page predictably).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('case');
    const i = id ? items.findIndex((p) => p.id === id) : -1;
    if (i >= 0) {
      setOpenIndex(i);
      requestAnimationFrame(() => scrollToIndex(i));
    }
    urlSyncReady.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!urlSyncReady.current) return;
    const url = new URL(window.location.href);
    if (openIndex !== null) url.searchParams.set('case', items[openIndex].id);
    else url.searchParams.delete('case');
    window.history.replaceState(null, '', url);
  }, [openIndex, items]);

  // Sync active index on scroll (debounced) + on resize.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let t = 0;
    const onScroll = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setActive(computeActive()), 60);
    };
    const onResize = () => setActive(computeActive());
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(t);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [computeActive]);

  // Mouse drag-to-scroll. `moved` suppresses the click that opens the modal.
  const drag = useRef({ down: false, sx: 0, sl: 0, moved: 0 });
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      drag.current = { down: true, sx: e.clientX, sl: track.scrollLeft, moved: 0 };
      track.classList.add('grab');
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.down) return;
      const dx = e.clientX - d.sx;
      d.moved = Math.max(d.moved, Math.abs(dx));
      track.scrollLeft = d.sl - dx;
    };
    const onUp = () => {
      if (drag.current.down) {
        drag.current.down = false;
        track.classList.remove('grab');
      }
    };

    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const handleSlideClick = (i: number) => {
    if (drag.current.moved > 6) return; // was a drag, not a click
    setOpenIndex(i);
  };

  return (
    <div className="showcase">
      <div className="car">
        <button
          className="car__nav car__prev"
          aria-label="Previous"
          onClick={() => scrollToIndex(active - 1)}
        >
          ‹
        </button>

        <div className="car__track" ref={trackRef}>
          {items.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className={`slide${p.cover ? '' : ' slide--typo'}${i === active ? ' is-active' : ''}`}
              aria-label={`Open ${p.name}`}
              onClick={() => handleSlideClick(i)}
            >
              {p.cover ? (
                <img
                  className="slide__img"
                  src={p.cover}
                  alt=""
                  loading="lazy"
                  style={{ objectPosition: p.coverPos || 'center' }}
                />
              ) : (
                <span className="slide__typo">{p.name}</span>
              )}
              <span className="slide__grad" />
              <span className="slide__body">
                <span className="slide__top">
                  <span className="slide__ix">
                    {pad(i + 1)} / {pad(total)}
                  </span>
                  <span className="slide__kind">{p.kind}</span>
                </span>
                <span className="slide__foot">
                  <span className="slide__name">{p.name}</span>
                  <span className="slide__tag">{p.tagline}</span>
                  <span className="slide__cta">
                    View case <em>→</em>
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>

        <button
          className="car__nav car__next"
          aria-label="Next"
          onClick={() => scrollToIndex(active + 1)}
        >
          ›
        </button>
      </div>

      <div className="car__bar">
        <span className="car__count">
          {pad(active + 1)} / {pad(total)}
        </span>
        <div className="car__dots">
          {items.map((p, i) => (
            <button
              key={p.id}
              className={`car__dot${i === active ? ' on' : ''}`}
              aria-label={p.name}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
        <span className="car__hint">drag · click to open</span>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <CaseModal
            items={items}
            index={openIndex}
            onRequestClose={() => setOpenIndex(null)}
            onNavigate={(i) => setOpenIndex(i)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
