import { ProjectSectionNav } from "@/components/4-organisms";
import {
  MoindiBrand,
  MoindiCollaboration,
  MoindiConclusion,
  MoindiDemo,
  MoindiDesignInCode,
  MoindiThesis,
} from "@/components/5-sections";
import { ProjectPageSnapContainer } from "@/components/4-organisms";

export default function MoindiPage() {
  const moindiSections = [
    { id: "thesis", fullNavLabel: "Thesis", shortNavLabel: "Thesis" },
    {
      id: "no-handoff",
      fullNavLabel: "Design in Code",
      shortNavLabel: "Design",
    },
    {
      id: "collaboration",
      fullNavLabel: "Collaboration",
      shortNavLabel: "Collab",
    },
    { id: "demo", fullNavLabel: "Try It", shortNavLabel: "Try" },
    { id: "brand", fullNavLabel: "A Coder's Brand", shortNavLabel: "Brand" },
    { id: "conclusion", fullNavLabel: "One Loop", shortNavLabel: "Loop" },
  ];

  return (
    <ProjectPageSnapContainer projectId="moindi">
      <ProjectSectionNav
        projectId="moindi"
        sectionIds={moindiSections.map((section) => section.id)}
        fullLabels={moindiSections.map((section) => section.fullNavLabel)}
        shortLabels={moindiSections.map((section) => section.shortNavLabel)}
      />
      <MoindiThesis id="thesis" />
      <MoindiDesignInCode id="no-handoff" />
      <MoindiCollaboration id="collaboration" />
      <MoindiDemo id="demo" />
      <MoindiBrand id="brand" />
      <MoindiConclusion id="conclusion" />
    </ProjectPageSnapContainer>
  );
}
