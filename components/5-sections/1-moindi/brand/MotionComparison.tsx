"use client";

import {
  ScrambleRevealText,
  SegmentedControl,
  SlashTexture,
} from "@/components/1-atoms";
import { useInView } from "@/hooks";
import { applyBezier, type BezierPoints } from "@/lib/bezier";
import { useEffect, useId, useState } from "react";
import {
  BUILD_MS,
  CHART_MAX,
  FILL_DELAY_MS,
  GAUGE_ARC_ANGLE,
  GAUGE_EASE,
  GAUGE_SIZE,
  GAUGE_STROKE,
  SCRAMBLE_BEZIER,
  TICK_LENGTH,
  gaugeReadings,
} from "../designed-in-code/MotionSamples";
import { visualHeight } from "./frame";

// three things building in with the timings from designed in code: the curve itself, one bar and one gauge.
// once at a constant speed, once on the curves the product shipped with
interface Motion {
  label: string;
  note: string;
  // css easing for the bar's wipe and rise
  grow: string;
  // css easing for the gauge's sweep and fill
  gauge: string;
  // the count-up's curve (also the bar's, drawn in the plot), or null for a constant rate
  count: BezierPoints | null;
  // the label scramble's curve, or null for a constant rate
  scramble: BezierPoints | null;
  // how the plot names the curve
  css: string;
}

// cubic-bezier(0.4, 0, 0.2, 1), as points for the count-up and the plot
const INERTIA_BEZIER: BezierPoints = [0.4, 0, 0.2, 1];

const motions: Motion[] = [
  {
    label: "Linear",
    note: "Constant speed",
    grow: "linear",
    gauge: "linear",
    count: null,
    scramble: null,
    css: "linear",
  },
  {
    label: "Inertia",
    note: "Momentum and friction",
    // one curve for everything here, the gauge's, so the plot is exactly what the bar and the gauge run on
    grow: GAUGE_EASE,
    gauge: GAUGE_EASE,
    count: INERTIA_BEZIER,
    scramble: SCRAMBLE_BEZIER,
    css: GAUGE_EASE,
  },
];

const BAR_VALUE = 286;
// what the 72% is: how far the echoes in amber round, from the purchase card, is funded
const GAUGE_LABEL = "ECHOES IN AMBER FUNDED";
// the gauge's width against the bar's: the bar is --bar-w wide, set on the visual's root
const GAUGE_TO_BAR = 3.5;
// funded, 72%: one value the ring fills to and the number counts to
const reading =
  gaugeReadings.find((option) => option.label === "Funded") ?? gaugeReadings[0];
// the whole entrance: the fills start after the wipe's head start, then take the build time
const BUILD_TOTAL_MS = FILL_DELAY_MS + BUILD_MS;
const HOLD_MS = 1600;
// the pause on the empty frame before each entrance
const START_PAUSE_MS = 500;
// how long the curve takes to fade in, and everything takes to fade out
const FADE_MS = 400;

const ease = (curve: BezierPoints | null, progress: number) =>
  curve ? applyBezier(curve, progress) : progress;

// how far along the build is, 0 to 1, after a delay
function useProgress(started: boolean, delayMs = 0) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!started) return;
    const start = performance.now() + delayMs;
    let frame = 0;
    const step = (now: number) => {
      const next = Math.min(1, Math.max(0, (now - start) / BUILD_MS));
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, delayMs]);
  return progress;
}

// a number counting from 0 to its value in step with its fill: same delay, same duration, same curve, so
// the number always reads what the fill shows
function useCount(target: number, started: boolean, motion: Motion) {
  const progress = useProgress(started, FILL_DELAY_MS);
  return Math.round(target * ease(motion.count, progress));
}

// the two cards the panels sit in
const cardClass = "border border-current/20 p-sm md:p-md";

const panelTitleClass =
  "roboto-mono shrink-0 text-[11px] font-bold uppercase opacity-60 md:text-xs";

// line thickness for the plot, in the plot's own units at its reference size. as the plot grows or shrinks
// from that size, the lines change half as much as everything else: half the width is fixed and half scales
// with the plot (--plot, its width). drawn as non-scaling strokes, so the svg's own scaling doesn't apply
const PLOT_REFERENCE_PX = 280;
const PLOT_VIEW_UNITS = 112;
const lineWidth = (units: number) => {
  const atReference = (units * PLOT_REFERENCE_PX) / PLOT_VIEW_UNITS;
  return `calc(${atReference / 2}px + var(--plot) * ${atReference / 2 / PLOT_REFERENCE_PX})`;
};

