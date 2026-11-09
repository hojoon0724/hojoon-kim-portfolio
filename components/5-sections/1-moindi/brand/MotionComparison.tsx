"use client";

import { useInView } from "@/hooks";
import { useEffect, useState } from "react";
import { visualHeight } from "./frame";

const tracks = [
  { label: "Linear", note: "Constant speed", easing: "linear" },
  {
    label: "Inertia",
    note: "Momentum and friction",
    easing: "var(--bezier-movement-inertia-1000)",
  },
];

const MOVE_MS = 1000;
const HOLD_MS = 900;

// the same distance and duration twice: once at a constant speed, once with the curve the product moves on.
// it runs back and forth on its own while it's on screen, and the button runs it by hand
export function MotionComparison() {
  const [isMoved, setIsMoved] = useState(false);
  const [auto, setAuto] = useState(true);
  const [ref, inView] = useInView<HTMLDivElement>(0.4);

  useEffect(() => {
    if (!inView || !auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = setTimeout(
      () => setIsMoved((moved) => !moved),
      MOVE_MS + HOLD_MS,
    );
    return () => clearTimeout(timeout);
  }, [inView, auto, isMoved]);

  return (
    <div
      ref={ref}
      className={`gap-lg p-md md:p-xl flex flex-col justify-center bg-(--moindi-gray-950) text-(--moindi-gray-50) ${visualHeight}`}
    >
      {tracks.map((track) => (
        <div key={track.label} className="gap-sm flex flex-col">
          <div className="roboto-mono flex justify-between text-xs uppercase md:text-sm">
            <span className="font-bold">{track.label}</span>
            <span className="opacity-60">{track.note}</span>
          </div>
          <div className="relative h-(--dot) border-b border-current/40 [--dot:2rem] md:[--dot:3rem]">
            <div
              className="absolute top-0 size-(--dot) bg-(--moindi-primary-500) transition-[left]"
              style={{
                left: isMoved ? "calc(100% - var(--dot))" : "0%",
                transitionDuration: `${MOVE_MS}ms`,
                transitionTimingFunction: track.easing,
              }}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          setAuto(false);
          setIsMoved((moved) => !moved);
        }}
        className="roboto-mono px-md w-fit cursor-pointer border border-current py-1 text-xs font-bold uppercase transition-colors hover:bg-current/10 md:text-sm"
      >
        {isMoved ? "Move back" : "Move"}
      </button>
    </div>
  );
}
