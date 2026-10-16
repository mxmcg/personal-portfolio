import { projects, projectsHeading } from "@/content/projects";
import { Entry } from "./Entry";

export function Projects() {
  return (
    <section className="sec" id="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">{projectsHeading}</h2>
      <ul className="entry-list">
        {projects.map((project) => (
          <li key={project.id}>
            <Entry
              title={project.title}
              summary={project.summary}
              tags={project.tags}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
