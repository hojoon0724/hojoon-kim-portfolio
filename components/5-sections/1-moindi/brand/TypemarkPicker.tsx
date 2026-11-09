"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Stage, visualHeight } from "./frame";
import {
  GLYPH,
  layouts,
  PITCH,
  TypemarkLayer,
  variantNames,
  type VariantId,
} from "./typemark";

// the space around each mark is half a letter on every side, and directional's two marks sit a little apart.
// both in letter units (a letter is 56)
const CLEAR = 0.5;
const GAP_UNITS = 16;

// a variant's size with its clearspace, in letter units
function unitsFor(variant: VariantId) {
  const layout = layouts[variant];
  const pad = 2 * CLEAR * GLYPH;
  return {
    w: layout.cols * PITCH - (PITCH - GLYPH) + pad,
    h: layout.rows * PITCH - (PITCH - GLYPH) + pad,
  };
}

const singles: VariantId[] = [
  "lockup",
  "primary",
  "horizontal",
  "3x3",
  "vertical",
  "2x2x2",
  "icon",
];
const pair = unitsFor("upward");

// the one letter size every variant shares: the biggest that lets the widest and the tallest of them fit the space
// the preview has, with directional's two marks counted together, side by side or stacked
function letterScale(
  space: { w: number; h: number },
  stacked: boolean,
): number {
  const widest = Math.max(
    ...singles.map((variant) => unitsFor(variant).w),
    stacked ? pair.w : 2 * pair.w + GAP_UNITS,
  );
  const tallest = Math.max(
    ...singles.map((variant) => unitsFor(variant).h),
    stacked ? 2 * pair.h + GAP_UNITS : pair.h,
  );
  const margin = 16;
  return Math.max(
    0,
    Math.min((space.w - margin) / widest, (space.h - margin) / tallest),
  );
}

// a frame of the given size centered on another, so it's tucked out of sight behind it
const behind = (
  front: { x: number; y: number; w: number; h: number },
  size: { w: number; h: number },
) => ({
  x: front.x + (front.w - size.w) / 2,
  y: front.y + (front.h - size.h) / 2,
  ...size,
});

// an element's size, kept up to date
function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
}

