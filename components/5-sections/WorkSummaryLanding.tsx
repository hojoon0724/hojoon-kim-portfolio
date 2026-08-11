"use client";

import { ensrq, moindi, rcnm } from "@/data/case-studies";
import { CaseStudy } from "@/types";
import Image from "next/image";
import { useState } from "react";

const PROJECTS = [moindi, ensrq, rcnm] as CaseStudy[];

export function WorkSummaryLanding() {
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(
    PROJECTS[0],
  );

  return (
    <div className="works-summary-landing content-max-width gap-sm flex h-screen flex-col">
      <div className="rendered-section bg-surface-light/60 flex-1">
        {selectedProject && (
          <div className="selected-project-container p-lg gap-sm relative flex h-full w-full flex-col items-center justify-center">
            <div className="background-image-container absolute inset-0 bg-amber-400/20">
              <Image
                src={selectedProject.backgroundImage}
                alt={selectedProject.title}
                fill
              />
            </div>
            <div className="project-info-container gap-sm relative z-10 flex flex-col items-center justify-center text-on-light max-w-prose text-center">
              <h2 className="selected-project-title">
                {selectedProject.title}
              </h2>
              <div className="role-tag-container text-xl font-semibold text-balance">
                {selectedProject.roleTag}
              </div>
              <div className="one-liner-container text-lg">
                {selectedProject.oneLiner}
              </div>
              <div className="position-container roboto-wide text-center text-lg font-bold">
                {selectedProject.position}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="project-select-container grid grid-cols-1 md:grid-cols-5">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className={`project-option-container hover:bg-surface-accent/50 hover:text-on-base min-h-8 flex cursor-pointer flex-col items-center justify-center transition-colors duration-300 ${
              selectedProject?.id === project.id
                ? "bg-surface-accent text-on-accent"
                : "bg-surface-feather text-on-light"
            }`}
            onClick={() => setSelectedProject(project)}
          >
            <div className="project-select__content">
              <h3 className="project-select__title">{project.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
