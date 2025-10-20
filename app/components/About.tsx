"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="max-w-[880px] mx-auto px-6 py-20"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-[var(--foreground)]">
          About Me
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4 text-[var(--color-muted)]">
            <p>
              Hello! I&apos;m Max, a senior front-end engineer passionate about
              creating intuitive and performant web experiences. My journey in
              web development started over 8 years ago, and I&apos;ve had the
              privilege of working on diverse projects ranging from startups to
              enterprise applications.
            </p>
            <p>
              I specialize in building scalable, accessible, and
              user-centered applications using modern technologies. I believe
              great software should be fast, maintainable, and delightful to
              use.
            </p>
            <p>
              When I&apos;m not coding, you&apos;ll find me contributing to open-source
              projects, writing technical articles, or exploring the latest web
              technologies.
            </p>
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                Technologies I work with:
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {[
                  "JavaScript (ES6+)",
                  "TypeScript",
                  "React & Next.js",
                  "Vue.js",
                  "Tailwind CSS",
                  "Node.js",
                  "GraphQL",
                  "PostgreSQL",
                ].map((tech) => (
                  <li key={tech} className="flex items-center gap-2">
                    <span className="text-[var(--color-accent)]">▹</span>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 rounded-lg overflow-hidden bg-[var(--color-border)]/20 border border-[var(--color-border)]">
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-muted)]">
                <svg
                  className="w-32 h-32"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
