"use client";

const experiences = [
  {
    period: "2021 — Present",
    title: "Senior Front-End Engineer",
    company: "Example Tech",
    companyUrl: "#",
    description:
      "Build and maintain critical components used to construct Example Tech's frontend. Work closely with cross-functional teams to implement user-facing features and improve overall user experience.",
    technologies: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "GraphQL",
    ],
  },
  {
    period: "2019 — 2021",
    title: "Front-End Developer",
    company: "Digital Agency Co",
    companyUrl: "#",
    description:
      "Developed and shipped highly interactive web applications for clients including major brands. Collaborated with designers and backend engineers to deliver pixel-perfect implementations.",
    technologies: ["JavaScript", "React", "Vue.js", "SCSS", "Node.js"],
  },
  {
    period: "2016 — 2019",
    title: "Junior Developer",
    company: "StartupXYZ",
    companyUrl: "#",
    description:
      "Started my journey in web development building features for an early-stage startup. Learned modern development practices and contributed to the company's growth from 5 to 50 employees.",
    technologies: ["HTML", "CSS", "JavaScript", "jQuery", "WordPress"],
  },
];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-[var(--background)]/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)] lg:sr-only">
          Experience
        </h2>
      </div>
      <div>
        <ol className="group/list">
          {experiences.map((exp, index) => (
            <li key={index} className="mb-12">
              <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] sm:col-span-2">
                  {exp.period}
                </header>
                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-[var(--foreground)]">
                    <div>
                      <a
                        className="inline-flex items-baseline font-medium leading-tight text-[var(--foreground)] hover:text-[var(--color-accent)] focus-visible:text-[var(--color-accent)] group/link text-base"
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${exp.title} at ${exp.company}`}
                      >
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                        <span>
                          {exp.title} ·{" "}
                          <span className="inline-block">
                            {exp.company}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </span>
                      </a>
                    </div>
                  </h3>
                  <p className="mt-2 text-sm leading-normal text-[var(--color-muted)]">
                    {exp.description}
                  </p>
                  <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    {exp.technologies.map((tech) => (
                      <li key={tech} className="mr-1.5 mt-2">
                        <div className="flex items-center rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium leading-5 text-[var(--color-accent)]">
                          {tech}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <a
            className="inline-flex items-baseline font-medium leading-tight text-[var(--foreground)] hover:text-[var(--color-accent)] focus-visible:text-[var(--color-accent)] group/link text-base"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="View Full Resume"
          >
            <span>
              View Full{" "}
              <span className="inline-block">
                Resume
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
