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
    description: 'Collect commits, stomp bugs, ship to production. A Phaser 3 pixel-art platformer — playable on desktop and phone.',
    url: '/play',
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
                A career-themed platformer rebuilt on <b>Phaser 3</b>. Run right, collect commits,
                stomp the bugs, grab a coffee for a caffeinated shield — and reach the house to
                ship to production. Fully playable on phones with on-screen controls.
              </p>
            </div>

            <div data-reveal data-reveal-delay="2">
              <GameEmbed />
            </div>

            <div className="play-foot">
              <span className="keys">
                <span><span className="play-key">←</span><span className="play-key">→</span> / <span className="play-key">A</span><span className="play-key">D</span> <b>move</b></span>
                <span><span className="play-key">Space</span> / <span className="play-key">W</span> <b>jump</b></span>
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
