import React from 'react';
import { Helmet } from 'react-helmet-async';
import { profile } from '../../data/profile';

function absoluteUrl(pathname = '/') {
  const normalized =
    pathname === '/' || !pathname
      ? '/'
      : pathname.startsWith('/')
        ? pathname
        : `/${pathname}`;
  const base = profile.siteOrigin.replace(/\/+$/, '');
  return `${base}${normalized === '/' ? '/' : normalized}`;
}

export default function Seo({ title, description, path = '/', noIndex }) {
  const pageTitle = title
    ? `${title} — ${profile.siteName}`
    : profile.siteTitle;
  const desc = description || profile.siteDescription;
  const url = absoluteUrl(path);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    url: profile.portfolioUrl,
    sameAs: [profile.linkedInUrl, profile.portfolioUrl],
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <link rel="canonical" href={url} />
      )}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
