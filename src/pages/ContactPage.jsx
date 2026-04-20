import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/site/Seo';
import { profile } from '../data/profile';
import { useMotionSafe } from '../hooks/useMotionSafe';

export default function ContactPage() {
  const { fadeUp, transition, reduce } = useMotionSafe();
  const [copied, setCopied] = useState(null);

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
        <div className="container">
          <motion.div {...fadeUp} transition={transition}>
            <p className="kicker">Contact</p>
            <h1 className="h1">Let’s build something reliable</h1>
            <p className="lead">
              Reach out for consulting, technical leadership, or full-stack product
              work. I respond fastest to email and LinkedIn.
            </p>
          </motion.div>

          <div className="contact-grid" style={{ marginTop: '2rem' }}>
            <motion.div
              {...fadeUp}
              transition={{ ...transition, delay: reduce ? 0 : 0.06 }}
              className="surface contact-card"
            >
              <ul className="contact-list">
                <li>
                  <span className="contact-icon" aria-hidden>
                    <Mail size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Email</div>
                    <a className="link-inline" href={`mailto:${profile.email}`}>
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
                    <a className="link-inline" href={`tel:${profile.phoneTel}`}>
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
                    <MapPin size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Location</div>
                    <div className="muted">{profile.location}</div>
                  </div>
                </li>
                <li>
                  <span className="contact-icon" aria-hidden>
                    <Linkedin size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>LinkedIn</div>
                    <a
                      className="link-inline"
                      href={profile.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      linkedin.com/in/bilel-hedhli
                    </a>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...transition, delay: reduce ? 0 : 0.12 }}
              className="surface contact-card"
            >
              <h2 className="h2" style={{ fontSize: '1.1rem' }}>
                Portfolio site
              </h2>
              <p className="muted">
                For a broader view of positioning and selected work, visit Novavespera.
              </p>
              <a
                className="btn btn-primary"
                style={{ width: 'fit-content' }}
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open novavespera.pro
              </a>
              <div className="divider" />
              <p className="muted" style={{ margin: 0 }}>
                Prefer structure first? Review{' '}
                <Link className="link-inline" to="/experience">
                  experience
                </Link>{' '}
                and{' '}
                <Link className="link-inline" to="/skills">
                  skills
                </Link>{' '}
                before reaching out.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
