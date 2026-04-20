import React from 'react';
import { motion } from 'framer-motion';
import Seo from '../components/site/Seo';
import { profile } from '../data/profile';
import { useMotionSafe } from '../hooks/useMotionSafe';

export default function AboutPage() {
  const { fadeUp, transition, reduce } = useMotionSafe();

  return (
    <>
      <Seo
        title="About"
        path="/about"
        description="Background, focus areas, and how Bilel Hedhli approaches engineering leadership and delivery."
      />
      <section className="section">
        <div className="container grid-2">
          <motion.div {...fadeUp} transition={transition}>
            <p className="kicker">About</p>
            <h1 className="h1">Engineering with ownership</h1>
            <p className="lead">
              I am a Tunis-based full-stack engineer and technical lead who designs
              and ships cloud systems end-to-end—then stays close to production
              reality: reliability, security, and team velocity.
            </p>
            <p className="muted">
              My work spans AWS architectures, microservices, and modern web and
              mobile stacks (Angular, React, Next.js, NestJS, Flutter, Ionic). I
              care about measurable outcomes: faster deployments, lower latency,
              healthier databases, and teams that can move without breaking trust
              with users.
            </p>
            <p className="muted">
              Outside individual contributions, I have led multi-person engineering
              efforts, aligned delivery with business risk, and championed security
              practices across authentication and data handling.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: reduce ? 0 : 0.08 }}
            className="surface"
            style={{ padding: '1.25rem', overflow: 'hidden' }}
          >
            <img
              src="/images/avatar_3.jpeg"
              alt={`Portrait of ${profile.name}`}
              width={720}
              height={900}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                borderRadius: 12,
                objectFit: 'cover',
                maxHeight: 420,
              }}
            />
            <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
              {profile.name} — {profile.location}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
