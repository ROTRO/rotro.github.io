import { featuredProjects, professionalProjects } from '../data/projects';
import { useReveal } from '../hooks/useReveal';

function FeaturedProject({ project }) {
  const isReversed = project.variant && project.variant.includes('feature--rev');

  const mediaContent = project.phones ? (
    /* Phone-style media (Fit-Core) */
    <>
      {project.phones.map((phone, i) => (
        <div key={i} className={`phone-slot phone-slot--${phone.slot}`}>
          <div
            className={`phone phone--${phone.slot === 'mid' ? 'mid' : 'side'}`}
            data-gallery={project.id}
            data-cap={phone.cap}
          >
            <img src={phone.src} alt={phone.alt} loading="lazy" />
          </div>
        </div>
      ))}
      {project.extraImages &&
        project.extraImages.map((img, i) => (
          <div key={i} className="lb-extra" data-gallery={project.id} data-cap={img.cap}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
    </>
  ) : project.browser ? (
    /* Browser-style media (Echo, eya) */
    <>
      <div
        className="bwin"
        data-gallery={project.id}
        data-cap={project.gallery[0]?.cap || ''}
      >
        <div className="bwin__bar">
          <span className="bwin__dots">
            <i /><i /><i />
          </span>
          <span className="bwin__url">{project.browser.url}</span>
        </div>
        <img
          src={project.browser.cover}
          alt={project.browser.coverAlt}
          loading="lazy"
          style={{ objectPosition: project.browser.coverPos || 'center' }}
        />
      </div>
      {project.extraImages &&
        project.extraImages.map((img, i) => (
          <div key={i} className="lb-extra" data-gallery={project.id} data-cap={img.cap}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
    </>
  ) : null;

  const textContent = (
    <div className="feature__text">
      <span className="feature__eyebrow">
        <span className="dot" />
        {project.kind} · {project.year}
        {project.live && ' · Live'}
      </span>
      <h2 className="feature__title">{project.name}</h2>
      <p className="feature__tagline">{project.tagline}</p>
      <p className="feature__desc">{project.desc}</p>
      <ul className="feature__feats">
        {project.feats.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <div className="feature__foot">
        <div className="chips">
          {project.stack.map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
        {project.live && (
          <a className="proj__link" href={project.live} target="_blank" rel="noreferrer">
            Visit live site <span className="arrow">↗</span>
          </a>
        )}
      </div>
    </div>
  );

  const mediaSection = (
    <div className="feature__media" style={{ background: project.mediaBg }}>
      {mediaContent}
      <p className="media-cap">◳ {project.mediaCap}</p>
    </div>
  );

  return (
    <article className={`card feature ticks ${project.variant || ''}`} data-reveal>
      <div className="feature__grid">
        {isReversed ? (
          <>
            {mediaSection}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {mediaSection}
          </>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  useReveal();

  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <span className="eyebrow" data-reveal>Selected work · 07</span>
          <h1 className="display" data-reveal data-reveal-delay="1">
            Things I've
            <br />
            built & led.
          </h1>
          <p className="lead" data-reveal data-reveal-delay="2">
            A focused selection — platform engineering, cloud architecture and product delivery,
            with an emphasis on reliability, security and team outcomes.
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.map((project) => (
        <section key={project.id} className="section" style={{ paddingTop: '1rem' }}>
          <div className="wrap">
            <FeaturedProject project={project} />
          </div>
        </section>
      ))}

      {/* Professional Work List */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="more-label" data-reveal>// Professional work</p>
          <div className="proj-list">
            {professionalProjects.map((proj, i) => (
              <article key={proj.id} className="proj" data-reveal>
                <div className="proj__no">{String(i + 1).padStart(3, '0')}</div>
                <div className="proj__main">
                  <div className="proj__head">
                    <h3>{proj.name}</h3>
                    <span className="proj__tag">{proj.tag}</span>
                  </div>
                  <p className="proj__desc">{proj.desc}</p>
                  {proj.award && (
                    <span className="proj__link" style={{ color: 'var(--faint)', cursor: 'default' }}>
                      {proj.award}
                    </span>
                  )}
                  {proj.link && (
                    <a className="proj__link" href={proj.link} target="_blank" rel="noreferrer">
                      {proj.linkLabel} <span className="arrow">↗</span>
                    </a>
                  )}
                </div>
                <div className="proj__aside">
                  <div className="chips">
                    {proj.stack.map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}