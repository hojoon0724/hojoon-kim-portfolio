"use client";

import { useScrollContext } from "@/app/ScrollProvider";
import { StaggeredReveal, StaggeredTextReveal } from "@/components/1-atoms";
import { FullScreenSlide } from "@/components/2-molecules";
import type { ProjectOverviewData } from "@/data";

export function ExpandedProjectSummary({
  project,
}: {
  project: ProjectOverviewData;
}) {
  const { activeTargetKey } = useScrollContext();
  const animationKey = `${project.id}-expanded-summary`;
  const startAnimation = activeTargetKey === animationKey;

  const projectVitals: { key: string; value: string }[] = [
    ...(project.projectVitals ?? []),
  ];

  const storyContent = {
    storyMd: project.storyMd ?? "",
    calloutMd: project.calloutMd ?? "",
  };

  const storyAnimationDelayMs = projectVitals.length * 100;

  return (
    <FullScreenSlide
      backgroundClassName={project.backgroundClassName}
      textColorClassName={project.textColorClassName}
      data-animation-key={animationKey}
      data-snap-target
    >
      <div className="expanded-summary-container gap-lg mx-auto my-auto flex w-full max-w-4xl flex-col items-center justify-start overflow-scroll">
        {/* <div className="absolute top-24 left-24">{JSON.stringify({ activeTargetKey })}</div> */}
        <div className="content-container p-md w-full">
          <StaggeredReveal
            className="project-vitals-table pb-lg mb-2xl gap-md flex flex-col"
            delayMs={0}
          >
            {projectVitals.map(({ key, value }) => (
              <div
                key={`${project.id}-${key}`}
                className={`project-vitals-row flex flex-row items-baseline`}
              >
                <div className="project-vitals-label w-[12ch] shrink-0 text-base leading-relaxed font-semibold md:text-lg">
                  {key}:
                </div>
                <div className="project-vitals-value w-full max-w-prose text-base leading-snug text-pretty md:text-lg">
                  {value}
                </div>
              </div>
            ))}
          </StaggeredReveal>

          {storyContent.storyMd && (
            <>
              <div
                className={`story-text-container gap-md grid w-full grid-cols-1 items-center justify-center md:grid-cols-[auto_1fr]`}
              >
                <StaggeredTextReveal
                  className="story-text gap-md flex max-w-prose flex-col text-base text-pretty"
                  revealBy="word"
                  delayMs={storyAnimationDelayMs}
                  finishByMs={1000}
                  text={storyContent.storyMd}
                  isMarkdown
                />

                {storyContent.calloutMd ? (
                  <StaggeredReveal className="h-full" delayMs={storyAnimationDelayMs}>
                    <div className="challenge-text-container roboto-narrow py-md border-y h-full text-center text-2xl font-light text-balance md:text-3xl flex justify-center items-center">
                      {storyContent.calloutMd}
                    </div>
                  </StaggeredReveal>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </FullScreenSlide>
  );
}
