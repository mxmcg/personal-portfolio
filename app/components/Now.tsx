import { site } from "@/content/site";

export function Now() {
  return (
    <section className="sec" aria-label="Now">
      <p className="nowline">
        <b>Now:</b> {site.now}
      </p>
    </section>
  );
}
