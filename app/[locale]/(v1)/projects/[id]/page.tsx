import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { projects } from '@/lib/projects';
import { SITE, SITE_URL } from '@/lib/site';

const pad = (n: number) => (n < 10 ? '0' : '') + n;

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const p = projects.find((x) => x.id === params.id);
  if (!p) return {};
  return {
    title: `${p.name} — Case study`,
    description: p.desc,
    alternates: { canonical: `/projects/${p.id}` },
    openGraph: {
      type: 'article',
      title: `${p.name} — ${p.tagline}`,
      description: p.desc,
      url: `/projects/${p.id}`,
      ...(p.cover ? { images: [{ url: p.cover, alt: p.name }] } : {}),
    },
  };
}

export default function CasePage({ params }: Props) {
  const index = projects.findIndex((x) => x.id === params.id);
  if (index === -1) notFound();

  const p = projects[index];
  const total = projects.length;
  const prev = projects[(index - 1 + total) % total];
  const next = projects[(index + 1) % total];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: p.name,
          description: p.desc,
          keywords: p.stack.join(', '),
          url: `${SITE_URL}/projects/${p.id}`,
          author: { '@type': 'Person', name: SITE.personName },
          ...(p.live ? { sameAs: p.live } : {}),
        }}
      />

      <main>
        <section className="page-intro" data-screen-label={`${p.name} — Intro`}>
          <div className="wrap">
            <span className="eyebrow" data-reveal>
              Case study · {pad(index + 1)} / {pad(total)}
            </span>
            <h1 className="display" data-reveal data-reveal-delay="1">
              {p.name}
            </h1>
            <p className="lead" data-reveal data-reveal-delay="2">
              {p.tagline}
            </p>
            <div className="case__badges" style={{ marginTop: '1.4rem' }} data-reveal data-reveal-delay="3">
              <span className="case__badge">{p.kind}</span>
              <span className="case__badge">{p.year}</span>
              <span className={`case__badge${p.live ? ' live' : ''}`}>
                {p.live ? '● Live' : 'Private'}
              </span>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '1.5rem' }} data-screen-label={`${p.name} — Detail`}>
          <div className="wrap">
            <div className="case__cols">
              <div className="case__info" data-reveal>
                <p className="case__desc">{p.desc}</p>

                <h2 className="case__h">Highlights</h2>
                <ul className="case__feats">
                  {p.feats.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <h2 className="case__h">Stack</h2>
                <div className="chips">
                  {p.stack.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>

                <div className="case__links">
                  {p.live ? (
                    <a className="arrow-link" href={p.live} target="_blank" rel="noreferrer">
                      Visit live site <span className="arrow">↗</span>
                    </a>
                  ) : (
                    <span className="case__priv">Source private</span>
                  )}
                </div>
              </div>

              {p.gallery.length > 0 && (
                <div className="case__gallery" data-reveal data-reveal-delay="1">
                  {p.gallery.map((g) => (
                    <figure className={`shot shot--${p.shape || 'web'}`} key={g.src}>
                      <img src={g.src} alt={g.cap} loading="lazy" />
                      <figcaption>{g.cap}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>

            <nav className="case-pager" aria-label="More case studies">
              <Link className="case-pager__link" href={`/projects/${prev.id}`} rel="prev">
                <span className="k">‹ Previous</span>
                <span className="v">{prev.name}</span>
              </Link>
              <Link className="arrow-link" href="/projects">
                All projects
              </Link>
              <Link className="case-pager__link case-pager__link--next" href={`/projects/${next.id}`} rel="next">
                <span className="k">Next ›</span>
                <span className="v">{next.name}</span>
              </Link>
            </nav>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
