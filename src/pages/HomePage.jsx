import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Linkedin, Sparkles } from 'lucide-react';
import Seo from '../components/site/Seo';
import MagneticLink from '../components/site/MagneticLink';
import FeaturedProjectsSwiper from '../components/projects/FeaturedProjectsSwiper';
import { profile } from '../data/profile';
import { useHomeHeroIntro } from '../hooks/useHomeHeroIntro';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomePage() {
  const heroRef = useRef(null);
  const lowerRef = useRef(null);

  useHomeHeroIntro(heroRef);
  useScrollReveal(lowerRef, { y: 22, stagger: 0.08, start: 'top 86%' });

  return (
    <>
      <Seo path="/" />
      <section className="hero">
        <div className="hero__inner container">
          <div ref={heroRef} className="hero__intro">
            <p className="kicker" data-hero-line>
              <Sparkles
                size={14}
                style={{ display: 'inline', verticalAlign: 'text-top', marginRight: 6 }}
                aria-hidden
              />
              {profile.siteName} · Full-stack · Cloud · Leadership
            </p>
            <h1 className="h1" data-hero-line>
              {profile.name}
            </h1>
            <p className="lead" data-hero-line>
              {profile.title}
            </p>
            <div className="hero__meta" data-hero-line>
              <span className="pill" aria-label="Site">
                <Sparkles size={14} aria-hidden style={{ marginRight: 6 }} />
                {profile.siteName}
              </span>
            </div>
            <div className="hero__actions" data-hero-actions>
              <MagneticLink className="btn btn-primary" to="/contact">
                Hire me <ArrowRight size={18} aria-hidden />
              </MagneticLink>
              <Link className="btn btn-ghost" to="/projects">
                View projects
              </Link>
              <Link className="btn btn-ghost" to="/experience">
                Experience
              </Link>
              <a
                className="btn btn-ghost"
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} aria-hidden />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProjectsSwiper />

      <section className="section-tight">
        <div ref={lowerRef} className="container">
          <div className="grid-2">
            <div className="surface elevate-card" data-reveal style={{ padding: '1.25rem' }}>
              <h2 className="h2" style={{ fontSize: '1.1rem' }}>
                What I ship
              </h2>
              <p className="muted" style={{ margin: 0 }}>
                Secure, scalable systems on AWS, pragmatic microservices, and product
                engineering across Angular, React, NestJS, Flutter, and Ionic—with CI/CD
                and reliability treated as first-class product concerns.
              </p>
            </div>
            <div className="surface elevate-card" data-reveal style={{ padding: '1.25rem' }}>
              <h2 className="h2" style={{ fontSize: '1.1rem' }}>
                Highlights
              </h2>
              <ul className="muted" style={{ margin: 0, paddingLeft: '1.1rem' }}>
                <li>Technical leadership and architecture on cloud-native platforms.</li>
                <li>Healthcare SaaS delivery with measurable performance gains.</li>
                <li>Security-minded authentication, data protection, and delivery hygiene.</li>
              </ul>
            </div>
          </div>

          <div className="chips chips--home" aria-label="Core technologies" style={{ marginTop: '1.25rem' }}>
            {[
              'AWS',
              'Angular',
              'NestJS',
              'React',
              'Node.js',
              'Docker',
              'CI/CD',
              'MongoDB',
            ].map((chip) => (
              <span key={chip} className="chip" data-reveal>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