// the curve, drawn as time across and progress up over the whole entrance: the background (the bar's track,
// the gauge's ring) builds in first, and the fill follows on the same curve after its delay. each has a dot
// riding it in step with the real thing, and the part already travelled is drawn solid over the faint whole
const PLOT_PHASES = [
  {
    key: "background",
    label: "Background",
    delayMs: 0,
    color: "var(--moindi-gray-500)",
  },
  {
    key: "fill",
    label: "Fill",
    delayMs: FILL_DELAY_MS,
    color: "var(--moindi-primary-500)",
  },
];

function CurvePlot({
  motion,
  started,
  curveShown,
  fadingOut,
}: {
  motion: Motion;
  started: boolean;
  // the curve fades in on its own before the build, and fades out with everything else after it; the axes stay
  curveShown: boolean;
  fadingOut: boolean;
}) {
  const curveStyle = {
    opacity: curveShown && !fadingOut ? 1 : 0,
    transition: `opacity ${FADE_MS}ms ease-in-out`,
  };
  // time across the whole entrance, so both phases share one axis
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const next = Math.min(BUILD_TOTAL_MS, now - start);
      setElapsed(next);
      if (next < BUILD_TOTAL_MS) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started]);

  const samples = 40;
  // a phase's point at its own progress t: across from its delay, up by the eased value
  const point = (delayMs: number, t: number) => ({
    x: ((delayMs + t * BUILD_MS) / BUILD_TOTAL_MS) * 100,
    y: 100 - ease(motion.count, t) * 100,
  });
  const path = (delayMs: number, until: number) =>
    Array.from({ length: Math.round(samples * until) + 1 }, (_, index) => {
      const { x, y } = point(delayMs, index / samples);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");

  return (
    <div className="flex min-h-0 flex-col items-center gap-2">
      <div
        // as big as its panel allows, leaving room for the axis labels beside and under it and the legend
        className="relative aspect-square"
        style={
          {
            "--plot": "min(calc(100cqw - 2rem), calc(100cqh - 4rem))",
            width: "var(--plot)",
          } as React.CSSProperties
        }
      >
        <svg
          viewBox="-6 -6 112 112"
          className="size-full overflow-visible"
          role="img"
          aria-label={`The ${motion.label.toLowerCase()} curve, ${motion.css}: the background builds in first and the fill follows ${FILL_DELAY_MS}ms later`}
        >
          <path
            d="M0,0 V100 H100"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.3"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: lineWidth(0.5) }}
          />
          <g style={curveStyle}>
            {/* the playhead: where the entrance is in time, sweeping across as both phases run */}
            <line
              x1={(elapsed / BUILD_TOTAL_MS) * 100}
              x2={(elapsed / BUILD_TOTAL_MS) * 100}
              y1={0}
              y2={100}
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: lineWidth(0.5) }}
            />
            {PLOT_PHASES.map((phase) => {
              const progress = Math.min(
                1,
                Math.max(0, (elapsed - phase.delayMs) / BUILD_MS),
              );
              const dot = point(phase.delayMs, progress);
              return (
                <g key={phase.key}>
                  <path
                    d={path(phase.delayMs, 1)}
                    fill="none"
                    stroke={phase.color}
                    strokeOpacity="0.2"
                    vectorEffect="non-scaling-stroke"
                    style={{ strokeWidth: lineWidth(1) }}
                  />
                  <path
                    d={path(phase.delayMs, progress)}
                    fill="none"
                    stroke={phase.color}
                    vectorEffect="non-scaling-stroke"
                    style={{ strokeWidth: lineWidth(1.25) }}
                  />
                  <circle cx={dot.x} cy={dot.y} r="2.5" fill={phase.color} />
                </g>
              );
            })}
          </g>
        </svg>
        {/* the axis names at a fixed size, each the same gap from its axis. the axes sit 6 of the viewbox's 112
            units in from the plot's edges, so 94.6% from the far side. progress is set vertically rather than
            rotated, so its box is as narrow as the text and the gap stays true */}
        <span
          className="roboto-mono absolute left-[52.7%] -translate-x-1/2 text-[9px] leading-none uppercase opacity-60"
          style={{ top: "calc(94.6% + 6px)" }}
        >
          Time
        </span>
        <span
          className="roboto-mono absolute top-[47.3%] -translate-y-1/2 rotate-180 text-[9px] leading-none uppercase opacity-60 [writing-mode:vertical-rl]"
          style={{ right: "calc(94.6% + 6px)" }}
        >
          Progress
        </span>
      </div>
      <div className="roboto-mono mt-3 flex shrink-0 flex-col items-center gap-1 text-[10px] md:text-xs">
        <span className="flex gap-3">
          {PLOT_PHASES.map((phase) => (
            <span key={phase.key} className="flex items-center gap-1">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: phase.color }}
              />
              {phase.label}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

// one bar: its slashed track wipes up, then the fill rises into it while the value counts up
function SingleBar({ motion, started }: { motion: Motion; started: boolean }) {
  const color = "var(--moindi-secondary-500)";
  const shown = useCount(BAR_VALUE, started, motion);
  return (
    <div className="flex h-full min-h-0 flex-col items-center gap-1">
      <div className="relative min-h-0 w-(--bar-w) flex-1">
        <div
          // its own compositing layer the whole time: chrome runs the clip-path wipe on the gpu, and without this the
          // slash pattern is redrawn a hair differently when the wipe ends, which flickers
          className="absolute inset-0 transform-[translateZ(0)] overflow-hidden bg-(--moindi-gray-100)"
          style={{
            clipPath: started ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
            transition: started
              ? `clip-path ${BUILD_MS}ms ${motion.grow}`
              : "none",
          }}
        >
          <SlashTexture color={color} />
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              backgroundColor: color,
              height: started ? `${(BAR_VALUE / CHART_MAX) * 100}%` : "0%",
              transition: started
                ? `height ${BUILD_MS}ms ${motion.grow} ${FILL_DELAY_MS}ms`
                : "none",
            }}
          />
        </div>
      </div>
      <span
        className={`shrink-0 font-mono text-[11px] tabular-nums md:text-xs ${started ? "" : "invisible"}`}
      >
        {shown}k
      </span>
    </div>
  );
}

