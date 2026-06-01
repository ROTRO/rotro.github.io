import Link from 'next/link';
import { SITE } from '@/lib/site';

/** Header brand lockup: animated spark mark + name/role. */
export default function Brand() {
  return (
    <Link className="brand" href="/">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <circle className="ring" cx="16" cy="24" r="11" strokeWidth="1.6" />
          <g className="spk" transform="translate(17,1.5) scale(0.2)">
            <path d="M50 3 C55 31, 69 45, 97 50 C69 55, 55 69, 50 97 C45 69, 31 55, 3 50 C31 45, 45 31, 50 3 Z" />
          </g>
        </svg>
      </span>
      <span className="brand__meta">
        <span className="brand__name">{SITE.brandName}</span>
        <span className="brand__role">{SITE.personName}</span>
      </span>
    </Link>
  );
}
