import { RevealParagraph } from "@/components/1-atoms";
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
      <div className="h-dvh w-full bg-amber-100"></div>
      <div className="mx-auto flex h-dvh w-full max-w-4xl items-center justify-center">
        <RevealParagraph
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          revealBy="word"
          className="p-xl text-4xl"
          startAt={0.8}
          endAt={0.5}
        ></RevealParagraph>
        <RevealParagraph
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          revealBy="letter"
          className="p-xl text-4xl"
          startAt={0.8}
          endAt={0.5}
        ></RevealParagraph>
      </div>
      <div className="h-dvh w-full bg-amber-100"></div>
      <ExpandedProjectSummary key={projectData.id} project={projectData} />
    </>
  );
}
