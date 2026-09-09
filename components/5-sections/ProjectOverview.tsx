"use client";

import { useScrollContext } from "@/app/ScrollProvider";
import { Icon, Section } from "@/components/1-atoms";
import {
  ExpandedProjectSummary,
  ProjectIntro,
  ProjectPage,
} from "@/components/4-organisms";
import type { ProjectOverviewData } from "@/data";
import { projectOverviewData } from "@/data";

interface ProjectOverviewProps {
  projectId: string;
}

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  const projectData = projectOverviewData.find(
    (project: ProjectOverviewData) => project.id === projectId,
  );
  const { activeTargetKey } = useScrollContext();

  if (!projectData) {
    return null;
  }
  const introAnimationKey = `${projectData.id}-intro`;
  const startAnimation = activeTargetKey === introAnimationKey;

  return (
    <Section
      className={`project-overview-container ${projectId} flex h-dvh w-screen shrink-0 snap-x snap-mandatory snap-start flex-row items-center justify-start overflow-x-scroll`}
      data-snap-container
      fullWidth
      id={projectId}
    >
      <div
        className={`${projectData.id}-slide-1 p-md gap-md flex h-dvh w-screen shrink-0 snap-start flex-col items-start justify-center ${projectData.backgroundClassName} ${projectData.textColorClassName}`}
        data-animation-key={introAnimationKey}
        data-snap-target
      >
        <div className="content-container gap-lg mx-auto flex w-full max-w-4xl flex-col items-start justify-between md:flex-row md:items-center">
          <ProjectIntro projectOverviewData={projectData} />
          <div
            className={`icon-container flex h-24 w-full justify-end md:w-24 ${projectData.textColorClassName} ${startAnimation ? "animation-fade-in-up-16 cursor-pointer [animation-delay:800ms]" : "opacity-0"}`}
            onClick={() => {
              const nextSlide = document.querySelector(
                `#${projectId} [data-animation-key="${projectData.id}-expanded-summary"]`,
              );
              if (nextSlide) {
                nextSlide.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <Icon
              icon="arrowRight"
              className={`${projectData.textColorClassName}`}
            />
          </div>
        </div>
      </div>

      {/* Expanded Project Summary */}
      <ExpandedProjectSummary
        key={`${projectData.id}-expanded-summary`}
        project={projectData}
      />

      {/* Project Page */}
      <ProjectPage
        key={`${projectData.id}-project-page`}
        projectId={projectId}
      />
    </Section>
  );
}
