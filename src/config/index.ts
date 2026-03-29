import type { SiteConfig, SiteContent } from "../types";

export const SITE_CONFIG: SiteConfig = {
  title: "Emilio Arango - Systems Administrator",
  author: "Emilio Arango",
  description:
    "Systems Administrator with over 10 years of experience in infrastructure management, automation, cloud systems, and IT operations. Focused on building reliable, secure, and efficient technology solutions.",
  lang: "en",
  siteLogo: "/alejandro-small.jpg",
  navLinks: [
    { text: "Experience", href: "#experience" },
    { text: "Projects", href: "#projects" },
    { text: "About", href: "#about" },
  ],
  socialLinks: [
    { text: "LinkedIn", href: "https://www.linkedin.com/in/emilio-arango-b7a55722" },
    { text: "GitHub", href: "https://github.com/emilioarango" },   // ← CHANGE TO YOUR ACTUAL GITHUB USERNAME
  ],
  socialImage: "/zen-og.png",
  canonicalURL: "https://personal-site-nu-coral.vercel.app",
};

export const SITE_CONTENT: SiteContent = {
  hero: {
    name: "Emilio Arango",
    specialty: "Systems Administrator",
    summary:
      "Systems Administrator specializing in infrastructure, automation, cloud technologies, and keeping complex IT environments running smoothly and securely.",
    email: "example@email.com",
  },
  experience: [
    {
      company: "Restaurant365",
      position: "Systems Administrator",
      startDate: "2025",
      endDate: "Present",
      summary: [
        "Manage infrastructure, cloud systems, automation, and integrations to support accounting, inventory, workforce management, and payroll platforms.",
        "Ensure high availability, security, and reliable operations across multi-location restaurant environments.",
        "Provide advanced troubleshooting, security management, and user access administration while continuously improving system reliability and scalability.",
      ],
    },
    {
      company: "Happy Money",
      position: "IT Support Specialist",
      startDate: "2021",
      endDate: "2024",
      summary: [
        "Provided end-to-end technical support for users and systems in a fast-paced financial environment.",
        "Managed endpoint devices, troubleshooting, and user access while maintaining security standards.",
        "Assisted with infrastructure maintenance, software deployments, and process automation initiatives.",
      ],
    },
  ],
  projects: [
    {
      name: "Spotifu Music",
      summary: "A music streaming app that emulates Spotify's core features.",
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/spotifu.png",
    },
    {
      name: "Shopp App",
      summary: "An e-commerce platform that replicates Shopify's key features.",
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/shopify-clon.png",
    },
    {
      name: "ClonTagram",
      summary: "A social network that replicates the features of Instagram",
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/clone-ig.png",
    },
  ],
  about: {
    description: `
      Hey, I'm Emilio Arango, a Systems Administrator with more than 10 years of experience in IT.
      I specialize in infrastructure management, automation, cloud systems, security, and ensuring reliable operations across complex environments.
      I take pride in building and maintaining systems that are stable, efficient, and secure.
    `,
    image: "/alejandro-big.jpg",
  },
};

// #5755ff
