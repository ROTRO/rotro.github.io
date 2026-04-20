import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Seo from '../components/site/Seo';
import {
  listProjectTechTags,
  listProjectTypes,
  PROJECTS,
} from '../data/projects';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ProjectsPage() {
  const rootRef = useRef(null);
  const [tech, setTech] = useState('all');
  const [type, setType] = useState('all');
  const [cursor, setCursor] = useState({ show: false, x: 0, y: 0 });

  useScrollReveal(rootRef, { y: 30, stagger: 0.08, start: 'top 84%' });

  const techOptions = useMemo(() => ['all', ...listProjectTechTags()], []);
  const typeOptions = useMemo(() => ['all', ...listProjectTypes()], []);

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (type !== 'all' && p.type !== type) return false;
      if (tech !== 'all' && !p.stack.includes(tech)) return false;
      return true;
    });
  }, [tech, type]);

  return (
    <>
      <Seo
        title="Projects"
        path="/projects"
        description="Selected engineering work across cloud, healthcare, enterprise delivery, and product surfaces."
      />

      <section className="projects-hero section">
        <div className="container">
          <p className="kicker">Work</p>
          <h1 className="h1 projects-hero__title">Projects that shipped</h1>
          <p className="lead projects-hero__lead">
            Case studies across web, mobile, and cloud—each with measurable outcomes,
            clear architecture, and production discipline.
          </p>
        </div>
      </section>

      <div
        key={`${tech}-${type}`}
        ref={rootRef}
        className="projects-page container section-tight"
      >
        <div className="projects-filters" data-reveal>
          <div className="projects-filters__group">
            <span className="projects-filters__label muted">Technology</span>
            <div className="projects-filters__chips" role="tablist" aria-label="Filter by technology">
              {techOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tech === t}
                  className={`projects-filter-chip${tech === t ? ' is-active' : ''}`}
                  onClick={() => setTech(t)}
                >
                  {t === 'all' ? 'All' : t}
                </button>
              ))}
            </div>
          </div>
          <div className="projects-filters__group">
            <span className="projects-filters__label muted">Type</span>
            <div className="projects-filters__chips" role="tablist" aria-label="Filter by type">
              {typeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={type === t}
                  className={`projects-filter-chip${type === t ? ' is-active' : ''}`}
                  onClick={() => setType(t)}
                >
                  {t === 'all' ? 'All' : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="projects-showcase-grid">
          {filtered.map((project) => (
            <article
              key={project.slug}
              className="project-card-xl"
              data-reveal
              onMouseMove={(e) => {
                setCursor({ show: true, x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setCursor((c) => ({ ...c, show: false }))}
            >
              <Link className="project-card-xl__link" to={`/projects/${project.slug}`}>
                <div className="project-card-xl__media">
                  <img
                    src={project.coverImage}
                    alt={`${project.name} cover`}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="project-card-xl__overlay" aria-hidden />
                  <div className="project-card-xl__body">
                    <span className="project-card-xl__eyebrow muted">
                      {project.year} · {project.role}
                    </span>
                    <h2 className="project-card-xl__title">{project.name}</h2>
                    <p className="project-card-xl__desc">{project.summary}</p>
                    <div className="project-card-xl__tags">
                      {project.stack.slice(0, 5).map((s) => (
                        <span key={s} className="project-card-xl__tag">
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="project-card-xl__cta">
                      View case study <ArrowUpRight size={18} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="muted" data-reveal>
            No projects match these filters.{' '}
            <button type="button" className="link-inline link-inline--animated" onClick={() => { setTech('all'); setType('all'); }}>
              Reset filters
            </button>
          </p>
        )}
      </div>

      {cursor.show && (
        <div
          className="project-cursor-hint"
          style={{ transform: `translate(${cursor.x + 12}px, ${cursor.y + 12}px)` }}
          aria-hidden
        >
          View project
        </div>
      )}
    </>
  );
}
