import React from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container site-footer__row">
        <div>
          © {year} {profile.name}. Built for clarity, speed, and accessibility.
        </div>
        <div className="footer-links">
          <Link to="/contact">Contact</Link>
          <a href={profile.linkedInUrl} rel="noopener noreferrer" target="_blank">
            LinkedIn
          </a>
          <a href={profile.portfolioUrl} rel="noopener noreferrer" target="_blank">
            Novavespera
          </a>
        </div>
      </div>
    </footer>
  );
}
