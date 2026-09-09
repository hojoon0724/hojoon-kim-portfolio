"use client";

import { useInView } from "@/hooks";
import {
  Children,
  cloneElement,
  CSSProperties,
  Fragment,
  isValidElement,
  ReactElement,
} from "react";

interface StaggeredRevealProps {
  children: React.ReactNode;
  className?: string;
  animationClassName?: string;
  delayMs?: number;
  staggerMs?: number;
  finishByMs?: number;
  threshold?: number;
  resetOnLeave?: boolean;
  startAnimation?: boolean;
}

export function StaggeredReveal({
  children,
  className,
  animationClassName = "animation-fade-in-up-16",
  delayMs = 100,
  staggerMs = 40,
  finishByMs = 0,
  threshold = 0.3,
  resetOnLeave = false,
  startAnimation = false,
}: StaggeredRevealProps) {
  const [ref, isInView] = useInView<HTMLDivElement>(threshold, !resetOnLeave);

  const revealed = startAnimation || isInView;

  const revealableUnitCount = Children.count(children);
  const calculatedStaggerMs =
    finishByMs > 0
      ? Math.max(0, finishByMs - delayMs) / Math.max(1, revealableUnitCount - 1)
      : staggerMs;

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => {
        const childDelayMs = delayMs + index * calculatedStaggerMs;

        if (!isValidElement(child)) return child;
        if (child.type === Fragment) return child;

        const childProps = child.props as {
          className?: string;
          style?: CSSProperties;
        };

        const mergedClassName = [
          childProps.className,
          revealed ? animationClassName : "opacity-0",
        ]
          .filter(Boolean)
          .join(" ");

        const mergedStyle: CSSProperties = {
          ...childProps.style,
          animationDelay: `${childDelayMs}ms, ${childDelayMs}ms`,
        };

        return cloneElement(
          child as ReactElement<{
            className?: string;
            style?: CSSProperties;
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
