/**
 * Showcase projects — copy aligned with real delivery; imagery from /public/images
 * and legacy portfolio shots under /public/img/portfolio (see portfolioLegacyGalleries.js).
 */

import {
  galleryAquadeep,
  galleryEstepsHealth,
  galleryMyFinance,
  galleryOrizonBooking,
} from './portfolioLegacyGalleries';

const chain = [
  'nova-vespera',
  'healthcare-platform',
  'cloud-platforms',
  'enterprise-delivery',
  'digital-products',
];

function linkNav(slug) {
  const i = chain.indexOf(slug);
  return {
    prevSlug: i > 0 ? chain[i - 1] : chain[chain.length - 1],
    nextSlug: i < chain.length - 1 ? chain[i + 1] : chain[0],
  };
}

const raw = [
  {
    slug: 'nova-vespera',
    name: 'Nova Vespera',
    tagline: 'Portfolio & brand experience',
    year: '2024',
    role: 'Design & engineering',
    type: 'web',
    stack: ['React', 'Performance', 'SEO', 'GSAP'],
    coverImage: '/images/portfolio_hero_bg.jpeg',
    heroImage: '/images/portfolio_hero_bg.jpeg',
    summary:
      'A high-clarity portfolio surface for leadership, cloud work, and product credibility—fast, accessible, and SEO-aware.',
    href: 'https://novavespera.pro/',
    overview:
      'Nova Vespera is the flagship presence for engineering narrative: who you work with, how you ship, and what reliability means in practice.',
    problem:
      'Generic templates buried the story under decorative noise and slow interaction patterns that did not match a senior engineer brand.',
    goals: [
      'Deliver a dark-first, premium visual system with minimal friction.',
      'Keep first paint and route transitions smooth on modest hardware.',
      'Make projects and experience scannable in under a minute.',
    ],
    architecture: {
      text: 'Static-first React shell with code-split routes, GSAP for motion discipline (transform/opacity), and Helmet-driven metadata for discovery.',
      highlights: ['React 18', 'React Router', 'Sass tokens', 'GSAP + ScrollTrigger'],
    },
    features: [
      {
        title: 'Motion system',
        body: 'Intro loader, route progress, and scroll reveals tuned for reduced-motion preferences.',
      },
      {
        title: 'Content architecture',
        body: 'Central profile and project data with typed sections for case-study depth.',
      },
      {
        title: 'Accessibility',
        body: 'Skip links, focus-visible states, and keyboard-friendly navigation patterns.',
      },
    ],
    gallery: [
      { src: '/images/portfolio_details_1.jpeg', alt: 'Portfolio layout detail' },
      { src: '/images/demo/main-home.jpeg', alt: 'Hero composition reference' },
      { src: '/images/portfolio_4.jpeg', alt: 'Visual rhythm and spacing' },
    ],
    results: [
      { label: 'Lighthouse-style goal', value: '≤ 1s', hint: 'perceived route change' },
      { label: 'Motion budget', value: 'GPU', hint: 'transform / opacity only' },
      { label: 'Surface', value: '1', hint: 'cohesive product-style shell' },
    ],
  },
  {
    slug: 'healthcare-platform',
    name: 'Healthcare real-time SaaS',
    tagline: 'eSteps Health',
    year: '2023',
    role: 'Full-stack lead',
    type: 'web',
    stack: ['Angular', 'Node.js', 'AWS', 'MongoDB', 'WebSockets'],
    coverImage: '/images/case_study_1.jpeg',
    heroImage: '/images/case_study_details_bg.jpeg',
    summary:
      'Real-time clinical workflows on Node.js and Angular with AWS-native reliability and MongoDB performance hardening.',
    href: null,
    overview:
      'Platform engineering for a latency-sensitive healthcare product: secure auth, resilient APIs, and measurable database and end-user latency improvements.',
    problem:
      'Growing usage exposed hot paths in MongoDB and inconsistent real-time behaviour under peak concurrent sessions.',
    goals: [
      'Stabilize real-time channels for critical UI updates.',
      'Improve MongoDB efficiency without risky big-bang rewrites.',
      'Raise engineering throughput while keeping release risk controlled.',
    ],
    architecture: {
      text: 'Angular front-end on AWS-backed Node services, document store with tuned indexes and query paths, and operational focus on uptime.',
      highlights: ['Microservice boundaries', 'Observability', 'Secure data flows'],
    },
    features: [
      {
        title: 'Real-time delivery',
        body: 'Event-driven updates with careful back-pressure and client reconciliation.',
      },
      {
        title: 'Security posture',
        body: 'Hardened authentication flows and data protection aligned with healthcare expectations.',
      },
      {
        title: 'Performance',
        body: 'MongoDB gains through indexing and query shaping; measurable latency reduction.',
      },
    ],
    gallery: galleryEstepsHealth,
    results: [
      { label: 'MongoDB', value: '+20%', hint: 'performance uplift' },
      { label: 'Latency', value: '−15%', hint: 'critical paths' },
      { label: 'Team velocity', value: '+25%', hint: 'delivery cadence' },
    ],
  },
  {
    slug: 'cloud-platforms',
    name: 'Cloud platforms & reliability',
    tagline: 'Aquadeep',
    year: '2024',
    role: 'Technical lead',
    type: 'cloud',
    stack: ['AWS', 'CI/CD', 'Kubernetes-ready', 'IaC'],
    coverImage: '/images/landscape.jpeg',
    heroImage: '/images/service_hero_bg.jpeg',
    summary:
      'AWS-first architectures with CI/CD modernization and a reliability culture: fewer surprises in production, faster safe releases.',
    href: null,
    overview:
      'Leadership across scalable services, deployment pipelines, and operational hygiene—balancing speed with uptime.',
    problem:
      'Releases were risk-heavy and observability gaps slowed incident response.',
    goals: [
      'Shorten deployment cycles while improving safety nets.',
      'Raise uptime through architecture and process changes.',
      'Align engineering practices with cloud cost and scale realities.',
    ],
    architecture: {
      text: 'Service topology on AWS with pipeline automation, progressive rollout patterns, and pragmatic infra choices over hype.',
      highlights: ['Pipelines', 'Resilience patterns', 'Cost-aware design'],
    },
    features: [
      {
        title: 'CI/CD',
        body: 'Pipeline improvements that materially reduced time-to-production.',
      },
      {
        title: 'Reliability',
        body: 'Operational clarity: health checks, rollback strategy, and incident readiness.',
      },
      {
        title: 'Leadership',
        body: 'Coaching teams on trade-offs between velocity and stability.',
      },
    ],
    gallery: galleryAquadeep,
    results: [
      { label: 'Deployments', value: '−30%', hint: 'cycle time' },
      { label: 'Uptime', value: '↑', hint: 'operational focus' },
      { label: 'Risk', value: '↓', hint: 'controlled rollouts' },
    ],
  },
  {
    slug: 'enterprise-delivery',
    name: 'Enterprise full-stack delivery',
    tagline: 'RMSoftware',
    year: '2026',
    role: 'Full-stack engineer',
    type: 'mobile',
    stack: ['Angular', 'NestJS', 'Flutter', 'Ionic', 'AWS'],
    coverImage: '/images/demo/digital-agency.jpeg',
    heroImage: '/images/portfolio_30.jpeg',
    summary:
      'Cross-surface product work—web and mobile—with NestJS services, Angular clients, and security-minded architecture.',
    href: null,
    overview:
      'End-to-end feature delivery across Angular, NestJS, Flutter, and Ionic with emphasis on microservice boundaries and secure defaults.',
    problem:
      'Complex domains required consistent patterns for auth, data access, and cross-platform parity.',
    goals: [
      'Ship cohesive experiences across Flutter and web clients.',
      'Standardize secure service-to-service communication.',
      'Keep architecture evolvable as domains grow.',
    ],
    architecture: {
      text: 'NestJS APIs with Angular and Ionic web surfaces plus Flutter mobile, deployed on AWS with pragmatic service decomposition.',
      highlights: ['Microservices', 'AuthN/Z', 'Shared contracts'],
    },
    features: [
      {
        title: 'Security',
        body: 'Defense-in-depth on tokens, transport, and sensitive payloads.',
      },
      {
        title: 'Mobile + web',
        body: 'Shared domain models with platform-appropriate UX.',
      },
      {
        title: 'Architecture',
        body: 'Clear service ownership and migration paths as load grows.',
      },
    ],
    gallery: galleryOrizonBooking,
    results: [
      { label: 'Surfaces', value: '4+', hint: 'Angular / Nest / Flutter / Ionic' },
      { label: 'Security', value: '↑', hint: 'hardened defaults' },
      { label: 'Clarity', value: 'High', hint: 'bounded contexts' },
    ],
  },
  {
    slug: 'digital-products',
    name: 'Digital products & systems',
    tagline: 'Product engineering',
    year: '2021',
    role: 'Full-stack developer',
    type: 'web',
    stack: ['Angular', 'Ionic', 'Node.js', 'MongoDB', 'Firebase'],
    coverImage: '/images/commercial.jpeg',
    heroImage: '/images/portfolio_22_lg.jpeg',
    summary:
      'Web and mobile applications with thoughtful data modeling across MongoDB and Firebase for fast-moving product teams.',
    href: null,
    overview:
      'Hands-on delivery for customer-facing apps with Angular, Ionic, and Node—pairing pragmatic schema design with shipping velocity.',
    problem:
      'Teams needed reliable offline-friendly mobile patterns and predictable sync with backend services.',
    goals: [
      'Ship stable mobile builds with Ionic and Angular.',
      'Model data cleanly across MongoDB and Firebase where each fits best.',
      'Keep APIs maintainable as features expanded.',
    ],
    architecture: {
      text: 'Node services backing Angular clients; Ionic shells for mobile; Firebase where real-time or lightweight persistence helped.',
      highlights: ['Document design', 'API boundaries', 'Client performance'],
    },
    features: [
      {
        title: 'Data modeling',
        body: 'MongoDB and Firebase used intentionally—not duplicated.',
      },
      {
        title: 'Mobile UX',
        body: 'Ionic flows tuned for touch and constrained devices.',
      },
      {
        title: 'Iteration speed',
        body: 'Patterns that let small teams ship without regressions.',
      },
    ],
    gallery: galleryMyFinance,
    results: [
      { label: 'Platforms', value: 'Web +', hint: 'mobile' },
      { label: 'Stores', value: '2', hint: 'Mongo + Firebase' },
      { label: 'Delivery', value: 'Lean', hint: 'focused iterations' },
    ],
  },
];

export const PROJECTS = raw.map((p) => ({
  ...p,
  ...linkNav(p.slug),
}));

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null;
}

export function listProjectTechTags() {
  const s = new Set();
  PROJECTS.forEach((p) => p.stack.forEach((t) => s.add(t)));
  return [...s].sort();
}

export function listProjectTypes() {
  return ['web', 'mobile', 'cloud'];
}

/** @deprecated use PROJECTS */
export const projects = PROJECTS.map((p) => ({
  id: p.slug,
  name: p.name,
  tagline: p.tagline,
  description: p.summary,
  href: p.href,
  stack: p.stack,
}));
