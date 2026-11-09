"use client";

import type { SizeTypes } from "@/demos/moindi/types";
import { Button } from "./Button";

// folder-style tabs from the original's tab-menu: the active tab sits raised and primary,
// the rest drop down half a rem and overlap by their border width
export function TabMenu<T extends string>({
  options,
  activeOption,
  onSelect,
  size = "small",
  bottomBorder = true,
  className = "",
}: {
  options: readonly T[];
  activeOption: T;
  onSelect: (option: T) => void;
  size?: SizeTypes;
  bottomBorder?: boolean;
  className?: string;
}) {
  return (
    <div className={`tab-menu-container ${className}`}>
      <div
        role="tablist"
        className={`tab-menu flex overflow-clip ${bottomBorder ? "border-b-2" : ""}`}
      >
        {options.map((option, index) => {
          const isActive = option === activeOption;
          return (
            <div
              key={option}
              className="tab-button border-2 border-b-0 transition-all ease-in-out"
              style={{
                transform: `translateX(-${index * 2}px) ${isActive ? "" : "translateY(0.5rem)"}`,
                zIndex: isActive ? 1 : 0,
              }}
            >
              <Button
                variant="flat"
                role="tab"
                aria-selected={isActive}
                color={isActive ? "primary" : "default"}
                size={size}
                onClick={() => onSelect(option)}
              >
                {option.replaceAll("-", " ")}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
