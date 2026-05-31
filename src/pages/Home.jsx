import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { useReveal } from '../hooks/useReveal';

const nowItems = [
  {
    title: 'Leading cloud architecture at Aquadeep',
    desc: 'Designing scalable AWS systems, managing developers and CI/CD pipelines, and driving uptime and reliability.',
  },
  {
    title: 'Full-stack delivery at RMSoftware',
    desc: 'Architecting production workloads with Angular, NestJS, Flutter and Ionic — with security baked in from the start.',
  },
  {
    title: 'Exploring React, Vue & Next.js',
    desc: 'Continuously modernizing my stack and sharpening front-of-stack craft alongside backend and infrastructure work.',
  },
];

const featuredItems = [
  {
    title: 'Real-time healthcare SaaS',
    num: '01',
    desc: 'End-to-end platform on Node.js, Angular & AWS — 20% faster data retrieval, 15% lower latency, team of 10.',
    chips: ['Node.js', 'Angular', 'AWS', 'MongoDB'],
  },
  {
    title: 'Cloud platforms & reliability',
    num: '02',
    desc: 'Technical leadership on AWS architectures and CI/CD modernization — balancing delivery speed with production stability.',
    chips: ['AWS', 'CI/CD', 'Leadership'],
  },
  {
    title: 'Enterprise full-stack delivery',
    num: '03',
    desc: 'Product work across Angular, NestJS, Flutter & Ionic with secure design patterns and microservices boundaries.',
    chips: ['Angular', 'NestJS', 'Flutter', 'Ionic'],
  },
  {
    title: 'Novavespera',
    num: '04',
    desc: 'A focused portfolio & brand presence built for clarity, performance and credibility with hiring teams.',
    chips: ['React', 'Performance', 'SEO'],
  },
];

export default function Home() {
  useReveal();

  return (
    <main>
      {/* Cinematic Hero */}
      <section className="cine">
        <video
          className="cine__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={profile.videoUrl}
        />
        <div className="cine__blur" />

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
                Bilel Hedhli
              </h1>

              <p className="cine__desc animate-blur-fade-up" style={{ animationDelay: '500ms' }}>
                Full-stack engineer & technical lead building secure, scalable systems on AWS —
                from architecture to deployment.
              </p>

              <div className="cine__cta">
                <Link
                  className="cine__btn-solid animate-blur-fade-up"
                  style={{ animationDelay: '600ms' }}
                  to="/projects"
                >
                  View work
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  className="cine__btn-glass liquid-glass animate-blur-fade-up"
                  style={{ animationDelay: '700ms' }}
                  to="/about"
                >
                  About me
                </Link>
              </div>
            </div>

            <div className="cine__right">
              <a
                className="cine__pill liquid-glass animate-blur-fade-up"
                style={{ animationDelay: '800ms' }}
                href={profile.cvPdf}
                target="_blank"
                rel="noreferrer"
              >
                Résumé
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </a>
              <Link
                className="cine__pill liquid-glass animate-blur-fade-up"
                style={{ animationDelay: '900ms' }}
                to="/contact"
              >
                Contact
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="cine__scroll animate-blur-fade-up" style={{ animationDelay: '1000ms' }}>
            Scroll to explore <span className="ar">↓</span>
          </div>
        </div>
      </section>

      {/* Now / Focus */}
      <section className="section">
        <div className="wrap">
          <div className="now">
            <div className="sec-head" style={{ margin: 0 }}>
              <span className="sec-num">01 / FOCUS</span>
              <h2 className="h-sec" data-reveal>
                What I'm
                <br />
                doing now
              </h2>
            </div>
            <div className="now__list">
              {nowItems.map((item, i) => (
                <div key={i} className="now__item" data-reveal data-reveal-delay={String(i)}>
                  <span className="now__idx">{String(i + 1).padStart(3, '0')}</span>
                  <div className="now__txt">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-num">02 / SELECTED WORK</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 className="h-sec" data-reveal>
                Things I've
                <br />
                built & led
              </h2>
              <Link className="arrow-link" to="/projects" data-reveal>
                All projects <span className="arrow">→</span>
              </Link>
            </div>
          </div>
          <div className="feat" data-reveal>
            {featuredItems.map((item) => (
              <Link key={item.num} className="feat__card" to="/projects">
                <div className="feat__top">
                  <h3>{item.title}</h3>
                  <span className="feat__no">{item.num}</span>
                </div>
                <p>{item.desc}</p>
                <div className="chips">
                  {item.chips.map((c) => (
                    <span key={c} className="chip">{c}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}