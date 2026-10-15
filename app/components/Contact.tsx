import { site } from "@/content/site";

export function Contact() {
  return (
    <section className="sec" id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{site.contactHeading}</h2>
      <p className="lede contact-copy">{site.contactBody}</p>
      <div className="text-links">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={site.linkedin.href} target="_blank" rel="noopener noreferrer">
          {site.linkedin.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
