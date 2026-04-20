import React, { useRef, useState } from 'react';
import { Check, Copy, Linkedin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/site/Seo';
import MagneticAnchor from '../components/site/MagneticAnchor';
import { profile } from '../data/profile';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ContactPage() {
  const rootRef = useRef(null);
  const [copied, setCopied] = useState(null);

  useScrollReveal(rootRef, { y: 24, stagger: 0.1, start: 'top 84%' });

  async function copyText(label, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <>
      <Seo
        title="Contact"
        path="/contact"
        description="Contact Bilel Hedhli for full-stack engineering, technical leadership, and cloud architecture engagements."
      />
      <section className="section">
        <div ref={rootRef} className="container">
          <div data-reveal>
            <p className="kicker">Contact</p>
            <h1 className="h1">Let’s build something reliable</h1>
            <p className="lead">
              Reach out for consulting, technical leadership, or full-stack product
              work. I respond fastest to email and LinkedIn.
            </p>
          </div>

          <div className="contact-grid" style={{ marginTop: '2rem' }}>
            <div className="surface contact-card elevate-card" data-reveal>
              <ul className="contact-list">
                <li>
                  <span className="contact-icon" aria-hidden>
                    <Mail size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Email</div>
                    <a
                      className="link-inline link-inline--animated"
                      href={`mailto:${profile.email}`}
                    >
                      {profile.email}
                    </a>
                    <div style={{ marginTop: 8 }}>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                        onClick={() => copyText('email', profile.email)}
                      >
                        {copied === 'email' ? (
                          <>
                            <Check size={16} aria-hidden /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={16} aria-hidden /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </li>
                <li>
                  <span className="contact-icon" aria-hidden>
                    <Phone size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Phone</div>
                    <a
                      className="link-inline link-inline--animated"
                      href={`tel:${profile.phoneTel}`}
                    >
                      {profile.phoneDisplay}
                    </a>
                    <div style={{ marginTop: 8 }}>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                        onClick={() => copyText('phone', profile.phoneTel)}
                      >
                        {copied === 'phone' ? (
                          <>
                            <Check size={16} aria-hidden /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={16} aria-hidden /> Copy number
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </li>
                <li>
                  <span className="contact-icon" aria-hidden>
                    <Linkedin size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>LinkedIn</div>
                    <a
                      className="link-inline link-inline--animated"
                      href={profile.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      linkedin.com/in/bilel-hedhli
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="surface contact-card elevate-card" data-reveal>
              <h2 className="h2" style={{ fontSize: '1.1rem' }}>
                {profile.siteName}
              </h2>
              <p className="muted">
                For a broader view of positioning and selected work, visit{' '}
                {profile.siteName}.
              </p>
              <MagneticAnchor
                className="btn btn-primary"
                style={{ width: 'fit-content' }}
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit {profile.siteName}
              </MagneticAnchor>
              <div className="divider" />
              <p className="muted" style={{ margin: 0 }}>
                Prefer structure first? Review{' '}
                <Link className="link-inline link-inline--animated" to="/experience">
                  experience
                </Link>{' '}
                and{' '}
                <Link className="link-inline link-inline--animated" to="/skills">
                  skills
                </Link>{' '}
                before reaching out.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
