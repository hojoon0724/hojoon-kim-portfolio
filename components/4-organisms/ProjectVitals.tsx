import type { ProjectOverviewData } from "@/data";
import Image from "next/image";

interface ProjectVitalsProps {
  project: ProjectOverviewData;
}

export function ProjectVitals({ project }: ProjectVitalsProps) {
  return (
    <div
      className={`detail-1 gap-md flex h-dvh w-screen shrink-0 snap-start flex-col items-start justify-start ${project.backgroundClassName} ${project.textColorClassName}`}
      data-snap-target
    >
      <div className="hero-image-container relative aspect-square w-full bg-black/30 md:aspect-video">
        {project.heroImage !== "" && (
          <Image
            src={project.heroImage}
            alt={project.name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="project-contents-container flex h-full w-full flex-col items-center justify-start border max-w-7xl mx-auto">
        <div className="longer-description-container max-w-prose text-balance text-left">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia corporis, error consectetur beatae aut, ipsum vel quis architecto cum optio deserunt dolor, id soluta fugit. Excepturi maiores ipsa obcaecati voluptates.
        </div>
        <div className="role-container">
          <h3>Role</h3>
          <p>{project.role}</p>
        </div>
        <div className="scope-list-container flex w-full flex-col items-start justify-start gap-md">
          <h3>Scope</h3>
          <ul className="scope-list flex flex-col items-start justify-start">
            {project.categories.map((category) => (
              <li key={category} className="scope-list-item">
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
