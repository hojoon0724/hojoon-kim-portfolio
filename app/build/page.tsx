import { ExpandedProjectSummary } from "@/components/5-sections";
import { projectOverviewData } from "@/data";

export default function BuildPage() {
  

  // if (!project) {
  //   return <div>Project not found</div>;
  // }
  return (
    <>
      {projectOverviewData.map((project) => (
        <ExpandedProjectSummary key={project.id} project={project} />
      ))}
    </>
  );
}
