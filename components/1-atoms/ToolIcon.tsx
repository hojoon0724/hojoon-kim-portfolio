"use client";
import Image from "next/image";
import { type CSSProperties } from "react";
import { useTooltipDelay } from "@/hooks";

interface ToolIconProps {
  toolId: string;
  pixelSize: number;
  className?: string;
  style?: CSSProperties;
  tooltipText?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

// centered on the icon along the other axis
const tooltipPositionClass = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

export function ToolIcon({
  toolId,
  pixelSize,
  className,
  style,
  tooltipText,
  tooltipPosition = "bottom",
}: ToolIconProps) {
  const { shown, instant, triggerProps, onAnimationEnd } = useTooltipDelay();

  const tooltipAnimationClass = !shown
    ? "animation-fade-out-down-8"
    : instant
      ? ""
      : "animation-fade-in-up-8";

  return (
    <div className="tool-icon-container relative" {...triggerProps}>
      <Image
        src={`/icons/tools/icons_${toolId}.webp`}
        alt={toolId}
        width={pixelSize}
        height={pixelSize}
        className={`tool-icon ${className ?? ""}`}
        style={style}
      />
      {tooltipText && shown !== null && (
        <div
          onAnimationEnd={onAnimationEnd}
          className={`pointer-events-none absolute z-10 ${tooltipPositionClass[tooltipPosition]} w-max rounded bg-black px-2 py-1 font-mono text-xs whitespace-nowrap text-white ${tooltipAnimationClass}`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}
