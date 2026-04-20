import { useReducedMotion } from 'framer-motion';

export function useMotionSafe() {
  const reduce = useReducedMotion();
  return {
    reduce,
    fadeUp: reduce
      ? { initial: false, animate: { opacity: 1, y: 0 } }
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } },
    stagger: reduce ? 0 : 0.06,
    transition: reduce
      ? { duration: 0.01 }
      : { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  };
}
