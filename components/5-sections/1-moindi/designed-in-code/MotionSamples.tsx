"use client";

import { ScrambleRevealText } from "@/components/1-atoms";
import { useInView } from "@/hooks";
import { applyBezier, type BezierPoints } from "@/lib/bezier";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useCountdown } from "./shared";

// the angular project's curves: bars grow and values count on cubic-bezier(0, 0, 0.25, 1) (growToTop and the
// count-up atom), and the gauge's tick reveal and fill run on cubic-bezier(0.4, 0, 0.2, 1)
export const COUNT_UP_BEZIER: BezierPoints = [0, 0, 0.25, 1];
export const GROW_EASE = "cubic-bezier(0, 0, 0.25, 1)";
export const GAUGE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
// the scramble-reveal atom's pace: characters settle slowly at first and faster toward the end
export const SCRAMBLE_BEZIER: BezierPoints = [0, 0, 1, 0.75];
// the original's updates use tailwind's ease-in-out class, which is this curve rather than css's own
// ease-in-out keyword (0.42, 0, 0.58, 1)
const UPDATE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

// the original's timings: bars and gauges build in over 1s, bars staggered 50ms apart, fills follow 300ms
// later, and later changes take 300ms
export const BUILD_MS = 1000;
export const STAGGER_MS = 50;
export const FILL_DELAY_MS = 400;
const UPDATE_MS = 750;

// counts from the number it last showed to the new one, as the original's chart-value does on each update
function useTweenedNumber(
  target: number,
  durationMs: number,
  active: boolean,
  decimals = 0,
) {
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    const from = active ? shownRef.current : 0;
    const to = active ? target : 0;
    if (from === to) return;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = applyBezier(COUNT_UP_BEZIER, progress);
      const factor = 10 ** decimals;
      const value = Math.round((from + (to - from) * eased) * factor) / factor;
      shownRef.current = value;
      setShown(value);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, active, decimals]);

  return shown;
}

// gauges from around the app. every tick is one unit of what the gauge counts, so a ten-track album gets ten
// ticks and the fill lands on the tick of the last track done
type GaugeFormat = "percentage" | "fraction" | "currency";
export const gaugeReadings: {
  label: string;
  count: number;
  maxCount: number;
  // what one tick stands for, in the gauge's own units
  unit: number;
  format: GaugeFormat;
  color: "primary" | "secondary";
}[] = [
  {
    label: "Tracks mixed",
    count: 7,
    maxCount: 10,
    unit: 1,
    format: "fraction",
    color: "primary",
  },
  {
    label: "Weeks left",
    count: 5,
    maxCount: 12,
    unit: 1,
    format: "fraction",
    color: "secondary",
  },
  {
    label: "Funded",
    count: 72,
    maxCount: 100,
    unit: 5,
    format: "percentage",
    color: "primary",
  },
  {
    label: "Backer spots",
    count: 18,
    maxCount: 25,
    unit: 1,
    format: "fraction",
    color: "secondary",
  },
  {
    label: "Raised",
    count: 12000,
    maxCount: 18000,
    unit: 1000,
    format: "currency",
    color: "primary",
  },
];
const GAUGE_CYCLE_MS = 4000;
// the original's ring: a 270° arc with ticks 1 unit long
export const GAUGE_SIZE = 160;
export const GAUGE_STROKE = 14;
export const GAUGE_ARC_ANGLE = 270;
export const TICK_LENGTH = 1;

export const formatWhole = (value: number) =>
  Math.round(value).toLocaleString("en-US");

