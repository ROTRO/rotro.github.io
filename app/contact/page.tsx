import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Bilel Hedhli — full-stack engineer and technical lead based in Tunis, Tunisia. Open to engineering leadership, full-stack and cloud roles.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <main>
        <section className="page-intro" data-screen-label="Contact — Intro">
          <div className="wrap">
            <span className="eyebrow" data-reveal>Contact · say hello</span>
            <h1 className="display" data-reveal data-reveal-delay="1">Let&apos;s talk.</h1>
            <p className="lead" data-reveal data-reveal-delay="2">
              Open to engineering leadership, full-stack and cloud roles — and interesting collaborations.
              The fastest way to reach me is below.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '1.5rem' }} data-screen-label="Contact — Grid">
          <div className="wrap">
            <div className="contact-grid">
              <div className="cinfo" data-reveal>
                <a className="row" href={`mailto:${SITE.email}`}>
                  <span className="ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <span className="lbl"><span className="k">Email</span><span className="v">{SITE.email}</span></span>
                  <span className="arrow">→</span>
                </a>
                <a className="row" href={SITE.phoneHref}>
                  <span className="ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <span className="lbl"><span className="k">Phone</span><span className="v">{SITE.phone}</span></span>
                  <span className="arrow">→</span>
                </a>
                <a className="row" href="https://linkedin.com/in/bilel-hedhli" target="_blank" rel="noreferrer">
                  <span className="ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </span>
                  <span className="lbl"><span className="k">LinkedIn</span><span className="v">/in/bilel-hedhli</span></span>
                  <span className="arrow">↗</span>
                </a>
                <a className="row" href="https://novavespera.pro/" target="_blank" rel="noreferrer">
                  <span className="ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                  </span>
                  <span className="lbl"><span className="k">Portfolio</span><span className="v">novavespera.pro</span></span>
                  <span className="arrow">↗</span>
                </a>
                <div className="row">
                  <span className="ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span className="lbl"><span className="k">Location</span><span className="v">{SITE.location} · {SITE.timezone}</span></span>
                </div>

                <div className="card avail ticks">
                  <div className="t"><span className="status-dot" /> Available for work</div>
                  <p>Currently open to new opportunities and freelance engagements. Typical reply within 24 hours.</p>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer headline={"Prefer email?\nI read every one."} variant="email" />
    </>
  );
}
