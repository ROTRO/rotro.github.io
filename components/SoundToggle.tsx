'use client';

import { useEffect, useState } from 'react';
import { startAmbient, stopAmbient } from '@/lib/ambientSound';

/**
 * Header sound toggle (thorgal-style "activer le son"): animated equalizer
 * bars while playing. Preference persists in localStorage; if previously on,
 * audio re-arms on the first user gesture (autoplay policy).
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('nv-sound') !== 'on') return;
    const arm = () => {
      startAmbient();
      setOn(true);
    };
    window.addEventListener('pointerdown', arm, { once: true });
    window.addEventListener('keydown', arm, { once: true });
    return () => {
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
    };
  }, []);

  useEffect(() => () => stopAmbient(), []);

  const toggle = () => {
    if (on) {
      stopAmbient();
      localStorage.setItem('nv-sound', 'off');
      setOn(false);
    } else {
      startAmbient();
      localStorage.setItem('nv-sound', 'on');
      setOn(true);
    }
  };

  return (
    <button
      type="button"
      className={`snd${on ? ' on' : ''}`}
      aria-pressed={on}
      aria-label={on ? 'Disable ambient sound' : 'Enable ambient sound'}
      onClick={toggle}
    >
      <span className="snd__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="snd__lbl">Sound</span>
    </button>
  );
}
