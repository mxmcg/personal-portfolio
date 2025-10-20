"use client";

export function AboutSection() {
  return (
    <section
      id="about"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-[var(--background)]/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)] lg:sr-only">
          About
        </h2>
      </div>
      <div>
        <p className="mb-4 leading-relaxed text-[var(--color-muted)]">
          Back in 2016, I decided to try my hand at web development and tumbled
          head first into the rabbit hole of coding and web technologies. Fast
          forward to today, and I&apos;ve had the privilege of building software for
          a{" "}
          <a
            href="#"
            className="font-medium text-[var(--color-accent)] hover:underline focus-visible:underline"
          >
            startup
          </a>
          , an{" "}
          <a
            href="#"
            className="font-medium text-[var(--color-accent)] hover:underline focus-visible:underline"
          >
            agency
          </a>
          , and a{" "}
          <a
            href="#"
            className="font-medium text-[var(--color-accent)] hover:underline focus-visible:underline"
          >
            large corporation
          </a>
          .
        </p>
        <p className="mb-4 leading-relaxed text-[var(--color-muted)]">
          My main focus these days is building accessible, inclusive products
          and digital experiences. I most enjoy building software in the sweet
          spot where design and engineering meet — things that look good but are
          also built well under the hood.
        </p>
        <p className="mb-4 leading-relaxed text-[var(--color-muted)]">
          When I&apos;m not at the computer, I&apos;m usually rock climbing, reading,
          hanging out with my family, or running after my two cats.
        </p>
        <p className="leading-relaxed text-[var(--color-muted)]">
          Here are a few technologies I&apos;ve been working with recently:
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-[var(--color-muted)]">
          <li className="flex items-start">
            <span className="mr-2 text-[var(--color-accent)]">▹</span>
            <span className="font-mono">JavaScript (ES6+)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-[var(--color-accent)]">▹</span>
            <span className="font-mono">TypeScript</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-[var(--color-accent)]">▹</span>
            <span className="font-mono">React</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-[var(--color-accent)]">▹</span>
            <span className="font-mono">Next.js</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-[var(--color-accent)]">▹</span>
            <span className="font-mono">Node.js</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-[var(--color-accent)]">▹</span>
            <span className="font-mono">Tailwind CSS</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
