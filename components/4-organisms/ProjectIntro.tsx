import { StaggeredReveal, StaggeredTextReveal } from "@/components/1-atoms";
import type { ProjectOverviewData } from "@/data";
import Image from "next/image";

interface ProjectIntroProps {
  projectOverviewData: ProjectOverviewData;
  // startAnimation: boolean;
}

export function ProjectIntro({ projectOverviewData }: ProjectIntroProps) {
  return (
    <div className="logo-text-container flex-col items-start justify-center">
      <StaggeredReveal
        className={`logo-container p-md my-2xl relative flex h-30 w-[75%] max-w-96 items-center justify-center ${projectOverviewData.textColorClassName}`}
        resetOnLeave={true}
      >
        <Image
          src={`/logos/${projectOverviewData.logoFileName}`}
          alt={`${projectOverviewData.name} Logo`}
          fill
          sizes="(max-width: 768px) 50vw, 384px"
          className="object-contain object-left"
          loading="eager"
        />
      </StaggeredReveal>
      <div className="role-tag-container mb-lg text-left text-balance opacity-100">
        <StaggeredTextReveal
          text={projectOverviewData.roleTag}
          className="role-tag roboto-narrow text-xl font-bold md:text-2xl"
          resetOnLeave={true}
        />
      </div>
      <div className="description-container max-w-prose text-left text-balance opacity-80">
        <StaggeredTextReveal
          className="description text-base text-balance"
          text={projectOverviewData.description}
          finishByMs={1000}
          resetOnLeave={true}
        />
      </div>
      <StaggeredReveal
        className="categories-container mt-xl -ml-1 flex flex-wrap"
        delayMs={500}
        finishByMs={1000}
        resetOnLeave={true}
      >
        {projectOverviewData.categories.map((category) => (
          <div key={category} className="category-chip-container">
            <span
              className={`roboto-narrow mr-2 mb-2 inline-block rounded-full bg-white px-3 py-1 text-sm font-semibold text-black opacity-70`}
            >
              {category}
            </span>
          </div>
        ))}
      </StaggeredReveal>
    </div>
  );
}
