export interface NavLink {
  text: string;
  href: string;
}

export interface Point {
  text: string;
}

export interface SkillGroup {
  name: string;
  items: string[];
  summary?: string;
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
