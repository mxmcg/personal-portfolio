import Image from "next/image";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

export function About() {
  return (
    <section className="sec" id="about" aria-labelledby="about-heading">
      <Image
        src={site.photo.src}
        alt={site.photo.alt}
        width={site.photo.width}
        height={site.photo.height}
        sizes="140px"
        className="about-photo"
      />
      <h2 id="about-heading">About</h2>
      <p className="about-copy">{site.about}</p>
      <p className="xlabel">Skills</p>
      <ul className="tags" aria-label="Skills">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}
