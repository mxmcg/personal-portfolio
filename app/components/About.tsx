import Image from "next/image";
import { site } from "@/content/site";

export function About() {
  return (
    <section className="sec" id="about" aria-labelledby="about-heading">
      <div className="about-grid">
        <div>
          <h2 id="about-heading">About</h2>
          <p className="about-copy">{site.about}</p>
        </div>
        <Image
          src={site.photo.src}
          alt={site.photo.alt}
          width={site.photo.width}
          height={site.photo.height}
          sizes="112px"
          className="about-photo"
        />
      </div>
    </section>
  );
}
