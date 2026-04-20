const SITE_ORIGIN = (
  process.env.REACT_APP_CANONICAL_ORIGIN || 'https://novavespera.pro'
).replace(/\/+$/, '');

export const profile = {
  name: 'Bilel Hedhli',
  title:
    'Full-Stack Engineer | Technical Lead | Cloud Solutions Specialist',
  email: 'bilelhedhli@gmail.com',
  phoneDisplay: '+216 51 531 353',
  phoneTel: '+21651531353',
  /** Public site URL (trailing slash for mail/links). */
  portfolioUrl: `${SITE_ORIGIN}/`,
  linkedInUrl: 'https://linkedin.com/in/bilel-hedhli',
  siteName: 'Nova Vespera',
  siteTitle: 'Nova Vespera | Bilel Hedhli',
  siteDescription:
    'Nova Vespera — portfolio of Bilel Hedhli: full-stack engineer, technical lead, and cloud solutions specialist building secure, scalable systems on AWS.',
  /** Canonical / Open Graph base (no trailing slash). Never localhost. */
  siteOrigin: SITE_ORIGIN,
};
