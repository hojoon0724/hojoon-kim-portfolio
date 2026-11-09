"use client";

import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface Slide {
  subtitle: string;
  copy: string[];
  visual: ReactNode;
  // heading over the visual. visuals that take theirs as a prop leave this out, so it can share a row with
  // their own controls
  visualTitle?: string;
}

function SlideText({
  slide,
  index,
  hidden,
}: {
  slide: Slide;
  index: number;
  hidden: boolean;
}) {
  return (
    <div
      className={`gap-xs lg:gap-xl grid grid-cols-1 [grid-area:text] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] ${hidden ? "invisible" : ""}`}
      aria-hidden={hidden || undefined}
    >
      <h3 className="flex items-baseline gap-3 text-lg font-bold md:text-2xl">
        <span className="roboto-mono text-sm opacity-50">
          {formatStep(index)}
        </span>
        {slide.subtitle}
      </h3>
      <div className="gap-xs flex flex-col text-sm text-pretty md:text-lg">
        {slide.copy.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

const formatStep = (index: number) => String(index + 1).padStart(2, "0");

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || target.matches("input, textarea, select"));

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

// a section of slides that scroll sideways under a fixed title, with a row of steps showing how far along it is
export function SlideCarousel({
  id,
  title,
  slides,
}: {
  id: string;
  title: string;
  slides: Slide[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const target = Math.max(0, Math.min(slides.length - 1, index));
    scroller.scrollTo({
      left: target * scroller.clientWidth,
      behavior: scrollBehavior(),
    });
  };

  // the slide that's mostly in view is the current one
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveIndex(
              Number((entry.target as HTMLElement).dataset.slideIndex),
            );
          }
        }
      },
      { root: scroller, threshold: 0.6 },
    );
    for (const slide of scroller.children) observer.observe(slide);
    return () => observer.disconnect();
  }, []);

  // left and right step through the slides while this section is on screen. the page's arrow-key navigation
  // only knows top-level slides, so it leaves these keys alone here
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key !== "ArrowLeft" && event.key !== "ArrowRight") ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }
      const rect = sectionRef.current?.getBoundingClientRect();
      const middle = window.innerHeight / 2;
      if (!rect || rect.top > middle || rect.bottom < middle) return;

      const scroller = scrollerRef.current;
      if (!scroller) return;
      const current = Math.round(scroller.scrollLeft / scroller.clientWidth);
      const next = current + (event.key === "ArrowRight" ? 1 : -1);
      if (next < 0 || next >= slides.length) return;

      event.preventDefault();
      scroller.scrollTo({
        left: next * scroller.clientWidth,
        behavior: scrollBehavior(),
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides.length]);

  const arrowClass =
    "flex size-9 shrink-0 cursor-pointer items-center justify-center border border-current transition-opacity hover:bg-current/10 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent";

  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      // exactly one screen tall: the header and indicator stay put and the slides take whatever height is left
      className="py-sm md:py-lg flex h-[calc(100dvh-var(--spacing-nav))] flex-col overflow-x-clip md:h-auto md:justify-center"
      snapToEnd
    >
      <div
        ref={sectionRef}
        className="gap-sm md:gap-md flex min-h-0 w-full min-w-0 flex-1 flex-col md:flex-none"
      >
        <div className="gap-xs md:gap-md px-md lg:px-xl mx-auto flex w-full max-w-7xl shrink-0 flex-col">
          <div className="gap-sm md:gap-xl flex items-center justify-between">
            <h2 className="text-nowrap">{title}</h2>

            {/* the story so far: steps up to the current one are filled in */}
            <div className="gap-xs md:gap-sm flex shrink-0 items-center md:w-full md:max-w-[28rem]">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous slide"
                className={arrowClass}
              >
                ←
              </button>
              {/* phones get the step count; wider screens get a bar per slide */}
              <span className="roboto-mono text-center text-sm whitespace-nowrap tabular-nums md:hidden">
                {formatStep(activeIndex)} / {formatStep(slides.length - 1)}
              </span>
              <div className="hidden flex-1 gap-1 md:flex">
                {slides.map((slide, index) => (
                  <button
                    key={slide.subtitle}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`${formatStep(index)}: ${slide.subtitle}`}
                    aria-current={index === activeIndex ? "step" : undefined}
                    title={slide.subtitle}
                    className="group flex h-9 flex-1 cursor-pointer items-center"
                  >
                    <span
                      className={`h-1 w-full transition-colors duration-300 group-hover:bg-current/60 ${index <= activeIndex ? "bg-current" : "bg-current/20"}`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === slides.length - 1}
                aria-label="Next slide"
                className={arrowClass}
              >
                →
              </button>
            </div>
          </div>
          <div className="w-full border-b" />
        </div>

        <div
          ref={scrollerRef}
          className="flex min-h-0 w-full min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:flex-none [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
          aria-label={title}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.subtitle}
              data-slide-index={index}
              className="h-full w-full shrink-0 snap-start"
              role="group"
              aria-roledescription="slide"
              aria-label={`${formatStep(index)} of ${formatStep(slides.length - 1)}: ${slide.subtitle}`}
            >
              <div className="gap-sm md:gap-md px-md lg:px-xl mx-auto flex h-full w-full max-w-7xl flex-col">
                {/* every slide's text is stacked in the same cell and only this slide's is visible, so the block is
                    as tall as the longest slide's text on every slide and the visuals below line up */}
                <div className="grid shrink-0 [grid-template-areas:'text']">
                  {slides.map((other, otherIndex) => (
                    <SlideText
                      key={other.subtitle}
                      slide={other}
                      index={otherIndex}
                      hidden={otherIndex !== index}
                    />
                  ))}
                </div>
                {/* phones: the section is one screen tall and this takes the rest of it, so visuals size to it (cqh).
                    anything that still doesn't fit scrolls here rather than growing the section.
                    md and up: every slide is as tall as the tallest one needs, and visuals size to the viewport */}
                <div className="min-h-0 flex-1 [--showcase-phone-w:min(280px,70vw,calc((100cqh-5.5rem)*71.9/150))] max-md:[container-type:size] max-md:overflow-y-auto md:[--showcase-phone-w:min(280px,calc((100svh-24rem)*71.9/150))]">
                  {slide.visualTitle ? (
                    <div className="gap-sm flex h-full flex-col">
                      <h3 className="roboto-mono shrink-0 text-sm font-bold uppercase md:text-base">
                        {slide.visualTitle}
                      </h3>
                      {/* its own size container, so the visual fits the height left under the heading */}
                      <div className="min-h-0 flex-1 max-md:[container-type:size]">
                        {slide.visual}
                      </div>
                    </div>
                  ) : (
                    slide.visual
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
