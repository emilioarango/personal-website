import type { SiteConfig, SiteContent } from "../types";

export const SITE_CONFIG: SiteConfig = {
  title: "Emilio Arango - Systems Administrator",
  author: "Emilio Arango",
  description:
    "Systems Administrator with over 10 years of experience in infrastructure management, automation, cloud systems, and IT operations. Focused on building reliable, secure, and efficient technology solutions.",
  lang: "en",
  siteLogo: "/emilio-small.jpg",
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
    email: "emilioearango@gmail.com",
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
  {
      company: "Taco Bell",
      position: "IT Support",
      startDate: "2018",
      endDate: "2019",
      summary: [
        "Provided hands-on IT support for restaurant locations and back-office systems.",
        "Managed hardware troubleshooting, network issues, and point-of-sale system maintenance.",
        "Assisted with software deployments and user training.",
      ],
    },
    {
      company: "Apple Store",
      position: "Genius Bar Technician",
      startDate: "2016",
      endDate: "2018",
      summary: [
        "Delivered technical support and repairs for Apple hardware and software.",
        "Diagnosed and resolved complex customer issues while maintaining high customer satisfaction.",
        "Worked with advanced diagnostic tools and performed hardware repairs.",
      ],
    },
  ],
  about: {
    description: `
      Hey, I'm Emilio Arango, a Systems Administrator with more than 10 years of experience in IT.
      I specialize in infrastructure management, automation, cloud systems, security, and ensuring reliable operations across complex environments.
      I take pride in building and maintaining systems that are stable, efficient, and secure.
    `,
    image: "/emilio-small.jpg",
  },
};

// #5755ff
