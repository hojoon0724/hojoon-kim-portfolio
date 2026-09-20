import { useEffect } from "react";

type Direction = "up" | "down" | "left" | "right";

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const SNAP_STOP_SELECTOR = "[data-snap-target], [data-snap-container]";
const INNER_SCROLL_STEP_PX = 100;
const SETTLE_DELAY_MS = 150;

const getChildren = (parent: Element, selector: string) =>
  Array.from(parent.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.matches(selector),
  );

const getClosestToViewportCenter = (
  elements: HTMLElement[],
  axis: "x" | "y",
) => {
  const viewportCenter =
    axis === "x" ? window.innerWidth / 2 : window.innerHeight / 2;
  let best = elements[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    const center =
      axis === "x" ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    const distance = Math.abs(center - viewportCenter);

    if (distance < bestDistance) {
      bestDistance = distance;
      best = element;
    }
  }

  return best;
};

// Slides can hold their own vertically scrolling content; arrows should
// scroll that first and only move to the next section once it runs out.
const findInnerScroller = (slide: HTMLElement, direction: Direction) => {
  for (const element of slide.querySelectorAll<HTMLElement>("*")) {
    if (element.scrollHeight <= element.clientHeight + 1) {
      continue;
    }

    const { overflowY } = window.getComputedStyle(element);
    if (overflowY !== "auto" && overflowY !== "scroll") {
      continue;
    }

    const canScroll =
      direction === "down"
        ? element.scrollTop + element.clientHeight < element.scrollHeight - 1
        : element.scrollTop > 1;

    if (canScroll) {
      return element;
    }
  }

  return null;
};

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || target.matches("input, textarea, select"));

/**
 * Arrow-key navigation for the nested snap layout: up/down move between
 * top-level sections, left/right move between slides in a project section.
 */
export function useArrowKeyNavigation() {
  useEffect(() => {
    // Where the last keypress is headed. Rapid presses build on this instead
    // of on the (still mid-animation) scroll position.
    let pendingSection: HTMLElement | null = null;
    let pendingSlide: HTMLElement | null = null;
    let settleTimer = 0;

    const scheduleSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        pendingSection = null;
        pendingSlide = null;
      }, SETTLE_DELAY_MS);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];

      if (
        !direction ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }

      const outerContainer = Array.from(
        document.querySelectorAll<HTMLElement>("[data-snap-container]"),
      ).find(
        (container) =>
          !container.parentElement?.closest("[data-snap-container]"),
      );

      if (!outerContainer) {
        return;
      }

      const sections = getChildren(outerContainer, SNAP_STOP_SELECTOR);
      if (sections.length === 0) {
        return;
      }

      const section =
        pendingSection && sections.includes(pendingSection)
          ? pendingSection
          : getClosestToViewportCenter(sections, "y");

      const slides = section.matches("[data-snap-container]")
        ? getChildren(section, "[data-snap-target]")
        : [];

      const slide =
        slides.length === 0
          ? section
          : pendingSlide && slides.includes(pendingSlide)
            ? pendingSlide
            : getClosestToViewportCenter(slides, "x");

      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? "auto"
        : "smooth";
      const step = direction === "down" || direction === "right" ? 1 : -1;

      if (direction === "up" || direction === "down") {
        const innerScroller = findInnerScroller(slide, direction);

        if (innerScroller) {
          event.preventDefault();
          innerScroller.scrollBy({
            top: step * INNER_SCROLL_STEP_PX,
            behavior,
          });
          return;
        }

        const nextSection = sections[sections.indexOf(section) + step];
        if (!nextSection) {
          return;
        }

        event.preventDefault();
        pendingSection = nextSection;
        pendingSlide = null;
        nextSection.scrollIntoView({
          behavior,
          block: "start",
          inline: "nearest",
        });
      } else {
        const nextSlide = slides[slides.indexOf(slide) + step];
        if (!nextSlide) {
          return;
        }

        event.preventDefault();
        pendingSection = section;
        pendingSlide = nextSlide;
        nextSlide.scrollIntoView({
          behavior,
          block: "nearest",
          inline: "start",
        });
      }

      scheduleSettle();
    };

    window.addEventListener("keydown", onKeyDown);
    // scroll doesn't bubble, so capture it to also catch the nested containers
    document.addEventListener("scroll", scheduleSettle, {
      capture: true,
      passive: true,
    });

    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("scroll", scheduleSettle, { capture: true });
    };
  }, []);
}
