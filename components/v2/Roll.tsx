import type { CSSProperties } from 'react';

/**
 * Per-letter hover roll: each glyph slides up to reveal its copy beneath,
 * staggered left to right. Triggered by hovering any `.has-roll` ancestor.
 * The visual letters are aria-hidden; the label is read once from sr-only text.
 */
export default function Roll({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="roll" aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span key={i} className="roll__ch" data-ch={ch} style={{ '--i': i } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}
