import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Seo from '../components/site/Seo';
import { projects } from '../data/projects';
import { useMotionSafe } from '../hooks/useMotionSafe';

export default function ProjectsPage() {
  const { fadeUp, transition, stagger, reduce } = useMotionSafe();

  return (
    <>
      <Seo
        title="Projects"
        path="/projects"
        description="Selected work and platforms featuring Bilel Hedhli's engineering and technical leadership."
      />
      <section className="section">
        <div className="container">
          <motion.div {...fadeUp} transition={transition}>
            <p className="kicker">Projects</p>
            <h1 className="h1">Selected impact, explained plainly</h1>
            <p className="lead">
              A short list of representative work—each tied to real delivery
              constraints, measurable improvements, or public presence.
            </p>
          </motion.div>

          <div className="project-grid" style={{ marginTop: '2rem' }}>
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                className="surface project-card"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...transition,
                  delay: reduce ? 0 : 0.08 + index * stagger,
                }}
              >
                <div className="muted" style={{ fontSize: '0.85rem' }}>
                  {project.tagline}
                </div>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                <div className="chips" aria-label="Technologies">
                  {project.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
                {project.href ? (
                  <a
                    className="link-inline"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit site
                    <ExternalLink size={16} aria-hidden />
                  </a>
                ) : (
                  <span className="muted" style={{ fontSize: '0.9rem' }}>
                    Details available on request.
                  </span>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
