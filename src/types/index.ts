export interface NavLink {
  text: string;
  href: string;
}

export interface Point {
  text: string;
  /** Render as a TODO Emilio still needs to fill. Never invent the missing fact. */
  todo?: boolean;
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
  todos: string[];
  facts?: string[];
}
