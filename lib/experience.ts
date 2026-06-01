export interface Role {
  period: string;
  current?: boolean;
  location?: string;
  title: string;
  company: string;
  bullets: { text: string; win?: boolean }[];
}

/** Work history — newest first. Drives the Experience timeline. */
export const roles: Role[] = [
  {
    period: 'Jan 2026 — Present',
    current: true,
    title: 'Full-Stack Engineer',
    company: 'RMSoftware',
    bullets: [
      { text: 'Design AWS-based architectures for production workloads — scalability, security, performance.' },
      { text: 'Develop full-stack applications using Angular, NestJS, Flutter and Ionic.' },
      { text: 'Implement security best practices: authentication, authorization, data protection.' },
      { text: 'Act as systems architect — microservices structure and deployment strategy.' },
    ],
  },
  {
    period: 'June 2024 — Dec 2025',
    title: 'Technical Lead',
    company: 'Aquadeep',
    bullets: [
      { text: 'Lead the design and deployment of cloud-based solutions on AWS — scalable, reliable architecture.' },
      { text: 'Manage a team of developers and establish CI/CD pipelines, reducing deployment times by 30%.' },
      { text: 'Improve system uptime and efficiency through modern DevOps practices.' },
    ],
  },
  {
    period: 'May 2023 — Mar 2024',
    location: 'Boston, MA',
    title: 'Full-Stack Engineer & Lead',
    company: 'eSteps Health',
    bullets: [
      { text: 'Built a real-time healthcare SaaS platform with Node.js, Angular and AWS.' },
      { text: 'Led backend development and optimized MongoDB — improving data retrieval by 20%.' },
      { text: 'Managed a team of 10 engineers, improving productivity by 25% and reducing latency by 15%.' },
      { text: 'Won First Prize at POESAM 2023 for an innovative healthcare solution.', win: true },
    ],
  },
  {
    period: 'Feb 2022 — May 2023',
    title: 'IT Project Manager',
    company: 'NOVASOLVD',
    bullets: [
      { text: 'Managed large-scale IT projects with structured roadmaps, timelines and measurable milestones.' },
      { text: 'Reduced operating costs by 20% by modernizing and modularizing legacy codebases.' },
      { text: 'Designed automated CI/CD pipelines, reducing deployment times by 40%.' },
    ],
  },
  {
    period: 'Oct 2020 — Dec 2021',
    title: 'Full-Stack Developer',
    company: 'DnD Services',
    bullets: [
      { text: 'Delivered client-specific web and mobile apps using Angular, Ionic and Node.js.' },
      { text: 'Designed scalable databases with MongoDB and Firebase for optimal performance.' },
      { text: 'Launched a production hybrid mobile app.' },
    ],
  },
];
