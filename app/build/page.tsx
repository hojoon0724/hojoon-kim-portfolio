"use client";

import { EnsrqBarrelRollBrochure } from "@/components/5-sections";
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
      <EnsrqBarrelRollBrochure/>
    </>
  );
}
