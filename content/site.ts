/** Site-wide copy. Edit here, not in the components. */

export const siteUrl = "https://maxmcgee.com";

export const navItems = [
  { href: "#about", label: "About", shortLabel: "About" },
  { href: "#experience", label: "Experience", shortLabel: "Work" },
  { href: "#projects", label: "Projects", shortLabel: "Projects" },
  { href: "#contact", label: "Contact", shortLabel: "Contact" },
] as const;

const intro =
  "I build web and mobile products with React, React Native, and headless CMS, and lead client-facing engineering on agency teams.";

export const site = {
  name: "Max McGee",
  logo: "max.mcgee",
  role: "Senior Full Stack Engineer, San Diego.",
  summary: intro,
  about:
    "I build web and mobile products from first prototype through launch. Most of my work is React and React Native on top of headless CMS, and I often lead the client side of engineering: running demos, scoping and estimating the work, and making sure what we ship holds up after launch.",
  photo: {
    src: "/headshot.jpg",
    alt: "Max McGee",
    width: 240,
    height: 300,
  },
  /**
   * Placeholder. Point href at a file in /public (for example "/resume.pdf")
   * when the résumé is ready.
   */
  resume: {
    label: "View resume",
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
