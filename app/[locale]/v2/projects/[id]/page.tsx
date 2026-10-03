import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import JsonLd from '@/components/JsonLd';
import Footer from '@/components/v2/Footer';
import Roll from '@/components/v2/Roll';
import { localizeProjects, projects } from '@/lib/projects';
import { SITE, SITE_URL } from '@/lib/site';
import { clean, localePath } from '@/lib/v2';
import { v2Href } from '@/lib/version';

interface Props {
  params: { locale: string; id: string };
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, id: p.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = localizeProjects(projects, params.locale).find((x) => x.id === params.id);
  if (!p) return {};
  const t = await getTranslations({ locale: params.locale, namespace: 'v2.projects' });
  return {
    title: t('caseTitle', { name: p.name }),
    description: clean(p.desc),
    alternates: { canonical: localePath(params.locale, `/projects/${p.id}`) },
    openGraph: {
      type: 'article',
      title: `${p.name}, ${clean(p.tagline)}`,
      description: clean(p.desc),
      ...(p.cover ? { images: [{ url: p.cover, alt: p.name }] } : {}),
    },
  };
}

export default async function CaseV2({ params }: Props) {
  setRequestLocale(params.locale);
  const list = localizeProjects(projects, params.locale);
  const index = list.findIndex((x) => x.id === params.id);
  if (index === -1) notFound();

  const t = await getTranslations('v2');
  const p = list[index];
  const next = list[(index + 1) % list.length];
  const phone = p.shape === 'phone';

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: p.name,
          description: clean(p.desc),
          keywords: p.stack.join(', '),
          url: `${SITE_URL}${localePath(params.locale, `/projects/${p.id}`)}`,
          author: { '@type': 'Person', name: SITE.personName },
          ...(p.live ? { sameAs: p.live } : {}),
        }}
      />

      <main>
        <section className="intro wrap">
          <div className="case-meta">
            <Link className="pill pill--ghost pill--sm has-roll" href={v2Href('/projects')}>
              <ArrowLeft size={16} weight="bold" aria-hidden="true" />
              <Roll text={t('common.allProjects')} />
            </Link>
            <span className="t-meta">{clean(p.kind, ' / ')}</span>
            <span className="t-meta">{clean(p.year)}</span>
          </div>
          <div className="grid">
            <h1 className="t-display" style={{ gridColumn: '1 / 12' }}>{p.name}</h1>
            <p className="t-lead" style={{ gridColumn: '1 / 8', marginTop: 'clamp(20px, 3vh, 32px)' }}>{clean(p.tagline)}</p>
          </div>
          {p.live && (
            <a className="pill pill--accent has-roll" href={p.live} target="_blank" rel="noreferrer" style={{ marginTop: 32 }}>
              <Roll text={t('projects.visit')} />
              <ArrowUpRight size={18} weight="bold" className="nudge-up" aria-hidden="true" />
            </a>
          )}
        </section>

        {p.cover && !phone && (
          <div className="case-cover" data-rv>
            <Image
              src={p.cover}
              alt={p.gallery[0]?.cap ? clean(p.gallery[0].cap, ': ') : p.name}
              width={1600}
              height={900}
              priority
              sizes="100vw"
              style={p.coverPos ? { objectPosition: p.coverPos } : undefined}
            />
          </div>
        )}

        <section className="section wrap grid case-body">
          <aside data-rv>
            <h2 className="t-meta">{t('projects.stack')}</h2>
            <div className="tags">{p.stack.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
          </aside>
          <div>
            <p className="desc" data-rv>{clean(p.desc)}</p>
            {p.feats.length > 0 && (
              <div data-rv>
                <h2 className="t-meta" style={{ marginBottom: 14 }}>{t('projects.highlights')}</h2>
                <ul className="feats">
                  {p.feats.map((f) => <li key={f}>{clean(f)}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>

        {p.gallery.length > 0 && (
          <section style={{ paddingBottom: 'clamp(88px, 14vh, 176px)' }}>
            <h2 className="t-meta wrap" style={{ marginBottom: 18 }}>{t('projects.screens')}</h2>
            {phone ? (
              <div className="shots-phone" tabIndex={0} aria-label={t('projects.screens')}>
                {p.gallery.map((g) => (
                  <figure key={g.src}>
                    <Image src={g.src} alt={clean(g.cap, ': ')} width={560} height={1150} sizes="280px" />
                    <figcaption className="t-meta">{clean(g.cap, ': ')}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="shots-web wrap">
                {p.gallery.map((g) => (
                  <figure key={g.src} data-rv>
                    <Image src={g.src} alt={clean(g.cap, ': ')} width={1600} height={1000} sizes="(max-width: 599px) 100vw, 50vw" />
                    <figcaption className="t-meta">{clean(g.cap, ': ')}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <Footer next={{ label: next.name, to: `/projects/${next.id}` }} />
    </>
  );
}
