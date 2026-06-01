import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import './play.css';

export const metadata: Metadata = {
  title: 'Deploy Run — the game',
  description:
    'A career-themed Mario-style mini-game. Collect commits, stomp bugs, grab coffee for a caffeinated shield, and reach the flag to ship to production.',
  alternates: { canonical: '/play' },
  openGraph: {
    title: 'Deploy Run — a playable easter egg',
    description: 'Collect commits, stomp bugs, ship to production. A pixel-art platformer built on canvas.',
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
                A little career-themed platformer. Run right, collect commits, stomp the bugs,
                grab a coffee for a caffeinated shield — and reach the flag to ship to production.
                Built from scratch on HTML canvas: no engine, no image files, every sprite drawn in code.
              </p>
            </div>

            <div className="play-stage" data-reveal data-reveal-delay="2">
              <div className="play-stage__inner">
                <iframe
                  className="play-frame"
                  src="/game/play.html"
                  title="Deploy Run — playable mini-game"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="play-foot">
              <span className="keys">
                <span><span className="play-key">←</span><span className="play-key">→</span> <b>move</b></span>
                <span><span className="play-key">Space</span> <b>jump</b></span>
                <span><span className="play-key">R</span> <b>restart</b></span>
                <span>· touch controls on mobile</span>
              </span>
              <span>built with canvas · 2026</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
