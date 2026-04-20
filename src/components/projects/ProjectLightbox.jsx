import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectLightbox({ items, index, onClose, onChangeIndex }) {
  const closeBtn = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onChangeIndex((index + items.length - 1) % items.length);
      }
      if (e.key === 'ArrowRight') {
        onChangeIndex((index + 1) % items.length);
      }
    };
    window.addEventListener('keydown', onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, items.length, onChangeIndex, onClose]);

  if (index == null || !items[index]) return null;

  const item = items[index];

  return (
    <div
      className="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      <button
        type="button"
        className="project-lightbox__backdrop"
        aria-label="Close gallery"
        onClick={onClose}
      />
      <div className="project-lightbox__panel" role="document">
        <button
          ref={closeBtn}
          type="button"
          className="project-lightbox__close icon-btn"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X size={20} />
        </button>
        <img className="project-lightbox__img" src={item.src} alt={item.alt} />
        <div className="project-lightbox__toolbar">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onChangeIndex((index + items.length - 1) % items.length)}
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="muted">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onChangeIndex((index + 1) % items.length)}
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
