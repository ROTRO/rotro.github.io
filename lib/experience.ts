export interface RoleTranslation {
  period?: string;
  location?: string;
  title?: string;
  bullets?: string[];
}

export interface Role {
  period: string;
  current?: boolean;
  location?: string;
  title: string;
  company: string;
  bullets: { text: string; win?: boolean }[];
  /** French translation override for period/location/title/bullet text. */
  fr?: RoleTranslation;
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
    fr: {
      period: 'Janv. 2026 — Présent',
      title: 'Ingénieur Full-Stack',
      bullets: [
        'Conception d’architectures AWS pour charges de production — scalabilité, sécurité, performance.',
        'Développement d’applications full-stack avec Angular, NestJS, Flutter et Ionic.',
        'Mise en œuvre des bonnes pratiques de sécurité : authentification, autorisation, protection des données.',
        'Rôle d’architecte systèmes — structure microservices et stratégie de déploiement.',
      ],
    },
  },
  {
    period: 'June 2024 — Dec 2025',
    title: 'Technical Lead',
    company: 'Aquadeep',
    bullets: [
      { text: 'Lead the design and deployment of cloud-based solutions on AWS — scalable, reliable architecture.' },
      { text: 'Lead engineering and CI/CD pipeline work, streamlining releases and cutting manual deployment steps.' },
      { text: 'Improve system uptime and efficiency through modern DevOps practices.' },
    ],
    fr: {
      period: 'Juin 2024 — Déc. 2025',
      title: 'Lead technique',
      bullets: [
        'Direction de la conception et du déploiement de solutions cloud sur AWS — architecture scalable et fiable.',
        'Direction de l’ingénierie et des pipelines CI/CD, simplifiant les mises en production et réduisant les étapes manuelles.',
        'Amélioration de la disponibilité et de l’efficacité du système via des pratiques DevOps modernes.',
      ],
    },
  },
  {
    period: 'May 2023 — Mar 2024',
    location: 'Remote · Boston, MA-based startup',
    title: 'Full-Stack Engineer',
    company: 'eSteps Health',
    bullets: [
      { text: 'Contributed backend and full-stack development to a real-time healthcare SaaS platform with Node.js, Angular and AWS.' },
      { text: 'Worked on backend development and MongoDB performance, including real-time patient monitoring features.' },
      { text: 'Part of the engineering team behind the product, alongside delivery and reliability work.' },
      { text: 'Won First Prize at Orange POESAM 2023 for an innovative healthcare solution.', win: true },
    ],
    fr: {
      period: 'Mai 2023 — Mars 2024',
      location: 'À distance · startup basée à Boston, MA',
      title: 'Ingénieur Full-Stack',
      bullets: [
        'Contribution au développement backend et full-stack d’une plateforme SaaS santé en temps réel avec Node.js, Angular et AWS.',
        'Travail sur le développement backend et la performance MongoDB, incluant des fonctionnalités de suivi patient en temps réel.',
        'Membre de l’équipe d’ingénierie derrière le produit, aux côtés du travail de livraison et de fiabilité.',
        'Lauréat du premier prix à Orange POESAM 2023 pour une solution de santé innovante.',
      ],
    },
  },
  {
    period: 'Feb 2022 — May 2023',
    title: 'IT Project Manager',
    company: 'NOVASOLVD',
    bullets: [
      { text: 'Managed large-scale IT projects with structured roadmaps, timelines and measurable milestones.' },
      { text: 'Modernized and modularized legacy codebases to reduce operating costs.' },
      { text: 'Designed automated CI/CD pipelines, cutting deployment times noticeably.' },
    ],
    fr: {
      period: 'Févr. 2022 — Mai 2023',
      title: 'Chef de projet IT',
      bullets: [
        'Gestion de projets IT à grande échelle avec feuilles de route structurées, plannings et jalons mesurables.',
        'Modernisation et modularisation de bases de code legacy pour réduire les coûts opérationnels.',
        'Conception de pipelines CI/CD automatisés, réduisant nettement les temps de déploiement.',
      ],
    },
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
    fr: {
      period: 'Oct. 2020 — Déc. 2021',
      title: 'Développeur Full-Stack',
      bullets: [
        'Livraison d’applications web et mobiles sur mesure avec Angular, Ionic et Node.js.',
        'Conception de bases de données scalables avec MongoDB et Firebase pour une performance optimale.',
        'Lancement d’une application mobile hybride en production.',
      ],
    },
  },
];

/** Resolve the role list for the given locale, merging `fr` overrides onto the English base. */
export function localizeRoles(items: Role[], locale: string): Role[] {
  if (locale !== 'fr') return items;
  return items.map((r) => {
    const t = r.fr;
    if (!t) return r;
    return {
      ...r,
      period: t.period ?? r.period,
      location: t.location ?? r.location,
      title: t.title ?? r.title,
      bullets: t.bullets ? r.bullets.map((b, i) => ({ ...b, text: t.bullets![i] ?? b.text })) : r.bullets,
    };
  });
}
