"use client";

import { useState } from "react";
import { SvgIcon } from "./SvgIcon";

// a header that toggles its content open, with the same grid-rows collapse as the user menu
export function Accordion({
  header,
  children,
  className = "",
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`accordion-container relative overflow-clip border ${className}`}
    >
      <button
        type="button"
        className="accordion-header relative z-10 flex w-full cursor-pointer items-center justify-between border border-b-2 text-left"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {header}
        <div
          className={`accordion-open-icon h-8 shrink-0 transition-transform duration-200 ${isOpen ? "-rotate-90" : "rotate-0"}`}
        >
          <SvgIcon iconName="caret-left" />
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0">{children}</div>
      </div>
    </div>
  );
}
