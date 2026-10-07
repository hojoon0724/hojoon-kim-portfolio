"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

interface ToolIconProps {
  toolId: string;
  pixelSize: number;
  className?: string;
  style?: CSSProperties;
  tooltipText?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

const TOOLTIP_DELAY_MS = 300;

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
  // null while the tooltip isn't on the page at all: before it is first shown, and again once it has faded out.
  // a hidden tooltip left in place is wider than its icon and adds sideways scroll to whatever holds the icons
  const [shown, setShown] = useState<boolean | null>(null);
  const timeoutRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const showAfterDelay = () => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(
      () => setShown(true),
      TOOLTIP_DELAY_MS,
    );
  };

  // hides right away, and only fades out if it had actually appeared
  const hide = () => {
    window.clearTimeout(timeoutRef.current);
    setShown((prev) => (prev ? false : prev));
  };

  const tooltipAnimationClass = shown
    ? "animation-fade-in-up-8"
    : "animation-fade-out-down-8";

  return (
    <div
      className="tool-icon-container relative"
      onMouseEnter={showAfterDelay}
      onMouseLeave={hide}
    >
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
          onAnimationEnd={() => setShown((prev) => (prev ? prev : null))}
          className={`pointer-events-none absolute z-10 ${tooltipPositionClass[tooltipPosition]} w-max rounded bg-black px-2 py-1 font-mono text-xs whitespace-nowrap text-white ${tooltipAnimationClass}`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}
