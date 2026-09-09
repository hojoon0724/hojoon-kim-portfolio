"use client";

import { ExpandedProjectSummary } from "@/components/4-organisms";
import { projectOverviewData } from "@/data";

const projectData = projectOverviewData.find(
  (project) => project.id === "rcnm",
);

export default function BuildPage() {
  if (!projectData) {
    return null;
  }
  return (
    <>
    <div className="h-dvh"></div>
      <ExpandedProjectSummary key={projectData.id} project={projectData} />
    </>
  );
}
