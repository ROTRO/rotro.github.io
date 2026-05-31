import { profile } from '../data/profile';
import { skillGroups, education, certifications } from '../data/skills';
import { useReveal } from '../hooks/useReveal';

export default function About() {
  useReveal();

  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <span className="eyebrow" data-reveal>About · profile.md</span>
          <h1 className="display" data-reveal data-reveal-delay="1">
            Engineer who
            <br />
            leads & ships.
          </h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap">
          <div className="about-grid">
            <div className="ph headshot ticks" data-reveal>
              {/* <span className="ph__label">headshot · 4:5</span> */}
            </div>
            <div className="about-body" data-reveal data-reveal-delay="1">
              <p>
                I'm <b>Bilel Hedhli</b> — a Technical Lead and Full-Stack Engineer based in Tunis, Tunisia,
                with <b>over 5 years</b> delivering innovative, scalable, cloud-driven software.
              </p>
              <p>
                I build complex systems with JavaScript technologies — <b>Angular, Node.js, React, Next.js</b> —
                integrate cloud platforms like <b>AWS, Firebase and Docker</b>, and streamline delivery with
                CI/CD pipelines. I've led cross-functional teams, modernized legacy codebases, and shipped
                real-time healthcare and business applications end to end.
              </p>
              <p>
                I care about <b>secure design</b>, clean architecture, and the operational discipline that keeps
                production systems fast and reliable.
              </p>
              <span className="award-tag">★ First Prize, POESAM 2023 — with eSteps Health</span>

              <dl className="facts">
                <div className="fact"><dt>Location</dt><dd>Tunis, Tunisia</dd></div>
                <div className="fact"><dt>Experience</dt><dd>5+ years</dd></div>
                <div className="fact"><dt>Current role</dt><dd>Technical Lead</dd></div>
                <div className="fact"><dt>Focus</dt><dd>AWS · Architecture</dd></div>
                <div className="fact">
                  <dt>Email</dt>
                  <dd>
                    <a className="arrow-link" href={`mailto:${profile.email}`} style={{ color: 'var(--accent)' }}>
                      {profile.email}
                    </a>
                  </dd>
                </div>
                <div className="fact"><dt>Availability</dt><dd style={{ color: 'var(--accent)' }}>● Open to work</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-num">01 / CAPABILITIES</span>
            <h2 className="h-sec" data-reveal>The toolkit</h2>
          </div>
          <div className="skill-grid">
            {skillGroups.map((group, i) => (
              <div
                key={group.title}
                className="card skill-block ticks"
                data-reveal
                data-reveal-delay={String(i % 2)}
                data-tilt="5"
              >
                <h3>
                  <span>{group.title}</span>
                  <span className="ix">{String(i + 1).padStart(2, '0')}</span>
                </h3>
                <div className="chips">
                  {group.items.map((item) => (
                    <span key={item} className="chip">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="two-col">
            <div className="list-block" data-reveal>
              <h3>// Education</h3>
              {education.map((edu) => (
                <div key={edu.degree} className="edu-item">
                  <h4>{edu.degree}</h4>
                  <div className="meta">{edu.school} · {edu.period}</div>
                </div>
              ))}
            </div>
            <div className="list-block" data-reveal data-reveal-delay="1">
              <h3>// Certifications</h3>
              {certifications.map((cert, i) => (
                <div key={cert} className="cert-item">
                  <span className="no">{String(i + 1).padStart(3, '0')}</span>
                  <span className="t">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}