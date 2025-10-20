export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  repo?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with cart management, payment integration, and real-time inventory tracking.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "Prisma"],
    image: "/project-1.svg",
    repo: "https://github.com/maxexample/ecommerce-platform",
    demo: "https://ecommerce-demo.vercel.app",
  },
  {
    id: "project-2",
    title: "Task Management Dashboard",
    description: "Collaborative task management tool with drag-and-drop interface, real-time updates, and team analytics.",
    techStack: ["React", "TypeScript", "Firebase", "Framer Motion", "Zustand"],
    image: "/project-2.svg",
    repo: "https://github.com/maxexample/task-dashboard",
    demo: "https://task-dashboard-demo.vercel.app",
  },
  {
    id: "project-3",
    title: "Weather Forecast App",
    description: "Beautiful weather application with 7-day forecasts, location search, and animated weather conditions.",
    techStack: ["Next.js", "TypeScript", "OpenWeather API", "Vercel"],
    image: "/project-3.svg",
    repo: "https://github.com/maxexample/weather-app",
    demo: "https://weather-app-demo.vercel.app",
  },
  {
    id: "project-4",
    title: "Portfolio CMS",
    description: "Headless CMS for managing portfolio content with markdown support, image optimization, and API generation.",
    techStack: ["Next.js", "TypeScript", "MDX", "Contentlayer", "Tailwind CSS"],
    image: "/project-4.svg",
    repo: "https://github.com/maxexample/portfolio-cms",
  },
];
