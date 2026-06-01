'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/types';

const pad = (n: number) => (n < 10 ? '0' : '') + n;

interface CaseModalProps {
  items: Project[];
  index: number;
  onRequestClose: () => void;
  onNavigate: (index: number) => void;
}

/** Full-height case-study panel for a single project, with prev/next + Esc. */
export default function CaseModal({
  items,
  index,
  onRequestClose,
  onNavigate,
}: CaseModalProps) {
  const [show, setShow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const total = items.length;
  const p = items[index];

  const close = useCallback(() => {
    setShow(false);
    window.setTimeout(onRequestClose, 320);
  }, [onRequestClose]);

  // Enter animation + body scroll lock.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Reset scroll when switching projects.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [index]);

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') onNavigate((index - 1 + total) % total);
      else if (e.key === 'ArrowRight') onNavigate((index + 1) % total);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, total, onNavigate, close]);

  return (
    <div
      className={`case${show ? ' on' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="case__panel" role="dialog" aria-modal="true" aria-label={p.name}>
        <button className="case__close" aria-label="Close" onClick={close}>
          ✕
        </button>

        <div className="case__scroll" ref={scrollRef}>
          <div className="case__head">
            <span className="case__ix">
              {pad(index + 1)} / {pad(total)}
            </span>
            <h2 className="case__title">{p.name}</h2>
            <p className="case__tag">{p.tagline}</p>
            <div className="case__badges">
              <span className="case__badge">{p.kind}</span>
              <span className="case__badge">{p.year}</span>
              <span className={`case__badge${p.live ? ' live' : ''}`}>
                {p.live ? '● Live' : 'Private'}
              </span>
            </div>
          </div>

          <div className="case__cols">
            <div className="case__info">
              <p className="case__desc">{p.desc}</p>

              <h4 className="case__h">Highlights</h4>
              <ul className="case__feats">
                {p.feats.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <h4 className="case__h">Stack</h4>
              <div className="case__chips chips">
                {p.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="case__links">
                {p.live ? (
                  <a
                    className="arrow-link"
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit live site <span className="arrow">↗</span>
                  </a>
                ) : (
                  <span className="case__priv">Source private</span>
                )}
              </div>
            </div>

            <div className={`case__gallery${p.gallery.length ? '' : ' is-empty'}`}>
              {p.gallery.map((g) => (
                <figure className={`shot shot--${p.shape || 'web'}`} key={g.src}>
                  <img src={g.src} alt={g.cap} loading="lazy" />
                  <figcaption>{g.cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className="case__foot">
          <button
            className="case__pv"
            aria-label="Previous project"
            onClick={() => onNavigate((index - 1 + total) % total)}
          >
            ‹ Prev
          </button>
          <span className="case__pos">
            {pad(index + 1)} / {pad(total)}
          </span>
          <button
            className="case__nx"
            aria-label="Next project"
            onClick={() => onNavigate((index + 1) % total)}
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
