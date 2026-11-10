"use client";

import type { ReactNode } from "react";

export interface SegmentedOption<T extends string | number> {
  value: T;
  content: ReactNode;
  // the option's accessible name and tooltip, for icon-only options
  title?: string;
}

// a row of options joined into one control: one outline in the text color, a hairline between options, and the
// picked one tinted (or filled, with activeClassName)
export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className = "",
  activeClassName = "bg-current/20",
}: {
  // the group's accessible name
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  activeClassName?: string;
}) {
  return (
    <div
      className={`roboto-mono flex h-7 shrink-0 border border-current text-[11px] font-bold uppercase md:text-xs ${className}`}
      role="group"
      aria-label={label}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          aria-label={option.title}
          title={option.title}
          onClick={() => onChange(option.value)}
          className={`flex cursor-pointer items-center px-2.5 whitespace-nowrap transition-colors duration-200 ${index > 0 ? "border-l border-current" : ""} ${option.value === value ? activeClassName : "hover:bg-current/10"}`}
        >
          {option.content}
        </button>
      ))}
    </div>
  );
}
