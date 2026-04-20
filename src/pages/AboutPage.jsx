import React, { useRef } from 'react';
import Seo from '../components/site/Seo';
import { profile } from '../data/profile';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutPage() {
  const rootRef = useRef(null);
  useScrollReveal(rootRef, { y: 24, stagger: 0.1, start: 'top 84%' });

  return (
    <>
      <Seo
        title="About"
        path="/about"
        description="Background, focus areas, and how Bilel Hedhli approaches engineering leadership and delivery."
      />
      <section className="section">
        <div ref={rootRef} className="container grid-2">
          <div data-reveal>
            <p className="kicker">About</p>
            <h1 className="h1">Engineering with ownership</h1>
            <p className="lead">
              I am a full-stack engineer and technical lead who designs and ships
              cloud systems end-to-end—then stays close to production reality:
              reliability, security, and team velocity.
            </p>
            <p className="muted">
              My work spans AWS architectures, microservices, and modern web and
              mobile stacks (Angular, React, Next.js, NestJS, Flutter, Ionic). I
              care about measurable outcomes: faster deployments, lower latency,
              healthier databases, and teams that can move without breaking trust
              with users.
            </p>
            <p className="muted">
              Outside individual contributions, I have led multi-person engineering
              efforts, aligned delivery with business risk, and championed security
              practices across authentication and data handling.
            </p>
          </div>

          <div
            data-reveal
            className="surface elevate-card"
            style={{ padding: '1.25rem', overflow: 'hidden' }}
          >
            <img
              src="/images/avatar_3.jpeg"
              alt={`Portrait of ${profile.name}`}
              width={720}
              height={900}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                borderRadius: 12,
                objectFit: 'cover',
                maxHeight: 420,
              }}
            />
            <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
              {profile.name} · {profile.siteName}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
