/**
 * Anonymized client work. These entries are intentionally not links.
 * Edit the copy here.
 */

export const projectsHeading = "Selected work";

export type Project = {
  id: string;
  title: string;
  summary: string;
  tags?: readonly string[];
};

export const projects: readonly Project[] = [
  {
    id: "b2b-search",
    title: "Enterprise B2B search",
    summary:
      "Migrating a food distributor's legacy search to Coveo with AI recommendations, nightly data sync, and Java/Node microservices.",
  },
  {
    id: "concierge",
    title: "AI shopping concierge",
    summary:
      "A streaming conversational assistant for a global beauty brand, demoed to executives in one week.",
  },
  {
    id: "utility",
    title: "Utility weather app",
    summary:
      "React Native maps with live clustering for weather and outages, push alerts, and automated store releases.",
  },
  {
    id: "medical",
    title: "Medical education app",
    summary:
      "Synced dual-video playback for cardiac imaging, with content driven by Contentful and GraphQL.",
  },
  {
    id: "speakers",
    title: "Retail speaker demo",
    summary:
      "Offline Dolby Atmos video that controls in-store speakers over UDP.",
  },
  {
    id: "replatform",
    title: "E-commerce replatform",
    summary:
      "A large retailer moved from Sitecore to Next.js and Contentstack with Coveo search; mentored three junior developers.",
  },
  {
    id: "configurator",
    title: "Product configurator",
    summary:
      "A 60-component candy customizer with image editing, launched in 7 locales.",
  },
];
