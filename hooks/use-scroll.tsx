"use client";

import { RefObject, useEffect, useState } from "react";

type Position = "start" | "center" | "end" | `${number}`;

type Offset = [`${Position} ${Position}`, `${Position} ${Position}`];

interface UseScrollOptions {
  target?: RefObject<HTMLElement | null>;
  offset?: Offset;
}

function resolvePosition(position: Position, size: number) {
  if (position === "start") return 0;
  if (position === "center") return size / 2;
  if (position === "end") return size;

  return Number(position) * size;
}

export function useScroll({
  target,
  // [start at: "element viewport", end at: "element viewport"]
  //  "start" is the top of el or viewport
  //  "end" is the bottom of el or viewport
  offset = ["start end", "end start"],
}: UseScrollOptions = {}) {
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    if (!target?.current) return;

    const element = target.current;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const [startOffset, endOffset] = offset;

      const [startElement, startViewport] = startOffset.split(" ") as [
        Position,
        Position,
      ];

      const [endElement, endViewport] = endOffset.split(" ") as [
        Position,
        Position,
      ];

      // Position of the element's relevant edge relative to the viewport.
      const start =
        rect.top +
        resolvePosition(startElement, rect.height) -
        resolvePosition(startViewport, viewportHeight);

      const end =
        rect.top +
        resolvePosition(endElement, rect.height) -
        resolvePosition(endViewport, viewportHeight);

      // Convert the current position into 0 → 1.
      // Scrolling upward moves the element from start → end.
      const progress = start / (start - end);

      setScrollYProgress(Math.min(1, Math.max(0, progress)));
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target, offset]);

  return { scrollYProgress };
}
