import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global image lightbox. Scans DOM for [data-gallery] elements on each route change.
 */
export default function Lightbox() {
  const [list, setList] = useState([]);
  const [cur, setCur] = useState(0);
  const [open, setOpen] = useState(false);
  const groupsRef = useRef({});
  const pathname = useLocation().pathname;

  const show = useCallback(
    (i) => {
      if (list.length === 0) return;
      setCur((prev) => (i + list.length) % list.length);
    },
    [list.length]
  );

  const openLightbox = useCallback(
    (g, i) => {
      setList(groupsRef.current[g] || []);
      setCur(i);
      setOpen(true);
      document.body.style.overflow = 'hidden';
    },
    []
  );

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handlersCleanupRef = useRef(null);

  // Re-scan DOM and attach click handlers on route change
  useEffect(() => {
    // Clean up previous handlers
    if (handlersCleanupRef.current) {
      handlersCleanupRef.current();
      handlersCleanupRef.current = null;
    }

    // Small delay to let the DOM render after route change
    const timer = setTimeout(() => {
      const triggers = Array.from(document.querySelectorAll('[data-gallery]'));
      const g = {};
      const handlers = [];
      const groupCounters = {};

      triggers.forEach((t) => {
        const key = t.getAttribute('data-gallery');
        if (!g[key]) g[key] = [];
        const img = t.querySelector('img');
        g[key].push({
          src: t.getAttribute('data-full') || (img ? img.src : ''),
          cap: t.getAttribute('data-cap') || '',
        });
        t.style.cursor = 'zoom-in';

        if (!groupCounters[key]) groupCounters[key] = 0;
        const idx = groupCounters[key]++;

        const handler = (e) => {
          e.preventDefault();
          openLightbox(key, idx);
        };
        t.addEventListener('click', handler);
        handlers.push({ el: t, handler });
      });

      groupsRef.current = g;

      // Store cleanup for next run
      handlersCleanupRef.current = () => {
        handlers.forEach(({ el, handler }) => el.removeEventListener('click', handler));
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      if (handlersCleanupRef.current) {
        handlersCleanupRef.current();
        handlersCleanupRef.current = null;
      }
    };
  }, [pathname, openLightbox]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, cur, close, show]);

  if (list.length === 0) return null;

  const item = list[cur] || {};

  return (
    <div className={`lb${open ? ' on' : ''}`}>
      <button className="lb__close" aria-label="Close" onClick={close}>
        ✕
      </button>
      <button className="lb__nav lb__prev" aria-label="Previous" onClick={() => show(cur - 1)}>
        ‹
      </button>
      <figure className="lb__fig">
        <img className="lb__img" src={item.src} alt={item.cap} />
        <figcaption className="lb__cap">{item.cap}</figcaption>
      </figure>
      <button className="lb__nav lb__next" aria-label="Next" onClick={() => show(cur + 1)}>
        ›
      </button>
      <div className="lb__count">
        {cur + 1} / {list.length}
      </div>
    </div>
  );
}