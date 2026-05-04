"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealTextProps {
  className?: string;
  revealBy?: "word" | "letter" | "line";
  progressWithScroll?: boolean;
  text: string;
  staggerMs?: number;
  threshold?: number;
  children?: React.ReactNode;
}

export function ScrollRevealText({
  className,
  revealBy = "word",
  progressWithScroll = false,
  text,
  staggerMs = 60,
  threshold = 0.1,
  children,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // one-shot mode: boolean
  const [revealed, setRevealed] = useState(false);
  // scroll-progress mode: how many units are revealed
  const [revealedCount, setRevealedCount] = useState(0);

  const units: string[] =
    revealBy === "letter" ? text.split("") : revealBy === "line" ? text.split("\n") : text.split(" ");

  // One-shot IntersectionObserver mode
  useEffect(() => {
    if (progressWithScroll) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [progressWithScroll, threshold]);

  // Scroll-progress mode: reveal units as element scrolls through viewport
  useEffect(() => {
    if (!progressWithScroll) return;
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const visibleRatio = Math.min(1, Math.max(0, visibleHeight / rect.height));
      const startThreshold = 0.2;
      const progress = Math.min(1, Math.max(0, (visibleRatio - startThreshold) / (1 - startThreshold)));
      setRevealedCount(Math.round(progress * units.length));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [progressWithScroll, units.length]);

  return (
    <div ref={containerRef} className={`scroll-reveal-text-outer-container ${className ?? ""}`} aria-label={text}>
      <div className="scroll-reveal-text-container">
        {units.map((unit, i) => {
          const isRevealed = progressWithScroll ? i < revealedCount : revealed;
          return (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: "inline-block",
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(12px)",
                transition: progressWithScroll
                  ? `opacity 150ms var(--bezier-fade), transform 150ms var(--bezier-movement-inertia-500)`
                  : `opacity 500ms var(--bezier-fade), transform 500ms var(--bezier-movement-inertia-500)`,
                transitionDelay: progressWithScroll ? "0ms" : `${i * staggerMs}ms`,
                whiteSpace: revealBy === "letter" ? "pre" : "normal",
              }}
            >
              {unit}
              {revealBy === "word" && i < units.length - 1 ? "\u00a0" : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}
