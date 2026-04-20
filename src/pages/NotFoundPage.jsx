import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Seo from '../components/site/Seo';

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <>
      <Seo title="Page not found" path={pathname} noIndex />
      <section className="not-found" aria-labelledby="nf-title">
        <div>
          <p className="kicker">404</p>
          <h1 id="nf-title" className="h1">
            This page does not exist
          </h1>
          <p className="lead" style={{ margin: '0 auto' }}>
            The route may have moved during the portfolio refresh. Head back home
            or jump to contact.
          </p>
          <div className="hero__actions" style={{ justifyContent: 'center' }}>
            <Link className="btn btn-primary" to="/">
              Back to home
            </Link>
            <Link className="btn btn-ghost" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
