'use client';

import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import type { Project } from '@/lib/types';

const pad = (n: number) => (n < 10 ? '0' : '') + n;

interface CaseModalProps {
  items: Project[];
  index: number;
  onRequestClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-height case-study panel for a single project, with prev/next + Esc.
 * Enter/exit animation is owned by motion (mount it inside <AnimatePresence>).
 */
export default function CaseModal({
  items,
  index,
  onRequestClose,
  onNavigate,
}: CaseModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const total = items.length;
  const p = items[index];

  const close = useCallback(() => onRequestClose(), [onRequestClose]);

  // Body scroll lock + move focus into the dialog, restore it on close.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('.case__close')?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, []);

  // Reset scroll when switching projects.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [index]);

  // Keyboard nav + focus trap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') onNavigate((index - 1 + total) % total);
      else if (e.key === 'ArrowRight') onNavigate((index + 1) % total);
      else if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, total, onNavigate, close]);

  return (
    <motion.div
      className="case"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <motion.div
        ref={panelRef}
        className="case__panel"
        initial={{ x: 72, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 56, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
      >
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

              <div className="case__links" style={{ display: 'flex', gap: '1.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                <Link className="arrow-link" href={`/projects/${p.id}`}>
                  Full case page <span className="arrow">→</span>
                </Link>
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
      </motion.div>
    </motion.div>
  );
}
