import React, { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import Seo from '../components/site/Seo';
import ProjectLightbox from '../components/projects/ProjectLightbox';
import { getProjectBySlug } from '../data/projects';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = useMemo(() => getProjectBySlug(slug), [slug]);
  const rootRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);

  useScrollReveal(rootRef, { y: 28, stagger: 0.08, start: 'top 86%' });

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const prev = getProjectBySlug(project.prevSlug);
  const next = getProjectBySlug(project.nextSlug);

  return (
    <>
      <Seo
        title={project.name}
        path={`/projects/${project.slug}`}
        description={project.summary}
      />

      <section className="project-hero">
        <div className="project-hero__media">
          <img
            src={project.heroImage}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <div className="project-hero__scrim" aria-hidden />
        </div>
        <div className="project-hero__content container">
          <Link className="project-hero__back link-inline link-inline--animated" to="/projects">
            ← All projects
          </Link>
          <h1 className="project-hero__title">{project.name}</h1>
          <p className="project-hero__tagline">{project.tagline}</p>
          <div className="project-hero__chips">
            {project.stack.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <p className="project-hero__meta muted">
            {project.role} · {project.year}
          </p>
          {project.href && (
            <a
              className="btn btn-primary"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live site <ExternalLink size={18} aria-hidden />
            </a>
          )}
        </div>
      </section>

      <div ref={rootRef} className="project-body container">
        <section className="project-section" data-reveal>
          <h2 className="project-section__title">Overview</h2>
          <p className="project-lead">{project.overview}</p>
        </section>

        <div className="project-grid-2">
          <section className="project-section surface project-surface" data-reveal>
            <h2 className="project-section__title">Problem</h2>
            <p className="muted">{project.problem}</p>
          </section>
          <section className="project-section surface project-surface" data-reveal>
            <h2 className="project-section__title">Goals</h2>
            <ul className="project-list muted">
              {project.goals.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="project-section surface project-surface" data-reveal>
          <h2 className="project-section__title">Architecture & stack</h2>
          <p className="muted">{project.architecture.text}</p>
          <div className="project-arch__tags">
            {project.architecture.highlights.map((h) => (
              <span key={h} className="chip">
                {h}
              </span>
            ))}
          </div>
        </section>

        <section className="project-section" data-reveal>
          <h2 className="project-section__title">Key features</h2>
          <div className="project-features">
            {project.features.map((f) => (
              <article key={f.title} className="project-feature surface">
                <h3>{f.title}</h3>
                <p className="muted">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="project-section" data-reveal>
          <h2 className="project-section__title">Gallery</h2>
          <div className="project-gallery">
            {project.gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className="project-gallery__item"
                onClick={() => setLightbox(i)}
              >
                <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
                <span className="project-gallery__zoom muted">Open</span>
              </button>
            ))}
          </div>
        </section>

        <section className="project-section" data-reveal>
          <h2 className="project-section__title">Results</h2>
          <div className="project-metrics">
            {project.results.map((r) => (
              <div key={r.label} className="project-metric surface">
                <div className="project-metric__value">{r.value}</div>
                <div className="project-metric__label">{r.label}</div>
                <div className="project-metric__hint muted">{r.hint}</div>
              </div>
            ))}
          </div>
        </section>

        <nav className="project-nav" aria-label="Project navigation">
          <Link className="project-nav__card" to={`/projects/${prev.slug}`}>
            <span className="muted">Previous</span>
            <span className="project-nav__name">
              <ArrowLeft size={18} aria-hidden /> {prev.name}
            </span>
          </Link>
          <Link className="project-nav__card project-nav__card--center" to="/projects">
            <span className="muted">Index</span>
            <span className="project-nav__name">All projects</span>
          </Link>
          <Link className="project-nav__card project-nav__card--end" to={`/projects/${next.slug}`}>
            <span className="muted">Next</span>
            <span className="project-nav__name">
              {next.name} <ArrowRight size={18} aria-hidden />
            </span>
          </Link>
        </nav>
      </div>

      {lightbox != null && (
        <ProjectLightbox
          items={project.gallery}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onChangeIndex={setLightbox}
        />
      )}
    </>
  );
}
