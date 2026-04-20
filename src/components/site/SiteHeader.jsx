import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { gsap } from '../../lib/gsapSetup';
import { getMotionPrefs } from '../../lib/motionPrefs';
import { NAV_LINKS } from '../../config/navigation';
import { profile } from '../../data/profile';
import { useTheme } from '../../context/ThemeContext';

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const titleId = useId();

  const [mobileVisible, setMobileVisible] = useState(false);
  const [compact, setCompact] = useState(false);

  const navRef = useRef(null);
  const pillRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const mobileBackdropRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setCompact(window.scrollY > 10);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileVisible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileVisible]);

  const requestCloseMobile = useCallback(() => {
    const { reduce, coarse } = getMotionPrefs();
    const panel = mobilePanelRef.current;
    const backdrop = mobileBackdropRef.current;
    if (!panel || !backdrop) {
      setMobileVisible(false);
      return;
    }
    if (reduce || coarse) {
      setMobileVisible(false);
      return;
    }
    const links = panel.querySelectorAll('a.nav-link');
    gsap.killTweensOf([panel, backdrop, links]);
    gsap.timeline({
      defaults: { ease: 'power2.in' },
      onComplete: () => setMobileVisible(false),
    })
      .to(links, { autoAlpha: 0, y: -10, stagger: 0.03, duration: 0.18 })
      .to(panel, { xPercent: 100, duration: 0.38 }, '-=0.12')
      .to(backdrop, { autoAlpha: 0, duration: 0.22 }, '-=0.28');
  }, []);

  useEffect(() => {
    if (!mobileVisible) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') requestCloseMobile();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileVisible, requestCloseMobile]);

  useLayoutEffect(() => {
    if (!mobileVisible) return undefined;
    const panel = mobilePanelRef.current;
    const backdrop = mobileBackdropRef.current;
    if (!panel || !backdrop) return undefined;

    const { reduce, coarse } = getMotionPrefs();
    const links = panel.querySelectorAll('a.nav-link');

    if (reduce) {
      gsap.set(backdrop, { autoAlpha: 1 });
      gsap.set(panel, { xPercent: 0 });
      gsap.set(links, { autoAlpha: 1, y: 0 });
      return undefined;
    }

    gsap.killTweensOf([panel, backdrop, links]);
    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set(panel, { xPercent: 100 });
    gsap.set(links, { autoAlpha: 0, y: coarse ? 8 : 18 });

    if (coarse) {
      gsap.to(backdrop, { autoAlpha: 1, duration: 0.2 });
      gsap.to(panel, { xPercent: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to(links, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.22,
        ease: 'power2.out',
        delay: 0.08,
      });
      return undefined;
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(backdrop, { autoAlpha: 1, duration: 0.28 })
      .to(panel, { xPercent: 0, duration: 0.52 }, '-=0.18')
      .to(
        links,
        { autoAlpha: 1, y: 0, stagger: 0.055, duration: 0.38, ease: 'power2.out' },
        '-=0.32',
      );

    return () => tl.kill();
  }, [mobileVisible]);

  useLayoutEffect(() => {
    const navEl = navRef.current;
    const pill = pillRef.current;
    if (!navEl || !pill) return undefined;

    const { reduce } = getMotionPrefs();
    if (reduce) {
      gsap.set(pill, { clearProps: 'all' });
      return undefined;
    }

    const update = () => {
      const linkEl =
        navEl.querySelector('.nav-link--active') ||
        navEl.querySelector('[aria-current="page"]');
      if (!linkEl) {
        gsap.to(pill, { autoAlpha: 0, duration: 0.2, ease: 'power2.out' });
        return;
      }
      const navRect = navEl.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();
      const x = linkRect.left - navRect.left;
      const w = linkRect.width;
      gsap.to(pill, {
        x,
        width: w,
        autoAlpha: 1,
        duration: 0.36,
        ease: 'expo.out',
      });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? ' nav-link--active' : ''}`;

  return (
    <header
      className={`site-header${compact ? ' site-header--compact' : ''}`}
      role="banner"
    >
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={() => setMobileVisible(false)}>
          <span className="brand__site">{profile.siteName}</span>
          <span className="brand__name">{profile.name}</span>
          <span className="brand__title">{profile.title}</span>
        </Link>

        <nav ref={navRef} className="nav-desktop" aria-label="Primary">
          <span ref={pillRef} className="nav-active-pill" aria-hidden="true" />
          {NAV_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            }
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-expanded={mobileVisible}
            aria-controls={titleId}
            onClick={() => setMobileVisible(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mobileVisible &&
        createPortal(
          <div className="mobile-nav" role="dialog" aria-modal="true">
            <button
              ref={mobileBackdropRef}
              type="button"
              className="mobile-backdrop"
              aria-label="Close menu"
              onClick={requestCloseMobile}
            />
            <div
              ref={mobilePanelRef}
              className="mobile-panel"
              id={titleId}
            >
              <div className="mobile-panel__head">
                <span className="mobile-panel__title">{profile.siteName}</span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={requestCloseMobile}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={requestCloseMobile}
                  className={linkClass}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
