"use client";

import { useScrollContext } from "@/app/ScrollProvider";
import {
  Icon,
  MarkdownRenderer,
  StaggeredReveal,
  ToolIcon,
} from "@/components/1-atoms";
import { FullScreenSlide } from "@/components/2-molecules";

import { AutoAdvanceCarousel } from "@/components/3-compounds";
import type { ProjectOverviewData } from "@/data";
import { toolsList } from "@/data";

export function ExpandedProjectSummary({
  project,
}: {
  project: ProjectOverviewData;
}) {
  const { activeTargetKey } = useScrollContext();
  const animationKey = `${project.id}-expanded-summary`;

  const projectVitals: { key: string; value: string }[] = [
    ...(project.projectVitals ?? []),
  ];

  const storyContent = {
    storyMd: project.storyMd ?? "",
    calloutMd: project.calloutMd ?? "",
  };

  const storyAnimationDelayMs = projectVitals.length * 100;

  return (
    <>
      <FullScreenSlide
        backgroundClassName={project.backgroundClassName}
        textColorClassName={project.textColorClassName}
        data-animation-key={animationKey}
        data-snap-target
      >
        <div className="expanded-summary-container relative mx-auto my-auto grid h-full min-h-dvh w-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_auto] xl:grid-rows-1">
          <StaggeredReveal
            className="background-slideshow-container p-md relative z-10 aspect-4/3 w-full pb-0 drop-shadow-[0px_6px_6px_rgba(0,0,0,0.5)] md:aspect-5/3 md:p-0 xl:aspect-auto"
            delayMs={100}
            resetOnLeave={false}
            threshold={0}
          >
            <AutoAdvanceCarousel
              imageArray={project.imageArray.map(
                (img) => `/test-numbers/${project.id}/${img}`,
              )}
              pause={activeTargetKey !== animationKey}
              
              indicatorBgClassName={project.backgroundClassName}
            />
          </StaggeredReveal>
          <div className="content-container p-md mx-auto flex w-full max-w-4xl flex-col justify-start overflow-scroll xl:my-auto">
            <StaggeredReveal
              className="project-vitals-table pb-lg mb-2xl gap-md flex flex-col"
              delayMs={0}
              resetOnLeave={false}
              threshold={0}
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
              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div className="tools-used-container flex flex-row">
                  <div className="project-vitals-label w-[12ch] shrink-0 text-base leading-relaxed font-semibold md:text-lg">
                    Tools:
                  </div>

                  <StaggeredReveal
                    className="tools-container flex flex-row flex-wrap"
                    delayMs={storyAnimationDelayMs / 2}
                    resetOnLeave={false}
                    threshold={0}
                  >
                    {project.toolsUsed.map((tool) => {
                      const toolData = toolsList.find((t) => t.id === tool);
                      if (!toolData) return tool;
                      return (
                        <ToolIcon
                          key={`${project.id}-${toolData.id}`}
                          toolId={toolData.id}
                          pixelSize={48}
                        />
                      );
                    })}
                  </StaggeredReveal>
                </div>
              )}
            </StaggeredReveal>

            <>
              <div
                className={`story-text-container gap-md grid w-full grid-cols-1 items-center justify-center md:grid-cols-[auto_1fr]`}
              >
                <div className="story-container gap-md flex max-w-prose flex-col text-base text-pretty">
                  <MarkdownRenderer
                    content={storyContent.storyMd}
                    animate={true}
                    finishByMs={500}
                    threshold={0}
                  />
                </div>

                {storyContent.calloutMd ? (
                  <StaggeredReveal
                    className="h-full"
                    delayMs={storyAnimationDelayMs}
                    resetOnLeave={false}
                    threshold={0}
                  >
                    <div className="challenge-text-container roboto-narrow py-md flex h-full items-center justify-center border-y text-center text-2xl font-light text-balance md:min-w-[20ch] md:text-3xl">
                      {storyContent.calloutMd}
                    </div>
                  </StaggeredReveal>
                ) : null}
              </div>
            </>

            <div
              className="continue p-3xl gap-md flex w-full items-center justify-end"
              onClick={() => {
                const nextSlide = document.querySelector(
                  `#${project.id} [data-animation-key="${project.id}-project-page"]`,
                );
                if (nextSlide) {
                  nextSlide.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <StaggeredReveal
                className="gap-md flex items-center"
                delayMs={storyAnimationDelayMs}
                resetOnLeave={false}
                threshold={0}
              >
                <div className="label font-mono">Continue</div>
                <div className="flex aspect-square h-16 w-16 items-center justify-center">
                  <Icon icon="arrowRight" />
                </div>
              </StaggeredReveal>
            </div>
          </div>
        </div>
      </FullScreenSlide>
    </>
  );
}
