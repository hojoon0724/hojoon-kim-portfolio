"use client";

import { Icon } from "@/components/1-atoms";
import { projectOverviewData } from "@/data";
import Link from "next/link";
import { RETURN_TO_PROJECT_KEY } from "./ExpandedProjectSummary";

interface ProjectBackLinkProps {
  projectId: string;
}

// the way back from a project page to that project's summary on the landing page
export function ProjectBackLink({ projectId }: ProjectBackLinkProps) {
  const projectName = projectOverviewData.find(
    (project) => project.id === projectId,
  )?.name;

  return (
    <Link
      href="/"
      transitionTypes={["project-back"]}
      aria-label={`Back to ${projectName ?? "project"} summary`}
      className="roboto-mono gap-sm flex w-fit shrink-0 flex-row items-center text-xs opacity-70 transition-all hover:-translate-x-1 hover:opacity-100 md:text-sm"
      onClick={(event) => {
        // skip new-tab clicks so this tab's landing page isn't affected
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        // the landing page reads this and jumps to the project's expanded summary
        sessionStorage.setItem(RETURN_TO_PROJECT_KEY, projectId);
      }}
    >
      <div className="icon-container flex h-4 w-4">
        <Icon icon="arrowLeft" />
      </div>
      <span className="hidden lg:inline">{projectName}</span>
    </Link>
  );
}
