import React, { useRef } from 'react';
import Seo from '../components/site/Seo';
import { experience } from '../data/experience';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ExperiencePage() {
  const rootRef = useRef(null);
  useScrollReveal(rootRef, { y: 28, stagger: 0.1, start: 'top 84%' });

  return (
    <>
      <Seo
        title="Experience"
        path="/experience"
        description="Professional experience across technical leadership, full-stack delivery, and cloud solutions."
      />
      <section className="section">
        <div ref={rootRef} className="container">
          <div data-reveal>
            <p className="kicker">Experience</p>
            <h1 className="h1">Roles that shaped how I build</h1>
            <p className="lead">
              A concise history focused on outcomes: architecture, delivery speed,
              reliability, and team leadership.
            </p>
          </div>

          <div className="divider" data-reveal />

          <div className="timeline" style={{ marginTop: '1.5rem' }}>
            {experience.map((job) => (
              <article
                key={job.id}
                className="surface job-card elevate-card"
                data-reveal
              >
                <h3 className="job-card__role">{job.role}</h3>
                <p className="job-card__meta">
                  {job.company} · {job.period}
                </p>
                <ul>
                  {job.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
