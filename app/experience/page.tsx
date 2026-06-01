import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { roles } from '@/lib/experience';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Five years of full-stack engineering and technical leadership across cloud, healthcare and enterprise products.',
  alternates: { canonical: '/experience' },
};

export default function ExperiencePage() {
  return (
    <>
      <main>
        <section className="page-intro" data-screen-label="Experience — Intro">
          <div className="wrap">
            <span className="eyebrow" data-reveal>Experience · 2020 → now</span>
            <h1 className="display" data-reveal data-reveal-delay="1">
              Five years,<br />five teams.
            </h1>
            <p className="lead" data-reveal data-reveal-delay="2">
              From hands-on full-stack delivery to leading engineers and owning cloud architecture —
              a track record of shipping reliable systems and measurable impact.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '1.5rem' }} data-screen-label="Experience — Timeline">
          <div className="wrap">
            <div className="tl">
              {roles.map((r) => (
                <article className="tl-item" data-reveal key={r.company + r.period}>
                  <div className="tl-period">
                    {r.period}
                    {r.current && (
                      <>
                        <br />
                        <span className="tl-now">Current</span>
                      </>
                    )}
                    {r.location && (
                      <>
                        <br />
                        <span className="tl-loc">{r.location}</span>
                      </>
                    )}
                  </div>
                  <div>
                    <div className="tl-co">
                      <h3>{r.title}</h3>
                      <span className="at">@ <b>{r.company}</b></span>
                    </div>
                    <ul className="tl-list">
                      {r.bullets.map((b) => (
                        <li className={b.win ? 'win' : undefined} key={b.text}>
                          {b.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
