"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-[880px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[var(--color-accent)] font-mono text-sm mb-5">
            Hi, my name is
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-[var(--foreground)]">
            Max Example.
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-[var(--color-muted)]">
            I build fast, maintainable, user-focused web apps.
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-[540px] mb-10 leading-relaxed">
            I&apos;m a senior front-end engineer specializing in building exceptional
            digital experiences. Currently focused on creating accessible,
            performant web applications with modern technologies.
          </p>
          <a
            href="#projects"
            className="inline-block px-7 py-4 border border-[var(--color-accent)] text-[var(--color-accent)] rounded hover:bg-[var(--color-accent)]/10 transition-all font-mono text-sm"
          >
            View my work
          </a>
        </motion.div>
      </div>
    </section>
  );
}
