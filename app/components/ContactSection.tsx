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
        <h2 className="mb-4 text-5xl font-bold text-slate-200">
          Get In Touch
        </h2>
        <p className="mb-8 max-w-md">
          I&apos;m currently looking for new opportunities. Whether you have a
          question or just want to say hi, my inbox is always open. I&apos;ll try my
          best to get back to you!
        </p>
        <a
          href="mailto:max@example.com"
          className="inline-block rounded border border-teal-300 px-7 py-4 font-mono text-sm text-teal-300 transition-all hover:bg-teal-400/10"
        >
          Say Hello
        </a>
      </div>
    </section>
  );
}
