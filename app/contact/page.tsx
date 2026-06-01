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
                  <span className="ic">@</span>
                  <span className="lbl"><span className="k">Email</span><span className="v">{SITE.email}</span></span>
                  <span className="arrow">→</span>
                </a>
                <a className="row" href={SITE.phoneHref}>
                  <span className="ic">☎</span>
                  <span className="lbl"><span className="k">Phone</span><span className="v">{SITE.phone}</span></span>
                  <span className="arrow">→</span>
                </a>
                <a className="row" href="https://linkedin.com/in/bilel-hedhli" target="_blank" rel="noreferrer">
                  <span className="ic">in</span>
                  <span className="lbl"><span className="k">LinkedIn</span><span className="v">/in/bilel-hedhli</span></span>
                  <span className="arrow">↗</span>
                </a>
                <a className="row" href="https://novavespera.pro/" target="_blank" rel="noreferrer">
                  <span className="ic">↗</span>
                  <span className="lbl"><span className="k">Portfolio</span><span className="v">novavespera.pro</span></span>
                  <span className="arrow">↗</span>
                </a>
                <div className="row">
                  <span className="ic">◎</span>
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
