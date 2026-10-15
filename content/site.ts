/** Site-wide copy. Edit here, not in the components. */

export const siteUrl = "https://maxmcgee.com";

export const navItems = [
  { href: "#about", label: "About", shortLabel: "About" },
  { href: "#experience", label: "Experience", shortLabel: "Work" },
  { href: "#projects", label: "Projects", shortLabel: "Projects" },
  { href: "#contact", label: "Contact", shortLabel: "Contact" },
] as const;

export const site = {
  name: "Max McGee",
  logo: "max.mcgee",
  role: "Senior Full Stack Engineer",
  summary: "I build enterprise web and AI experiences for Fortune 500 brands.",
  about:
    "I build web and mobile applications for Fortune 500 retail brands and global enterprises, specializing in React, React Native, and headless CMS architectures. Beyond engineering, I architect solutions, manage cross-functional teams, and collaborate directly with stakeholders and clients.",
  photo: {
    src: "/headshot.jpg",
    alt: "Max McGee",
    width: 112,
    height: 112,
  },
  /**
   * Placeholder. Point href at a file in /public (for example "/resume.pdf")
   * when the résumé is ready.
   */
  resume: {
    label: "View résumé",
    href: "#",
  },
  contactCta: "Get in touch",
  contactHeading: "Get in touch",
  contactBody: "Open to interesting conversations and opportunities.",
  email: "maxmcgeedev@gmail.com",
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mxmcg/",
  },
  now: "building with Claude agents · Claude Certified Architect (936)",
  location: "Based in Vista, CA",
} as const;
