"use client";

import { Icon } from "@/components/1-atoms";
import { projectOverviewData } from "@/data";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RETURN_TO_PROJECT_KEY } from "./ExpandedProjectSummary";

interface ProjectSectionNavProps {
  projectId: string;
  sectionIds: string[];
  fullLabels: string[];
  shortLabels: string[];
}

export function ProjectSectionNav({
  projectId,
  sectionIds,
  fullLabels,
  shortLabels,
}: ProjectSectionNavProps) {
  const debug = false;
  const [activeId, setActiveId] = useState<string | null>(null);
  const projectName = projectOverviewData.find(
    (project) => project.id === projectId,
  )?.name;
  const debugRef = useRef<HTMLDivElement>(null);
  const debugCounts = useRef({ effect: 0, frame: 0, scroll: 0, io: 0, tap: 0 });

  // written straight to the DOM so each stage shows up even if a later one never runs
  const writeDebug = (extra: Record<string, unknown> = {}) => {
    if (!debug || !debugRef.current) return;
    debugRef.current.textContent = JSON.stringify({
      ...debugCounts.current,
      ...extra,
    });
  };

  useEffect(() => {
    let frameId = 0;
    debugCounts.current.effect += 1;
    writeDebug();

    const syncActiveSection = () => {
      frameId = 0;
      // a section becomes active once its top passes the center of the viewport
      const activationLine = window.innerHeight / 2;
      const reachedPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1;

      let nextActiveId: string | null = null;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        if (section.getBoundingClientRect().top <= activationLine) {
          nextActiveId = id;
        }
      }

      // the last section may be too short to ever reach the center
      if (reachedPageEnd) {
        nextActiveId = sectionIds[sectionIds.length - 1] ?? nextActiveId;
      }

      setActiveId(nextActiveId);

      debugCounts.current.frame += 1;
      const firstSection = document.getElementById(sectionIds[0] ?? "");
      writeDebug({
        scrollY: Math.round(window.scrollY),
        firstTop: firstSection
          ? Math.round(firstSection.getBoundingClientRect().top)
          : "missing",
        found: sectionIds.filter((id) => document.getElementById(id)).length,
        copies: document.querySelectorAll(`[id="${sectionIds[0]}"]`).length,
        nextActiveId,
      });
    };

    // re-request instead of skipping while a frame is pending: Safari drops
    // pending frames when the page is frozen, which would block every later sync
    const queueSync = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncActiveSection);
    };

    // Safari restores the scroll position on back navigation without a scroll
    // event, so also sync whenever a section crosses the center of the viewport
    const observer = new IntersectionObserver(
      () => {
        debugCounts.current.io += 1;
        queueSync();
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    const onScroll = () => {
      debugCounts.current.scroll += 1;
      queueSync();
    };

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", queueSync);
    window.addEventListener("pageshow", queueSync);

    queueSync();

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", queueSync);
      window.removeEventListener("pageshow", queueSync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds]);

  // iOS Safari jumps to the top of the page before a native hash navigation,
  // so scroll to the section ourselves and only update the hash in the URL
  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    debugCounts.current.tap += 1;
    writeDebug();

    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="Project sections"
      className="project-section-nav h-nav px-md sticky top-0 z-40 w-full bg-inherit"
    >
      {/* debug */}
      {debug && (
        <div
          ref={debugRef}
          className="fixed bottom-0 left-0 z-50 bg-black p-2 text-xs text-white"
        >
          not hydrated
        </div>
      )}
      <div className="gap-md mx-auto flex h-full w-full items-stretch md:grid md:grid-cols-[1fr_auto_1fr]">
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
        <ul className="gap-3xl md:gap-xl flex h-full min-w-0 flex-1 items-stretch  justify-center overflow-x-auto md:justify-center">
          {sectionIds.map((id, index) => {
            const isActive = activeId === id;

            return (
              <li key={id} className="flex shrink-0 items-stretch">
                <a
                  href={`#${id}`}
                  onClick={(event) => scrollToSection(event, id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`roboto-mono flex items-center border-b-2 text-xs font-semibold text-nowrap transition-all duration-300 md:text-sm ${isActive ? "border-current opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}
                >
                  <span className="md:hidden">{shortLabels[index]}</span>
                  <span className="hidden md:inline">{fullLabels[index]}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
