"use client";

import { useScrollContext } from "@/app/ScrollProvider";
import { Markdown } from "@/components/1-atoms";
import { FullScreenSlide } from "@/components/2-molecules";
import type { ProjectOverviewData } from "@/data";

export function ExpandedProjectSummary({
  project,
}: {
  project: ProjectOverviewData;
}) {
  const { activeTargetKey } = useScrollContext();
  const animationKey = `${project.id}-summary`;
  const startAnimation = activeTargetKey === animationKey;

  const projectVitals: { key: string; value: string }[] = [
    { key: "Who", value: project.name },
    ...(project.projectVitals ?? []),
  ];

  const storyContent = {
    storyMd: project.storyMd ?? "",
    calloutMd: project.calloutMd ?? "",
  };

  return (
    <FullScreenSlide
      backgroundClassName={project.backgroundClassName}
      textColorClassName={project.textColorClassName}
      data-animation-key={animationKey}
      data-snap-target
    >
      <div className="expanded-summary-container gap-lg mx-auto my-auto flex w-full max-w-4xl flex-col items-center justify-start overflow-scroll">
        <div className="content-container p-md w-full">
          <div className="project-vitals-table pb-lg mb-2xl">
            {projectVitals.map(({ key, value }, index) => (
              <div
                key={`${project.id}-${key}`}
                className={`project-vitals-row flex flex-row items-baseline ${startAnimation ? `animation-fade-in-up-16` : "opacity-0"}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="project-vitals-label w-[12ch] shrink-0 text-base leading-relaxed font-semibold md:text-lg">
                  {key}:
                </div>
                <div className="project-vitals-value w-full max-w-prose text-base leading-snug text-pretty md:text-lg">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {storyContent.storyMd && (
            <div
              className={`story-text-container gap-md grid w-full grid-cols-1 items-center justify-center md:grid-cols-[auto_1fr] ${startAnimation ? `animation-fade-in-up-16 animation-1000` : "opacity-0"}`}
              style={{
                animationDelay: `${(projectVitals.length + 2) * 100}ms`,
              }}
            >
              <div className="story-section-title roboto-wide col-span-1 text-xl font-bold md:text-2xl">
                The Story
              </div>

              {/* <ScrollRevealText
                className="story-text text gap-md flex max-w-prose flex-col text-base text-pretty md:order-3"
                revealBy="word"
                delayMs={0}
                staggerMs={10}
                text={storyContent.storyMd}
              /> */}

              <Markdown className="text gap-md flex max-w-prose flex-col text-base text-pretty md:order-3">
                {storyContent.storyMd}
              </Markdown>

              {storyContent.calloutMd ? (
                <div className="challenge-text-container roboto-narrow py-md border-y text-center text-2xl font-light text-balance md:order-2 md:row-span-2 md:text-3xl">
                  {storyContent.calloutMd}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </FullScreenSlide>
  );
}
