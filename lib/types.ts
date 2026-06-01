export interface GalleryShot {
  src: string;
  cap: string;
}

/** Visual shape of a project's screenshots — drives gallery layout. */
export type ProjectShape = 'phone' | 'web' | null;

export interface Project {
  id: string;
  /** e.g. "Personal project", "Professional · Lead" */
  kind: string;
  year: string;
  /** Live URL if the project is publicly reachable, otherwise null. */
  live: string | null;
  name: string;
  tagline: string;
  /** Cover image for the carousel slide; null renders a typographic slide. */
  cover: string | null;
  /** object-position for the cover image. */
  coverPos?: string;
  desc: string;
  feats: string[];
  stack: string[];
  shape: ProjectShape;
  gallery: GalleryShot[];
}

export interface NavLink {
  label: string;
  to: string;
}

export interface SocialLink {
  label: string;
  href: string;
  external?: boolean;
}
