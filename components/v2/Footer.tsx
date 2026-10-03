import { getTranslations } from 'next-intl/server';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Link } from '@/i18n/navigation';
import { SITE, SITE_URL, SOCIALS } from '@/lib/site';
import { v2Href } from '@/lib/version';
import Roll from './Roll';

interface Props {
  /** "Next page" teaser above the footer (label + locale-less path). */
  next?: { label: string; to: string };
}

const PAGES = ['about', 'experience', 'projects', 'play'] as const;

export default async function Footer({ next }: Props) {
  const t = await getTranslations('v2');
  const elsewhere = SOCIALS.filter((s) => s.external && !s.href.startsWith(SITE_URL));

  return (
    <>
      {next && (
        <Link className="next has-roll" href={v2Href(next.to)}>
          <span className="next__label t-meta">{t('common.nextPage')}</span>
          <span className="next__name">
            <Roll text={next.label} />
            <ArrowRight weight="light" aria-hidden="true" />
          </span>
        </Link>
      )}

      <footer className="foot">
        <Link className="foot__big has-roll" href={v2Href('/contact')}>
          <Roll text={t('common.talk')} />
          <ArrowUpRight weight="bold" aria-hidden="true" />
        </Link>

        <div className="grid foot__cols">
          <div className="foot__col">
            <h2 className="t-meta">{t('footer.contact')}</h2>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <span className="t-meta">{t('footer.location')}</span>
          </div>
          <div className="foot__col">
            <h2 className="t-meta">{t('footer.elsewhere')}</h2>
            {elsewhere.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          <div className="foot__col">
            <h2 className="t-meta">{t('footer.pages')}</h2>
            {PAGES.map((p) => (
              <Link key={p} href={v2Href(`/${p}`)}>
                {t(`nav.${p}`)}
              </Link>
            ))}
          </div>
          <div className="foot__col">
            <h2 className="t-meta">{t('common.resume')}</h2>
            <a href="/assets/Bilel-Hedhli-CV.pdf" target="_blank" rel="noreferrer">
              Bilel-Hedhli-CV.pdf
            </a>
          </div>
        </div>

        <div className="foot__base t-meta">
          <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
          <span>{t('footer.built')}</span>
        </div>
      </footer>
    </>
  );
}
