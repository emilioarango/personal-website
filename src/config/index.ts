import type { GlanceRow, NavLink, Role, SkillGroup, WorkItem } from "../types";

/**
 * Portfolio content for emilioarango.com.
 * Search for `todo: true` and `resume.todo` before publishing.
 * USERS is the only headcount that should appear on the site.
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
  title: "Emilio Arango — Systems Administrator",
  jobTitle: "Systems Administrator",
  description:
    "Systems administrator in Irvine. Owns Entra ID, Microsoft 365, Okta, Jamf, Intune, and Sophos for 800+ users, and builds AI helpdesk automation at Restaurant365.",
  url: "https://emilioarango.com",
  lang: "en",
  locale: "en_US",
  ogImage: "/og-image.png",
  ogImageAlt:
    "Emilio Arango, systems administrator. He owns identity, endpoints, and AI infrastructure for 800+ users.",
  location: {
    locality: "Irvine",
    region: "CA",
    country: "US",
  },
  knowsAbout: [
    "Microsoft Entra ID",
    "Okta",
    "Microsoft 365",
    "Jamf",
    "Microsoft Intune",
    "Sophos",
    "macOS",
    "Windows",
    "Endpoint management",
    "Identity and access",
    "High availability",
    "Helpdesk automation",
  ],
};

export const NAV: NavLink[] = [
  { text: "Skills", href: "#skills" },
  { text: "Experience", href: "#experience" },
  { text: "Work", href: "#work" },
  { text: "About", href: "#about" },
];

export const HERO = {
  kicker: "Senior systems · IT infrastructure · AI",
  line: `I own identity, endpoints, and AI infrastructure for ${USERS} users.`,
  meta: "Systems Administrator · Restaurant365 · Irvine, California · 2024–Present",
};

export const GLANCE: { role: string; place: string; rows: GlanceRow[] } = {
  role: "Systems Administrator",
  place: "Restaurant365 · Irvine",
  rows: [
    { label: "People", value: USERS },
    { label: "Identity", value: "Entra ID, Okta" },
    { label: "Endpoints", value: "Jamf, Intune, Sophos" },
    { label: "Fleet", value: "Mac and Windows" },
    { label: "Automation", value: "AI helpdesk" },
  ],
};

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
    items: ["Sophos"],
    summary: "Endpoint protection across that same fleet.",
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
        text: `Own Entra ID, Okta, Microsoft 365, Jamf, Intune, and Sophos for ${USERS} users in Irvine.`,
      },
      {
        text: "Manage Mac and Windows endpoints and the high-availability systems those users rely on.",
      },
      {
        text: "Build AI-driven helpdesk automation that turns internal knowledge into self-serve tooling.",
      },
      {
        todo: true,
        text: "Add one measured outcome for automation or availability (a count, a rate, or time saved). Use a real figure only.",
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

export const WORK: WorkItem[] = [
  {
    name: "AI helpdesk automation",
    context: "Restaurant365 · Internal",
    summary:
      "Self-serve helpdesk tooling that turns Restaurant365’s internal knowledge into something employees can use themselves.",
    links: [],
    todos: [
      "Name the tool or workflow.",
      "Add the stack you are willing to share (platform, model, or scripts).",
      "Add one real result for this project (a count, a rate, or time saved).",
    ],
  },
  {
    name: "Chess engine",
    context: "Personal project · Python",
    summary:
      "A playable chess engine in pure Python: legal move generation, minimax with alpha-beta pruning, and piece-square tables. No dependencies.",
    links: [{ label: "Source", href: SOCIAL.chessEngine }],
    todos: [],
  },
];

export const ABOUT = {
  body: "I have spent my career in IT since 2015, from Genius Bar repairs to owning identity and endpoint platforms at Restaurant365. The work I want stays up and gets quieter: access that is clear, queues that shrink, and tools people can use on their own. Away from the keyboard I play chess, drive a Subaru WRX STI, and spend time with film and history.",
  interests: ["Chess", "Subaru WRX STI", "Film", "History"],
};

export const RESUME = {
  href: "/resume",
  label: "Resume",
  title: "Resume — Emilio Arango",
  description:
    "Resume of Emilio Arango, systems administrator at Restaurant365 in Irvine. Identity, endpoints, Microsoft 365, and AI helpdesk automation for 800+ users.",
  summary: `Systems administrator owning identity, endpoints, and AI infrastructure for ${USERS} users at Restaurant365 in Irvine. In IT since 2015, from the Apple Genius Bar through financial-services support and a restaurant service desk.`,
  todo: "Add public/resume.pdf, then set resume.href in src/config/index.ts to /resume.pdf so the hero Resume button downloads a file. This page is the placeholder.",
};
