"use client";

import { useRef } from "react";
import { SvgIcon } from "./SvgIcon";

// the original's snap-scroller: a sideways row that shows 2, 3 or 4 children at a time by screen width,
// with arrows that appear on hover and step one child at a time
export function SnapScroller({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function step(direction: 1 | -1) {
    const container = scrollRef.current;
    const firstChild = container?.firstElementChild;
    if (!container || !(firstChild instanceof HTMLElement)) return;
    const gap = parseFloat(getComputedStyle(container).columnGap) || 0;
    container.scrollBy({
      left: direction * (firstChild.offsetWidth + gap),
      behavior: "smooth",
    });
  }

  return (
    <div className="snap-scroller relative w-full">
      <div
        ref={scrollRef}
        className="scroll-container flex snap-x snap-mandatory gap-(--standard-space-half) overflow-x-auto overflow-y-hidden *:w-[calc((100%-var(--standard-space-half))/2)] *:shrink-0 *:snap-start md:*:w-[calc((100%-2*var(--standard-space-half))/3)] lg:*:w-[calc((100%-3*var(--standard-space-half))/4)]"
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-2 pb-12">
        {(
          [
            ["left", -1],
            ["right", 1],
          ] as const
        ).map(([side, direction]) => (
          <button
            key={side}
            type="button"
            aria-label={`Scroll ${side}`}
            className="pointer-events-auto w-12 cursor-pointer border bg-(--surface-base) py-6 opacity-0 transition-opacity hover:opacity-80 focus-visible:opacity-80"
            onClick={() => step(direction)}
          >
            <SvgIcon iconName={`chevron-${side}`} className="h-8 w-8" />
          </button>
        ))}
      </div>
    </div>
  );
}
