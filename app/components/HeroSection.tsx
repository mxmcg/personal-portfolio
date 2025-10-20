"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="mb-5 text-base font-mono text-[var(--color-accent)]">
          Hi, my name is
        </p>
        <h1 className="mb-2 text-5xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-7xl">
          Max Example.
        </h1>
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-[var(--color-muted)] sm:text-5xl lg:text-6xl">
          I build things for the web.
        </h2>
        <p className="mb-12 max-w-lg text-lg leading-relaxed text-[var(--color-muted)]">
          I&apos;m a software engineer specializing in building (and occasionally
          designing) exceptional digital experiences. Currently, I&apos;m focused on
          building accessible, human-centered products.
        </p>
        <a
          href="#projects"
          className="inline-block rounded border border-[var(--color-accent)] px-7 py-4 font-mono text-sm text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)]/10"
        >
          Check out my work!
        </a>
      </motion.div>
    </section>
  );
}
