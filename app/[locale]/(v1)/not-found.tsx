import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <main>
        <section className="page-intro" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }} data-screen-label="404">
          <div className="wrap">
            <span className="eyebrow">Error · 404</span>
            <h1 className="display" style={{ marginTop: '0.8rem' }}>
              Lost the<br />thread.
            </h1>
            <p className="lead" style={{ marginTop: '1.2rem' }}>
              That page doesn&apos;t exist — or moved. Let&apos;s get you back on track.
            </p>
            <Link className="btn btn--primary" href="/" data-magnetic="0.3" style={{ marginTop: '1.6rem' }}>
              Back home <span className="arrow">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
