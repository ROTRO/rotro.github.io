/**
 * Gallery assets from legacy `rotro.github.io/src/components/Portfolio.js`,
 * served from `public/img/portfolio/...` (paths are root-relative for CRA).
 * Extensions match files on disk (case-sensitive hosts).
 */

function toGallery(label, paths) {
  return paths.map((src, i) => ({
    src: src.startsWith('/') ? src : `/${src}`,
    alt: `${label} — screenshot ${i + 1}`,
  }));
}

/** eSteps Health — Portfolio.js carousel (paths fixed to .PNG on disk). */
export const galleryEstepsHealth = toGallery('eSteps Health', [
  '/img/portfolio/esteps/1.PNG',
  '/img/portfolio/esteps/2.PNG',
  '/img/portfolio/esteps/3.PNG',
  '/img/portfolio/esteps/4.PNG',
  '/img/portfolio/esteps/5.PNG',
]);

/** Aquadeep — no carousel in legacy; hero image only. */
export const galleryAquadeep = toGallery('Aquadeep', ['/img/portfolio/aqua.png']);

/** Orizon Booking — closest legacy match for enterprise / full-stack delivery. */
export const galleryOrizonBooking = toGallery('Orizon Booking', [
  '/img/portfolio/OR/1.png',
  '/img/portfolio/OR/2.png',
  '/img/portfolio/OR/3.png',
  '/img/portfolio/OR/4.png',
]);

/** MyFinance — Angular / Node / Mongo product-era work. */
export const galleryMyFinance = toGallery('MyFinance', [
  '/img/portfolio/myF/1.PNG',
  '/img/portfolio/myF/2.PNG',
  '/img/portfolio/myF/3.PNG',
]);

/** Optional: full legacy carousels for reuse (e.g. future project slugs). */
export const LEGACY_PORTFOLIO_CAROUSELS = {
  juricar: toGallery('JuriCar', [
    '/img/portfolio/JUR/1.PNG',
    '/img/portfolio/JUR/2.PNG',
    '/img/portfolio/JUR/3.PNG',
    '/img/portfolio/JUR/4.PNG',
  ]),
  clinicaTour: toGallery('Clinica-Tour', [
    '/img/portfolio/CT/1.png',
    '/img/portfolio/CT/2.png',
    '/img/portfolio/CT/3.png',
    '/img/portfolio/CT/5.png',
    '/img/portfolio/CT/6.png',
    '/img/portfolio/CT/7.png',
  ]),
  mmeCompany: toGallery('MME Company', ['/img/portfolio/MM/2.png', '/img/portfolio/MM/3.png']),
  francePapiers: toGallery('France Papiers', [
    '/img/portfolio/FP/1.png',
    '/img/portfolio/FP/2.png',
    '/img/portfolio/FP/3.png',
  ]),
  visionnaire: toGallery('Visionnaire', ['/img/portfolio/vision/visionnaire.png']),
};
