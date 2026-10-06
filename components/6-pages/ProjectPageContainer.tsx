import {
  ProjectOverviewData,
  projectOverviewData,
} from "@/data/project-overview-data";

interface ProjectPageContainerProps {
  projectId: string;
  children: React.ReactNode;
}

export function ProjectPageContainer({
  projectId,
  children,
}: ProjectPageContainerProps) {
  const projectData = projectOverviewData.find(
    (project: ProjectOverviewData) => project.id === projectId,
  );
  return (
    <div
      className={`${projectId}-page-container min-h-dvh ${projectData?.backgroundClassName} ${projectData?.textColorClassName}`}
      data-snap-target
    >
      {children}
    </div>
  );
}
