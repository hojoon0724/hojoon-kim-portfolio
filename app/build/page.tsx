import { ScrollRevealText } from "@/components/1-atoms";
import { FullScreenSlide } from "@/components/2-molecules/";
import { ExpandedProjectSummary } from "@/components/4-organisms";
import { projectOverviewData } from "@/data";

const projectData = projectOverviewData.find(
  (project) => project.id === "ensrq",
);

export default function BuildPage() {
  if (!projectData) {
    return null;
  }
  return (
    <>
      <ExpandedProjectSummary key={projectData.id} project={projectData} />
      <FullScreenSlide className="flex h-dvh flex-col items-center justify-center border">
        <div className="flex h-full items-center justify-center">
          <ScrollRevealText
            className="h-full text-center text-4xl font-bold md:text-5xl"
            revealBy="word"
            text="Have an early product, a complex creative project, or an idea that needs to become real?"
          />
        </div>
      </FullScreenSlide>
      <FullScreenSlide className="flex h-dvh flex-col items-center justify-center border">
        <div className="flex h-full items-center justify-center">
          <ScrollRevealText
            className="h-full text-center text-4xl font-bold md:text-5xl"
            revealBy="word"
            text="Have an early product, a complex creative project, or an idea that needs to become real?"
          />
        </div>
        <ScrollRevealText
          className="h-full border text-center text-4xl font-bold md:text-5xl"
          revealBy="word"
          threshold={0.5}
          text="Have an early product, a complex creative project, or an idea that needs to become real?"
        />
      </FullScreenSlide>
    </>
  );
}
