import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Linkedin, MapPin, Sparkles } from 'lucide-react';
import Seo from '../components/site/Seo';
import { profile } from '../data/profile';
import { useMotionSafe } from '../hooks/useMotionSafe';

export default function HomePage() {
  const { fadeUp, transition, stagger, reduce } = useMotionSafe();

  return (
    <>
      <Seo title="Home" path="/" />
      <section className="hero">
        <div className="hero__inner container">
          <motion.div
            {...fadeUp}
            transition={{ ...transition, delay: reduce ? 0 : 0.05 }}
          >
            <p className="kicker">
              <Sparkles
                size={14}
                style={{ display: 'inline', verticalAlign: 'text-top', marginRight: 6 }}
                aria-hidden
              />
              Full-stack · Cloud · Leadership
            </p>
            <h1 className="h1">{profile.name}</h1>
            <p className="lead">{profile.title}</p>
            <div className="hero__meta">
              <span className="pill" aria-label="Location">
                <MapPin size={14} aria-hidden />
                {profile.location}
              </span>
            </div>
            <div className="hero__actions">
              <Link className="btn btn-primary" to="/contact">
                Hire me <ArrowRight size={18} aria-hidden />
              </Link>
              <Link className="btn btn-ghost" to="/experience">
                View experience
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
          </motion.div>

          <div className="section-tight" style={{ marginTop: '2rem' }}>
            <div className="grid-2">
              <div className="surface" style={{ padding: '1.25rem' }}>
                <h2 className="h2" style={{ fontSize: '1.1rem' }}>
                  What I ship
                </h2>
                <p className="muted" style={{ margin: 0 }}>
                  Secure, scalable systems on AWS, pragmatic microservices, and
                  product engineering across Angular, React, NestJS, Flutter, and
                  Ionic—with CI/CD and reliability treated as first-class product
                  concerns.
                </p>
              </div>
              <div className="surface" style={{ padding: '1.25rem' }}>
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
          </div>

          <motion.div
            className="section-tight"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: reduce ? 0 : 0.35 }}
          >
            <div className="chips" aria-label="Core technologies">
              {[
                'AWS',
                'Angular',
                'NestJS',
                'React',
                'Node.js',
                'Docker',
                'CI/CD',
                'MongoDB',
              ].map((chip, i) => (
                <motion.span
                  key={chip}
                  className="chip"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...transition,
                    delay: reduce ? 0 : 0.35 + i * stagger,
                  }}
                >
                  {chip}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
