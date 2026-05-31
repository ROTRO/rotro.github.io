import { useState, useEffect, useCallback } from 'react';

/**
 * Global image lightbox. Populated dynamically via data-gallery attributes.
 * This component scans the DOM for [data-gallery] elements and builds groups.
 */
export default function Lightbox() {
  const [groups, setGroups] = useState({});
  const [list, setList] = useState([]);
  const [cur, setCur] = useState(0);
  const [open, setOpen] = useState(false);

  // Register gallery items from the DOM after mount
  useEffect(() => {
    const triggers = Array.from(document.querySelectorAll('[data-gallery]'));
    const g = {};
    triggers.forEach((t) => {
      const key = t.getAttribute('data-gallery');
      if (!g[key]) g[key] = [];
      const img = t.querySelector('img');
      g[key].push({
        src: t.getAttribute('data-full') || (img ? img.src : ''),
        cap: t.getAttribute('data-cap') || '',
      });
      t.style.cursor = 'zoom-in';
    });
    setGroups(g);
  }, []);

  const show = useCallback(
    (i) => {
      if (list.length === 0) return;
      setCur((i + list.length) % list.length);
    },
    [list.length]
  );

  const openLightbox = useCallback(
    (g, i) => {
      setList(groups[g] || []);
      setCur(i);
      setOpen(true);
      document.body.style.overflow = 'hidden';
    },
    [groups]
  );

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = '';
  }, []);

  // Attach click handlers
  useEffect(() => {
    const triggers = Array.from(document.querySelectorAll('[data-gallery]'));
    const handlers = [];

    const groupCounters = {};

    triggers.forEach((t) => {
      const g = t.getAttribute('data-gallery');
      if (!groupCounters[g]) groupCounters[g] = 0;
      const idx = groupCounters[g]++;

      const handler = () => openLightbox(g, idx);
      t.addEventListener('click', handler);
      handlers.push({ el: t, handler });
    });

    return () => {
      handlers.forEach(({ el, handler }) => el.removeEventListener('click', handler));
    };
  }, [groups, openLightbox]);

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