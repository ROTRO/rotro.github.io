import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Trophy } from '@phosphor-icons/react/dist/ssr';
import Footer from '@/components/v2/Footer';
import { localizeRoles, roles } from '@/lib/experience';
import { clean, cleanRange, localePath } from '@/lib/v2';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'v2' });
  return {
    title: t('nav.experience'),
    description: t('experience.metaDesc'),
    alternates: { canonical: localePath(params.locale, '/experience') },
  };
}

export default async function ExperienceV2({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('v2');
  const list = localizeRoles(roles, params.locale);

  return (
    <>
      <main>
        <section className="intro wrap grid">
          <h1 className="t-display">{t('experience.title')}</h1>
          <p className="t-lead">{t('experience.sub')}</p>
        </section>

        <section className="wrap" style={{ paddingBottom: 'clamp(88px, 14vh, 176px)' }}>
          {list.map((r) => (
            <article className="grid role" key={`${r.company}-${r.period}`}>
              <div className="role__side">
                {r.current && <span className="tag tag--accent">{t('experience.current')}</span>}
                <h2 className="role__co">{r.company}</h2>
                <span className="t-meta">{cleanRange(r.period)}</span>
                {r.location && <span className="t-meta">{clean(r.location)}</span>}
              </div>
              <div className="role__main" data-rv>
                <h3 className="role__title">{r.title}</h3>
                <ul>
                  {r.bullets.map((b) => (
                    <li key={b.text} className={b.win ? 'win' : undefined}>
                      {b.win && <Trophy size={18} weight="bold" aria-hidden="true" />}
                      <span>{clean(b.text)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer next={{ label: t('nav.projects'), to: '/projects' }} />
    </>
  );
}
