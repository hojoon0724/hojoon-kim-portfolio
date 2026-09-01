"use client";

import { ScrollIndicator } from "@/components/2-molecules";
import { About, ContactPage, ProjectOverview } from "@/components/5-sections";
import { useEffect, useRef, useState } from "react";

interface VisibleSections {
  id: string;
  label: string;
  bgTone: "dark" | "bright";
}

export function Landing() {
  const [sectionInView, setSectionInView] = useState("about");
  const [showLabel, setShowLabel] = useState(false);
  const activeSectionRef = useRef("");
  const labelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSectionLabelMs = 1200; // Duration to show the section label in milliseconds

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
      <ScrollIndicator
        visibleSections={visibleSections}
        sectionInView={sectionInView}
        showLabel={showLabel}
      />
      <About id="about" />
      {projectSections.map((section) => (
        <ProjectOverview key={section.id} projectId={section.id} />
      ))}
      <ContactPage id="contact" />
    </>
  );
}
