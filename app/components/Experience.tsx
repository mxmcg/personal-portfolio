import { experience } from "@/content/experience";
import { Entry } from "./Entry";

export function Experience() {
  return (
    <section
      className="sec"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <h2 id="experience-heading">Experience</h2>
      {experience.map((group) => (
        <div key={group.id}>
          <p className="xlabel">{group.label}</p>
          <ul className="entry-list">
            {group.entries.map((entry) => (
              <li key={entry.id}>
                <Entry
                  title={entry.title}
                  period={entry.period}
                  summary={entry.summary}
                  tags={entry.tags}
                  draft={entry.draft}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
