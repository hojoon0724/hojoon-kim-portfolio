"use client";

import { projectOverviewData } from "@/data";
import { useEffect, useRef, useState } from "react";
import { ProjectBackLink } from "./ProjectBackLink";

export interface TimelineStep {
  id: string;
  number: string;
  // when the step happens, written the way a schedule would: "T−3h", "Live", "Wrap"
  marker: string;
  label: string;
  title: string;
  text: string;
  extraDetails: string[];
  // a note on what the step is meant to show. it is a guide for building the page and is never rendered
  intendedEffect?: string;
  media: string[];
}

export interface TimelinePhase {
  id: string;
  label: string;
  // ids of the steps in this phase, in order
  steps: string[];
}

interface TimelineScrollProps {
  projectId: string;
  section: {
    eyebrow: string;
    title: string;
    intro: string;
    timingNote: string;
    closing: string;
  };
  phases: TimelinePhase[];
  steps: TimelineStep[];
}

// how far down the space under the timeline the reading line sits. the step crossing it is the current one
const readingLine = 0.35;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// a page that reads like a schedule being played back.
// - the whole timeline stays pinned at the top: every step is a tick, grouped under its phase
// - the page scrolls freely underneath, with no snapping, and a playhead travels along the timeline as it does.
//   the playhead moves continuously, so it also shows how far through the current step the reader is
// - pressing a tick jumps to that step
export function TimelineScroll({
  projectId,
  section,
  phases,
  steps,
}: TimelineScrollProps) {
  const projectData = projectOverviewData.find(
    (project) => project.id === projectId,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  // the timeline is drawn in phase order, which is also the order the steps are shown in
  const orderedSteps = phases.flatMap((phase) =>
    phase.steps.flatMap(
      (stepId) => steps.find((step) => step.id === stepId) ?? [],
    ),
  );
  const stepCount = orderedSteps.length;
  const activeStep = orderedSteps[activeIndex];

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const railBottom = railRef.current?.getBoundingClientRect().bottom ?? 0;
      const line = railBottom + (window.innerHeight - railBottom) * readingLine;

      // the current step is the last one whose top has crossed the reading line
      let index = -1;
      stepRefs.current.forEach((element, stepIndex) => {
        if (element && element.getBoundingClientRect().top <= line) {
          index = stepIndex;
        }
      });

      // how far the reader is through that step, so the playhead keeps moving between ticks
      let through = 0;
      const current = stepRefs.current[index];
      if (current) {
        const rect = current.getBoundingClientRect();
        through = clamp01((line - rect.top) / rect.height);
      }

      const progress = clamp01((Math.max(0, index) + through) / stepCount);
      if (playheadRef.current) {
        playheadRef.current.style.left = `${progress * 100}%`;
      }
      if (playedRef.current) {
        playedRef.current.style.width = `${progress * 100}%`;
      }
      setActiveIndex(Math.max(0, index));
    };

    const queueUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      scroller.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, [stepCount]);

  const scrollToStep = (index: number) => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    stepRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    // this is the element that scrolls. it has no snapping: the reader moves through the schedule at their own pace
    <div
      ref={scrollerRef}
      className={`timeline-scroll h-dvh w-full overflow-y-auto ${projectData?.backgroundClassName} ${projectData?.textColorClassName}`}
    >
      {/* the timeline. pinned for the whole scroll, intro and closing included */}
      <nav
        ref={railRef}
        aria-label="Production timeline"
        className="timeline-rail px-md lg:px-xl py-sm sticky top-0 z-40 flex flex-col gap-2 border-b border-white/15 bg-inherit"
      >
        <div className="gap-md flex items-center justify-between">
          <ProjectBackLink projectId={projectId} />
          {/* a readout of where the playhead is, since the ticks are too small to carry their own titles */}
          {activeStep && (
            <p
              className="roboto-mono gap-sm flex min-w-0 items-baseline text-xs md:text-sm"
              aria-live="polite"
            >
              <span className="shrink-0 text-red-400">{activeStep.marker}</span>
              <span className="truncate">{activeStep.title}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {/* each phase is as wide as the steps it holds */}
          <div className="flex" aria-hidden="true">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="roboto-mono min-w-0 truncate border-l border-white/30 pl-1 text-[10px] uppercase opacity-70 md:text-xs"
                style={{ flexGrow: phase.steps.length, flexBasis: 0 }}
              >
                {phase.label}
              </div>
            ))}
          </div>

          <div className="relative">
            {/* the track, and the part of it already played */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
            <div
              ref={playedRef}
              className="absolute top-0 left-0 h-px bg-red-400"
              style={{ width: 0 }}
            />
            <div
              ref={playheadRef}
              className="pointer-events-none absolute -top-1 bottom-0 z-10 w-px bg-red-400"
              style={{ left: 0 }}
              aria-hidden="true"
            />
            <ol className="flex">
              {orderedSteps.map((step, index) => {
                const isActive = index === activeIndex;
                const isPlayed = index < activeIndex;

                return (
                  <li key={step.id} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => scrollToStep(index)}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={`${step.number}, ${step.title}`}
                      className={`roboto-mono flex w-full cursor-pointer flex-col items-start border-l pt-1 pl-1 text-left text-[10px] transition-opacity duration-300 md:text-xs ${isActive ? "border-white opacity-100" : isPlayed ? "border-white/60 opacity-70 hover:opacity-100" : "border-white/30 opacity-40 hover:opacity-100"}`}
                    >
                      <span className={isActive ? "font-bold" : ""}>
                        {step.number}
                      </span>
                      <span className="hidden w-full truncate lg:block">
                        {step.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </nav>

      <div className="px-md lg:px-xl mx-auto flex w-full max-w-7xl flex-col">
        <header className="gap-md py-3xl flex min-h-[60dvh] flex-col justify-center">
          <h5 className="opacity-70">{section.eyebrow}</h5>
          <h1 className="max-w-5xl text-balance">{section.title}</h1>
          <p className="roboto-narrow max-w-prose text-xl text-pretty md:text-2xl">
            {section.intro}
          </p>
          <p className="max-w-prose text-sm opacity-70 md:text-base">
            {section.timingNote}
          </p>
        </header>

        {phases.map((phase) => (
          <section key={phase.id} className="flex flex-col">
            <div className="gap-md pt-2xl pb-md flex items-baseline justify-between">
              <h2>{phase.label}</h2>
              <span className="roboto-mono text-xs opacity-70 md:text-sm">
                {phase.steps.length} steps
              </span>
            </div>

            <ol className="flex flex-col">
              {phase.steps.map((stepId) => {
                const index = orderedSteps.findIndex(
                  (step) => step.id === stepId,
                );
                const step = orderedSteps[index];
                if (!step) return null;

                return (
                  // scroll-mt keeps the top of the step clear of the pinned timeline when a tick jumps to it
                  <li
                    key={step.id}
                    id={`timeline-${step.id}`}
                    ref={(element) => {
                      stepRefs.current[index] = element;
                    }}
                    className="gap-lg py-2xl grid scroll-mt-32 grid-cols-1 border-t border-white/15 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.2fr)]"
                  >
                    <div className="flex flex-row items-baseline gap-3 lg:flex-col lg:gap-1">
                      <span className="roboto-mono text-xs opacity-70 md:text-sm">
                        {step.number} / {step.label}
                      </span>
                      <span className="roboto-wide text-xl font-bold text-red-400 md:text-2xl">
                        {step.marker}
                      </span>
                    </div>

                    <div className="gap-md flex flex-col">
                      <h3>{step.title}</h3>
                      <p className="max-w-prose text-base text-pretty md:text-lg">
                        {step.text}
                      </p>
                      {step.extraDetails.length > 0 && (
                        <ul className="gap-sm flex flex-col">
                          {step.extraDetails.map((detail) => (
                            <li
                              key={detail}
                              className="gap-sm flex max-w-prose items-baseline text-sm opacity-70 md:text-base"
                            >
                              <span
                                className="roboto-mono w-4 shrink-0"
                                aria-hidden="true"
                              >
                                +
                              </span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* MEDIA PLACEHOLDER: replace this div with the step's photos, diagrams or video */}
                    <div className="timeline-media-placeholder p-sm flex aspect-video w-full items-start border border-dashed border-white/30">
                      <span className="roboto-mono text-xs opacity-50 md:text-sm">
                        Media: {step.title}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}

        <footer className="py-3xl flex min-h-[50dvh] flex-col justify-center border-t border-white/15">
          <p className="roboto-narrow max-w-5xl text-2xl font-light text-balance md:text-4xl">
            {section.closing}
          </p>
        </footer>
      </div>
    </div>
  );
}
