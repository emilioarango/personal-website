import type { Interest, NavLink, Role, SkillGroup, WorkItem } from "../types";

/**
 * Personal site content for emilioarango.com.
 * Work history stays in EXPERIENCE and is rendered only on /resume.
 * Add a project by appending an object to PROJECTS. Empty slots are not rendered.
 */
const USERS = "800+";

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
    "Emilio Arango, in Southern California. Chess, code, film, and history.",
  url: "https://emilioarango.com",
  lang: "en",
  locale: "en_US",
  ogImage: "/og-image.png",
  ogImageAlt: "Emilio Arango. Chess, code, film, and history.",
  knowsAbout: [
    "Chess",
    "Artificial intelligence",
    "Programming",
    "Film",
    "History",
  ],
};

export const NAV: NavLink[] = [
  { text: "Interests", href: "#interests" },
  { text: "About", href: "#about" },
  { text: "Projects", href: "#projects" },
];

export const HERO = {
  kicker: "Southern California",
  line: "I play chess, write code, watch films, and read history.",
};

export const ABOUT = {
  lead: "I live in Southern California. The days I like best have a game, a film, or a book that is much older than I am.",
  detail:
    "I write software for the fun of seeing an idea work, and I use AI while I build. The rest of the day I try to keep in proportion.",
};

export const INTERESTS: Interest[] = [
  {
    name: "Chess",
    summary: "A game I sit down and play.",
    image: "/interests/chess.webp",
    alt: "A wooden chess knight lit from the side.",
  },
  {
    name: "AI and coding",
    summary: "Writing software, and using AI while I build.",
    image: "/interests/code.webp",
    alt: "A dark screen of code.",
  },
  {
    name: "Film",
    summary: "Getting lost in a good movie.",
    image: "/interests/film.webp",
    alt: "A movie projector in low light.",
  },
  {
    name: "History",
    summary:
      "The long view, and what the last few millennia still have to say.",
    image: "/interests/history.webp",
    alt: "Michelangelo’s David, seen from below.",
  },
];

/** Append another object to show another card. Nothing is rendered for an empty list slot. */
export const PROJECTS: WorkItem[] = [
  {
    name: "Chess engine",
    context: "Python",
    summary:
      "A small chess engine in pure Python: legal moves, minimax with alpha-beta pruning, and piece-square tables.",
    links: [{ label: "Source", href: SOCIAL.chessEngine }],
    todos: [],
  },
];

export const SKILLS: SkillGroup[] = [
  {
    name: "Identity",
    items: ["Entra ID", "Okta", "M365"],
  },
  {
    name: "Endpoint",
    items: ["Jamf", "Intune", "Sophos"],
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
      { text: "Entra ID, Okta, and Microsoft 365 identity." },
      { text: "A Jamf and Intune endpoint fleet with Sophos." },
      {
        text: "Built a production AI agent, plus Python and MCP automation.",
      },
    ],
  },
  {
    company: "Happy Money",
    position: "IT Support Specialist",
    start: "2019",
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

export const RESUME = {
  href: "/resume",
  label: "Resume",
  title: "Resume — Emilio Arango",
  description:
    "A short overview of Emilio Arango’s work in identity, endpoints, and AI automation.",
  headline: "Systems Engineer — Identity, Endpoint & AI Automation",
  summary: `I run identity and endpoint for a company of ${USERS} people. I build AI agents and automation to cut repetitive IT work.`,
  cta: "Email me for the full resume.",
};
