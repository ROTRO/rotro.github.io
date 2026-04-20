import React, { Suspense, lazy, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import InitialLoader from './components/transitions/InitialLoader';
import { getMotionPrefs } from './lib/motionPrefs';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageFallback() {
  return (
    <div
      className="container section"
      style={{ paddingTop: '6rem' }}
      role="status"
      aria-live="polite"
    >
      <p className="muted">Loading…</p>
    </div>
  );
}

export default function App() {
  const [booted, setBooted] = useState(() => getMotionPrefs().reduce);

  return (
    <>
      {!booted && <InitialLoader onDone={() => setBooted(true)} />}
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
