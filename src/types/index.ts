export interface NavLink {
  text: string;
  href: string;
  /** Home-page section id this tab tracks while scrolling. */
  section?: string;
}

export interface HeroTile {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  icon: "pin" | "shield" | "box" | "crown";
  href?: string;
  linkLabel?: string;
}

export interface Point {
  text: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
  summary?: string;
}

export interface Interest {
  name: string;
  summary: string;
  image: string;
  alt: string;
}

export interface Role {
  company: string;
  position: string;
  start: string;
  end: string;
  location?: string;
  points?: Point[];
}

export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkItem {
  name: string;
  context: string;
  summary: string;
  links: WorkLink[];
}
