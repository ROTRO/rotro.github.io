import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Trophy } from '@phosphor-icons/react/dist/ssr';
import JsonLd from '@/components/JsonLd';
import Footer from '@/components/v2/Footer';
import { personSchema } from '@/lib/structuredData';
import { localePath } from '@/lib/v2';

interface Props {
  params: { locale: string };
}

const LANG = ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'React', 'Next.js', 'NestJS', 'Ionic', 'Flutter'];
const CLOUD = ['AWS', 'Docker', 'CI/CD', 'GitHub', 'Git'];
const DATA = ['MongoDB', 'MySQL', 'Firebase', 'REST APIs', 'Spring Boot'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'v2' });
  return {
    title: t('nav.about'),
    description: t('about.metaDesc'),
    alternates: { canonical: localePath(params.locale, '/about') },
    openGraph: { type: 'profile' },
  };
}

export default async function AboutV2({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('v2');
  const edu = t.raw('about.edu') as { degree: string; school: string; years: string }[];
  const certs = t.raw('about.certs') as string[];
  const arch = t.raw('about.archItems') as string[];
  const facts = ['location', 'experience', 'role', 'focus'] as const;

  return (
    <>
      <JsonLd data={personSchema()} />

      <main>
        <section className="intro wrap grid about-top">
          <h1 className="t-display">{t('about.title')}</h1>
          <figure data-parallax>
            <Image src="/assets/headshot.webp" alt={t('about.photoAlt')} width={460} height={460} priority sizes="(max-width: 767px) 280px, 22vw" />
          </figure>
        </section>

        <section className="wrap grid" style={{ paddingBottom: 'clamp(88px, 14vh, 176px)' }}>
          <div className="bio" data-rv>
            <p>{t('about.bio1')}</p>
            <p style={{ color: 'var(--muted)' }}>{t('about.bio2')}</p>
            <p style={{ color: 'var(--muted)' }}>{t('about.bio3')}</p>
          </div>
          <dl className="facts" data-rv>
            {facts.map((f) => (
              <div key={f}>
                <dt className="t-meta">{t(`about.facts.${f}`)}</dt>
                <dd>{t(`about.facts.${f}V`)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wrap" style={{ paddingBottom: 'clamp(88px, 14vh, 176px)' }}>
          <h2 className="t-h2" data-rv>{t('about.toolkitTitle')}</h2>
          <div className="bento">
            <div className="bento__cell bento__cell--wide" data-rv>
              <h3>{t('about.groups.lang')}</h3>
              <div className="tags">{LANG.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
            </div>
            <div className="bento__cell bento__cell--accent" data-rv>
              <Trophy size={32} weight="light" aria-hidden="true" />
              <div>
                <p className="award__big">{t('about.awardTop')}</p>
                <p className="award__body">{t('about.awardBody')}</p>
              </div>
            </div>
            <div className="bento__cell bento__cell--ink" data-rv>
              <h3>{t('about.groups.cloud')}</h3>
              <div className="tags">{CLOUD.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
            </div>
            <div className="bento__cell" data-rv>
              <h3>{t('about.groups.data')}</h3>
              <div className="tags">{DATA.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
            </div>
            <div className="bento__cell bento__cell--soft bento__cell--arch" data-rv>
              <h3>{t('about.groups.arch')}</h3>
              <div className="tags">{arch.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
            </div>
          </div>
        </section>

        <section className="wrap grid learn" style={{ paddingBottom: 'clamp(88px, 14vh, 176px)' }}>
          <div data-rv>
            <h3 className="t-meta">{t('about.eduTitle')}</h3>
            <ul>
              {edu.map((e) => (
                <li key={e.degree}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 500, letterSpacing: '-0.02em' }}>{e.degree}</span>
                  <span style={{ color: 'var(--muted)' }}>{e.school}, {e.years}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-rv>
            <h3 className="t-meta">{t('about.certTitle')}</h3>
            <ul>
              {certs.map((c) => (
                <li key={c} style={{ fontSize: '1.25rem', fontWeight: 500, letterSpacing: '-0.02em' }}>{c}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer next={{ label: t('nav.experience'), to: '/experience' }} />
    </>
  );
}
