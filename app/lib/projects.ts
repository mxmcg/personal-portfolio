export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  repo?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform Transformation",
    description: "Led migration of a national retail brand from legacy Sitecore to modern headless architecture with Next.js and Contentstack.",
    techStack: ["Next.js", "Contentstack", "GraphQL", "TypeScript"],
  },
  {
    id: "project-2",
    title: "Interactive Product Customizers",
    description: "Built personalized e-commerce experiences for Fortune 500 retail brands with 3D product visualization and real-time previews.",
    techStack: ["React", "Next.js", "TypeScript", "Commercetools"],
  },
  {
    id: "project-3",
    title: "AI-Powered Product Concierge",
    description: "Developed conversational AI skincare advisor for a global beauty brand with real-time streaming responses and personalized recommendations.",
    techStack: ["Preact", "Google Agent Dev Kit", "TypeScript"],
  },
  {
    id: "project-4",
    title: "Utility Weather & Outage Platform",
    description: "Built React Native mobile app for a regional energy provider with real-time geospatial visualizations and push notifications.",
    techStack: ["React Native", "TypeScript", "Expo", "Firebase"],
  },
];
