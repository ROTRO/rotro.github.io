import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import GameEmbed from '@/components/game/GameEmbed';
import Footer from '@/components/v2/Footer';
import { localePath } from '@/lib/v2';
// game shell/touch styles are shared with v1; v2.css aliases the tokens it reads
import '../../(v1)/play/play.css';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'v2.play' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: { canonical: localePath(params.locale, '/play') },
    openGraph: { images: [{ url: '/og-play.jpg', width: 1200, height: 630, alt: 'Deploy Run' }] },
  };
}

export default async function PlayV2({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('v2');

  const keys: [string[], string][] = [
    [['←', '→', 'A', 'D'], t('play.move')],
    [['Space', 'W'], t('play.jump')],
    [['Shift', 'X'], t('play.dash')],
    [['M'], t('play.mute')],
    [['R'], t('play.restart')],
  ];

  return (
    <>
      <main>
        <section className="intro wrap grid">
          <h1 className="t-display">{t('play.title')}</h1>
          <p className="t-lead">{t('play.sub')}</p>
        </section>

        <section style={{ paddingBottom: 'clamp(88px, 14vh, 176px)' }}>
          <div className="play-stage" data-rv>
            <GameEmbed />
          </div>
          <div className="keys-legend t-meta">
            {keys.map(([caps, label]) => (
              <span key={label}>
                {caps.map((k) => (
                  <kbd className="kbd" key={k}>{k}</kbd>
                ))}
                {label}
              </span>
            ))}
            <span>{t('play.touch')}</span>
            <span>{t('play.credit')}</span>
          </div>
        </section>
      </main>

      <Footer next={{ label: t('nav.home'), to: '/' }} />
    </>
  );
}
