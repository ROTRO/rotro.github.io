import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { V2_ACTIVE } from './lib/version';

const intl = createMiddleware(routing);

const localePattern = routing.locales.join('|');
/** `/fr/v2/about` or `/v2` → captures the optional locale prefix and the rest. */
const V2_PATH = new RegExp(`^(/(?:${localePattern}))?/v2(?=/|$)(.*)$`);
/** Leading locale segment of an internal (already-localized) pathname. */
const LOCALE_PATH = new RegExp(`^/(${localePattern})(?=/|$)(.*)$`);

export default function middleware(request: NextRequest) {
  if (!V2_ACTIVE) return intl(request);

  const { pathname } = request.nextUrl;

  // v2 is live at the canonical URLs: send /v2/* back to them so there is one URL per page.
  const preview = pathname.match(V2_PATH);
  if (preview) {
    const url = request.nextUrl.clone();
    url.pathname = `${preview[1] ?? ''}${preview[2]}` || '/';
    return NextResponse.redirect(url, 308);
  }

  const response = intl(request);
  if (response.headers.has('location')) return response;

  // next-intl either rewrote (`/about` → `/en/about`) or passed through (`/fr/about`).
  const rewrite = response.headers.get('x-middleware-rewrite');
  const target = rewrite ? new URL(rewrite) : request.nextUrl.clone();
  const localized = target.pathname.match(LOCALE_PATH);
  if (!localized) return response;

  target.pathname = `/${localized[1]}/v2${localized[2]}`;
  response.headers.set('x-middleware-rewrite', target.toString());
  response.headers.delete('x-middleware-next');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
