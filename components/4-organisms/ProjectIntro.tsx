import { ScrollRevealText } from "@/components/1-atoms";
import type { ProjectOverviewData } from "@/data";
import Image from "next/image";

interface ProjectIntroProps {
  projectOverviewData: ProjectOverviewData;
  startAnimation: boolean;
}

export function ProjectIntro({
  projectOverviewData,
  startAnimation,
}: ProjectIntroProps) {
  return (
    <div className="logo-text-container flex-col items-start justify-center">
      <div
        className={`logo-container p-md my-2xl relative flex h-30 w-[75%] max-w-96 items-center justify-center ${projectOverviewData.textColorClassName} ${startAnimation ? "animation-fade-in-up-16" : "opacity-0"}`}
      >
        <Image
          src={`/logos/${projectOverviewData.logoFileName}`}
          alt={`${projectOverviewData.name} Logo`}
          fill
          sizes="(max-width: 768px) 50vw, 384px"
          className="object-contain object-left"
          loading="eager"
        />
      </div>
      <div className="role-tag-container mb-lg text-left text-balance opacity-100">
        <ScrollRevealText
          className="role-tag roboto-narrow text-xl font-bold md:text-2xl"
          text={projectOverviewData.roleTag}
        />
      </div>
      <div className="description-container max-w-prose text-left text-balance opacity-80">
        <ScrollRevealText
          className="description text-base"
          text={projectOverviewData.description}
          staggerMs={60}
        />
      </div>
      <ScrollRevealText
        className="categories-container mt-xl -ml-1 flex flex-wrap"
        staggerMs={90}
        delayMs={500}
      >
        {projectOverviewData.categories.map((category) => (
          <span
            key={category}
            className={`category-chip roboto-narrow mr-2 mb-2 inline-block rounded-full bg-white px-3 py-1 text-sm font-semibold text-black opacity-70`}
          >
            {category}
          </span>
        ))}
      </ScrollRevealText>
    </div>
  );
}
