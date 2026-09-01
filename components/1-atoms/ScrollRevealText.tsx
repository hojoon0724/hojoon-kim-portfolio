"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealTextProps {
  className?: string;
  revealBy?: "word" | "letter" | "line";
  text: string;
  staggerMs?: number;
  threshold?: number;
  wrap?: boolean;
}

export function ScrollRevealText({
  className,
  revealBy = "word",
  text,
  staggerMs = 60,
  threshold = 0.2,
  wrap = true,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  const textUnits: string[] = !text
    ? []
    : revealBy === "letter"
      ? text.split("")
      : revealBy === "line"
        ? text.split("\n")
        : text.split(" ");

  useEffect(() => {
    if (!textUnits.length) return;
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const visibleRatio = Math.min(
        1,
        Math.max(0, visibleHeight / rect.height),
      );
      const startThreshold = Math.min(0.95, Math.max(0, threshold));
      const progress = Math.min(
        1,
        Math.max(0, (visibleRatio - startThreshold) / (1 - startThreshold)),
      );
      setRevealedCount(Math.round(progress * textUnits.length));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [textUnits.length, threshold]);

  if (!textUnits.length) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal-text-outer-container ${className ?? ""}`}
      aria-label={text}
    >
      <div
        className={`scroll-reveal-text-container ${wrap ? "flex-wrap" : "flex flex-nowrap"}`}
      >
        {textUnits.map((unit, i) => {
          const isRevealed = i < revealedCount;
          return (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: "inline-block",
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(12px)",
                transition:
                  "opacity 150ms var(--bezier-fade), transform 150ms var(--bezier-movement-inertia-500)",
                transitionDelay: `${i * staggerMs}ms`,
                whiteSpace: revealBy === "letter" ? "pre" : "normal",
              }}
            >
              {unit}
              {revealBy === "word" && i < textUnits.length - 1 ? "\u00a0" : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}
