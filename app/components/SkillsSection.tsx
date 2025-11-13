"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const skillCategories = [
  {
    title: "Languages & Frameworks",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "React Native",
      "Next.js",
      "Node.js",
      "Express.js",
      "AngularJS",
      "Flask",
      "Apollo Client",
      "Redux",
    ],
  },
  {
    title: "Architecture & DevOps",
    skills: [
      "GraphQL",
      "REST APIs",
      "Microservices",
      "Docker",
      "AWS (EC2, S3, Lambda)",
      "CloudFormation",
      "Firebase",
      "Terraform",
      "GitHub Actions",
      "CircleCI",
      "Fastlane",
      "Bitrise",
    ],
  },
  {
    title: "CMS & E-Commerce",
    skills: [
      "Contentful",
      "Contentstack",
      "Strapi",
      "WordPress",
      "Commercetools",
      "Cloudinary",
      "Coveo",
      "Amplience",
    ],
  },
  {
    title: "Testing & Monitoring",
    skills: [
      "Jest",
      "Cypress",
      "React Testing Library",
      "Postman",
      "Firebase Analytics",
      "Prometheus",
      "Datadog",
    ],
  },
  {
    title: "Design & Emerging Tech",
    skills: [
      "Blockchain/NFTs",
      "Image Generation",
      "Python",
      "Symphony",
      "Object Detection (YOLO)",
      "Claude Code",
      "GitHub Copilot",
    ],
  },
];

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <motion.div
        className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          Core Skills
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-8"
      >
        {skillCategories.map((category, index) => (
          <motion.div key={index} variants={categoryVariants}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-200">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <motion.span
                  key={skillIndex}
                  className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 transition-colors hover:bg-teal-400/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-200">
            Certifications
          </h3>
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mt-1 h-5 w-5 flex-shrink-0 text-teal-300"
            >
              <path
                fillRule="evenodd"
                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-slate-200">AWS Certified Cloud Practitioner</p>
              <p className="mt-1 text-sm text-slate-400">Valid through April 2026</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
