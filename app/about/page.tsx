import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { personSchema } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Technical lead and full-stack engineer with 5+ years building cloud-driven software on AWS — Angular, Node.js, React and secure architecture.',
  alternates: { canonical: '/about' },
  openGraph: { type: 'profile', url: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personSchema()} />

      <main>
        <section className="page-intro" data-screen-label="About — Intro">
          <div className="wrap">
            <span className="eyebrow" data-reveal>About · profile.md</span>
            <h1 className="display" data-reveal data-reveal-delay="1">
              Engineer who<br />leads &amp; ships.
            </h1>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '1rem' }} data-screen-label="About — Bio">
          <div className="wrap">
            <div className="about-grid">
              <div className="ph headshot ticks" data-reveal>
                <span className="ph__label">headshot · 4:5</span>
                <span className="corner">drop image here</span>
              </div>
              <div className="about-body" data-reveal data-reveal-delay="1">
                <p>
                  I&apos;m <b>Bilel Hedhli</b> — a Technical Lead and Full-Stack Engineer based in Tunis, Tunisia,
                  with <b>over 5 years</b> delivering innovative, scalable, cloud-driven software.
                </p>
                <p>
                  I build complex systems with JavaScript technologies — <b>Angular, Node.js, React, Next.js</b> —
                  integrate cloud platforms like <b>AWS, Firebase and Docker</b>, and streamline delivery with
                  CI/CD pipelines. I&apos;ve led cross-functional teams, modernized legacy codebases, and shipped
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
                  <div className="fact"><dt>Email</dt><dd><a className="arrow-link" href="mailto:bilelhedhli@gmail.com" style={{ color: 'var(--accent)' }}>bilelhedhli@gmail.com</a></dd></div>
                  <div className="fact"><dt>Availability</dt><dd style={{ color: 'var(--accent)' }}>● Open to work</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="section" data-screen-label="About — Skills">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">01 / CAPABILITIES</span>
              <h2 className="h-sec" data-reveal>The toolkit</h2>
            </div>
            <div className="skill-grid">
              <div className="card skill-block ticks" data-reveal data-tilt="5">
                <h3><span>Languages &amp; frameworks</span><span className="ix">01</span></h3>
                <div className="chips">
                  <span className="chip">JavaScript</span><span className="chip">Angular</span><span className="chip">Node.js</span>
                  <span className="chip">React</span><span className="chip">Next.js</span><span className="chip">Ionic</span>
                  <span className="chip">NestJS</span><span className="chip">Flutter</span>
                </div>
              </div>
              <div className="card skill-block ticks" data-reveal data-reveal-delay="1" data-tilt="5">
                <h3><span>Cloud &amp; delivery</span><span className="ix">02</span></h3>
                <div className="chips">
                  <span className="chip">AWS</span><span className="chip">Docker</span><span className="chip">CI/CD</span>
                  <span className="chip">GitHub</span><span className="chip">Git</span>
                </div>
              </div>
              <div className="card skill-block ticks" data-reveal data-tilt="5">
                <h3><span>Data</span><span className="ix">03</span></h3>
                <div className="chips">
                  <span className="chip">MongoDB</span><span className="chip">MySQL</span><span className="chip">Firebase</span>
                  <span className="chip">REST APIs</span><span className="chip">Spring Boot</span>
                </div>
              </div>
              <div className="card skill-block ticks" data-reveal data-reveal-delay="1" data-tilt="5">
                <h3><span>Architecture &amp; security</span><span className="ix">04</span></h3>
                <div className="chips">
                  <span className="chip">System architecture</span><span className="chip">Microservices</span>
                  <span className="chip">Security best practices</span><span className="chip">Agile / Scrum</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }} data-screen-label="About — Education">
          <div className="wrap">
            <div className="two-col">
              <div className="list-block" data-reveal>
                <h3>// Education</h3>
                <div className="edu-item">
                  <h4>M.Sc. — Computer Software &amp; Media Applications</h4>
                  <div className="meta">Higher Institute of Technology, Rades · 2020 — 2022</div>
                </div>
                <div className="edu-item">
                  <h4>B.Sc. — Computer Software Engineering</h4>
                  <div className="meta">Higher Institute of Technology, Bizerte · 2017 — 2020</div>
                </div>
              </div>
              <div className="list-block" data-reveal data-reveal-delay="1">
                <h3>// Certifications</h3>
                <div className="cert-item"><span className="no">001</span><span className="t">Introduction to Programming Using Java</span></div>
                <div className="cert-item"><span className="no">002</span><span className="t">Foundations of Cybersecurity</span></div>
                <div className="cert-item"><span className="no">003</span><span className="t">HTML5 Application Development Fundamentals</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
