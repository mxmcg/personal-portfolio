"use client";

import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <nav className="max-w-[880px] mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          className="text-xl font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          aria-label="Home"
        >
          ME
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#about"
            className="text-sm hover:text-[var(--color-accent)] transition-colors"
          >
            About
          </a>
          <a
            href="#projects"
            className="text-sm hover:text-[var(--color-accent)] transition-colors"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="text-sm hover:text-[var(--color-accent)] transition-colors"
          >
            Contact
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
