"use client";

import { applyBezier, type BezierPoints } from "@/lib/bezier";
import { Space_Mono } from "next/font/google";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  appearingPieces,
  finalStep,
  hiddenPieces,
  letterBuilds,
  type OverlayItem,
  type Pieces,
  type Point,
  type Quad,
  DRAW_MS,
  TWEEN_MS,
} from "./letters";

// the motion curve, --bezier-movement-inertia-1000: cubic-bezier(0.44, 0.7, 0.12, 1). the guides drawing in, the
// pieces scaling and the letters moving all use it. the points are for the requestAnimationFrame tweens, which
// can't read css
const MOTION_BEZIER: BezierPoints = [0.44, 0.7, 0.12, 1];
const MOTION_EASE = "var(--bezier-movement-inertia-1000)";

const GUIDE_COLOR = "var(--moindi-secondary-400)";
// round caps on near-zero dashes make dots
const DOTS = "0.01 2.2";

// the construction rectangle. when it appears it's dragged out from its first corner to the opposite one; when it
// goes, it only fades
// rounds a computed coordinate before it's rendered. the server and the browser can work out the same trig a
// hair apart (Safari and Node differ around the 15th digit), which React reports as a hydration mismatch.
// a thousandth of a unit is far below a pixel
const round = (value: number) => Math.round(value * 1000) / 1000;

function ConstructionRect({
  points,
  isShown,
  className,
  tempo,
}: {
  points: Quad;
  isShown: boolean;
  className: string;
  tempo: number;
}) {
  const ref = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !isShown) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = element.animate(
      [{ transform: "scale(0)" }, { transform: "scale(1)" }],
      // the curve spelled out: element.animate can't read a css variable
      { duration: DRAW_MS * tempo, easing: "cubic-bezier(0.44, 0.7, 0.12, 1)" },
    );
    return () => animation.cancel();
  }, [isShown, tempo]);

  return (
    <polygon
      ref={ref}
      points={points.map(([x, y]) => `${round(x)},${round(y)}`).join(" ")}
      fill={GUIDE_COLOR}
      fillOpacity={0.2}
      className={className}
      style={{
        transformBox: "view-box",
        transformOrigin: `${points[0][0]}px ${points[0][1]}px`,
      }}
    />
  );
}

const LINE_FADE_MS = 500;
// the guides draw on the same curve as everything else here
const PEN_BEZIER = MOTION_BEZIER;

