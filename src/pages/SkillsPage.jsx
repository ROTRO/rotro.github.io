import React, { useRef } from 'react';
import Seo from '../components/site/Seo';
import { skillGroups } from '../data/skills';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function SkillsPage() {
  const rootRef = useRef(null);
  useScrollReveal(rootRef, { y: 24, stagger: 0.09, start: 'top 84%' });

  return (
    <>
      <Seo
        title="Skills"
        path="/skills"
        description="Technical skills across full-stack engineering, cloud platforms, data stores, and secure architecture."
      />
      <section className="section">
        <div ref={rootRef} className="container">
          <div data-reveal>
            <p className="kicker">Skills</p>
            <h1 className="h1">Tools and disciplines I practice daily</h1>
            <p className="lead">
              Grouped for readability—everything listed here is backed by production
              experience, not buzzword padding.
            </p>
          </div>

          <div className="skill-grid" style={{ marginTop: '2rem' }}>
            {skillGroups.map((group) => (
              <section
                key={group.title}
                className="surface skill-block elevate-card"
                data-reveal
              >
                <h3 className="skill-block__title">{group.title}</h3>
                <div className="chips" aria-label={group.title}>
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
