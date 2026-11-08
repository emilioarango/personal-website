import type { NavLink, Role, SkillGroup, WorkItem } from "../types";

/**
 * Personal site content for emilioarango.com.
 * Work history stays in EXPERIENCE and is rendered only on /resume.
 */

export const SOCIAL = {
  email: "emilioearango@gmail.com",
  linkedin: "https://www.linkedin.com/in/emilio-a-b7a55722",
  github: "https://github.com/emilioarango",
  chessEngine: "https://github.com/emilioarango/chess-engine",
};

export const SITE = {
  name: "Emilio Arango",
  title: "Emilio Arango",
  description:
    "Emilio Arango — personal site. Systems administrator in Southern California.",
  url: "https://emilioarango.com",
  lang: "en",
  locale: "en_US",
  ogImage: "/og-image.png",
  ogImageAlt: "Emilio Arango",
  knowsAbout: [
    "Chess",
    "Artificial intelligence",
    "Programming",
    "Identity and access management",
    "Endpoint management",
  ],
};

export const NAV: NavLink[] = [
  { text: "Résumé", href: "#resume" },
  { text: "Contact", href: "#contact" },
];

export const HERO = {
  kicker: "Southern California",
  line: "Systems administrator.",
};

export const ABOUT = {
  lead: "I live in Southern California. The days I like best have a game, a film, or a book that is much older than I am.",
  detail:
    "I write software for the fun of seeing an idea work, and I use AI while I build. The rest of the day I try to keep in proportion.",
};

/** Kept for /resume tooling context; not rendered on the homepage. */
export const PROJECTS: WorkItem[] = [
  {
    name: "Chess engine",
    context: "Python",
    summary:
      "A small chess engine in pure Python: legal moves, minimax with alpha-beta pruning, and piece-square tables.",
    links: [{ label: "Source", href: SOCIAL.chessEngine }],
  },
];

export const SKILLS: SkillGroup[] = [
  {
    name: "Identity",
    items: ["Entra ID", "Microsoft 365", "Conditional Access", "SSO", "Okta"],
  },
  {
    name: "Endpoint",
    items: ["Intune", "Microsoft Defender", "Jamf Pro", "Autopilot"],
  },
  {
    name: "Automation and AI",
    items: ["Python", "MCP", "Claude Code", "Cursor", "Grok Bot", "LLM agents"],
  },
];

export const EXPERIENCE: Role[] = [
  {
    company: "Restaurant365",
    position: "Systems Administrator",
    start: "2024",
    end: "Present",
    points: [
      {
        text: "Entra ID, Microsoft 365, Conditional Access, and SSO.",
      },
      {
        text: "Run a hybrid fleet: Intune, Autopilot, and Microsoft Defender on Windows, and Jamf Pro on Mac.",
      },
      {
        text: "Lead helpdesk operations and serve as the escalation point for Tier 1–3 issues across the organization.",
      },
      {
        text: "Built a production AI agent, plus Python and MCP automation.",
      },
    ],
  },
  {
    company: "Happy Money",
    position: "IT Support Specialist",
    start: "2020",
    end: "2024",
  },
  {
    company: "Taco Bell",
    position: "Service Desk Analyst",
    start: "2018",
    end: "2020",
  },
  {
    company: "Apple",
    position: "Genius Bar Technician",
    start: "2015",
    end: "2018",
  },
];

export const EDUCATION = [
  "California State University, Fullerton: B.B.A., Concentration in Marketing (2018)",
  "AZ-900 Microsoft Azure Fundamentals",
  "Okta Certified (2023–2025)",
  "Google IT Support Professional",
  "Jira Fundamentals",
];

export const RESUME = {
  href: "/resume",
  label: "Résumé",
  title: "Résumé — Emilio Arango",
  description:
    "A short overview of Emilio Arango’s work in identity, endpoints, and AI automation.",
  headline: "Systems Administrator",
  summary:
    "I run identity and endpoint for a multi-site organization. I build AI agents and automation to cut repetitive IT work.",
  cta: "Email me for the full résumé.",
};
