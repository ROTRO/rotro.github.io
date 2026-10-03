import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import JsonLd from '@/components/JsonLd';
import { projects } from '@/lib/projects';
import { projectsSchema } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected engineering and product work — fitness, e-commerce and wellness apps plus healthcare, cloud and enterprise platforms. Browse the carousel and open any case study.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={projectsSchema()} />

      <main>
        <section className="page-intro" data-screen-label="Projects — Intro">
          <div className="wrap">
            <span className="eyebrow" data-reveal>
              Selected work · {String(projects.length).padStart(2, '0')}
            </span>
            <h1 className="display" data-reveal data-reveal-delay="1">
              Things I&apos;ve<br />built &amp; led.
            </h1>
            <p className="lead" data-reveal data-reveal-delay="2">
              A focused selection — platform engineering, cloud architecture and product delivery,
              with an emphasis on reliability, security and team outcomes.
            </p>
          </div>
        </section>

        <section className="section showcase" style={{ paddingTop: '1.5rem' }} data-screen-label="Projects — Showcase">
          <div className="wrap">
            <p className="more-label" data-reveal>// Drag, browse, open — every project as a case study</p>
          </div>
          <div data-reveal>
            <Carousel items={projects} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
