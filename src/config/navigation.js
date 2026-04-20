import { matchPath } from 'react-router-dom';

/** Primary nav order — used for slide direction on route changes. */
export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export function navIndex(pathname) {
  return NAV_LINKS.findIndex((item) =>
    matchPath({ path: item.to, end: !!item.end }, pathname),
  );
}

/** +1 forward in nav, -1 backward (for motion direction). */
export function routeSlideDirection(fromPath, toPath) {
  const a = navIndex(fromPath);
  const b = navIndex(toPath);
  if (a < 0 || b < 0) return 1;
  return b >= a ? 1 : -1;
}
