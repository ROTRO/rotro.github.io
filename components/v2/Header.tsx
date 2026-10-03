'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { ArrowUpRight, DotsNine, X } from '@phosphor-icons/react';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { stripV2, v2Href } from '@/lib/version';
import { SITE } from '@/lib/site';
import Roll from './Roll';

gsap.registerPlugin(ScrollTrigger);

const PAGES = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/about' },
  { key: 'experience', to: '/experience' },
  { key: 'projects', to: '/projects' },
  { key: 'play', to: '/play' },
] as const;

const lenis = () => (window as Window & { __lenis?: Lenis }).__lenis;

/**
 * Fixed header: wordmark left, "Let's talk" + Menu pills right. Slides away
 * while scrolling down and returns on scroll up. The menu is a floating panel
 * anchored top-right (focus moves in on open, Escape closes, scroll is paused).
 */
export default function Header() {
  const t = useTranslations('v2');
  const locale = useLocale();
  const pathname = usePathname();
  const current = stripV2(pathname);
  const reduce = useReducedMotion();

  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // hide on scroll down, show on scroll up; solid brand pill once off the top
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        bar.classList.toggle('is-solid', y > 40);
        bar.classList.toggle('is-hidden', self.direction === 1 && y > 240);
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    lenis()?.stop();
    const first = panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lenis()?.start();
      menuBtn.current?.focus();
    };
  }, [open]);

  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.92, y: -8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -6 },
      };

  return (
    <>
      <header ref={barRef} className="hdr">
        <Link className="hdr__brand" href={v2Href('/')}>
          {SITE.personName}
        </Link>
        <div className="hdr__right">
          <Link className="pill pill--accent has-roll hdr__talk" href={v2Href('/contact')}>
            <Roll text={t('common.talk')} />
          </Link>
          <button
            ref={menuBtn}
            type="button"
            className="pill has-roll"
            aria-expanded={open}
            aria-controls="v2-menu"
            aria-label={t('common.openMenu')}
            onClick={() => setOpen(true)}
          >
            <Roll text={t('common.menu')} />
            <DotsNine size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="menu-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              id="v2-menu"
              ref={panelRef}
              className="menu"
              role="dialog"
              aria-modal="true"
              aria-label={t('common.menu')}
              {...panelMotion}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              <div className="menu__top">
                <button type="button" className="pill pill--ghost pill--sm has-roll" onClick={() => setOpen(false)} aria-label={t('common.closeMenu')}>
                  <Roll text={t('common.close')} />
                  <X size={16} weight="bold" aria-hidden="true" />
                </button>
              </div>

              <nav className="menu__nav" aria-label={t('common.menu')}>
                {PAGES.map((p) => (
                  <Link
                    key={p.key}
                    className="has-roll"
                    href={v2Href(p.to)}
                    aria-current={current === p.to ? 'page' : undefined}
                  >
                    <Roll text={t(`nav.${p.key}`)} />
                  </Link>
                ))}
                <Link
                  className="has-roll"
                  href={v2Href('/contact')}
                  aria-current={current === '/contact' ? 'page' : undefined}
                >
                  <Roll text={t('nav.contact')} />
                </Link>
              </nav>

              <div className="menu__foot">
                <div className="langs" role="group" aria-label={t('common.language')}>
                  {routing.locales.map((l) => (
                    <Link key={l} href={pathname} locale={l} aria-current={l === locale ? 'true' : undefined} hrefLang={l}>
                      {l.toUpperCase()}
                    </Link>
                  ))}
                </div>
                <a className="pill pill--ghost pill--sm" href="/assets/Bilel-Hedhli-CV.pdf" target="_blank" rel="noreferrer">
                  {t('common.resume')}
                  <ArrowUpRight size={16} weight="bold" className="nudge-up" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