// one gauge: the ring sweeps in over its track, the fill follows, the value counts up and the label scrambles in
function SingleGauge({
  motion,
  started,
}: {
  motion: Motion;
  started: boolean;
}) {
  const maskId = `gauge-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const radius = GAUGE_SIZE / 2 - GAUGE_STROKE / 2;
  const circumference = 2 * Math.PI * radius;
  const arc = (circumference * GAUGE_ARC_ANGLE) / 360;
  const fill = arc * Math.min(1, reading.count / reading.maxCount);
  const tickSpacing = arc / (reading.maxCount / reading.unit);
  const color = `var(--moindi-${reading.color}-500)`;
  const shownValue = useCount(reading.count, started, motion);
  const sweep = (delayMs: number) =>
    started
      ? `stroke-dashoffset ${BUILD_MS}ms ${motion.gauge} ${delayMs}ms`
      : "none";
  // a longer label than the reading's own "funded", so the scramble has enough characters to show its curve
  const label = GAUGE_LABEL;
  // sized off the panel like the gauge and its number, so it stays in proportion at any size
  const labelClass =
    "font-mono text-[clamp(0.625rem,5cqmin,1.125rem)] font-bold whitespace-nowrap";

  return (
    // the ring is 270°, so the bottom of its square is empty: the label rises into that opening
    // as big as its panel allows either way: the panel is a size container, and the gauge's height is about its
    // width once the label tucks into the ring's opening
    <div
      className="flex flex-col items-center"
      // at most GAUGE_TO_BAR times the bar's width, so the two keep the same proportion at every size; smaller
      // only if the panel can't fit that
      style={{
        width: `min(100cqw, calc(100cqh - 0.5rem), calc(var(--bar-w) * ${GAUGE_TO_BAR}))`,
      }}
    >
      <div className="relative aspect-square w-full">
        <svg
          viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
          className="size-full rotate-135"
          aria-hidden="true"
        >
          <mask id={maskId}>
            <circle
              cx={GAUGE_SIZE / 2}
              cy={GAUGE_SIZE / 2}
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth={GAUGE_STROKE}
              strokeDasharray={`${arc} ${circumference}`}
              strokeDashoffset={started ? 0 : arc}
              style={{ transition: sweep(0) }}
            />
          </mask>
          <g mask={`url(#${maskId})`}>
            <rect
              width={GAUGE_SIZE}
              height={GAUGE_SIZE}
              fill="var(--moindi-gray-100)"
            />
            <circle
              cx={GAUGE_SIZE / 2}
              cy={GAUGE_SIZE / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={GAUGE_STROKE}
              strokeDasharray={`${TICK_LENGTH} ${tickSpacing - TICK_LENGTH}`}
              strokeDashoffset={-(tickSpacing - TICK_LENGTH)}
            />
          </g>
          <circle
            cx={GAUGE_SIZE / 2}
            cy={GAUGE_SIZE / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={GAUGE_STROKE}
            strokeDasharray={`${arc} ${circumference}`}
            strokeDashoffset={started ? arc - fill : arc}
            style={{ transition: sweep(FILL_DELAY_MS) }}
          />
        </svg>
        <div
          // the number waits for the build to start, rather than sitting at 0%
          className={`absolute inset-0 flex items-center justify-center font-mono text-[clamp(0.75rem,9cqmin,1.5rem)] font-bold tabular-nums ${started ? "" : "invisible"}`}
        >
          <span className="text-[1.4em]">{shownValue}%</span>
        </div>
      </div>
      <div className="mt-[-6%]">
        {started ? (
          <ScrambleRevealText
            text={label}
            // the same speed as the background: it starts and finishes with the ring's sweep
            durationMs={BUILD_MS}
            bezier={motion.scramble ?? undefined}
            className={labelClass}
          />
        ) : (
          <span className={`${labelClass} invisible`}>{label}</span>
        )}
      </div>
    </div>
  );
}

function Panel({
  title,
  className = "",
  sized = false,
  children,
}: {
  title: string;
  className?: string;
  // makes the content area a size container, for content that scales to it
  sized?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`gap-sm flex min-h-0 min-w-0 flex-col ${className}`}>
      <span className={panelTitleClass}>{title}</span>
      <div
        className={`flex min-h-0 flex-1 items-center justify-center ${sized ? "@container-[size]" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

// one motion at a time: the curve, a bar and a gauge build in together, hold, then the other motion takes over
// and they build in from nothing, on repeat while on screen. the switch on top shows which is playing and can
// pick one
export function MotionComparison() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [motionIndex, setMotionIndex] = useState(0);
  // bumped on every switch, so everything remounts at zero and builds in again
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const motion = motions[motionIndex];

  // the curve fades in on the empty axes, then the build starts; after a hold, everything but the axes fades
  // out and the next run begins
  const [curveShown, setCurveShown] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const resetTo = (index: number) => {
    setStarted(false);
    setCurveShown(false);
    setFadingOut(false);
    setMotionIndex(index);
    setRun((count) => count + 1);
  };
  const show = (index: number) => resetTo(index);

  // a new run: the curve fades in on the next frame, and the build starts once it has
  useEffect(() => {
    if (!inView) return;
    const frame = requestAnimationFrame(() => setCurveShown(true));
    const timeout = setTimeout(
      () => setStarted(true),
      Math.max(START_PAUSE_MS, FADE_MS),
    );
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [inView, run]);

  // after the entrance and a hold, fade out. held on the finished build for reduced motion
  useEffect(() => {
    if (!inView || !started || fadingOut) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = setTimeout(
      () => setFadingOut(true),
      BUILD_TOTAL_MS + HOLD_MS,
    );
    return () => clearTimeout(timeout);
  }, [inView, started, fadingOut]);

  // once faded, the other motion takes over
  useEffect(() => {
    if (!fadingOut) return;
    const timeout = setTimeout(
      () => resetTo((motionIndex + 1) % motions.length),
      FADE_MS,
    );
    return () => clearTimeout(timeout);
  }, [fadingOut, motionIndex]);

  const fadeStyle = {
    opacity: fadingOut ? 0 : 1,
    transition: `opacity ${FADE_MS}ms ease-in-out`,
  };

  return (
    <div
      ref={ref}
      className={`gap-sm md:gap-md p-md md:p-lg grid bg-(--moindi-gray-30) text-(--moindi-gray-900) [--bar-w:3.5rem] max-md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:[--bar-w:5rem] ${visualHeight}`}
    >
      {/* the control area: which motion, what it means, and its curve */}
      <div className={`gap-sm flex min-h-0 min-w-0 flex-col ${cardClass}`}>
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
          <SegmentedControl
            label="Motion"
            options={motions.map((option, index) => ({
              value: index,
              content: option.label,
            }))}
            value={motionIndex}
            onChange={show}
            activeClassName="bg-(--moindi-gray-900) text-(--moindi-gray-30)"
          />
          <span
            className="roboto-mono text-xs uppercase opacity-60 md:text-sm"
            aria-live="polite"
          >
            {motion.note}
          </span>
        </div>
        <div
          key={`curve-${run}`}
          className="@container-[size] flex min-h-0 flex-1 items-center justify-center"
        >
          <CurvePlot
            motion={motion}
            started={started}
            curveShown={curveShown}
            fadingOut={fadingOut}
          />
        </div>
      </div>

      {/* the animations area: the bar and the gauge running on that curve, each in its own section */}
      <div
        key={`animations-${run}`}
        className={`grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] ${cardClass}`}
      >
        <Panel title="Bar" className="pr-sm md:pr-md">
          <div className="h-full" style={fadeStyle}>
            <SingleBar motion={motion} started={started} />
          </div>
        </Panel>
        <Panel
          title="Gauge"
          sized
          className="pl-sm md:pl-md border-l border-current/20"
        >
          <div
            className="flex size-full items-center justify-center"
            style={fadeStyle}
          >
            <SingleGauge motion={motion} started={started} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
