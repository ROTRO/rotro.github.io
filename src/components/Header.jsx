import { useState, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header className="hdr">
      <div className="hdr__inner">
        <Link className="brand" to="/" onClick={close}>
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <circle className="ring" cx="16" cy="24" r="11" strokeWidth="1.6" />
              <g className="spk" transform="translate(17,1.5) scale(0.2)">
                <path d="M50 3 C55 31, 69 45, 97 50 C69 55, 55 69, 50 97 C45 69, 31 55, 3 50 C31 45, 45 31, 50 3 Z" />
              </g>
            </svg>
          </span>
          <span className="brand__meta">
            <span className="brand__name">Nova Vespera</span>
            <span className="brand__role">Bilel Hedhli</span>
          </span>
        </Link>

        <nav className={`nav${open ? ' open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={close}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hdr__status">
          <span className="status-dot" />
          <span>Available for work</span>
        </div>

        <button
          className="nav-toggle"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '\u00d7' : '\u2261'}
        </button>
      </div>
    </header>
  );
}