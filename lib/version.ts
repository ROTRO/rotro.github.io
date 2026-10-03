/**
 * Site version switch. `NEXT_PUBLIC_SITE_VERSION=v2` serves the v2 design at
 * the canonical URLs (middleware rewrites `/about` → `/v2/about`); anything
 * else keeps v1 live, with v2 still previewable under `/v2/*` (noindex).
 *
 * NEXT_PUBLIC_* is inlined at build time, so changing it needs a rebuild.
 */
export type SiteVersion = 'v1' | 'v2';

export const SITE_VERSION: SiteVersion =
  process.env.NEXT_PUBLIC_SITE_VERSION === 'v2' ? 'v2' : 'v1';

export const V2_ACTIVE = SITE_VERSION === 'v2';

/** Path prefix for v2 routes while v2 is only a preview. */
export const V2_BASE = V2_ACTIVE ? '' : '/v2';

/** Locale-less path → the href that reaches its v2 page (`/about` → `/v2/about` in preview). */
export function v2Href(path: string): string {
  if (!V2_BASE) return path;
  return path === '/' ? V2_BASE : `${V2_BASE}${path}`;
}

/** Strip the preview prefix from a locale-less pathname (`/v2/about` → `/about`). */
export function stripV2(pathname: string): string {
  if (pathname === '/v2') return '/';
  return pathname.startsWith('/v2/') ? pathname.slice(3) : pathname;
}
