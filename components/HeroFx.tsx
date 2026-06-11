'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HeroParticles = dynamic(() => import('./HeroParticles'), { ssr: false });

/**
 * Gate for the WebGL hero layer: skipped entirely on reduced-motion, touch
 * devices, small screens and Save-Data connections, so those users keep the
 * plain video hero with zero extra cost.
 */
export default function HeroFx() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth < 768;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    if (!reduce && !coarse && !small && !saveData) setEnabled(true);
  }, []);

  return enabled ? <HeroParticles /> : null;
}
