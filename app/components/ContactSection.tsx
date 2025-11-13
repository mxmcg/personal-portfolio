"use client";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          Contact
        </h2>
      </div>
      <div>
        <h2 className="mb-4 text-3xl font-bold text-slate-200 sm:text-4xl md:text-5xl">
          Let&apos;s Connect
        </h2>
        <p className="mb-8 max-w-md leading-relaxed">
          Whether you&apos;re looking for a technical architect, need help with a challenging project,
          or just want to chat about React Native, headless CMS, or the latest in AI development —
          I&apos;m always open to interesting conversations and opportunities.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:maxmcgeedev@gmail.com"
            className="inline-flex items-center gap-2 rounded border border-teal-300 px-7 py-4 font-mono text-sm text-teal-300 transition-all hover:bg-teal-400/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
              <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
            </svg>
            Email Me
          </a>
          <a
            href="https://www.linkedin.com/in/mxmcg/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-slate-600 px-7 py-4 font-mono text-sm text-slate-400 transition-all hover:border-teal-300 hover:text-teal-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
            LinkedIn
          </a>
        </div>
        <p className="mt-8 text-sm text-slate-500">
          Based in San Diego, CA
        </p>
      </div>
    </section>
  );
}