// one reading, built from nothing: the ring sweeps in over its pale track, the fill runs to the value 300ms
// later, the value counts up in the middle and the label scrambles in underneath
function GaugeReading({
  reading,
}: {
  reading: (typeof gaugeReadings)[number];
}) {
  const [ref, isInView] = useInView<HTMLDivElement>(0.4);
  const maskId = `gauge-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const radius = GAUGE_SIZE / 2 - GAUGE_STROKE / 2;
  const circumference = 2 * Math.PI * radius;
  const arc = (circumference * GAUGE_ARC_ANGLE) / 360;
  const fill = arc * Math.min(1, reading.count / reading.maxCount);
  // one tick at the end of every unit, so the last one sits on the end of the arc and the fill stops on a tick
  const units = reading.maxCount / reading.unit;
  const tickSpacing = arc / units;

  const shownValue = useTweenedNumber(reading.count, BUILD_MS, isInView);
  const shownMax = useTweenedNumber(reading.maxCount, BUILD_MS, isInView);
  const color = `var(--moindi-${reading.color}-500)`;
  const prefix = reading.format === "currency" ? "$" : "";
  const sweep = (delayMs: number) =>
    isInView
      ? `stroke-dashoffset ${BUILD_MS}ms ${GAUGE_EASE} ${delayMs}ms`
      : "none";

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1"
      role="img"
      aria-label={`${reading.label}: ${
        reading.format === "percentage"
          ? `${reading.count}%`
          : `${prefix}${formatWhole(reading.count)} of ${prefix}${formatWhole(reading.maxCount)}`
      }, ${units} ticks of ${prefix}${formatWhole(reading.unit)}${reading.format === "percentage" ? "%" : ""} each`}
    >
      <div className="relative size-24 md:size-32 lg:size-40">
        <svg
          viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
          className="size-full rotate-[135deg]"
          aria-hidden="true"
        >
          {/* the arc that sweeps in and reveals the track and its ticks */}
          <mask id={maskId}>
            <circle
              cx={GAUGE_SIZE / 2}
              cy={GAUGE_SIZE / 2}
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth={GAUGE_STROKE}
              strokeDasharray={`${arc} ${circumference}`}
              strokeDashoffset={isInView ? 0 : arc}
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
            strokeDashoffset={isInView ? arc - fill : arc}
            style={{ transition: sweep(FILL_DELAY_MS) }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center font-mono font-bold tabular-nums"
          aria-hidden="true"
        >
          {reading.format === "percentage" ? (
            <span className="text-lg md:text-xl lg:text-2xl">
              {Math.round(shownValue)}%
            </span>
          ) : (
            // the original's vertical chart-value: the count over its max, split by a rule
            <span className="flex flex-col items-center text-xs md:text-sm lg:text-base">
              <span>
                {prefix}
                {formatWhole(shownValue)}
              </span>
              <span className="border-t border-current px-1">
                {prefix}
                {formatWhole(shownMax)}
              </span>
            </span>
          )}
        </div>
      </div>
      <ScrambleRevealText
        text={reading.label.toUpperCase()}
        durationMs={BUILD_MS}
        bezier={SCRAMBLE_BEZIER}
        className="font-mono text-xs font-bold whitespace-nowrap"
      />
    </div>
  );
}

// the original's chart-gauge-item, moving through the readings above. each one builds from the start rather
// than morphing out of the last, so every reading shows the full entrance
function Gauge() {
  const [ref, isInView] = useInView<HTMLDivElement>(0.4);
  const [readingIndex, setReadingIndex] = useState(0);

  useEffect(() => {
    if (
      !isInView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timeout = setTimeout(
      () => setReadingIndex((index) => (index + 1) % gaugeReadings.length),
      GAUGE_CYCLE_MS,
    );
    return () => clearTimeout(timeout);
  }, [isInView, readingIndex]);

  return (
    <div ref={ref}>
      <GaugeReading key={readingIndex} reading={gaugeReadings[readingIndex]} />
    </div>
  );
}

// one digit of an odometer. when it changes, the new digit rolls down into place from above while the old one
// rolls out below, the way a countdown's wheel turns, on the update curve
function OdometerDigit({ digit }: { digit: string }) {
  const [roll, setRoll] = useState({
    current: digit,
    previous: null as string | null,
    turn: 0,
  });
  // a new digit starts a roll from whatever was showing
  if (roll.current !== digit) {
    setRoll({ current: digit, previous: roll.current, turn: roll.turn + 1 });
  }
  const incomingRef = useRef<HTMLSpanElement>(null);
  const outgoingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (
      roll.turn === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timing = { duration: UPDATE_MS, easing: UPDATE_EASE };
    const incoming = incomingRef.current?.animate(
      [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }],
      timing,
    );
    const outgoing = outgoingRef.current?.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
      timing,
    );
    return () => {
      incoming?.cancel();
      outgoing?.cancel();
    };
  }, [roll.turn]);

  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span ref={incomingRef} className="block">
        {roll.current}
      </span>
      {roll.previous !== null && (
        // parked below the slot once it's rolled out. set as transform, the same property the roll animates:
        // tailwind's translate-y-full sets the separate translate property, which adds to the animation and
        // starts the old digit already out of sight
        <span
          ref={outgoingRef}
          className="absolute inset-x-0 top-0 block"
          style={{ transform: "translateY(100%)" }}
        >
          {roll.previous}
        </span>
      )}
    </span>
  );
}

// the countdown's digits each roll like an odometer; the units between them stay put
function OdometerText({ text }: { text: string }) {
  return (
    <>
      {/* read as one string; the rolling digits are only for the eye */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text
          .split("")
          .map((character, index) =>
            /\d/.test(character) ? (
              <OdometerDigit key={index} digit={character} />
            ) : (
              <span key={index}>{character}</span>
            ),
          )}
      </span>
    </>
  );
}

function LiveCountdown() {
  const countdown = useCountdown(52 * 86400 * 1000 + 2 * 3600 * 1000);
  return (
    <div className="flex flex-col items-center gap-1 font-mono">
      <span className="text-xs uppercase opacity-60">Ends in</span>
      <span className="text-base leading-none font-bold whitespace-pre tabular-nums sm:text-xl md:text-lg xl:text-2xl">
        {countdown ? <OdometerText text={countdown.text} /> : " "}
      </span>
      <span className="text-xs opacity-60">
        {countdown?.endDate.toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </span>
    </div>
  );
}

// tracks from luna veyne's album echoes in amber, each with its own numbers. the card rotates through them
const albumTracks = [
  {
    title: "ECHOES IN AMBER",
    position: "Title track",
    stats: { streams: 412.8, saves: 38.6, playlists: 1240 },
  },
  {
    title: "AMBER HOUR",
    position: "Track 2",
    stats: { streams: 286.4, saves: 24.1, playlists: 870 },
  },
  {
    title: "HALF-LIT ROOMS",
    position: "Track 5",
    stats: { streams: 197.2, saves: 19.7, playlists: 612 },
  },
  {
    title: "SLOW BURN STATIC",
    position: "Track 8",
    stats: { streams: 158.9, saves: 12.3, playlists: 455 },
  },
];
const statColumns = [
  { key: "streams", label: "Streams", suffix: "k" },
  { key: "saves", label: "Saves", suffix: "k" },
  { key: "playlists", label: "Playlists", suffix: "" },
] as const;
const REVEAL_CYCLE_MS = 4000;
// the same second the name takes to scramble in
const REVEAL_COUNT_MS = 1000;

// one of the track's numbers, as the original's chart-value: counts up from zero the first time, then from
// the last track's number to this one's, on the count-up curve and in step with the name's scramble
function StatValue({
  value,
  suffix,
  label,
  isInView,
}: {
  value: number;
  suffix: string;
  label: string;
  isInView: boolean;
}) {
  const decimals = Number.isInteger(value) ? 0 : 1;
  const shown = useTweenedNumber(value, REVEAL_COUNT_MS, isInView, decimals);
  return (
    <div className="flex flex-col">
      <span className="text-base font-bold whitespace-nowrap tabular-nums sm:text-xl lg:text-2xl">
        {shown.toFixed(decimals)}
        {suffix}
      </span>
      <span className="text-xs opacity-60">{label}</span>
    </div>
  );
}

// the profile header's entrance: a track's name scrambles into place while its numbers count up under it.
// every few seconds it moves to the next track on the album and plays again
function RevealSample() {
  const [ref, isInView] = useInView<HTMLDivElement>(0.3);
  const [trackIndex, setTrackIndex] = useState(0);
  const track = albumTracks[trackIndex];

  useEffect(() => {
    if (
      !isInView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timeout = setTimeout(
      () => setTrackIndex((index) => (index + 1) % albumTracks.length),
      REVEAL_CYCLE_MS,
    );
    return () => clearTimeout(timeout);
  }, [isInView, trackIndex]);

  return (
    <div
      ref={ref}
      className="gap-xs md:gap-md flex w-full flex-col items-center text-center font-mono"
    >
      {/* keyed by track, so each name scrambles in from the start */}
      <div key={track.title} className="flex flex-col items-center gap-1">
        <ScrambleRevealText
          text={track.title}
          durationMs={1000}
          resetOnLeave
          className="text-lg font-bold whitespace-nowrap sm:text-2xl lg:text-3xl"
        />
        <ScrambleRevealText
          text={`Echoes in Amber · ${track.position}`}
          durationMs={900}
          delayMs={300}
          resetOnLeave
          className="text-xs opacity-60 sm:text-sm"
        />
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        {statColumns.map((column) => (
          <StatValue
            key={column.key}
            value={track.stats[column.key]}
            suffix={column.suffix}
            label={column.label}
            isInView={isInView}
          />
        ))}
      </div>
    </div>
  );
}

// echoes in amber's eight tracks and the streams each picked up in its first eight weeks out, in thousands.
// the chart shows the running total, so every week the bars climb: the title track leads from the start, and
// afterglow letters sits near the bottom until a playlist pick in week 5 sends it up the order
export const albumTrackWeeks = [
  {
    number: "01",
    title: "Echoes in Amber",
    weekly: [92, 74, 61, 52, 44, 36, 29, 25],
  },
  {
    number: "02",
    title: "Amber Hour",
    weekly: [58, 49, 42, 37, 32, 27, 22, 19],
  },
  {
    number: "03",
    title: "Paper Lanterns",
    weekly: [31, 27, 24, 21, 19, 16, 14, 12],
  },
  {
    number: "04",
    title: "Glasshouse",
    weekly: [24, 22, 25, 31, 33, 30, 29, 27],
  },
  {
    number: "05",
    title: "Half-Lit Rooms",
    weekly: [35, 31, 28, 25, 23, 20, 18, 17],
  },
  {
    number: "06",
    title: "Low Tide Radio",
    weekly: [26, 22, 19, 17, 15, 13, 11, 9],
  },
  {
    number: "07",
    title: "Afterglow Letters",
    weekly: [12, 11, 10, 14, 41, 58, 54, 48],
  },
  {
    number: "08",
    title: "Slow Burn Static",
    weekly: [29, 25, 22, 20, 18, 16, 15, 14],
  },
];
export const WEEK_COUNT = 8;
// each track's running total at the end of a week
export const cumulativeStreams = (week: number) =>
  albumTrackWeeks.map((track) =>
    track.weekly.slice(0, week + 1).reduce((sum, streams) => sum + streams, 0),
  );
// every bar's track is the same ceiling, as the original's maxCount: just over the biggest final total, so the
// bars have room to climb all the way through week 8
export const CHART_MAX = 450;
const CHART_CYCLE_MS = 2500;

// the original's slash-texture: two thin diagonal strokes repeated as a pattern, in the bar's color
export function SlashTexture({
  color,
  scale = 0.35,
}: {
  color: string;
  scale?: number;
}) {
  // useId can include characters a url(#...) reference trips over
  const id = `slash-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={16 * scale}
          height={36 * scale}
        >
          <g fill={color} transform={`scale(${scale})`}>
            <rect
              x="-21.8"
              y="17"
              width="41.4"
              height="2"
              transform="rotate(-66.04 -1.1 18)"
            />
            <rect
              x="-5.8"
              y="17"
              width="41.4"
              height="2"
              transform="rotate(-66.04 14.9 18)"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// one bar of the series: a slash-textured track the full height of the chart, with the solid fill rising
// inside it to the value, and the value itself underneath
function ChartBar({
  value,
  index,
  highlighted,
  isInView,
  built,
}: {
  value: number;
  index: number;
  highlighted: boolean;
  isInView: boolean;
  built: boolean;
}) {
  const color = highlighted
    ? "var(--moindi-primary-500)"
    : "var(--moindi-secondary-500)";
  const shown = useTweenedNumber(value, built ? UPDATE_MS : BUILD_MS, isInView);
  const ease = GROW_EASE;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col items-center gap-1">
      <div className="relative min-h-0 w-full max-w-10 flex-1">
        <div
          // the track is always full height and gets wiped into view from the bottom, so the slashes stay
          // put while they're revealed. growing its height instead would drag the pattern along with the top
          // its own compositing layer the whole time: chrome runs the clip-path wipe on the gpu, and without this the
          // slash pattern is redrawn a hair differently when the wipe ends, which flickers bar by bar
          className="absolute inset-0 [transform:translateZ(0)] overflow-hidden bg-(--moindi-gray-100)"
          style={{
            clipPath: isInView ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
            transition: isInView
              ? `clip-path ${BUILD_MS}ms ${ease} ${index * STAGGER_MS}ms`
              : "none",
          }}
        >
          <SlashTexture color={color} />
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              backgroundColor: color,
              height: isInView ? `${(value / CHART_MAX) * 100}%` : "0%",
              transition: !isInView
                ? "none"
                : built
                  ? `height ${UPDATE_MS}ms ${UPDATE_EASE}, background-color ${UPDATE_MS}ms ${UPDATE_EASE}`
                  : `height ${BUILD_MS}ms ${ease} ${index * STAGGER_MS + FILL_DELAY_MS}ms`,
            }}
          />
        </div>
      </div>
      <span className="shrink-0 text-center font-mono text-[10px] tabular-nums sm:text-xs">
        {shown}k
      </span>
    </div>
  );
}

