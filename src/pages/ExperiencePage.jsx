import React from 'react';
import { motion } from 'framer-motion';
import Seo from '../components/site/Seo';
import { experience } from '../data/experience';
import { useMotionSafe } from '../hooks/useMotionSafe';

export default function ExperiencePage() {
  const { fadeUp, transition, stagger, reduce } = useMotionSafe();

  return (
    <>
      <Seo
        title="Experience"
        path="/experience"
        description="Professional experience across technical leadership, full-stack delivery, and cloud solutions."
      />
      <section className="section">
        <div className="container">
          <motion.div {...fadeUp} transition={transition}>
            <p className="kicker">Experience</p>
            <h1 className="h1">Roles that shaped how I build</h1>
            <p className="lead">
              A concise history focused on outcomes: architecture, delivery speed,
              reliability, and team leadership.
            </p>
          </motion.div>

          <div className="divider" />

          <div className="timeline" style={{ marginTop: '1.5rem' }}>
            {experience.map((job, index) => (
              <motion.article
                key={job.id}
                className="surface job-card"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...transition,
                  delay: reduce ? 0 : 0.08 + index * stagger,
                }}
              >
                <h2>{job.role}</h2>
                <p className="job-card__meta">
                  {job.company} · {job.period}
                </p>
                <ul>
                  {job.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
