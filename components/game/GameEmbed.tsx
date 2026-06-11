'use client';

import dynamic from 'next/dynamic';

/** Client-only loader for the Phaser game (engine chunk loads on demand). */
const GameCanvas = dynamic(() => import('./GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="game-shell game-shell--loading">
      <span className="game-loading">Booting engine…</span>
    </div>
  ),
});

export default function GameEmbed() {
  return <GameCanvas />;
}
