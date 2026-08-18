"use client";

import { About, ProjectOverview } from "@/components/5-sections";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export function Landing() {
  const [sectionPosition, setSectionPosition] = useState("about");
  const sections = useMemo(
    () => [
      { id: "about", text: "About" },
      { id: "moindi", text: "MOindi" },
      { id: "rcnm", text: "Rocket City New Music" },
      { id: "ensrq", text: "enSRQ" },
      { id: "focus-features", text: "Focus Features" },
      { id: "laphil", text: "LA Phil" },
    ],
    [],
  );

  const setActiveSection = (id: string) => {
    setSectionPosition(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.5, 0.8],
      },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <div className="scroll-indicator-container p-sm pointer-events-none absolute inset-0 flex h-dvh w-dvw flex-col items-end justify-end">
        <div className="indicators gap-sm pb-3xl flex flex-col items-end justify-center">
          {sections.map((section) => (
            <Link
              href={`#${section.id}`}
              key={section.id}
              className={`group scroll-indicator relative z-40 overflow-clip transition-all duration-300 ${sectionPosition === section.id ? "max-w-3xl opacity-80" : "max-w-2xl opacity-50"} h-md gap-sm pointer-events-auto flex items-center justify-end overflow-visible transition-all duration-300 hover:max-w-192 hover:opacity-70`}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="text-container flex h-full items-center justify-end">
                <div className="text-nowrap opacity-0 transition-all delay-100 duration-100 group-hover:opacity-100">
                  {section.text}
                </div>
              </div>
              <div
                className={`line h-px shrink-0 border ${sectionPosition === section.id ? "w-3xl" : "w-2xl"} transition-all duration-300`}
              ></div>
            </Link>
          ))}
        </div>
      </div>
      <About id="about" />
      {sections.slice(1).map((section) => (
        <ProjectOverview key={section.id} projectId={section.id} />
      ))}
    </>
  );
}
