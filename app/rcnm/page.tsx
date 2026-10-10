import {
  ProjectPageSnapContainer,
  ProjectSectionNav,
} from "@/components/4-organisms";
import {
  RcnmDatabaseIntro,
  RcnmDatabaseOutro,
  RcnmDatabaseStory,
  RcnmLightingVideo,
  RcnmVisualIdentity,
  RcnmFounding,
} from "@/components/5-sections";
import { databaseStory } from "@/data/rcnm-db-data-masked/fixed-data";

export default function RcnmPage() {
  const rcnmSections = [
    {
      id: "founding",
      fullNavLabel: "Founding",
      shortNavLabel: "Founding",
    },
    {
      id: "database-architecture",
      fullNavLabel: "Database Architecture",
      shortNavLabel: "Database",
    },
    {
      id: "lighting-video",
      fullNavLabel: "Lighting & Video",
      shortNavLabel: "Stage",
    },
    {
      id: "brand",
      fullNavLabel: "Visual Identity",
      shortNavLabel: "Brand",
    },
  ];

  return (
    <ProjectPageSnapContainer projectId="rcnm">
      <ProjectSectionNav
        projectId="rcnm"
        sectionIds={rcnmSections.map((section) => section.id)}
        fullLabels={rcnmSections.map((section) => section.fullNavLabel)}
        shortLabels={rcnmSections.map((section) => section.shortNavLabel)}
      />

      {/* founding: an opening strip, deliberately left out of the nav */}
      <RcnmFounding id="founding" />

      {/* database showcase */}
      <RcnmDatabaseIntro id="database-architecture" />
      <RcnmDatabaseStory id="database-story" story={databaseStory} />
      <RcnmDatabaseOutro id="database-outro" />

      {/* lighting and video  */}
      <RcnmLightingVideo id="lighting-video" />

      {/* brand */}
      <RcnmVisualIdentity id="brand" />
    </ProjectPageSnapContainer>
  );
}
