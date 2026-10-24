"use client";
import { useTooltipDelay } from "@/hooks";

interface HoverTooltipProps {
  children: React.ReactNode;
  tooltipText: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function HoverTooltip({
  children,
  tooltipText,
  position = "bottom",
}: HoverTooltipProps) {
  const { shown, instant, triggerProps, onAnimationEnd } = useTooltipDelay();

  const animationClass = !shown
    ? "animation-fade-out-down-8"
    : instant
      ? ""
      : "animation-fade-in-up-8";

  return (
    <div className="relative" {...triggerProps}>
      {children}
      {shown !== null && (
        <div
          onAnimationEnd={onAnimationEnd}
          className={`pointer-events-none absolute ${position === "top" ? "bottom-full mb-2" : position === "bottom" ? "top-full mt-2" : position === "left" ? "right-full mr-2" : "left-full ml-2"} w-max rounded bg-black p-2 text-white ${animationClass}`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}
