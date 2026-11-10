"use client";

import type { ReactNode } from "react";

const DEFAULT_TRANSITION =
  "duration-300 ease-out motion-reduce:transition-none";

// two versions of the same spot, stacked in one cell and cross-fading. the cell is as big as the bigger of the
// two, so nothing around it shifts
export function CrossFade({
  showSecond,
  first,
  second,
  className = "",
  transitionClassName = DEFAULT_TRANSITION,
}: {
  showSecond: boolean;
  first: ReactNode;
  second: ReactNode;
  className?: string;
  // duration and easing classes for the fade
  transitionClassName?: string;
}) {
  const layer = (shown: boolean) =>
    `[grid-area:stack] transition-opacity ${transitionClassName} ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`;
  return (
    <div className={`grid [grid-template-areas:'stack'] ${className}`}>
      <div className={layer(!showSecond)} aria-hidden={showSecond || undefined}>
        {first}
      </div>
      <div className={layer(showSecond)} aria-hidden={!showSecond || undefined}>
        {second}
      </div>
    </div>
  );
}
