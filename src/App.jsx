import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Lightbox from './components/Lightbox';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useTilt } from './hooks/useTilt';

import Home from './pages/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

function AppInner() {
  useScrollToTop();
  useTilt();

  return (
    <div className="page">
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Routes>
        <Route path="/contact" element={<Footer variant="contact" />} />
        <Route path="*" element={<Footer />} />
      </Routes>
      <Lightbox />
    </div>
  );
}

export default function App() {
  return <AppInner />;
}