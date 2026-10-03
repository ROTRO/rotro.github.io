export interface GalleryShot {
  src: string;
  cap: string;
}

/** Visual shape of a project's screenshots — drives gallery layout. */
export type ProjectShape = 'phone' | 'web' | null;

/** Locale override for a Project's translatable fields; galleryCaps aligns by index with `gallery`. */
export interface ProjectTranslation {
  kind?: string;
  tagline?: string;
  desc?: string;
  feats?: string[];
  galleryCaps?: string[];
}

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
  /** French translation override for kind/tagline/desc/feats/gallery captions. */
  fr?: ProjectTranslation;
}

export interface NavLink {
  /** Translation key under the `nav` namespace, e.g. "home" → nav.home. */
  key: string;
  to: string;
}

export interface SocialLink {
  label: string;
  href: string;
  external?: boolean;
}
