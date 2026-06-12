import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import GameEmbed from '@/components/game/GameEmbed';
import './play.css';

export const metadata: Metadata = {
  title: 'Deploy Run — the game',
  description:
    'A career-themed pixel-art platformer built on Phaser 3. Collect commits, stomp bugs, grab coffee for a caffeinated shield, and ship to production.',
  alternates: { canonical: '/play' },
  openGraph: {
    title: 'Deploy Run — a playable easter egg',
    description: 'Two levels, power-up forms, a boss incident. A Phaser 3 pixel-art platformer — playable on desktop and phone.',
    url: '/play',
    images: [{ url: '/og-play.jpg', width: 1200, height: 630, alt: 'Deploy Run gameplay' }],
  },
};

export default function PlayPage() {
  return (
    <>
      <main>
        <section className="section play-wrap" data-screen-label="Play — Deploy Run">
          <div className="wrap">
            <div className="play-head">
              <span className="eyebrow" data-reveal>
                <span className="status-dot" /> Easter egg · canvas game
              </span>
              <h1 data-reveal data-reveal-delay="1">Deploy Run</h1>
              <p data-reveal data-reveal-delay="2">
                A career-themed platformer rebuilt on <b>Phaser 3</b>. Two levels — Staging by day,
                Production at night — with power-up forms, moving and crumbling platforms,
                checkpoints, a scored run with an S-to-C grade, and a boss incident to resolve
                before you can ship. Fully playable on phones with on-screen controls.
              </p>
            </div>

            <div data-reveal data-reveal-delay="2">
              <GameEmbed />
            </div>

            <div className="play-foot">
              <span className="keys">
                <span><span className="play-key">←</span><span className="play-key">→</span> / <span className="play-key">A</span><span className="play-key">D</span> <b>move</b></span>
                <span><span className="play-key">Space</span> / <span className="play-key">W</span> <b>jump</b></span>
                <span><span className="play-key">Shift</span> / <span className="play-key">X</span> <b>dash</b></span>
                <span><span className="play-key">M</span> <b>mute</b></span>
                <span><span className="play-key">R</span> <b>restart</b></span>
                <span>· touch controls on mobile</span>
              </span>
              <span>Phaser 3 · art: Sunny Land by ansimuz</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
