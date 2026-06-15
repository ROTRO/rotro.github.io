'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BestRun } from '@/lib/game/deployRun';

/**
 * Footer badge surfacing the visitor's best Deploy Run (localStorage
 * 'dr-best', written by the game). Renders nothing until they've won a run.
 */
export default function GameBadge() {
  const [best, setBest] = useState<BestRun | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        setBest(JSON.parse(localStorage.getItem('dr-best') || 'null'));
      } catch {
        setBest(null);
      }
    };
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, []);

  if (!best) return null;

  return (
    <Link className="game-badge" href="/play" title="Beat your best run">
      <span aria-hidden="true">🏆</span> Best deploy: <b>{best.grade}</b> ·{' '}
      {best.score.toLocaleString()} pts
    </Link>
  );
}
