/**
 * Anonymized client work. These entries are intentionally not links.
 * Edit the copy here.
 */

export type Project = {
  id: string;
  title: string;
  summary: string;
  tags: readonly string[];
};

export const projects: readonly Project[] = [
  {
    id: "commerce-platform",
    title: "E-Commerce Platform Transformation",
    summary:
      "Migrated a national retail brand from legacy Sitecore to a headless Next.js and Contentstack stack.",
    tags: ["Next.js", "Contentstack", "GraphQL"],
  },
  {
    id: "customizers",
    title: "Interactive Product Customizers",
    summary:
      "Personalized commerce for Fortune 500 retail brands with 3D visualization and real-time previews.",
    tags: ["React", "Commercetools", "TypeScript"],
  },
  {
    id: "concierge",
    title: "AI-Powered Product Concierge",
    summary:
      "Conversational AI skincare advisor for a global beauty brand with streaming, personalized recommendations.",
    tags: ["Preact", "Google ADK", "TypeScript"],
  },
  {
    id: "utility",
    title: "Utility Weather & Outage Platform",
    summary:
      "React Native app for a regional energy provider with live geospatial maps and push alerts.",
    tags: ["React Native", "Expo", "Firebase"],
  },
];
