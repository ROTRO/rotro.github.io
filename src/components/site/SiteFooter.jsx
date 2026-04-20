import React from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container site-footer__row">
        <div>
          © {year} {profile.name} · {profile.siteName}. Built for clarity, speed,
          and accessibility.
        </div>
        <div className="footer-links">
          <Link className="link-animated" to="/contact">
            Contact
          </Link>
          <a
            className="link-animated"
            href={profile.linkedInUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <a
            className="link-animated"
            href={profile.portfolioUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {profile.siteName}
          </a>
        </div>
      </div>
    </footer>
  );
}
