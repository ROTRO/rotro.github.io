import type { NavLink, SocialLink } from './types';

/** Canonical production origin — used for SEO canonical/OG URLs and JSON-LD. */
export const SITE_URL = 'https://novavespera.pro';

export const SITE = {
  brandName: 'Nova Vespera',
  personName: 'Bilel Hedhli',
  role: 'Full-Stack Engineer & Technical Lead',
  email: 'bilelhedhli@gmail.com',
  phone: '+216 51 531 353',
  phoneHref: 'tel:+21651531353',
  location: 'Tunis, Tunisia',
  timezone: 'UTC+1',
  available: true,
} as const;

export const NAV: NavLink[] = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/about' },
  { key: 'experience', to: '/experience' },
  { key: 'projects', to: '/projects' },
  { key: 'contact', to: '/contact' },
  { key: 'play', to: '/play' },
];

export const SOCIALS: SocialLink[] = [
  { label: 'Email', href: `mailto:${SITE.email}` },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/bilel-hedhli', external: true },
  { label: 'novavespera.pro', href: 'https://novavespera.pro/', external: true },
  { label: 'GitHub', href: 'https://github.com/rotro', external: true },
];
