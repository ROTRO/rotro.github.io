'use client';

import { useEffect, useRef, useState } from 'react';
import { createDeployRun, touchInput } from '@/lib/game/deployRun';
import type Phaser from 'phaser';

/**
 * Mounts the Phaser game and overlays on-screen controls for touch devices.
 * The buttons write into the shared `touchInput` object, which the game's
 * update loop reads alongside the keyboard.
 */
export default function GameCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches);
    if (hostRef.current && !gameRef.current) {
      gameRef.current = createDeployRun(hostRef.current);
    }
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      touchInput.left = touchInput.right = touchInput.jump = false;
    };
  }, []);

  const bind = (key: 'left' | 'right' | 'jump') => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* pointer already gone — capture is best-effort */
      }
      touchInput[key] = true;
    },
    onPointerUp: () => {
      touchInput[key] = false;
    },
    onPointerCancel: () => {
      touchInput[key] = false;
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  return (
    <div className="game-shell">
      <div ref={hostRef} className="game-host" />
      {touch && (
        <div className="game-touch" aria-hidden="true">
          <div className="game-touch__pad">
            <button type="button" className="game-touch__btn" {...bind('left')}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button type="button" className="game-touch__btn" {...bind('right')}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          <button type="button" className="game-touch__btn game-touch__jump" {...bind('jump')}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