// a dotted construction line. when it appears it's drawn from one end to the other; when it goes, it only fades
function ConstructionLine({
  from,
  to,
  isShown,
  tempo,
}: {
  from: Point;
  to: Point;
  isShown: boolean;
  tempo: number;
}) {
  const [progress, setProgress] = useState(0);

  // drawn like a pen stroke: it shows up at once and runs from one end to the other at an even pace, easing in and
  // out at the ends. once it's gone it's put back to nothing, out of sight, so the next time it draws from scratch
  useEffect(() => {
    let frame = 0;
    if (!isShown) {
      const timeout = setTimeout(() => setProgress(0), LINE_FADE_MS);
      return () => clearTimeout(timeout);
    }
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : DRAW_MS * tempo;
    const start = performance.now();
    const tick = (now: number) => {
      const linear = duration ? Math.min(1, (now - start) / duration) : 1;
      setProgress(applyBezier(PEN_BEZIER, linear));
      if (linear < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isShown, tempo]);

  return (
    <line
      x1={round(from[0])}
      y1={round(from[1])}
      x2={round(from[0] + (to[0] - from[0]) * progress)}
      y2={round(from[1] + (to[1] - from[1]) * progress)}
      strokeDasharray={DOTS}
      strokeWidth={1}
      // no fade in: the drawing is the entrance. it only fades on the way out
      style={{
        opacity: isShown ? 1 : 0,
        transition: isShown ? "none" : `opacity ${LINE_FADE_MS}ms`,
      }}
    />
  );
}

// every construction item a letter uses at any step, once each
const constructionOf = (letter: number): OverlayItem[] => {
  const items = new Map<string, OverlayItem>();
  for (const step of letterBuilds[letter]) {
    for (const item of step.overlay ?? []) items.set(item.id, item);
  }
  return [...items.values()];
};

// the horizontal typemark from the product's nav bar. each letter sits in its own 56-unit cell, 8 units apart, and
// every one is rearranged from the same source shape, the icon
export const TYPEMARK_PATH =
  "M50.35,0l-22.35,22.35L5.65,0h44.69ZM33.65,56h22.35v-22.35l-22.35,22.35ZM0,33.65v22.35h22.35L0,33.65ZM86.35,0l-22.35,22.35V0h22.35ZM97.65,0l22.35,22.35V0h-22.35ZM97.65,56h22.35v-22.35l-22.35,22.35ZM64,33.65v22.35h22.35l-22.35-22.35ZM128,0l12.2,12.2v31.6l-12.2,12.2V0ZM171.8,12.2v31.6l12.2,12.2V0l-12.2,12.2ZM320,0l12.2,12.2v31.6l-12.2,12.2V0ZM363.8,12.2v31.6l12.2,12.2V0l-12.2,12.2ZM248,0v33.65L214.35,0h33.65ZM225.65,56l-33.65-33.65v33.65h33.65ZM312,0v22.35L289.65,0h22.35ZM289.65,56h22.35v-22.35l-22.35,22.35ZM256,5.65v44.69l22.35-22.35-22.35-22.35Z";

export const GLYPH = 56;

// the wordmark's typeface, from the guidelines
const spaceMono = Space_Mono({ subsets: ["latin"], weight: "700" });
// sized so its capitals stand just under half a letter tall, as in the official lockup
const WORDMARK_EM = 37;
export const PITCH = 64;
export const LETTERS = ["M", "O", "i", "n", "d", "i"] as const;

// the pieces scale and morph on the shared curve too, as points for the requestAnimationFrame tween
const TWEEN_BEZIER = MOTION_BEZIER;

// every piece partway to its new state: it waits out its own delay, then eases over the tween's duration
const lerpPieces = (
  from: Pieces,
  to: Pieces,
  elapsed: number,
  duration: number,
  tempo: number,
): Pieces =>
  Object.fromEntries(
    Object.entries(to).map(([id, target]) => {
      const start = { ...(from[id] ?? target), ...target.enterFrom };
      const delay = (target.delay ?? 0) * tempo;
      const t =
        !duration || elapsed >= delay + duration
          ? 1
          : target.instant
            ? elapsed >= delay
              ? 1
              : 0
            : applyBezier(
                TWEEN_BEZIER,
                Math.max(0, (elapsed - delay) / duration),
              );
      return [
        id,
        {
          opacity: start.opacity + (target.opacity - start.opacity) * t,
          points: target.points.map(([x, y], index) => [
            start.points[index][0] + (x - start.points[index][0]) * t,
            start.points[index][1] + (y - start.points[index][1]) * t,
          ]) as Quad,
        },
      ];
    }),
  );

export type GlyphPhase = "shown" | "hidden" | "appear";

// one letter at one step of its build, from the source shape (step 0) to the finished letter. when the step
// changes, every piece's points slide from where they are to where the new step puts them, so moving, growing,
// flipping and cutting all animate the same way
export function Glyph({
  index,
  step = finalStep(index),
  showGuides = false,
  tempo = 1,
  phase = "shown",
}: {
  index: number;
  step?: number;
  // construction lines only show while this letter is the one being built
  showGuides?: boolean;
  // scales every duration and delay: 0.5 builds the letter twice as fast
  tempo?: number;
  // hidden fades everything out where it is; appear draws the source shape in piece by piece
  phase?: GlyphPhase;
}) {
  const stepIndex = Math.min(step, finalStep(index));
  const target = letterBuilds[index][stepIndex];
  const targetPieces =
    phase === "hidden"
      ? hiddenPieces(index, stepIndex)
      : phase === "appear"
        ? appearingPieces(index)
        : target.pieces;
  const [pieces, setPieces] = useState(targetPieces);
  const shownRef = useRef(targetPieces);

  useEffect(() => {
    const from = shownRef.current;
    const to = targetPieces;
    if (from === to) return;
    // reduced motion lands on the new step in a single frame
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : TWEEN_MS * tempo;
    const longestDelay = Math.max(
      0,
      ...Object.values(to).map((piece) => (piece.delay ?? 0) * tempo),
    );
    const total = duration ? duration + longestDelay : 0;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const done = elapsed >= total;
      shownRef.current = done
        ? to
        : lerpPieces(from, to, elapsed, duration, tempo);
      setPieces(shownRef.current);
      if (!done) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // a new tempo only applies from the next step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPieces]);

  return (
    <svg
      viewBox={`0 0 ${GLYPH} ${GLYPH}`}
      className="block size-full overflow-visible"
      aria-hidden="true"
    >
      {Object.entries(pieces).map(([id, piece]) => (
        <polygon
          key={id}
          points={piece.points
            .map(([x, y]) => `${round(x)},${round(y)}`)
            .join(" ")}
          fill="currentColor"
          // a hairline in the same color closes the seams where pieces meet
          stroke="currentColor"
          strokeWidth={0.5}
          strokeLinejoin="round"
          opacity={piece.opacity}
        />
      ))}
      {/* the construction, drawn over the pieces in the brand's secondary color. every item the letter ever uses
          is always here, so it fades in and out as steps add and drop it */}
      <g
        fill="none"
        stroke={GUIDE_COLOR}
        strokeWidth={0.6}
        strokeLinecap="round"
      >
        {constructionOf(index).map((item) => {
          const isShown = Boolean(
            showGuides &&
            phase !== "hidden" &&
            target.overlay?.some((other) => other.id === item.id),
          );
          const fade = `transition-opacity duration-500 ${isShown ? "opacity-100" : "opacity-0"}`;
          if (item.kind === "rect") {
            return (
              <ConstructionRect
                key={item.id}
                points={item.points}
                isShown={isShown}
                className={fade}
                tempo={tempo}
              />
            );
          }
          if (item.kind === "point") {
            return (
              <circle
                key={item.id}
                cx={round(item.at[0])}
                cy={round(item.at[1])}
                r={1.6}
                fill={GUIDE_COLOR}
                stroke="none"
                className={fade}
              />
            );
          }
          const [from, to]: [Point, Point] =
            item.kind === "line"
              ? [item.from, item.to]
              : [
                  [item.x, -8],
                  [item.x, 64],
                ];
          return (
            <ConstructionLine
              key={item.id}
              from={from}
              to={to}
              isShown={isShown}
              tempo={tempo}
            />
          );
        })}
      </g>
    </svg>
  );
}

export type VariantId =
  | "source"
  | "lockup"
  | "primary"
  | "horizontal"
  | "vertical"
  | "3x3"
  | "2x2x2"
  | "upward"
  | "downward"
  | "icon";

export const variantNames: Record<VariantId, string> = {
  source: "Icon / source shape",
  lockup: "Lockup",
  primary: "2x4 Primary",
  horizontal: "Horizontal",
  vertical: "Vertical",
  "3x3": "3x3",
  "2x2x2": "2x2x2",
  upward: "3x2x1 Directional",
  downward: "1x2x3 Directional",
  icon: "Icon",
};

interface Layout {
  // where each letter sits, in cells
  cells: { col: number; row: number }[];
  cols: number;
  rows: number;
  // the lockup's wordmark, in the cells the top row leaves empty
  wordmark?: { col: number; row: number; cols: number };
}

// the letters fill the rows in reading order. directional rows line up on one side to make the arrow
function rowsLayout(rows: number[], align: "left" | "right" = "left"): Layout {
  const cols = Math.max(...rows);
  const cells = rows.flatMap((count, row) =>
    Array.from({ length: count }, (_, col) => ({
      col: align === "left" ? col : cols - count + col,
      row,
    })),
  );
  return { cells, cols, rows: rows.length };
}

// every letter on the same cell, each showing the icon, so together they read as the one shape they come from
const stacked: Layout = {
  cells: LETTERS.map(() => ({ col: 0, row: 0 })),
  cols: 1,
  rows: 1,
};

export const layouts: Record<VariantId, Layout> = {
  source: stacked,
  lockup: {
    ...rowsLayout([2, 4]),
    wordmark: { col: 2, row: 0, cols: 2 },
  },
  primary: rowsLayout([2, 4]),
  horizontal: rowsLayout([6]),
  vertical: rowsLayout([1, 1, 1, 1, 1, 1]),
  "3x3": rowsLayout([3, 3]),
  "2x2x2": rowsLayout([2, 2, 2]),
  upward: rowsLayout([3, 2, 1], "right"),
  downward: rowsLayout([1, 2, 3], "right"),
  // the icon is the source shape itself: the most reduced form of the system
  icon: stacked,
};

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const MOVE_MS = 800;
const MOVE_EASE = MOTION_EASE;

// the typemark laid out in a variant, fitted inside a box with one letter of clearspace on every side. the stage
// is measured in units (stage.w by stage.h) and everything is placed in percentages of it, so it scales with the
// stage and the letters slide from one arrangement to the next
export function TypemarkLayer({
  variant,
  stage,
  box,
  clearspace = 1,
  fixedScale,
  steps,
  focus = null,
  tempo = 1,
  phase = "shown",
}: {
  variant: VariantId;
  stage: { w: number; h: number };
  box: Box;
  // in letters
  clearspace?: number;
  // a set size for the letters, in stage units per letter unit, instead of fitting them to the box: keeps every
  // variant's letters the same size. the box then only places them, centered
  fixedScale?: number;
  // how far along its build each letter is. left out, the icon and source show the source shape and every
  // other variant shows finished letters
  steps?: number[];
  // the letter being built; the others step back while it is
  focus?: number | null;
  // how fast the letter being built moves: 1 is normal, 0.5 twice as fast
  tempo?: number;
  // one phase for every letter, or one each
  phase?: GlyphPhase | GlyphPhase[];
}) {
  const isSource = variant === "source" || variant === "icon";
  const layout = layouts[variant];
  const width = layout.cols * PITCH - (PITCH - GLYPH);
  const height = layout.rows * PITCH - (PITCH - GLYPH);
  const pad = clearspace * GLYPH * 2;
  const scale =
    fixedScale ?? Math.min(box.w / (width + pad), box.h / (height + pad));
  const left = box.x + (box.w - width * scale) / 2;
  const top = box.y + (box.h - height * scale) / 2;

  const place = (col: number, row: number, cols = 1): CSSProperties => ({
    left: `${((left + col * PITCH * scale) / stage.w) * 100}%`,
    top: `${((top + row * PITCH * scale) / stage.h) * 100}%`,
    width: `${(((cols * PITCH - (PITCH - GLYPH)) * scale) / stage.w) * 100}%`,
  });

  // every letter moves at once, so an arrangement changes as one piece
  const transition = ["left", "top", "width", "opacity", "font-size"]
    .map((property) => `${property} ${MOVE_MS}ms ${MOVE_EASE}`)
    .join(", ");

  // where the wordmark sits: in the lockup, its spot there; otherwise wherever it last was, so it can fade out
  // without moving
  const lockupPlace = layout.wordmark
    ? place(layout.wordmark.col, layout.wordmark.row, layout.wordmark.cols)
    : null;
  const [lastWordmarkPlace, setLastWordmarkPlace] = useState(
    lockupPlace ?? place(0, 0, 2),
  );
  if (
    lockupPlace &&
    JSON.stringify(lockupPlace) !== JSON.stringify(lastWordmarkPlace)
  ) {
    setLastWordmarkPlace(lockupPlace);
  }
  const wordmarkPlace = lockupPlace ?? lastWordmarkPlace;

  return (
    <>
      {layout.cells.map((cell, index) => (
        <div
          key={index}
          className="absolute aspect-square"
          style={{
            ...place(cell.col, cell.row),
            opacity: focus === null || focus === index ? 1 : 0.3,
            transition,
          }}
        >
          <Glyph
            index={index}
            step={steps?.[index] ?? (isSource ? 0 : finalStep(index))}
            showGuides={focus === index}
            tempo={focus === index ? tempo : 1}
            phase={typeof phase === "string" ? phase : phase[index]}
          />
        </div>
      ))}
      {/* the wordmark, as in the official lockup: Space Mono Bold, spanning exactly the two cells the top row leaves
          empty, sitting on the bottom of that row. it's always here so it can fade in and out in place */}
      <svg
        viewBox={`0 0 ${2 * PITCH - (PITCH - GLYPH)} ${GLYPH}`}
        className="absolute aspect-120/56 overflow-visible"
        style={{
          ...wordmarkPlace,
          opacity: layout.wordmark ? 1 : 0,
          // it only fades: it appears where it belongs and leaves from where it was, without moving or scaling
          transition: `opacity ${MOVE_MS}ms ${MOVE_EASE}`,
        }}
        aria-hidden="true"
      >
        <text
          x={0}
          y={GLYPH}
          textLength={2 * PITCH - (PITCH - GLYPH)}
          lengthAdjust="spacingAndGlyphs"
          fontSize={WORDMARK_EM}
          fontWeight={700}
          fill="currentColor"
          className={spaceMono.className}
        >
          MOindi
        </text>
      </svg>
    </>
  );
}
