'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

/** Loads the WebGL hero only when WebGL exists and the visitor isn't on Save-Data. */
export default function HeroSceneGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let webgl = false;
    try {
      webgl = !!document.createElement('canvas').getContext('webgl2');
    } catch {
      webgl = false;
    }
    if (webgl && !saveData) setEnabled(true);
  }, []);

  return enabled ? <HeroScene /> : null;
}
