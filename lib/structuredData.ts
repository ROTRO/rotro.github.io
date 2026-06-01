import { SITE, SITE_URL } from './site';
import { projects } from './projects';

type Json = Record<string, unknown>;

/** schema.org Person — identity graph for the site author. */
export function personSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.personName,
    alternateName: SITE.brandName,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    jobTitle: 'Full-Stack Engineer & Technical Lead',
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tunis',
      addressCountry: 'TN',
    },
    sameAs: [
      'https://linkedin.com/in/bilel-hedhli',
      'https://rotro.github.io',
      'https://novavespera.pro',
    ],
    knowsAbout: [
      'AWS',
      'Cloud Architecture',
      'Full-Stack Engineering',
      'Angular',
      'Node.js',
      'React',
      'CI/CD',
      'Technical Leadership',
    ],
  };
}

/** schema.org WebSite — helps search engines understand the site root. */
export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${SITE.brandName} — ${SITE.personName}`,
    url: SITE_URL,
    author: { '@type': 'Person', name: SITE.personName },
  };
}

/** schema.org ItemList of CreativeWork — the project portfolio. */
export function projectsSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Selected work — Bilel Hedhli',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.name,
        description: p.desc,
        keywords: p.stack.join(', '),
        ...(p.live ? { url: p.live } : {}),
      },
    })),
  };
}
