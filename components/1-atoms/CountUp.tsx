"use client";

import { useInView } from "@/hooks";
import { applyBezier, readBezier } from "@/lib/bezier";
import { useEffect, useState } from "react";

interface CountUpProps {
  startNumber?: number;
  targetNumber: number;
  className?: string;
  durationMs?: number;
  delayMs?: number;
  finishByMs?: number;
  threshold?: number;
  easeOut?: boolean;
  startAnimation?: boolean;
  resetOnLeave?: boolean;
}

function countDecimals(value: number): number {
  return (String(value).split(".")[1] ?? "").length;
}

export function CountUp({
  startNumber = 0,
  targetNumber,
  className,
  durationMs = 500,
  delayMs = 0,
  finishByMs = 0,
  threshold = 0.3,
  easeOut = true,
  startAnimation = false,
  resetOnLeave = false,
}: CountUpProps) {
  const [ref, isInView] = useInView<HTMLSpanElement>(threshold, !resetOnLeave);
  const [value, setValue] = useState(startNumber);

  const revealed = startAnimation || isInView;

  // finishByMs counts from the reveal, so the delay comes out of the counting time
  const calculatedDurationMs =
    finishByMs > 0 ? Math.max(0, finishByMs - delayMs) : durationMs;

  useEffect(() => {
    if (!revealed) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const bezier = easeOut ? readBezier("--bezier-count-up") : null;
    let frameId = 0;
    let startTime = 0;

    const tick = (now: number) => {
      if (startTime === 0) startTime = now + delayMs;

      const elapsed = now - startTime;
      const progress =
        reduceMotion || calculatedDurationMs === 0
          ? 1
          : Math.min(1, Math.max(0, elapsed / calculatedDurationMs));
      // easeOut: most of the count happens early, then it slows right down as it nears the target. otherwise an even pace
      const easedProgress = bezier ? applyBezier(bezier, progress) : progress;

      setValue(
        progress === 1
          ? targetNumber
          : startNumber + (targetNumber - startNumber) * easedProgress,
      );

      if (progress < 1) frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    // going back to the start here means a second reveal doesn't flash the old total first
    return () => {
      window.cancelAnimationFrame(frameId);
      setValue(startNumber);
    };
  }, [
    revealed,
    startNumber,
    targetNumber,
    calculatedDurationMs,
    delayMs,
    easeOut,
  ]);

  const decimals = Math.max(
    countDecimals(startNumber),
    countDecimals(targetNumber),
  );
  const format = (number: number) =>
    number.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  // the widest the number will ever be, so the space it takes is settled before it starts counting
  const widestText = [format(startNumber), format(targetNumber)].reduce(
    (widest, text) => (text.length > widest.length ? text : widest),
  );

  return (
    <span ref={ref} className={`inline-grid tabular-nums ${className ?? ""}`}>
      {/* an invisible copy of the widest number holds the width; the counting number sits in the same cell,
          lined up from the right so each digit is already where it will end up and new digits appear to its left */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {widestText}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1 text-right">
        {format(revealed ? value : startNumber)}
      </span>
      {/* screen readers get the final number once instead of every step on the way */}
      <span className="sr-only">{format(targetNumber)}</span>
    </span>
  );
}
