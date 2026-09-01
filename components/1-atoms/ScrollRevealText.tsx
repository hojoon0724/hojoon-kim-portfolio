"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealTextProps {
  className?: string;
  children?: ReactNode;
  delayMs?: number;
  revealBy?: "word" | "letter" | "line";
  progressWithScroll?: boolean;
  text?: string;
  staggerMs?: number;
  threshold?: number;
  resetOnLeave?: boolean;
  wrap?: boolean;
}

export function ScrollRevealText({
  className,
  children,
  delayMs = 0,
  revealBy = "word",
  progressWithScroll = false,
  text,
  staggerMs = 60,
  threshold = 0.1,
  resetOnLeave = true,
  wrap = true,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // one-shot mode: boolean
  const [revealed, setRevealed] = useState(false);
  // scroll-progress mode: how many units are revealed
  const [revealedCount, setRevealedCount] = useState(0);

  const childItems = Children.toArray(children);
  const hasChildren = childItems.length > 0;
  const textToReveal = text ?? "";
  const shouldRender = hasChildren || Boolean(textToReveal);

  const textUnits: string[] = !textToReveal
    ? []
    : revealBy === "letter"
      ? textToReveal.split("")
      : revealBy === "line"
        ? textToReveal.split("\n")
        : textToReveal.split(" ");

  const revealItems = hasChildren ? childItems : textUnits;

  // One-shot IntersectionObserver mode
  useEffect(() => {
    if (progressWithScroll) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (!resetOnLeave) {
            observer.disconnect();
          }
          return;
        }

        if (resetOnLeave) {
          setRevealed(false);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [progressWithScroll, resetOnLeave, threshold]);

  // Scroll-progress mode: reveal units as element scrolls through viewport
  useEffect(() => {
    if (!progressWithScroll) return;
    if (!shouldRender) return;
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
      const startThreshold = 0.2;
      const progress = Math.min(
        1,
        Math.max(0, (visibleRatio - startThreshold) / (1 - startThreshold)),
      );
      setRevealedCount(Math.round(progress * revealItems.length));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [progressWithScroll, revealItems.length, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal-text-outer-container ${className ?? ""}`}
      aria-label={hasChildren ? undefined : textToReveal}
    >
      <div
        className={`scroll-reveal-text-container ${wrap ? "flex-wrap" : "flex flex-nowrap"}`}
      >
        {revealItems.map((item, i) => {
          const isRevealed = progressWithScroll ? i < revealedCount : revealed;
          return (
            <span
              key={i}
              aria-hidden={hasChildren ? undefined : "true"}
              style={{
                display: "inline-block",
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(12px)",
                transition: progressWithScroll
                  ? `opacity 150ms var(--bezier-fade), transform 150ms var(--bezier-movement-inertia-500)`
                  : `opacity 500ms var(--bezier-fade), transform 500ms var(--bezier-movement-inertia-500)`,
                transitionDelay: progressWithScroll
                  ? "0ms"
                  : `${delayMs + i * staggerMs}ms`,
                whiteSpace:
                  !hasChildren && revealBy === "letter" ? "pre" : "normal",
              }}
            >
              {item}
              {!hasChildren && revealBy === "word" && i < revealItems.length - 1
                ? "\u00a0"
                : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}
