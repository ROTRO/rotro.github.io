import { useState } from 'react';
import { profile } from '../data/profile';
import { useReveal } from '../hooks/useReveal';

export default function Contact() {
  useReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <span className="eyebrow" data-reveal>Contact · say hello</span>
          <h1 className="display" data-reveal data-reveal-delay="1">
            Let's talk.
          </h1>
          <p className="lead" data-reveal data-reveal-delay="2">
            Open to engineering leadership, full-stack and cloud roles — and interesting collaborations.
            The fastest way to reach me is below.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="wrap">
          <div className="contact-grid">
            <div className="cinfo" data-reveal>
              <a className="row" href={`mailto:${profile.email}`}>
                <span className="ic">@</span>
                <span className="lbl">
                  <span className="k">Email</span>
                  <span className="v">{profile.email}</span>
                </span>
                <span className="arrow">→</span>
              </a>
              <a className="row" href={`tel:${profile.phoneTel}`}>
                <span className="ic">☎</span>
                <span className="lbl">
                  <span className="k">Phone</span>
                  <span className="v">{profile.phoneDisplay}</span>
                </span>
                <span className="arrow">→</span>
              </a>
              <a className="row" href={profile.linkedInUrl} target="_blank" rel="noreferrer">
                <span className="ic">in</span>
                <span className="lbl">
                  <span className="k">LinkedIn</span>
                  <span className="v">/in/bilel-hedhli</span>
                </span>
                <span className="arrow">↗</span>
              </a>
              <a className="row" href={profile.portfolioUrl} target="_blank" rel="noreferrer">
                <span className="ic">↗</span>
                <span className="lbl">
                  <span className="k">Portfolio</span>
                  <span className="v">novavespera.pro</span>
                </span>
                <span className="arrow">↗</span>
              </a>
              <div className="row">
                <span className="ic">◎</span>
                <span className="lbl">
                  <span className="k">Location</span>
                  <span className="v">Tunis, Tunisia · UTC+1</span>
                </span>
              </div>

              <div className="card avail ticks">
                <div className="t">
                  <span className="status-dot" /> Available for work
                </div>
                <p>Currently open to new opportunities and freelance engagements. Typical reply within 24 hours.</p>
              </div>
            </div>

            <form className="card form ticks" data-reveal data-reveal-delay="1" onSubmit={handleSubmit}>
              <div className="row2">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" type="text" placeholder="Your name" required readOnly={submitted} />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="you@company.com" required readOnly={submitted} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input id="subject" type="text" placeholder="What's this about?" readOnly={submitted} />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Tell me about the role or project…" required readOnly={submitted} />
              </div>
              <div className="form__foot">
                <button className="btn btn--primary" type="submit" disabled={submitted}>
                  {submitted ? 'Sent ' : 'Send message '}<span className="arrow">→</span>
                </button>
                {!submitted && <span className="form__note">// encrypted · no spam</span>}
                <span className={`form__ok${submitted ? ' show' : ''}`}>✓ Thanks — I'll be in touch shortly.</span>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}