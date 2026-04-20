import React from 'react';
import { motion } from 'framer-motion';
import Seo from '../components/site/Seo';
import { skillGroups } from '../data/skills';
import { useMotionSafe } from '../hooks/useMotionSafe';

export default function SkillsPage() {
  const { fadeUp, transition, stagger, reduce } = useMotionSafe();

  return (
    <>
      <Seo
        title="Skills"
        path="/skills"
        description="Technical skills across full-stack engineering, cloud platforms, data stores, and secure architecture."
      />
      <section className="section">
        <div className="container">
          <motion.div {...fadeUp} transition={transition}>
            <p className="kicker">Skills</p>
            <h1 className="h1">Tools and disciplines I practice daily</h1>
            <p className="lead">
              Grouped for readability—everything listed here is backed by production
              experience, not buzzword padding.
            </p>
          </motion.div>

          <div className="skill-grid" style={{ marginTop: '2rem' }}>
            {skillGroups.map((group, index) => (
              <motion.section
                key={group.title}
                className="surface skill-block"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...transition,
                  delay: reduce ? 0 : 0.08 + index * stagger,
                }}
              >
                <h2>{group.title}</h2>
                <div className="chips" aria-label={group.title}>
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
