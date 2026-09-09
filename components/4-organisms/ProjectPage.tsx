import { FullScreenSlide } from "@/components/2-molecules";
import { projectOverviewData } from "@/data";

interface ProjectPageProps {
  projectId: string;
}

export function ProjectPage({ projectId }: ProjectPageProps) {
  const projectData = projectOverviewData.find(
    (project) => project.id === projectId,
  ) || { backgroundClassName: "", textColorClassName: "" };
  const animationKey = `${projectId}-project-page`;

  return (
    <FullScreenSlide
      backgroundClassName={projectData.backgroundClassName}
      textColorClassName={projectData.textColorClassName}
      data-animation-key={animationKey}
      data-snap-target
    >
      <div className="project-container font-mono text-2xl m-auto">{projectId} project page</div>
    </FullScreenSlide>
  );
}
