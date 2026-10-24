import type { Interest, NavLink, Role, SkillGroup, WorkItem } from "../types";

/**
 * Personal site content for emilioarango.com.
 * Work history stays in EXPERIENCE and is rendered only on /resume.
 * Search for `todo: true` and `PROJECT_TODO` / `resume.todo` before publishing.
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
  jobTitle: "Systems Administrator",
  description:
    "Emilio Arango, in Southern California. Chess, code, film, history, and a Subaru WRX STI.",
  url: "https://emilioarango.com",
  lang: "en",
  locale: "en_US",
  ogImage: "/og-image.png",
  ogImageAlt:
    "Emilio Arango. Chess, code, film, history, and a Subaru WRX STI.",
  knowsAbout: [
    "Chess",
    "Artificial intelligence",
    "Programming",
    "Film",
    "History",
    "Motorsport",
  ],
};

export const NAV: NavLink[] = [
  { text: "About", href: "#about" },
  { text: "Interests", href: "#interests" },
  { text: "Projects", href: "#projects" },
];

export const HERO = {
  kicker: "Southern California",
  line: "Chess, code, film, history, and a Subaru WRX STI.",
};

export const ABOUT = {
  body: "I'm Emilio Arango. I live in Southern California. I play chess, write code, watch films, read history, and drive a Subaru WRX STI.",
};

export const INTERESTS: Interest[] = [
  {
    name: "Chess",
    summary: "A game I play, and one I have been teaching a computer to play.",
  },
  {
    name: "AI and coding",
    summary:
      "Writing software, and using AI while I build. The chess engine is the piece anyone can open.",
  },
  {
    name: "Film",
    summary: "Getting lost in a good movie.",
  },
  {
    name: "History",
    summary:
      "The long view, and what the last few millennia still have to say.",
  },
  {
    name: "Motorsport",
    summary: "The sport, and the Subaru WRX STI I drive.",
  },
];

export const PROJECTS: WorkItem[] = [
  {
    name: "Chess engine",
    context: "Python",
    summary:
      "A playable chess engine in pure Python: legal move generation, minimax with alpha-beta pruning, and piece-square tables. No dependencies.",
    links: [{ label: "Source", href: SOCIAL.chessEngine }],
    todos: [],
  },
];

export const PROJECT_TODO =
  "Add any other project you want on this page: a name, one sentence, and a link.";

export const SKILLS: SkillGroup[] = [
  {
    name: "Identity",
    items: ["Microsoft Entra ID", "Okta"],
    summary:
      "Directory, single sign-on, and access for the people on these platforms.",
  },
  {
    name: "Endpoint / MDM",
    items: ["Jamf", "Microsoft Intune", "macOS", "Windows"],
    summary:
      "Enrollment and day-to-day management for a mixed Mac and Windows fleet.",
  },
  {
    name: "Security",
    items: ["Microsoft Defender", "Mimecast"],
    summary: "Microsoft Defender on the endpoints, and Mimecast for email.",
  },
  {
    name: "Cloud / Microsoft 365",
    items: ["Microsoft 365"],
    summary:
      "Microsoft 365 for the organization, alongside the high-availability systems daily work depends on.",
  },
  {
    name: "Automation & AI",
    items: ["Helpdesk automation", "Self-serve tooling"],
    summary:
      "Internal knowledge turned into tools employees can use themselves.",
  },
];

export const EXPERIENCE: Role[] = [
  {
    company: "Restaurant365",
    position: "Systems Administrator",
    start: "2024",
    end: "Present",
    location: "Irvine, California",
    points: [
      {
        text: `Own Entra ID, Okta, Microsoft 365, Jamf, Intune, Microsoft Defender, and Mimecast for ${USERS} users in Irvine.`,
      },
      {
        text: "Manage Mac and Windows endpoints and the high-availability systems those users rely on.",
      },
      {
        text: "Build AI-driven helpdesk automation that turns internal knowledge into self-serve tooling.",
      },
    ],
  },
  {
    company: "Happy Money",
    position: "IT Support Specialist",
    start: "2019",
    end: "2024",
    points: [
      {
        text: "Supported endpoints, user access, and security practice in a financial-services environment.",
      },
      {
        text: "Contributed to automation work and the day-to-day stability of shared systems.",
      },
    ],
  },
  {
    company: "Taco Bell",
    position: "Service Desk Analyst",
    start: "2018",
    end: "2020",
    points: [
      {
        text: "Resolved hardware, network, and point-of-sale issues for restaurant and back-office teams.",
      },
      {
        text: "Supported software deployments and user training.",
      },
    ],
  },
  {
    company: "Apple",
    position: "Genius Bar Technician",
    start: "2015",
    end: "2018",
    points: [
      {
        text: "Diagnosed and repaired Apple hardware and software face to face at the Genius Bar.",
      },
      {
        text: "Used Apple diagnostic tools for hands-on hardware repair.",
      },
    ],
  },
];

export const RESUME = {
  href: "/resume",
  label: "Resume",
  title: "Resume — Emilio Arango",
  description:
    "Resume of Emilio Arango, systems administrator at Restaurant365 in Irvine. Identity, endpoints, Microsoft 365, Defender, and Mimecast for 800+ users.",
  summary: `Systems administrator owning identity, endpoints, and AI infrastructure for ${USERS} users at Restaurant365 in Irvine. In IT since 2015, from the Apple Genius Bar through financial-services support and a restaurant service desk.`,
  todo: "Add public/resume.pdf, then set resume.href in src/config/index.ts to /resume.pdf so the Resume button downloads a file. This page is the placeholder.",
};
