import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import HeroFx from '@/components/HeroFx';
import JsonLd from '@/components/JsonLd';
import { personSchema, websiteSchema } from '@/lib/structuredData';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.personName} — ${SITE.role}`,
  description:
    'Full-stack engineer, technical lead, and cloud solutions specialist building secure, scalable systems on AWS — from architecture to deployment.',
  alternates: { canonical: '/' },
};

const HERO_VIDEO = '/assets/hero.mp4';
const HERO_POSTER = '/assets/hero-poster.jpg';

export default function HomePage() {
  return (
    <>
      <JsonLd data={[websiteSchema(), personSchema()]} />

      <main>
        <section className="cine" data-screen-label="Home — Hero">
          <video
            className="cine__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER}
            src={HERO_VIDEO}
          />
          <div className="cine__blur" />
          <HeroFx />

          <div className="cine__inner">
            <div className="cine__row">
              <div className="cine__left">
                <div className="cine__meta animate-blur-fade-up" style={{ animationDelay: '300ms' }}>
                  <span className="cine__chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    5+ Years
                  </span>
                  <span className="sep" />
                  <span className="cine__chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    Technical Lead
                  </span>
                  <span className="sep" />
                  <span className="cine__chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Tunis · UTC+1
                  </span>
                </div>

                <h1 className="cine__title animate-blur-fade-up" style={{ animationDelay: '400ms' }}>
                  {SITE.personName}
                </h1>

                <p className="cine__desc animate-blur-fade-up" style={{ animationDelay: '500ms' }}>
                  Full-stack engineer &amp; technical lead building secure, scalable systems on AWS —
                  from architecture to deployment.
                </p>

                <div className="cine__cta">
                  <Link className="cine__btn-solid animate-blur-fade-up" style={{ animationDelay: '600ms' }} href="/projects" data-magnetic="0.25">
                    View work
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                  <Link className="cine__btn-glass liquid-glass animate-blur-fade-up" style={{ animationDelay: '700ms' }} href="/about" data-magnetic="0.2">
                    About me
                  </Link>
                </div>
              </div>

              <div className="cine__right">
                <a className="cine__pill liquid-glass animate-blur-fade-up" style={{ animationDelay: '800ms' }} href="/assets/Bilel-Hedhli-CV.pdf" target="_blank" rel="noreferrer">
                  Résumé
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                </a>
                <Link className="cine__pill liquid-glass animate-blur-fade-up" style={{ animationDelay: '900ms' }} href="/play">
                  Play the game
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="cine__scroll animate-blur-fade-up" style={{ animationDelay: '1000ms' }}>
              Scroll to explore <span className="ar">↓</span>
            </div>
          </div>
        </section>

        <section className="section chapter" data-screen-label="Home — Stats">
          <span className="chapter__ghost" aria-hidden="true">01</span>
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">01 / BY THE NUMBERS</span>
            </div>
            <div className="stats" data-reveal>
              <div className="stat">
                <div className="stat__num"><span data-count="5">5</span><span className="suf">+</span></div>
                <div className="stat__lbl">Years of experience</div>
              </div>
              <div className="stat">
                <div className="stat__num"><span data-count="10">10</span></div>
                <div className="stat__lbl">Engineers led</div>
              </div>
              <div className="stat">
                <div className="stat__num"><span data-count="30">30</span><span className="suf">%</span></div>
                <div className="stat__lbl">Faster deployments via CI/CD</div>
              </div>
              <div className="stat">
                <div className="stat__num"><span data-count="25">25</span><span className="suf">%</span></div>
                <div className="stat__lbl">Team productivity gain</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section chapter" data-screen-label="Home — Now">
          <span className="chapter__ghost" aria-hidden="true">02</span>
          <div className="wrap">
            <div className="now">
              <div className="sec-head" style={{ margin: 0 }}>
                <span className="sec-num">02 / FOCUS</span>
                <h2 className="h-sec" data-reveal>
                  What I&apos;m<br />doing now
                </h2>
              </div>
              <div className="now__list">
                <div className="now__item" data-reveal>
                  <span className="now__idx">001</span>
                  <div className="now__txt">
                    <h3>Leading cloud architecture at Aquadeep</h3>
                    <p>Designing scalable AWS systems, managing developers and CI/CD pipelines, and driving uptime and reliability.</p>
                  </div>
                </div>
                <div className="now__item" data-reveal data-reveal-delay="1">
                  <span className="now__idx">002</span>
                  <div className="now__txt">
                    <h3>Full-stack delivery at RMSoftware</h3>
                    <p>Architecting production workloads with Angular, NestJS, Flutter and Ionic — with security baked in from the start.</p>
                  </div>
                </div>
                <div className="now__item" data-reveal data-reveal-delay="2">
                  <span className="now__idx">003</span>
                  <div className="now__txt">
                    <h3>Exploring React, Vue &amp; Next.js</h3>
                    <p>Continuously modernizing my stack and sharpening front-of-stack craft alongside backend and infrastructure work.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section chapter" data-screen-label="Home — Featured">
          <span className="chapter__ghost" aria-hidden="true">03</span>
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-num">03 / SELECTED WORK</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 className="h-sec" data-reveal>
                  Things I&apos;ve<br />built &amp; led
                </h2>
                <Link className="arrow-link" href="/projects" data-reveal>
                  All projects <span className="arrow">→</span>
                </Link>
              </div>
            </div>
            <div className="feat">
              <Link className="feat__card" href="/projects/esteps">
                <div className="feat__top"><h3>Real-time healthcare SaaS</h3><span className="feat__no">01</span></div>
                <p>End-to-end platform on Node.js, Angular &amp; AWS — 20% faster data retrieval, 15% lower latency, team of 10.</p>
                <div className="chips"><span className="chip">Node.js</span><span className="chip">Angular</span><span className="chip">AWS</span><span className="chip">MongoDB</span></div>
                <span className="door-cta">Enter <em>→</em></span>
              </Link>
              <Link className="feat__card" href="/projects/aquadeep">
                <div className="feat__top"><h3>Cloud platforms &amp; reliability</h3><span className="feat__no">02</span></div>
                <p>Technical leadership on AWS architectures and CI/CD modernization — balancing delivery speed with production stability.</p>
                <div className="chips"><span className="chip">AWS</span><span className="chip">CI/CD</span><span className="chip">Leadership</span></div>
                <span className="door-cta">Enter <em>→</em></span>
              </Link>
              <Link className="feat__card" href="/projects/rms">
                <div className="feat__top"><h3>Enterprise full-stack delivery</h3><span className="feat__no">03</span></div>
                <p>Product work across Angular, NestJS, Flutter &amp; Ionic with secure design patterns and microservices boundaries.</p>
                <div className="chips"><span className="chip">Angular</span><span className="chip">NestJS</span><span className="chip">Flutter</span><span className="chip">Ionic</span></div>
                <span className="door-cta">Enter <em>→</em></span>
              </Link>
              <Link className="feat__card" href="/projects/novavespera">
                <div className="feat__top"><h3>Novavespera</h3><span className="feat__no">04</span></div>
                <p>A focused portfolio &amp; brand presence built for clarity, performance and credibility with hiring teams.</p>
                <div className="chips"><span className="chip">React</span><span className="chip">Performance</span><span className="chip">SEO</span></div>
                <span className="door-cta">Enter <em>→</em></span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
