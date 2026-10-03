import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Link } from '@/i18n/navigation';
import JsonLd from '@/components/JsonLd';
import Footer from '@/components/v2/Footer';
import HeroSceneGate from '@/components/v2/HeroSceneGate';
import Roll from '@/components/v2/Roll';
import Words from '@/components/v2/Words';
import WorkCard from '@/components/v2/WorkCard';
import { localizeProjects, projects } from '@/lib/projects';
import { localizeRoles, roles } from '@/lib/experience';
import { personSchema, websiteSchema } from '@/lib/structuredData';
import { cleanRange, FEATURED_IDS, localePath } from '@/lib/v2';
import { v2Href } from '@/lib/version';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'v2.home' });
  return {
    title: { absolute: `Bilel Hedhli, ${t('metaTitle')}` },
    description: t('metaDesc'),
    alternates: { canonical: localePath(params.locale, '/') },
  };
}

export default async function HomeV2({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('v2');

  const all = localizeProjects(projects, params.locale);
  const featured = FEATURED_IDS.map((id) => all.find((p) => p.id === id)).filter((p) => p !== undefined);
  const recent = localizeRoles(roles, params.locale).slice(0, 4);

  return (
    <>
      <JsonLd data={[websiteSchema(), personSchema()]} />

      <main>
        <section className="hero">
          <div className="hero__scene" data-hero-out>
            <HeroSceneGate />
          </div>
          <div className="wrap grid hero__copy">
            <h1 className="t-hero">{t('home.heroTitle')}</h1>
            <div className="hero__aside">
              <p>{t('home.heroSub')}</p>
              <div className="ctas">
                <Link className="pill pill--accent has-roll" href={v2Href('/contact')}>
                  <Roll text={t('common.talk')} />
                  <ArrowRight size={18} weight="bold" className="nudge" aria-hidden="true" />
                </Link>
                <a className="pill pill--ghost has-roll" href="/assets/Bilel-Hedhli-CV.pdf" target="_blank" rel="noreferrer">
                  <Roll text={t('common.resume')} />
                  <ArrowUpRight size={18} weight="bold" className="nudge-up" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section wrap grid statement">
          <Words className="t-statement" text={t('home.intro')} />
        </section>

        <section className="section wrap" style={{ paddingTop: 0 }}>
          <div className="work-head">
            <h2 className="t-h2" data-rv>{t('home.workTitle')}</h2>
            <p className="t-lead" data-rv>{t('home.workSub')}</p>
          </div>
          <div className="work-grid">
            {featured.map((p, i) => (
              <WorkCard key={p.id} project={p} toneIndex={i} />
            ))}
          </div>
          <div className="work-more" data-rv>
            <Link className="pill pill--accent has-roll" href={v2Href('/projects')}>
              <Roll text={t('common.allProjects')} />
              <ArrowRight size={18} weight="bold" className="nudge" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="section block">
          <div className="kinetic" aria-hidden="true">
            <span className="kinetic__line" data-kinetic="1">{t('home.gameLine1')}</span>
            <span className="kinetic__line" data-kinetic="-1">{t('home.gameLine2')}</span>
            <span className="kinetic__line" data-kinetic="1">{t('home.gameLine3')}</span>
          </div>
          <h2 className="sr-only">
            {t('home.gameLine1')}, {t('home.gameLine2')}, {t('home.gameLine3')}
          </h2>
          <div className="wrap grid">
            <div className="block__shot" data-rv>
              <Image src="/og-play.jpg" alt={t('home.gameAlt')} width={1200} height={630} sizes="(max-width: 767px) 100vw, 56vw" />
            </div>
            <div className="block__copy" data-rv>
              <p>{t('home.gameBody')}</p>
              <div className="ctas">
                <Link className="pill has-roll" href={v2Href('/play')}>
                  <Roll text={t('home.gameCta')} />
                  <ArrowRight size={18} weight="bold" className="nudge" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section wrap">
          <h2 className="t-h2" data-rv>{t('home.expTitle')}</h2>
          <div className="rows">
            {recent.map((r) => (
              <div className="grid row" key={`${r.company}-${r.period}`} data-rv>
                <span className="row__co">{r.company}</span>
                <span className="row__title">{r.title}</span>
                <span className="row__when t-meta">{cleanRange(r.period)}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'clamp(32px, 6vh, 64px)' }} data-rv>
            <Link className="pill pill--ghost has-roll" href={v2Href('/experience')}>
              <Roll text={t('common.fullExperience')} />
              <ArrowRight size={18} weight="bold" className="nudge" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer next={{ label: t('nav.about'), to: '/about' }} />
    </>
  );
}
