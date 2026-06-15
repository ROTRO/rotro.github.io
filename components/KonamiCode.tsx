'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

const CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

/**
 * Konami code easter egg: ↑↑↓↓←→←→BA anywhere on the site flashes a
 * retro toast and warps to /play. Ignored while typing or already in-game.
 */
export default function KonamiCode() {
  const router = useRouter();
  const pathname = usePathname();
  const pos = useRef(0);
  const [hit, setHit] = useState(false);

  useEffect(() => {
    if (pathname === '/play') return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
        pos.current = 0;
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos.current = key === CODE[pos.current] ? pos.current + 1 : key === CODE[0] ? 1 : 0;
      if (pos.current === CODE.length) {
        pos.current = 0;
        setHit(true);
        setTimeout(() => {
          setHit(false);
          router.push('/play');
        }, 1100);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pathname, router]);

  return (
    <AnimatePresence>
      {hit && (
        <motion.div
          className="konami-toast"
          role="status"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        >
          ↑↑↓↓←→←→BA — cheat accepted · loading <b>Deploy Run</b>…
        </motion.div>
      )}
    </AnimatePresence>
  );
}
