export function getMotionPrefs() {
  if (typeof window === 'undefined') {
    return {
      reduce: true,
      coarse: true,
      allowCursor: false,
      allowHeavy: false,
    };
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const wide = window.matchMedia('(min-width: 960px)').matches;

  return {
    reduce,
    coarse,
    allowCursor: !reduce && !coarse && wide,
    /** Scroll / hover intensity */
    allowHeavy: !reduce && !coarse,
  };
}
