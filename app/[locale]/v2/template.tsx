'use client';

import { motion, MotionConfig } from 'motion/react';

/** Per-navigation enter transition for v2 page content. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        id="content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
