"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function Contact() {
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
      id="contact"
      ref={sectionRef}
      className="max-w-[880px] mx-auto px-6 py-20"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-[600px] mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4 text-[var(--foreground)]">
          Get In Touch
        </h2>
        <p className="text-[var(--color-muted)] mb-8">
          I&apos;m currently open to new opportunities and interesting projects.
          Whether you have a question or just want to say hi, I&apos;ll do my best
          to get back to you!
        </p>
        <a
          href="mailto:max@example.com"
          className="inline-block px-7 py-4 border border-[var(--color-accent)] text-[var(--color-accent)] rounded hover:bg-[var(--color-accent)]/10 transition-all font-mono text-sm"
        >
          Say Hello
        </a>
      </motion.div>
    </section>
  );
}
