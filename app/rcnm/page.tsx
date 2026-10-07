import { ProjectSectionNav } from "@/components/4-organisms";
import {
  RcnmDatabaseArchitecture,
  RcnmStageLighting,
  RcnmVideoProduction,
  RcnmVisualIdentity,
} from "@/components/5-sections";
import { ProjectPageContainer } from "@/components/6-pages";

export default function RcnmPage() {
  const rcnmSections = [
    {
      id: "database-architecture",
      fullNavLabel: "Database Architecture",
      shortNavLabel: "Database",
    },
    {
      id: "visual-identity",
      fullNavLabel: "Visual Identity",
      shortNavLabel: "Identity",
    },
    {
      id: "stage-lighting",
      fullNavLabel: "Stage & Lighting",
      shortNavLabel: "Stage",
    },
    {
      id: "video-production",
      fullNavLabel: "Video Production",
      shortNavLabel: "Video",
    },
  ];

  return (
    <ProjectPageContainer projectId="rcnm">
      <ProjectSectionNav
        projectId="rcnm"
        sectionIds={rcnmSections.map((section) => section.id)}
        fullLabels={rcnmSections.map((section) => section.fullNavLabel)}
        shortLabels={rcnmSections.map((section) => section.shortNavLabel)}
      />
      <RcnmDatabaseArchitecture id="database-architecture" />
      <RcnmVisualIdentity id="visual-identity" />
      <RcnmStageLighting id="stage-lighting" />
      <RcnmVideoProduction id="video-production" />
    </ProjectPageContainer>
  );
}
