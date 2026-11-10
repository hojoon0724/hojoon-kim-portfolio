"use client";

import { useNow } from "@/demos/moindi/hooks/use-now";
import { countdownEndDate } from "@/demos/moindi/lib/countdown";
import { projectUrl } from "@/demos/moindi/lib/format";
import type { ProjectInterface } from "@/demos/moindi/types";
import { CollapsibleParagraph } from "./CollapsibleParagraph";
import { ImageContainer } from "./ImageContainer";
import { LinkButton } from "./LinkButton";
import { ProjectHeader } from "./ProjectHeader";
import { StakeBreakdown } from "./StakeBreakdown";

// an artist's active round: countdown header, cover and description, then the goal and share split beside it
export function CurrentProjectBlock({
  project,
  className = "",
}: {
  project: ProjectInterface;
  className?: string;
}) {
  const now = useNow();
  const isProjectEnded = now !== null && countdownEndDate() < now;

  return (
    <div
      className={`current-project-block mx-auto grid w-full grid-cols-1 border ${className}`}
    >
      <ProjectHeader title="Active Contract" />
      <div className="current-project-block__main grid w-full grid-cols-1 lg:grid-cols-[1fr_min(320px,30%)]">
        <div className="current-project-block__info col-span-1 grid w-full grid-cols-1 gap-(--standard-space) border p-(--standard-space) md:grid-cols-5">
          <ImageContainer
            className="col-span-full md:col-span-2"
            srcSet={project.heroSrcSet}
            description={`${project.title} album cover`}
          />
          <div className="current-project-block__info col-span-1 flex h-full flex-col justify-between md:col-span-3">
            <div className="current-project-block__info__title-description-container flex h-full w-full flex-col justify-between">
              <h3 className="current-project-block__name space-grotesk font-medium tracking-tight">
                {project.title}
              </h3>
              <CollapsibleParagraph maxLines={6}>
                <p className="current-project-block__description">
                  {project.description}
                </p>
              </CollapsibleParagraph>
            </div>
          </div>
        </div>
        <div className="current-project-block__deal col-span-1 flex h-full flex-col justify-between border p-(--standard-space)">
          <div className="current-project-block__deal__goal-container bg-(--secondary-500)">
            <div className="current-project-block__deal__goal-label space-mono w-full p-2 px-6 text-center text-lg">
              Goal: ${project.projectGoal.toLocaleString()}
            </div>
          </div>
          <div className="current-project-block__deal__split-graph-container flex flex-col items-center">
            <div className="current-project-block__deal__split-graph-label space-grotesk p-2 text-xl">
              Split
            </div>
            <StakeBreakdown className="w-full" project={project} small />
            <LinkButton
              className="mt-4 w-full"
              href={projectUrl(project.id)}
              color={isProjectEnded ? "tertiary" : "primary"}
            >
              View Project
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
