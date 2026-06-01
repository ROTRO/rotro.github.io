import Link from 'next/link';
import { NAV, SOCIALS, SITE } from '@/lib/site';

interface FooterProps {
  /** Big closing headline; supports a manual line break via \n. */
  headline?: string;
  /** Call-to-action style. */
  variant?: 'primary' | 'email';
}

/** Shared site footer. Home/most pages use the primary CTA; Contact uses email. */
export default function Footer({
  headline = "Let's build\nsomething solid.",
  variant = 'primary',
}: FooterProps) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__grid">
          <div>
            <p className="foot__big">
              {headline.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
            {variant === 'primary' ? (
              <Link
                className="btn btn--primary"
                href="/contact"
                data-magnetic="0.3"
                style={{ marginTop: '1.4rem' }}
              >
                Start a conversation <span className="arrow">→</span>
              </Link>
            ) : (
              <a
                className="btn btn--ghost"
                href={`mailto:${SITE.email}`}
                data-magnetic="0.3"
                style={{ marginTop: '1.4rem' }}
              >
                {SITE.email}
              </a>
            )}
          </div>

          <div className="foot__col">
            <h4>Navigate</h4>
            {NAV.filter((n) => n.to !== '/').map((n) => (
              <Link key={n.to} href={n.to}>
                {n.label}
              </Link>
            ))}
          </div>

          <div className="foot__col">
            <h4>Elsewhere</h4>
            {SOCIALS.map((s) =>
              s.external ? (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ) : (
                <a key={s.label} href={s.href}>
                  {s.label}
                </a>
              )
            )}
          </div>
        </div>

        <div className="foot__bar">
          <span>© 2026 {SITE.personName}</span>
          <span>
            {SITE.location} · {SITE.timezone}
          </span>
          <span>Full-Stack · Cloud · Leadership</span>
        </div>
      </div>
    </footer>
  );
}
