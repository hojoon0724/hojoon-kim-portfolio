"use client";

import { ScrollIndicator } from "@/components/2-molecules";
import { RETURN_TO_PROJECT_KEY } from "@/components/4-organisms";
import { About, ContactPage, ProjectOverview } from "@/components/5-sections";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface VisibleSections {
  id: string;
  label: string;
  bgTone: "dark" | "bright";
}

export function Landing() {
  const [sectionInView, setSectionInView] = useState("about");
  const activeSectionRef = useRef("");

  const visibleSections: VisibleSections[] = [
    { id: "about", label: "About", bgTone: "dark" },
    { id: "moindi", label: "MOindi", bgTone: "bright" },
    { id: "rcnm", label: "Rocket City New Music", bgTone: "dark" },
    { id: "ensrq", label: "enSRQ", bgTone: "dark" },
    { id: "focus-features", label: "Focus Features", bgTone: "dark" },
    { id: "laphil", label: "LA Phil", bgTone: "bright" },
    { id: "contact", label: "Contact", bgTone: "dark" },
  ];

  const projectSections = visibleSections.slice(1, -1); // Exclude the first and last sections (About and Contact)

  // main function that runs when a section changes
  function setActiveSection(id: string) {
    if (id === activeSectionRef.current) return;

    activeSectionRef.current = id;
    setSectionInView(id);
  }

  // coming back from a project page: jump to the summary slide the user left from
  useLayoutEffect(() => {
    const projectId = sessionStorage.getItem(RETURN_TO_PROJECT_KEY);
    if (!projectId) return;

    sessionStorage.removeItem(RETURN_TO_PROJECT_KEY);
    document
      .querySelector(
        `#${projectId} [data-animation-key="${projectId}-expanded-summary"]`,
      )
      ?.scrollIntoView({ behavior: "instant" });
  }, []);

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
      <ScrollIndicator
        visibleSections={visibleSections}
        sectionInView={sectionInView}
      />
      <About id="about" />
      {projectSections.map((section) => (
        <ProjectOverview key={section.id} projectId={section.id} />
      ))}
      <ContactPage id="contact" />
    </>
  );
}
