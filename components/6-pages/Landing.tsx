"use client";

import { About, ProjectOverview } from "@/components/5-sections";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Landing() {
  const [sectionPosition, setSectionPosition] = useState("about");
  const [showLabel, setShowLabel] = useState(false);
  const activeSectionRef = useRef("");
  const labelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSectionLabelMs = 1200; // Duration to show the section label in milliseconds

  const visibleSections = [
    { id: "about", label: "About", bgTone: "dark" },
    { id: "moindi", label: "MOindi", bgTone: "bright" },
    { id: "rcnm", label: "Rocket City New Music", bgTone: "dark" },
    { id: "ensrq", label: "enSRQ", bgTone: "dark" },
    { id: "focus-features", label: "Focus Features", bgTone: "dark" },
    { id: "laphil", label: "LA Phil", bgTone: "bright" },
  ];

  // main function that runs when a section changes
  function setActiveSection(id: string) {
    if (id === activeSectionRef.current) return;

    activeSectionRef.current = id;
    setSectionPosition(id);
    setShowLabel(true);

    // cancel the prev hide timeout
    if (labelTimeoutRef.current) {
      clearTimeout(labelTimeoutRef.current);
    }

    // show the new section, then hide it
    labelTimeoutRef.current = setTimeout(() => {
      setShowLabel(false);
    }, showSectionLabelMs);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 },
    );
    const sections = document.querySelectorAll(
      ".about-section, .project-overview-container",
    );
    sections.forEach((section) => {
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="scroll-indicator-container p-sm pointer-events-none absolute inset-0 flex h-dvh w-dvw flex-col items-end justify-end">
        <div
          className={`indicators gap-sm pb-3xl flex flex-col items-end justify-center ${visibleSections.find((section) => section.id === sectionPosition)?.bgTone === "bright" ? "text-gray-950" : "text-gray-100"} `}
        >
          {visibleSections.map((section) => (
            <Link
              href={`#${section.id}`}
              key={section.id}
              className={`group scroll-indicator relative z-40 transition-all duration-300 ${sectionPosition === section.id ? "max-w-3xl opacity-80" : "max-w-2xl opacity-50"} h-md gap-sm pointer-events-auto flex items-center justify-end overflow-visible transition-all duration-300 hover:max-w-192 hover:opacity-70`}
            >
              <div className="text-container flex h-full items-center justify-end">
                <div
                  className={`pointer-events-none text-nowrap transition-all group-hover:opacity-100 ${showLabel && sectionPosition === section.id ? "opacity-100" : "opacity-0 duration-200"}`}
                >
                  {section.label}
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
      {visibleSections.slice(1).map((section) => (
        <ProjectOverview key={section.id} projectId={section.id} />
      ))}
    </>
  );
}
