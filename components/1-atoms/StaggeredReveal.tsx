"use client";

import React, { Children, useEffect, useState } from "react";

interface StaggeredRevealProps {
  children: React.ReactNode;
  className?: string;
  animationClassName?: string;
  delayMs?: number;
  staggerMs?: number;
  finishByMs?: number;
  threshold?: number;
  resetOnLeave?: boolean;
}

export function StaggeredReveal({
  children,
  className,
  animationClassName = "animation-fade-in-up-16",
  delayMs = 100,
  staggerMs = 50,
  finishByMs = 0, // Default 0 = uses delay+stagger. If set, will override delay+stagger to finish by this time.
  threshold = 0.5,
  resetOnLeave = true,
}: StaggeredRevealProps) {
  const calculatedStaggerMs = finishByMs > 0 ? Math.max(0, finishByMs - delayMs) / Math.max(1, Children.count(children) - 1) : staggerMs;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  // const childrenCount = Children.toArray(children).filter(React.isValidElement).length

  useEffect(() => {
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
  }, [resetOnLeave, threshold]);

  return (
    <div ref={containerRef} className={className}>
      {Children.map(children, (child, index) => {
        const childDelayMs = delayMs + index * calculatedStaggerMs;

        if (!React.isValidElement(child)) return child;
        if (child.type === React.Fragment) return child;

        const childProps = child.props as {
          className?: string;
          style?: React.CSSProperties;
        };

        const mergedClassName = [
          childProps.className,
          revealed ? animationClassName : "opacity-0",
        ]
          .filter(Boolean)
          .join(" ");

        const mergedStyle: React.CSSProperties = {
          ...childProps.style,
          animationDelay: `${childDelayMs}ms, ${childDelayMs}ms`,
        };

        return React.cloneElement(
          child as React.ReactElement<{
            className?: string;
            style?: React.CSSProperties;
          }>,
          {
            className: mergedClassName || undefined,
            style: mergedStyle,
          },
        );
      })}
    </div>
  );
}
