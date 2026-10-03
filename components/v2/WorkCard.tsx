import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Link } from '@/i18n/navigation';
import type { Project } from '@/lib/types';
import { clean } from '@/lib/v2';
import { v2Href } from '@/lib/version';
import Roll from './Roll';

const TYPE_TONES = ['ink', 'accent', 'soft'] as const;

/**
 * Project card: rounded media + title row. Web covers fill the frame, phone
 * covers sit as a screen on a tinted ground, and cover-less projects get a
 * typographic tile (tone cycles by `toneIndex` so neighbours differ).
 */
export default function WorkCard({ project, toneIndex = 0, priority = false }: { project: Project; toneIndex?: number; priority?: boolean }) {
  const p = project;
  const phone = p.shape === 'phone';
  const tone = TYPE_TONES[toneIndex % TYPE_TONES.length];

  return (
    <Link className="card has-roll" href={v2Href(`/projects/${p.id}`)} data-rv>
      <div className={`card__media${p.cover ? (phone ? ' card__media--phone' : '') : ` card__media--${tone}`}`}>
        {p.cover ? (
          <Image
            src={p.cover}
            alt=""
            width={phone ? 700 : 1400}
            height={phone ? 1439 : 1050}
            sizes={phone ? '(max-width: 767px) 40vw, 20vw' : '(max-width: 767px) 100vw, 48vw'}
            style={p.coverPos && !phone ? { objectPosition: p.coverPos } : undefined}
            priority={priority}
          />
        ) : (
          <div className="card__type">
            <strong>{p.name}</strong>
            <span>{p.stack.slice(0, 3).join(', ')}</span>
          </div>
        )}
        <span className="card__go" aria-hidden="true">
          <ArrowUpRight size={22} weight="bold" />
        </span>
      </div>
      <div className="card__info">
        <div className="card__row">
          <h3 className="card__title">
            <Roll text={p.name} />
          </h3>
          <span className="t-meta">{clean(p.year)}</span>
        </div>
        <p className="card__sub">{clean(p.tagline)}</p>
      </div>
    </Link>
  );
}
