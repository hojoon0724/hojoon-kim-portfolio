import {
  ProjectOverviewData,
  projectOverviewData,
} from "@/data/project-overview-data";

interface ProjectPageSnapContainerProps {
  projectId: string;
  children: React.ReactNode;
}

export function ProjectPageSnapContainer({
  projectId,
  children,
}: ProjectPageSnapContainerProps) {
  const projectData = projectOverviewData.find(
    (project: ProjectOverviewData) => project.id === projectId,
  );
  return (
    // the height and overflow make this the element that scrolls. without them the window scrolls and nothing snaps
    <div
      className={`${projectId}-page-container flex h-dvh w-full snap-y snap-mandatory flex-col items-center justify-start overflow-y-auto ${projectData?.backgroundClassName} ${projectData?.textColorClassName}`}
      data-snap-container
    >
      {children}
    </div>
  );
}
