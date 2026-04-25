import type { SiteConfig, SiteContent } from "../types";

export const SITE_CONFIG: SiteConfig = {
  title: "Emilio Arango — Systems Administrator",
  author: "Emilio Arango",
  description:
    "Systems Administrator with over 10 years of experience in infrastructure management, automation, cloud systems, and IT operations. Focused on building reliable, secure, and efficient technology solutions.",
  lang: "en",
  siteLogo: "/emilio-small.jpg",
  navLinks: [
    { text: "Experience", href: "#experience" },
    { text: "About", href: "#about" },
  ],
  socialLinks: [
    { text: "LinkedIn", href: "https://www.linkedin.com/in/emilio-arango-b7a55722" },
    { text: "GitHub", href: "https://github.com/emilioarango" },   // ← Update with your actual GitHub username
  ],
  socialImage: "/zen-og.png",
  canonicalURL: "https://emilioarango.com",
};

export const SITE_CONTENT: SiteContent = {
  hero: {
    name: "Emilio Arango",
    specialty: "Systems Administrator",
    summary:
      "Systems Administrator specializing in Mac/Windows endpoint management, MDM (Jamf/Intune), Azure Entra ID, and AI-driven helpdesk automation.",
    email: "emilioearango@gmail.com",   // ← Update this once you have professional email
  },
  experience: [
    {
      company: "Restaurant365",
      position: "Systems Administrator",
      startDate: "2024",
      endDate: "Present",
      summary: [
        "Manage and maintain critical cloud infrastructure supporting restaurant accounting, inventory, workforce management, and payroll platforms.",
        "Handle system integrations, automation workflows, and performance monitoring to ensure high availability and operational efficiency.",
        "Provide advanced troubleshooting, security management, and user access administration.",
      ],
    },
    {
      company: "Happy Money",
      position: "IT Support Specialist",
      startDate: "2019",
      endDate: "2024",
      summary: [
        "Delivered technical support and systems maintenance in a fast-paced financial services environment.",
        "Managed endpoint devices, user access, troubleshooting, and security best practices.",
        "Supported infrastructure stability and assisted with automation initiatives.",
      ],
    },
    {
      company: "Taco Bell",
      position: "Service Desk Analyst",
      startDate: "2018",
      endDate: "2020",
      summary: [
        "Provided hands-on IT support for restaurant locations and back-office systems.",
        "Managed hardware troubleshooting, network issues, and point-of-sale system maintenance.",
        "Assisted with software deployments and user training.",
      ],
    },
    {
      company: "Apple Store",
      position: "Genius Bar Technician",
      startDate: "2015",
      endDate: "2018",
      summary: [
        "Delivered technical support and repairs for Apple hardware and software.",
        "Diagnosed and resolved complex customer issues while maintaining high customer satisfaction.",
        "Worked with advanced diagnostic tools and performed hardware repairs.",
      ],
    },
  ],
  projects: [],   // keeps the section hidden
  about: {
    description: `
      Hey, I'm Emilio Arango, a Systems Administrator with more than 10 years of experience in IT.
      I specialize in infrastructure management, automation, cloud systems, security, and ensuring reliable operations across complex environments.
      I take pride in building and maintaining systems that are stable, efficient, and secure.
    `,
    image: "/emilio-small.jpg",
  },
};
