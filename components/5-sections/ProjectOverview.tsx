"use client";

import { Icon, ScrollRevealText, Section } from "@/components/1-atoms";
import type { ProjectOverviewData } from "@/data";
import { projectOverviewData } from "@/data";
import Image from "next/image";
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
          <div className="logo-text-container flex-col items-start justify-center">
            <div
              className={`logo-container p-md my-2xl relative flex h-30 w-[75%] max-w-96 items-center justify-center ${projectData.textColorClassName} ${startAnimation ? "animation-fade-in-up-16" : "opacity-0"}`}
            >
              <Image
                src={`/logos/${projectData.logoFileName}`}
                alt={`${projectData.name} Logo`}
                fill
                sizes="(max-width: 768px) 50vw, 384px"
                className="object-contain object-left"
                loading="eager"
              />
            </div>
            <div className="role-tag-container mb-lg text-left text-balance opacity-100">
              <ScrollRevealText
                className="role-tag roboto-narrow text-xl font-bold md:text-2xl"
                text={projectData.roleTag}
              />
            </div>
            <div className="description-container max-w-prose text-left text-balance opacity-80">
              <ScrollRevealText
                className="description text-base"
                text={projectData.description}
                staggerMs={60}
              />
            </div>
            <ScrollRevealText
              className="categories-container -ml-1 mt-xl flex flex-wrap"
              staggerMs={90}
              delayMs={500}
            >
              {projectData.categories.map((category) => (
                <span
                  key={category}
                  className={`category-chip roboto-narrow mr-2 mb-2 inline-block rounded-full bg-white px-3 py-1 text-sm font-semibold text-black opacity-70`}
                >
                  {category}
                </span>
              ))}
            </ScrollRevealText>
          </div>

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
        <div className={`detail-1 p-md gap-md flex h-dvh w-screen shrink-0 snap-start flex-col items-start justify-center ${projectData.backgroundClassName} ${projectData.textColorClassName}`}
        data-snap-target>
          detail stuff here
        </div>
    </Section>
  );
}
