"use client";

import { Icon, Section } from "@/components/1-atoms";
import { ProjectIntro, ProjectVitals } from "@/components/4-organisms";
import type { ProjectOverviewData } from "@/data";
import { projectOverviewData } from "@/data";
import { useEffect, useRef, useState } from "react";

interface ProjectOverviewProps {
  projectId: string;
}

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  const projectData = projectOverviewData.find(
    (project: ProjectOverviewData) => project.id === projectId,
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timeoutId: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = window.setTimeout(() => {
            setStartAnimation(true);
          }, 120);
          return;
        }

        if (timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutId = undefined;
        }
        setStartAnimation(false);
      },
      { threshold: 0.5 },
    );

    observer.observe(el);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      observer.disconnect();
    };
  }, []);

  if (!projectData) {
    return null;
  }
  return (
    <Section
      className={`project-overview-container ${projectId} flex h-dvh w-screen shrink-0 snap-x snap-mandatory snap-start flex-row items-center justify-start overflow-x-scroll`}
      data-snap-container
      fullWidth
      id={projectId}
    >
      <div
        ref={sectionRef}
        className={`${projectData.id}-slide-1 p-md gap-md flex h-dvh w-screen shrink-0 snap-start flex-col items-start justify-center ${projectData.backgroundClassName} ${projectData.textColorClassName}`}
        data-snap-target
      >
        <div className="content-container gap-lg mx-auto flex w-full max-w-4xl flex-col items-start justify-between md:flex-row md:items-center">
          <ProjectIntro
            projectOverviewData={projectData}
            startAnimation={startAnimation}
          />
          <div
            className={`icon-container flex h-24 w-full justify-end md:w-24 ${projectData.textColorClassName} ${startAnimation ? "animation-fade-in-up-16 [animation-delay:800ms]" : "opacity-0"}`}
          >
            <Icon
              icon="arrow.arrow-right"
              className={`${projectData.textColorClassName}`}
            />
          </div>
        </div>
      </div>

      {/* first scrolled */}
      <ProjectVitals project={projectData} />

      {/* second scrolled */}
      <div
        className={`detail-1 p-md gap-md flex h-dvh w-screen shrink-0 snap-start flex-col items-start justify-center ${projectData.backgroundClassName} ${projectData.textColorClassName}`}
        data-snap-target
      >
        detail stuff here
      </div>
    </Section>
  );
}
