'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Brand from './Brand';
import { NAV } from '@/lib/site';

/** Fixed top header: brand, primary nav (Next Link), status, mobile toggle. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <header className="hdr">
      <div className="hdr__inner">
        <Brand />
        <nav className={`nav${open ? ' open' : ''}`}>
          {NAV.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hdr__status">
          <span className="status-dot" />
          <span>Available for work</span>
        </div>
        <button
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '×' : '≡'}
        </button>
      </div>
    </header>
  );
}
