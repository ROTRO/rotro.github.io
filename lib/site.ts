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
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Experience', to: '/experience' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
  { label: 'Play', to: '/play' },
];

export const SOCIALS: SocialLink[] = [
  { label: 'Email', href: `mailto:${SITE.email}` },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/bilel-hedhli', external: true },
  { label: 'novavespera.pro', href: 'https://novavespera.pro/', external: true },
  { label: 'GitHub', href: 'https://rotro.github.io', external: true },
];
