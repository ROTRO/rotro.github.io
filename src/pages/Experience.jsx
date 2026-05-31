import { experience } from '../data/experience';
import { useReveal } from '../hooks/useReveal';

export default function Experience() {
  useReveal();

  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <span className="eyebrow" data-reveal>Experience · 2020 → now</span>
          <h1 className="display" data-reveal data-reveal-delay="1">
            Five years,
            <br />
            five teams.
          </h1>
          <p className="lead" data-reveal data-reveal-delay="2">
            From hands-on full-stack delivery to leading engineers and owning cloud architecture —
            a track record of shipping reliable systems and measurable impact.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="wrap">
          <div className="tl">
            {experience.map((job) => (
              <article key={job.id} className="tl-item" data-reveal>
                <div className="tl-period">
                  {job.period}
                  {job.isCurrent && <span className="now-badge">Current</span>}
                  {job.location && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{job.location}</span>
                  )}
                </div>
                <div>
                  <div className="tl-co">
                    <h3>{job.role}</h3>
                    <span className="at">
                      @ <b>{job.company}</b>
                    </span>
                  </div>
                  <ul className="tl-list">
                    {job.highlights.map((h, i) => {
                      if (typeof h === 'object') {
                        return (
                          <li key={i} className="win">
                            {h.text}
                          </li>
                        );
                      }
                      return <li key={i}>{h}</li>;
                    })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}