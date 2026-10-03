import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/JsonLd';
import Footer from '@/components/v2/Footer';
import WorkCard from '@/components/v2/WorkCard';
import { localizeProjects, projects } from '@/lib/projects';
import { projectsSchema } from '@/lib/structuredData';
import { localePath } from '@/lib/v2';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'v2' });
  return {
    title: t('nav.projects'),
    description: t('projects.metaDesc'),
    alternates: { canonical: localePath(params.locale, '/projects') },
  };
}

export default async function ProjectsV2({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('v2');
  const list = localizeProjects(projects, params.locale);

  // typographic tiles cycle tones in their own sequence so neighbours differ
  let typeIndex = 0;

  return (
    <>
      <JsonLd data={projectsSchema()} />

      <main>
        <section className="intro wrap grid">
          <h1 className="t-display">{t('projects.title')}</h1>
          <p className="t-lead">{t('projects.sub')}</p>
        </section>

        <section className="wrap" style={{ paddingBottom: 'clamp(160px, 26vh, 320px)' }}>
          <div className="work-grid">
            {list.map((p, i) => (
              <WorkCard key={p.id} project={p} toneIndex={p.cover ? 0 : typeIndex++} priority={i < 2} />
            ))}
          </div>
        </section>
      </main>

      <Footer next={{ label: t('nav.contact'), to: '/contact' }} />
    </>
  );
}
