import { Link } from 'react-router-dom';
import { profile } from '../data/profile';

export default function Footer({ variant = 'default' }) {
  const isContact = variant === 'contact';

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__grid">
          <div>
            <p className="foot__big">
              {isContact ? (
                <>
                  Prefer email?
                  <br />I read every one.
                </>
              ) : (
                <>
                  Let's build
                  <br />
                  something solid.
                </>
              )}
            </p>
            {isContact ? (
              <a
                className="btn btn--ghost"
                href={`mailto:${profile.email}`}
                style={{ marginTop: '1.4rem' }}
              >
                {profile.email}
              </a>
            ) : (
              <Link
                className="btn btn--primary"
                to="/contact"
                style={{ marginTop: '1.4rem' }}
              >
                Start a conversation <span className="arrow">→</span>
              </Link>
            )}
          </div>

          <div className="foot__col">
            <h4>Navigate</h4>
            {!isContact && <Link to="/about">About</Link>}
            {isContact && <Link to="/">Home</Link>}
            {!isContact && <Link to="/experience">Experience</Link>}
            {!isContact && <Link to="/projects">Projects</Link>}
            {isContact && <Link to="/experience">Experience</Link>}
            {isContact && <Link to="/projects">Projects</Link>}
            {!isContact && <Link to="/contact">Contact</Link>}
          </div>

          <div className="foot__col">
            <h4>Elsewhere</h4>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.linkedInUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.portfolioUrl} target="_blank" rel="noreferrer">
              novavespera.pro
            </a>
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>

        <div className="foot__bar">
          <span>© 2026 Bilel Hedhli</span>
          <span>Tunis, Tunisia · UTC+1</span>
          <span>Full-Stack · Cloud · Leadership</span>
        </div>
      </div>
    </footer>
  );
}