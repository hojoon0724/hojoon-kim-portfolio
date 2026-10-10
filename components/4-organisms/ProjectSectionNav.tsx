"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectBackLink } from "./ProjectBackLink";

interface ProjectSectionNavProps {
  projectId: string;
  sectionIds: string[];
  fullLabels: string[];
  shortLabels: string[];
  // pin the nav over a snap container instead of sticking it to the page
  overlay?: boolean;
}

export function ProjectSectionNav({
  projectId,
  sectionIds,
  fullLabels,
  shortLabels,
  overlay = false,
}: ProjectSectionNavProps) {
  const debug = false;
  const [activeId, setActiveId] = useState<string | null>(null);
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

    // on snap pages the sections scroll inside a container, not the window
    const scrollContainer =
      document
        .getElementById(sectionIds[0] ?? "")
        ?.closest<HTMLElement>("[data-snap-container]") ?? null;
    const scrollTarget = scrollContainer ?? window;

    const syncActiveSection = () => {
      frameId = 0;
      // a section becomes active once its top passes the center of the viewport
      const activationLine = window.innerHeight / 2;
      const reachedPageEnd = scrollContainer
        ? scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight - 1
        : window.innerHeight + window.scrollY >=
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

    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", queueSync);
    window.addEventListener("pageshow", queueSync);

    queueSync();

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      scrollTarget.removeEventListener("scroll", onScroll);
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
      className={`project-section-nav h-nav px-md top-0 z-40 w-full bg-inherit ${overlay ? "absolute left-0" : "sticky"} min-h-nav`}
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
        <ProjectBackLink projectId={projectId} />
        <ul className="gap-3xl md:gap-xl flex h-full min-w-0 flex-1 items-stretch justify-center overflow-x-auto md:justify-center">
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