const subscribeToWidth = (onChange: () => void) => {
  const query = window.matchMedia("(min-width: 768px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

// what a placement looks like to the cheatsheet: the facts its questions ask about
interface Placement {
  id: string;
  // the variant this placement leads to, by its name in the guidelines
  label: string;
  // a real placement from the guidelines' examples that leads there, which is what the space's shape is
  example: string;
  nameElsewhere: boolean;
  legible?: boolean;
  small?: boolean;
  reallySmall?: boolean;
  tall?: boolean;
  reallyNarrow?: boolean;
  reallyFlat?: boolean;
  // the last question: would pointing somewhere help the composition
  directional?: "upward" | "downward";
}

// one placement for each variant, taken from the guidelines' own examples
const placements: Placement[] = [
  {
    id: "billboard",
    label: "Lockup",
    example: "Billboard",
    nameElsewhere: false,
    legible: true,
  },
  {
    id: "office",
    label: "2x4 Primary",
    example: "Office wall",
    nameElsewhere: true,
    small: false,
  },
  {
    id: "nav",
    label: "Horizontal",
    example: "Nav bar",
    nameElsewhere: true,
    small: true,
    reallySmall: false,
    tall: false,
    reallyFlat: true,
  },
  {
    id: "overlay",
    label: "3x3",
    example: "Video overlay",
    nameElsewhere: true,
    small: true,
    reallySmall: false,
    tall: false,
    reallyFlat: false,
  },
  {
    id: "bottle",
    label: "Vertical",
    example: "Bottle",
    nameElsewhere: true,
    small: true,
    reallySmall: false,
    tall: true,
    reallyNarrow: true,
  },
  {
    id: "banner",
    label: "2x2x2",
    example: "Street banner",
    nameElsewhere: true,
    small: true,
    reallySmall: false,
    tall: true,
    reallyNarrow: false,
  },
  {
    id: "favicon",
    label: "Icon",
    example: "Favicon",
    nameElsewhere: true,
    small: true,
    reallySmall: true,
  },
  {
    id: "subway",
    label: "Directional",
    example: "Subway stairs",
    nameElsewhere: true,
    small: false,
    directional: "downward",
  },
];

// the cheatsheet from page 10 of the guidelines, laid out the same way, in the page's own 1920 by 1080 units

type NodeKind =
  | "result"
  | "question"
  | "start"
  | "goToStart"
  | "useDirectional";

interface FlowNode {
  id: string;
  kind: NodeKind;
  lines: string[];
  // the middle of the node
  x: number;
  y: number;
}

const RESULT_W = 270;
const RESULT_H = 72;

const nodes: FlowNode[] = [
  { id: "start", kind: "start", lines: ["Lockup"], x: 195, y: 316 },
  {
    id: "nameElsewhere",
    kind: "question",
    lines: ["Does the name \u201cMOindi\u201d", "appear somewhere else?"],
    x: 665,
    y: 320,
  },
  {
    id: "small",
    kind: "question",
    lines: ["Is the space small?"],
    x: 1085,
    y: 412,
  },
  { id: "primary", kind: "result", lines: ["2x4 Primary"], x: 1725, y: 316 },
  {
    id: "legible",
    kind: "question",
    lines: ["Is everything", "clearly legible?"],
    x: 630,
    y: 513,
  },
  { id: "lockup", kind: "result", lines: ["Lockup"], x: 195, y: 513 },
  {
    id: "reallySmall",
    kind: "question",
    lines: ["Really small?"],
    x: 1465,
    y: 513,
  },
  { id: "icon", kind: "result", lines: ["Icon"], x: 1725, y: 611 },
  {
    id: "tallWide",
    kind: "question",
    lines: ["Tall or wide?"],
    x: 960,
    y: 686,
  },
  { id: "narrow", kind: "question", lines: ["Really narrow?"], x: 477, y: 686 },
  { id: "flat", kind: "question", lines: ["Really flat?"], x: 1445, y: 686 },
  { id: "vertical", kind: "result", lines: ["Vertical"], x: 195, y: 770 },
  { id: "2x2x2", kind: "result", lines: ["2x2x2"], x: 757, y: 770 },
  { id: "horizontal", kind: "result", lines: ["Horizontal"], x: 1163, y: 770 },
  { id: "3x3", kind: "result", lines: ["3x3"], x: 1725, y: 770 },
  {
    id: "directional",
    kind: "question",
    lines: ["Does the directional variation", "improve the composition?"],
    x: 960,
    y: 966,
  },
  {
    id: "goToStart",
    kind: "goToStart",
    lines: ["Go to Start"],
    x: 381,
    y: 960,
  },
  {
    id: "useDirectional",
    kind: "useDirectional",
    lines: ["Use Directional"],
    x: 1549,
    y: 960,
  },
];

type Answer = "YES" | "NO" | "TALL" | "WIDE" | null;

interface FlowEdge {
  id: string;
  answer: Answer;
  // the line's corners, ending at the arrowhead
  points: [number, number][];
  // where the answer's label sits on the line
  label?: [number, number];
}

const edges: FlowEdge[] = [
  {
    id: "start",
    answer: null,
    points: [
      [330, 316],
      [458, 316],
    ],
  },
  {
    id: "nameElsewhere-YES",
    answer: "YES",
    points: [
      [870, 316],
      [995, 316],
      [995, 378],
    ],
    label: [995, 316],
  },
  {
    id: "nameElsewhere-NO",
    answer: "NO",
    points: [
      [643, 366],
      [643, 468],
    ],
    label: [643, 412],
  },
  {
    id: "legible-YES",
    answer: "YES",
    points: [
      [510, 513],
      [332, 513],
    ],
    label: [419, 513],
  },
  {
    id: "legible-NO",
    answer: "NO",
    points: [
      [760, 513],
      [995, 513],
      [995, 448],
    ],
    label: [995, 513],
  },
  {
    id: "small-NO",
    answer: "NO",
    points: [
      [1197, 382],
      [1197, 316],
      [1588, 316],
    ],
    label: [1197, 316],
  },
  {
    id: "small-YES",
    answer: "YES",
    points: [
      [1197, 446],
      [1197, 513],
      [1352, 513],
    ],
    label: [1197, 508],
  },
  {
    id: "reallySmall-YES",
    answer: "YES",
    points: [
      [1520, 542],
      [1520, 608],
      [1588, 608],
    ],
    label: [1520, 608],
  },
  {
    id: "reallySmall-NO",
    answer: "NO",
    points: [
      [1409, 542],
      [1409, 607],
      [960, 607],
      [960, 656],
    ],
    label: [1409, 607],
  },
  {
    id: "tallWide-TALL",
    answer: "TALL",
    points: [
      [855, 686],
      [602, 686],
    ],
    label: [728, 686],
  },
  {
    id: "tallWide-WIDE",
    answer: "WIDE",
    points: [
      [1065, 686],
      [1337, 686],
    ],
    label: [1207, 686],
  },
  {
    id: "narrow-YES",
    answer: "YES",
    points: [
      [432, 716],
      [432, 770],
      [332, 770],
    ],
    label: [432, 770],
  },
  {
    id: "narrow-NO",
    answer: "NO",
    points: [
      [522, 716],
      [522, 770],
      [620, 770],
    ],
    label: [522, 770],
  },
  {
    id: "flat-YES",
    answer: "YES",
    points: [
      [1400, 716],
      [1400, 770],
      [1300, 770],
    ],
    label: [1400, 770],
  },
  {
    id: "flat-NO",
    answer: "NO",
    points: [
      [1490, 716],
      [1490, 770],
      [1588, 770],
    ],
    label: [1490, 770],
  },
  {
    id: "directional-NO",
    answer: "NO",
    points: [
      [712, 960],
      [517, 960],
    ],
    label: [625, 960],
  },
  {
    id: "directional-YES",
    answer: "YES",
    points: [
      [1210, 960],
      [1413, 960],
    ],
    label: [1305, 960],
  },
];

const answerColor = (answer: Answer) =>
  answer === "YES"
    ? "var(--moindi-success-500)"
    : answer === "NO"
      ? "var(--moindi-error-500)"
      : "var(--moindi-gray-950)";

// the cheatsheet run on a placement: every node and line it passes through, in order, and the variant it ends on
function runCheatsheet(placement: Placement) {
  const path: string[] = ["start", "start-edge"];
  const visit = (node: string, answer?: Answer) => {
    path.push(node);
    if (answer) path.push(`${node}-${answer}`);
  };
  const yesNo = (value: boolean | undefined): Answer => (value ? "YES" : "NO");

  const pick = (): VariantId => {
    visit("nameElsewhere", yesNo(placement.nameElsewhere));
    if (!placement.nameElsewhere) {
      visit("legible", yesNo(placement.legible));
      if (placement.legible) {
        visit("lockup");
        return "lockup";
      }
    }
    visit("small", yesNo(placement.small));
    if (!placement.small) {
      visit("primary");
      return "primary";
    }
    visit("reallySmall", yesNo(placement.reallySmall));
    if (placement.reallySmall) {
      visit("icon");
      return "icon";
    }
    visit("tallWide", placement.tall ? "TALL" : "WIDE");
    if (placement.tall) {
      visit("narrow", yesNo(placement.reallyNarrow));
      visit(placement.reallyNarrow ? "vertical" : "2x2x2");
      return placement.reallyNarrow ? "vertical" : "2x2x2";
    }
    visit("flat", yesNo(placement.reallyFlat));
    visit(placement.reallyFlat ? "horizontal" : "3x3");
    return placement.reallyFlat ? "horizontal" : "3x3";
  };

  let variant = pick();
  // the last question only comes up for the typemarks, not the lockup or the icon
  if (variant !== "lockup" && variant !== "icon") {
    visit("directional", yesNo(Boolean(placement.directional)));
    if (placement.directional) {
      visit("useDirectional");
      variant = placement.directional;
    }
  }
  return { path, variant };
}

const STEP_MS = 140;

// one node of the chart, in the guidelines' look: questions as plain text, results in pale blue boxes
function FlowNodeView({
  node,
  on,
  order,
}: {
  node: FlowNode;
  on: boolean;
  order: number;
}) {
  const box =
    node.kind === "result" || node.kind === "start"
      ? { fill: "var(--moindi-secondary-100)", stroke: "none" }
      : node.kind === "goToStart"
        ? { fill: "none", stroke: "var(--moindi-primary-500)" }
        : node.kind === "useDirectional"
          ? { fill: "none", stroke: "var(--moindi-secondary-500)" }
          : null;
  const textColor =
    node.kind === "goToStart"
      ? "var(--moindi-primary-500)"
      : node.kind === "useDirectional"
        ? "var(--moindi-secondary-500)"
        : "var(--moindi-gray-950)";
  const lineHeight = 40;
  return (
    <g
      className="transition-opacity duration-300"
      style={{
        opacity: on ? 1 : 0.22,
        transitionDelay: on ? `${order * STEP_MS}ms` : "0ms",
      }}
    >
      {box && (
        <rect
          x={node.x - RESULT_W / 2}
          y={node.y - RESULT_H / 2}
          width={RESULT_W}
          height={RESULT_H}
          fill={box.fill}
          stroke={box.stroke}
          strokeWidth={5}
        />
      )}
      {node.kind === "start" && (
        <>
          <rect
            x={node.x - RESULT_W / 2}
            y={node.y - RESULT_H / 2 - 32}
            width={RESULT_W}
            height={28}
            fill="var(--moindi-primary-500)"
          />
          <text
            x={node.x}
            y={node.y - RESULT_H / 2 - 18}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={20}
            fontWeight={700}
            fill="var(--moindi-gray-950)"
            className="roboto-mono"
          >
            START HERE
          </text>
        </>
      )}
      <text
        x={node.x}
        textAnchor="middle"
        fontSize={34}
        fontWeight={node.kind === "question" ? 400 : 600}
        fill={textColor}
      >
        {node.lines.map((line, index) => (
          <tspan
            key={line}
            x={node.x}
            y={node.y + (index - (node.lines.length - 1) / 2) * lineHeight}
            dominantBaseline="central"
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function FlowEdgeView({
  edge,
  on,
  order,
  markerId,
}: {
  edge: FlowEdge;
  on: boolean;
  order: number;
  markerId: string;
}) {
  const color = answerColor(edge.answer);
  return (
    <g
      className="transition-opacity duration-300"
      style={{
        opacity: on ? 1 : 0.22,
        transitionDelay: on ? `${order * STEP_MS}ms` : "0ms",
      }}
    >
      <polyline
        points={edge.points.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={4}
        markerEnd={`url(#${markerId}-${edge.answer ?? "plain"})`}
      />
      {edge.label && edge.answer && (
        <g>
          <rect
            x={edge.label[0] - (edge.answer.length * 12 + 16) / 2}
            y={edge.label[1] - 14}
            width={edge.answer.length * 12 + 16}
            height={28}
            fill={color}
          />
          <text
            x={edge.label[0]}
            y={edge.label[1]}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={18}
            fontWeight={700}
            fill="var(--moindi-gray-50)"
            className="roboto-mono"
          >
            {edge.answer}
          </text>
        </g>
      )}
    </g>
  );
}

// the cheatsheet as something to use: pick a placement and its path through the flowchart lights up, one question
// at a time, while the space beside it takes the placement's shape and the letters rearrange into the variant the
// chart lands on
export function TypemarkPicker() {
  const [placementId, setPlacementId] = useState(placements[0].id);
  const placement =
    placements.find((option) => option.id === placementId) ?? placements[0];
  const { path, variant } = runCheatsheet(placement);
  const order = (id: string) => path.indexOf(id);
  const markerId = "flow-arrow";
  // directional comes in two, pointing up and pointing down
  const marks: VariantId[] =
    variant === "upward" || variant === "downward"
      ? ["upward", "downward"]
      : [variant];
  // phones put directional's two marks side by side; md and up stack them, to suit the taller preview there
  const isMd = useSyncExternalStore(
    subscribeToWidth,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false,
  );
  const [previewRef, preview] = useSize<HTMLDivElement>();
  const scale = letterScale(preview, isMd);
  const frameFor = (mark: VariantId) => {
    const units = unitsFor(mark);
    return { w: units.w * scale, h: units.h * scale };
  };
  const frames = marks.map(frameFor);
  const gap = GAP_UNITS * scale;
  const along = (frame: { w: number; h: number }) => (isMd ? frame.h : frame.w);
  const total =
    frames.reduce((sum, frame) => sum + along(frame), 0) +
    gap * (frames.length - 1);
  let next = ((isMd ? preview.h : preview.w) - total) / 2;
  const spaces = frames.map((frame) => {
    const space = isMd
      ? { x: (preview.w - frame.w) / 2, y: next, ...frame }
      : { x: next, y: (preview.h - frame.h) / 2, ...frame };
    next += along(frame) + gap;
    return space;
  });
  const STAGE = preview;
  const percent = (value: number, total: number) => `${(value / total) * 100}%`;

  return (
    <div className={`gap-sm flex flex-col ${visualHeight}`}>
      {/* every button the same size: four across and two rows, or all eight in one row when there's room for it */}
      <div className="@container shrink-0">
        <div
          className="gap-xs grid grid-cols-4 @min-[56rem]:grid-cols-8"
          role="group"
          aria-label="Logo"
        >
          {placements.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={option.id === placementId}
              onClick={() => setPlacementId(option.id)}
              className={`roboto-mono py-xs cursor-pointer border border-current px-1 text-center text-[11px] leading-tight font-bold uppercase transition-colors duration-200 md:text-sm ${option.id === placementId ? "bg-current/20" : "hover:bg-current/10"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="gap-sm grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] md:grid-rows-1">
        {/* the flowchart */}
        <div className="flex min-h-0 items-center justify-center bg-(--moindi-gray-50) p-2">
          <svg
            key={placement.id}
            viewBox="40 230 1840 790"
            className="max-h-full w-full"
            role="img"
            aria-label={`Logo cheatsheet: the path to the ${variantNames[variant]}`}
          >
            <defs>
              {(["YES", "NO", "TALL", "plain"] as const).map((answer) => (
                <marker
                  key={answer}
                  id={`${markerId}-${answer}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M1,1 L9,5 L1,9"
                    fill="none"
                    stroke={answerColor(answer === "plain" ? null : answer)}
                    strokeWidth={1.6}
                  />
                </marker>
              ))}
              <marker
                id={`${markerId}-WIDE`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path
                  d="M1,1 L9,5 L1,9"
                  fill="none"
                  stroke={answerColor("WIDE")}
                  strokeWidth={1.6}
                />
              </marker>
            </defs>
            {edges.map((edge) => {
              const id = edge.id === "start" ? "start-edge" : edge.id;
              return (
                <FlowEdgeView
                  key={edge.id}
                  edge={edge}
                  on={order(id) !== -1}
                  order={order(id)}
                  markerId={markerId}
                />
              );
            })}
            {nodes.map((node) => (
              <FlowNodeView
                key={node.id}
                node={node}
                on={order(node.id) !== -1}
                order={order(node.id)}
              />
            ))}
          </svg>
        </div>

        {/* what the chart picked, in the placement's space */}
        <div className="flex min-h-0 flex-col bg-(--moindi-gray-950)">
          <div ref={previewRef} className="min-h-0 flex-1">
            {preview.w > 0 && preview.h > 0 && (
              <Stage w={STAGE.w} h={STAGE.h}>
                <div
                  role="img"
                  aria-label={
                    marks.length > 1
                      ? "The directional typemark, pointing up and pointing down"
                      : `The ${variantNames[variant]}`
                  }
                  className="absolute inset-0 text-(--moindi-gray-950)"
                >
                  {/* directional shows two marks. the letters only move in the first; the second is always the
                    downward one and waits behind the first, hidden, sliding out from behind it when directional is
                    picked and back behind it when it isn't. it's drawn first so it stays underneath */}
                  {[1, 0].map((slot) => {
                    const isShown = slot < spaces.length;
                    const space = isShown
                      ? spaces[slot]
                      : behind(spaces[0], frameFor("downward"));
                    return (
                      <div
                        key={slot}
                        className="transition-opacity duration-500"
                        style={{ opacity: isShown ? 1 : 0 }}
                      >
                        <div
                          className="absolute bg-(--moindi-primary-500) transition-[left,top,width,height] duration-700 ease-(--bezier-movement-inertia-1000)"
                          style={{
                            left: percent(space.x, STAGE.w),
                            top: percent(space.y, STAGE.h),
                            width: percent(space.w, STAGE.w),
                            height: percent(space.h, STAGE.h),
                          }}
                        />
                        <TypemarkLayer
                          variant={slot === 1 ? "downward" : marks[0]}
                          stage={STAGE}
                          box={space}
                          fixedScale={scale}
                        />
                      </div>
                    );
                  })}
                </div>
              </Stage>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
