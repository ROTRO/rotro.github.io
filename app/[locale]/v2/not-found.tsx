import { getTranslations } from 'next-intl/server';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Link } from '@/i18n/navigation';
import Footer from '@/components/v2/Footer';
import Roll from '@/components/v2/Roll';
import { v2Href } from '@/lib/version';

export default async function NotFoundV2() {
  const t = await getTranslations('v2');

  return (
    <>
      <main>
        <section className="intro wrap grid" style={{ minHeight: '70dvh', alignContent: 'end' }}>
          <h1 className="t-display">{t('notFound.title')}</h1>
          <p className="t-lead">{t('notFound.body')}</p>
          <div style={{ gridColumn: '1 / -1', marginTop: 32 }}>
            <Link className="pill pill--accent has-roll" href={v2Href('/')}>
              <Roll text={t('notFound.back')} />
              <ArrowRight size={18} weight="bold" className="nudge" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
