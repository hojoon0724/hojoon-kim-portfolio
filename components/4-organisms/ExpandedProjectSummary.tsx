"use client";

import { useScrollContext } from "@/app/ScrollProvider";
import {
  Icon,
  StaggeredReveal,
  StaggeredTextReveal,
  ToolIcon,
} from "@/components/1-atoms";
import { FullScreenSlide } from "@/components/2-molecules";

import { AutoAdvanceCarousel } from "@/components/3-compounds";
import type { ProjectOverviewData } from "@/data";
import { toolsList } from "@/data";
import Link from "next/link";

export function ExpandedProjectSummary({
  project,
}: {
  project: ProjectOverviewData;
}) {
  const { activeTargetKey } = useScrollContext();
  const animationKey = `${project.id}-expanded-summary`;
  const startAnimation = activeTargetKey === animationKey;
  const imageArray = [
    "/test-numbers/untitled-2-01.webp",
    "/test-numbers/untitled-2-02.webp",
    "/test-numbers/untitled-2-03.webp",
    "/test-numbers/untitled-2-04.webp",
    "/test-numbers/untitled-2-05.webp",
    "/test-numbers/untitled-2-06.webp",
    "/test-numbers/untitled-2-07.webp",
    "/test-numbers/untitled-2-08.webp",
    "/test-numbers/untitled-2-09.webp",
    "/test-numbers/untitled-2-10.webp",
    "/test-numbers/untitled-2-11.webp",
  ];

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
        {/* <div className="expanded-summary-container gap-md mx-auto my-auto flex min-h-screen w-full flex-col xl:flex-row overflow-scroll"> */}
        <div className="expanded-summary-container relative mx-auto my-auto grid h-full min-h-dvh w-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_auto] xl:grid-rows-1">
          <StaggeredReveal
            className="background-slideshow-container p-md relative aspect-4/3 w-full pb-0 md:aspect-5/3 md:p-0 drop-shadow-[0px_6px_6px_rgba(0,0,0,0.5)] xl:aspect-auto z-10 "
            delayMs={100}
            resetOnLeave={true}
            threshold={0}
          >
            <AutoAdvanceCarousel imageArray={imageArray} />
          </StaggeredReveal>
          <div className="content-container p-md mx-auto flex w-full max-w-4xl flex-col justify-start overflow-scroll xl:my-auto">
            <StaggeredReveal
              className="project-vitals-table pb-lg mb-2xl gap-md flex flex-col"
              delayMs={0}
              resetOnLeave={true}
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
                    resetOnLeave={true}
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
                <StaggeredTextReveal
                  className="story-text gap-md flex max-w-prose flex-col text-base text-pretty"
                  revealBy="word"
                  delayMs={storyAnimationDelayMs}
                  finishByMs={1000}
                  text={storyContent.storyMd}
                  threshold={0}
                  isMarkdown
                  resetOnLeave={true}
                />

                {storyContent.calloutMd ? (
                  <StaggeredReveal
                    className="h-full"
                    delayMs={storyAnimationDelayMs}
                    resetOnLeave={true}
                    threshold={0}
                  >
                    <div className="challenge-text-container roboto-narrow py-md flex h-full items-center justify-center border-y text-center text-2xl font-light text-balance md:min-w-[20ch] md:text-3xl">
                      {storyContent.calloutMd}
                    </div>
                  </StaggeredReveal>
                ) : null}
              </div>
            </>

            <div className="continue p-3xl flex w-full items-center justify-end gap-md" onClick={() => {
              const nextSlide = document.querySelector(
                `#${project.id} [data-animation-key="${project.id}-project-page"]`,
              );
              if (nextSlide) {
                nextSlide.scrollIntoView({ behavior: "smooth" });
              }
            }}>
            <StaggeredReveal
              className="flex items-center gap-md"
              delayMs={storyAnimationDelayMs}
              resetOnLeave={true}
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
