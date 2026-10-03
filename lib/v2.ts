import { routing } from '@/i18n/routing';

/** Projects shown on the v2 home page, in order. */
export const FEATURED_IDS = ['orizon', 'fitcore', 'visionnaire', 'echo'];

/**
 * The shared content data uses em/en dashes as separators; v2 renders them
 * as plain punctuation. `sep` replaces a spaced dash ("A — B"), bare dashes
 * in ranges ("2025–26") always become a hyphen.
 */
export function clean(text: string, sep = ', '): string {
  return text.replace(/\s+[—–]\s+/g, sep).replace(/[—–]/g, '-');
}

/** Period strings ("Jan 2026 — Present") read better with a hyphen than a comma. */
export const cleanRange = (text: string) => clean(text, ' - ');

/** Public, locale-prefixed path for canonical URLs (`/about` → `/fr/about`). */
export function localePath(locale: string, path: string): string {
  if (locale === routing.defaultLocale) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}
