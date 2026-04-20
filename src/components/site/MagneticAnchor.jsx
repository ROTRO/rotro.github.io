import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapSetup';
import { getMotionPrefs } from '../../lib/motionPrefs';

const MagneticAnchor = React.forwardRef(function MagneticAnchor(
  { children, className = '', ...rest },
  forwardedRef,
) {
  const outer = useRef(null);
  const inner = useRef(null);

  useLayoutEffect(() => {
    const { reduce, coarse } = getMotionPrefs();
    if (reduce || coarse) return undefined;

    const root = outer.current;
    const target = inner.current;
    if (!root || !target) return undefined;

    const strength = 0.2;
    const onMove = (e) => {
      const rect = root.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      gsap.to(target, {
        x,
        y,
        duration: 0.32,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };
    const onLeave = () => {
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const setRefs = (node) => {
    outer.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <a ref={setRefs} className={className} {...rest}>
      <span ref={inner} className="magnetic-link__inner">
        {children}
      </span>
    </a>
  );
});

export default MagneticAnchor;