// the original's chart-series, vertical: tracks build in one after another as the chart scrolls into view, the
// fills rise into them and the values count up underneath. then it steps a week at a time, and each step
// glides the fills and counts the totals up to the new week's. the week buttons jump to one
function ChartSample() {
  const [ref, isInView] = useInView<HTMLDivElement>(0.3);
  const [week, setWeek] = useState(0);
  // once the build-in is over, changes switch to the quicker update timing
  const [built, setBuilt] = useState(false);
  const totals = cumulativeStreams(week);
  const leader = Math.max(...totals);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(
      () => setBuilt(true),
      BUILD_MS + FILL_DELAY_MS + albumTrackWeeks.length * STAGGER_MS,
    );
    return () => clearTimeout(timeout);
  }, [isInView]);

  useEffect(() => {
    if (
      !isInView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    // hold on the last week a little longer before starting over
    const timeout = setTimeout(
      () => setWeek((current) => (current + 1) % WEEK_COUNT),
      week === WEEK_COUNT - 1 ? CHART_CYCLE_MS * 2 : CHART_CYCLE_MS,
    );
    return () => clearTimeout(timeout);
  }, [isInView, week]);

  return (
    <div ref={ref} className="gap-xs md:gap-sm flex size-full min-h-0 flex-col">
      <div className="gap-xs flex shrink-0 flex-wrap items-center justify-between">
        <span className="font-mono text-xs uppercase opacity-60">
          Total streams
        </span>
        <div className="flex items-center gap-1" role="group" aria-label="Week">
          <span className="mr-1 font-mono text-xs uppercase opacity-60">
            Week
          </span>
          {Array.from({ length: WEEK_COUNT }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={index === week}
              aria-label={`Week ${index + 1}`}
              onClick={() => setWeek(index)}
              className={`size-6 cursor-pointer border border-current font-mono text-xs transition-colors ${index === week ? "bg-(--moindi-gray-900) text-(--moindi-gray-30)" : "hover:bg-current/10"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div
        className="flex min-h-0 flex-1 gap-1 sm:gap-2"
        role="img"
        aria-label={`Total streams for each track on Echoes in Amber after week ${week + 1}, in thousands: ${albumTrackWeeks.map((track, index) => `${track.title} ${totals[index]}k`).join(", ")}`}
      >
        {totals.map((value, index) => (
          <ChartBar
            key={albumTrackWeeks[index].number}
            value={value}
            index={index}
            highlighted={value === leader}
            isInView={isInView}
            built={built}
          />
        ))}
      </div>
      <div className="flex shrink-0 gap-1 sm:gap-2" aria-hidden="true">
        {albumTrackWeeks.map((track) => (
          <span
            key={track.number}
            title={track.title}
            className="flex-1 text-center font-mono text-[10px] opacity-60 sm:text-xs"
          >
            {track.number}
          </span>
        ))}
      </div>
    </div>
  );
}

// a labelled card that fills its grid cell. replaying remounts the sample, so it runs from the start
function MotionCard({
  name,
  description,
  replayable = true,
  className = "",
  children,
}: {
  name: string;
  description: string;
  replayable?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [run, setRun] = useState(0);
  return (
    <figure
      className={`flex min-h-0 flex-col border border-black/15 bg-(--moindi-gray-30) text-(--moindi-gray-900) ${className}`}
    >
      <div className="px-sm flex shrink-0 items-center justify-between gap-2 border-b border-black/15 py-1.5 md:py-2">
        <span className="font-mono text-xs font-bold uppercase">{name}</span>
        {replayable && (
          <button
            type="button"
            onClick={() => setRun((count) => count + 1)}
            className="cursor-pointer font-mono text-xs uppercase underline-offset-2 opacity-60 hover:underline hover:opacity-100"
          >
            Replay
          </button>
        )}
      </div>
      <div
        key={run}
        className="p-xs md:p-sm flex min-h-0 flex-1 items-center justify-center"
      >
        {children}
      </div>
      <figcaption className="px-sm pb-sm shrink-0 text-xs opacity-70 max-md:hidden">
        {description}
      </figcaption>
    </figure>
  );
}

// the components whose motion was designed alongside them, running live, in a grid as tall as the frames on the
// other slides: the chart takes the big cell, the reveal a wide one, and the gauge and countdown share the rest
export function MotionSamples() {
  return (
    <div className="gap-xs md:gap-md grid h-full grid-cols-2 grid-rows-[minmax(0,1fr)_auto_auto] md:h-[min(calc(280px*150/71.9),calc(100svh-24rem))] md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)] md:grid-rows-2">
      <MotionCard
        name="Chart series"
        description="Each track's total streams on the album, a week at a time. Bars build in one by one, then glide as the weeks add up."
        className="col-span-2 md:col-span-1 md:row-span-2"
      >
        <ChartSample />
      </MotionCard>
      <MotionCard
        name="Scramble & count up"
        description="Each track's name scrambles into place while its numbers count up, then the next track takes over."
        className="col-span-2"
      >
        <RevealSample />
      </MotionCard>
      <MotionCard
        name="Gauge"
        description="Each tick is one unit. The ring sweeps in, then fills to the value."
      >
        <Gauge />
      </MotionCard>
      <MotionCard
        name="Countdown"
        description="Every round's deadline ticks down live, to the second."
        replayable={false}
      >
        <LiveCountdown />
      </MotionCard>
    </div>
  );
}
