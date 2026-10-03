import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, FilePdf, GithubLogo, LinkedinLogo, Phone } from '@phosphor-icons/react/dist/ssr';
import CopyEmail from '@/components/v2/CopyEmail';
import Footer from '@/components/v2/Footer';
import MailForm from '@/components/v2/MailForm';
import { SITE } from '@/lib/site';
import { localePath } from '@/lib/v2';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'v2' });
  return {
    title: t('nav.contact'),
    description: t('contact.metaDesc'),
    alternates: { canonical: localePath(params.locale, '/contact') },
  };
}

export default async function ContactV2({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('v2');

  const channels = [
    { label: t('contact.phone'), value: SITE.phone, href: SITE.phoneHref, Icon: Phone },
    { label: t('contact.linkedin'), value: '/in/bilel-hedhli', href: 'https://linkedin.com/in/bilel-hedhli', Icon: LinkedinLogo, external: true },
    { label: t('contact.github'), value: '/rotro', href: 'https://github.com/rotro', Icon: GithubLogo, external: true },
    { label: t('common.resume'), value: 'PDF', href: '/assets/Bilel-Hedhli-CV.pdf', Icon: FilePdf, external: true },
  ];

  return (
    <>
      <main>
        <section className="intro wrap grid">
          <h1 className="t-display">{t('contact.title')}</h1>
          <p className="t-lead">{t('contact.sub')}</p>
        </section>

        <section className="wrap grid reach" style={{ paddingBottom: 'clamp(88px, 14vh, 176px)' }}>
          <div className="reach__left">
            <div data-rv>
              <span className="t-meta" style={{ display: 'block', marginBottom: 10 }}>{t('contact.email')}</span>
              <div className="mail-big">
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <CopyEmail email={SITE.email} />
              </div>
            </div>
            <div className="channels" data-rv>
              {channels.map(({ label, value, href, Icon, external }) => (
                <a key={href} href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <Icon size={22} weight="regular" aria-hidden="true" />
                  <span>{label}</span>
                  <span className="t-meta">{value}</span>
                  <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <MailForm />
        </section>
      </main>

      <Footer next={{ label: t('nav.play'), to: '/play' }} />
    </>
  );
}
