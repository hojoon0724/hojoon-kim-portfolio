"use client";

import type { ReactNode } from "react";

const DEFAULT_TRANSITION =
  "duration-300 ease-out motion-reduce:transition-none";

// a block that grows open or collapses shut, animating its height to and from nothing without measuring it
export function Collapse({
  open,
  children,
  className = "",
  transitionClassName = DEFAULT_TRANSITION,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  // duration and easing classes for the open and close
  transitionClassName?: string;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] ${transitionClassName} ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} ${className}`}
      aria-hidden={!open || undefined}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
