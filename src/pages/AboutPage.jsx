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
              src="https://scontent.ftun8-1.fna.fbcdn.net/v/t39.30808-6/275285847_5522209134461962_246686062498108650_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=oRC6wfmRdo4Q7kNvwGuxXvc&_nc_oc=AdpxkaAJlKDCcGVFLa3cr9ER7grV_xMKZRlzMxngapqjV5yIUoQUx-pCwBykVRSWV2o&_nc_zt=23&_nc_ht=scontent.ftun8-1.fna&_nc_gid=ATh_L7dVIjckLs3PPcdJig&_nc_ss=7a3a8&oh=00_Af3k_4ud2MW18LIbV7iBqSiwJnD7NAuo0toCQsD41R5Llg&oe=69EC1063"
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
