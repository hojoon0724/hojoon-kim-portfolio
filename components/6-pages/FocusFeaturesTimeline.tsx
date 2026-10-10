"use client";

import {
  ProjectBackLink,
  type TimelinePhase,
  type TimelineStep,
} from "@/components/4-organisms";
import { projectOverviewData } from "@/data";
import { useEffect, useRef, useState } from "react";

interface FocusFeaturesTimelineProps {
  projectId: string;
  section: {
    eyebrow: string;
    title: string;
    intro: string;
    timingNote: string;
    closing: string;
  };
  phases: TimelinePhase[];
  steps: TimelineStep[];
}

// -- the 3d model -----------------------------------------------------------
// everything behind the text is a line drawing in 3d, made of simple shapes and drawn on a canvas by hand.
// there is no 3d library: each line's two ends are moved, rotated, and flattened onto the screen with a little math

type Vec3 = [x: number, y: number, z: number];
// one line, as its two ends: x1, y1, z1, x2, y2, z2
type Segment = [number, number, number, number, number, number];

const line = (from: Vec3, to: Vec3): Segment => [...from, ...to];

// the 12 edges of a box
const box = (
  width: number,
  height: number,
  depth: number,
  center: Vec3 = [0, 0, 0],
) => {
  const [cx, cy, cz] = center;
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;
  const segments: Segment[] = [];

  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      segments.push(
        [cx - x, cy + a * y, cz + b * z, cx + x, cy + a * y, cz + b * z],
        [cx + a * x, cy - y, cz + b * z, cx + a * x, cy + y, cz + b * z],
        [cx + a * x, cy + b * y, cz - z, cx + a * x, cy + b * y, cz + z],
      );
    }
  }
  return segments;
};

// a circle of short lines, facing along the y or z axis
const ring = (radius: number, axis: "y" | "z", center: Vec3, sides = 16) => {
  const [cx, cy, cz] = center;
  const point = (index: number): Vec3 => {
    const angle = (index / sides) * Math.PI * 2;
    const a = Math.cos(angle) * radius;
    const b = Math.sin(angle) * radius;
    return axis === "z" ? [cx + a, cy + b, cz] : [cx + a, cy, cz + b];
  };

  return Array.from({ length: sides }, (_, index) =>
    line(point(index), point(index + 1)),
  );
};

// a cylinder: a ring at each end and four lines joining them
const cylinder = (
  radius: number,
  length: number,
  axis: "y" | "z",
  center: Vec3 = [0, 0, 0],
) => {
  const [cx, cy, cz] = center;
  const half = length / 2;
  const near: Vec3 = axis === "z" ? [cx, cy, cz - half] : [cx, cy - half, cz];
  const far: Vec3 = axis === "z" ? [cx, cy, cz + half] : [cx, cy + half, cz];
  const segments = [...ring(radius, axis, near), ...ring(radius, axis, far)];

  for (let side = 0; side < 4; side += 1) {
    const angle = (side / 4) * Math.PI * 2;
    const a = Math.cos(angle) * radius;
    const b = Math.sin(angle) * radius;
    segments.push(
      axis === "z"
        ? [cx + a, cy + b, near[2], cx + a, cy + b, far[2]]
        : [cx + a, near[1], cz + b, cx + a, far[1], cz + b],
    );
  }
  return segments;
};

// where a shape sits: position, rotation (around x, then y, then z), size and how visible it is
type Pose = { position: Vec3; rotation: Vec3; scale: number; alpha: number };

const pose = (
  position: Vec3,
  rotation: Vec3 = [0, 0, 0],
  scale = 1,
  alpha = 1,
): Pose => ({ position, rotation, scale, alpha });

// -- the camera rig ---------------------------------------------------------
// the rig is the star of the page. every part has four arrangements, and a scene says how much of each to use:
// - assembled: the working unit, on its tripod
// - exploded: the same unit pulled apart in mid air, each part still near where it belongs
// - knolled: every part laid flat on the floor in a grid, the way gear is laid out to be counted
// - cased: every part shrunk away into the flight cases

type RigLayout = "assembled" | "exploded" | "knolled" | "cased";
const rigLayouts: RigLayout[] = ["assembled", "exploded", "knolled", "cased"];

const quarterTurn = Math.PI / 2;
// how far the tripod legs lean out from straight down
const legLean = 0.38;
const insideBigCase: Vec3 = [-1.3, -1.6, 0];
const insideSmallCase: Vec3 = [1.7, -1.7, 0.3];

type RigPart = { segments: Segment[] } & Record<RigLayout, Pose>;

const cased = (into: Vec3) => pose(into, [0, 0, 0], 0.25, 0);

// a tripod leg hangs straight down from the head, then leans out in its own direction
const tripodLeg = (turn: number, knollX: number): RigPart => ({
  segments: cylinder(0.05, 3, "y", [0, -1.5, 0]),
  assembled: pose([0, 0.45, 0], [legLean, turn, 0]),
  exploded: pose(
    [Math.sin(turn) * 0.9, -0.85, Math.cos(turn) * 0.9],
    [legLean, turn, 0],
  ),
  knolled: pose([knollX, -2.3, 1.5], [quarterTurn, 0, 0]),
  cased: cased(insideBigCase),
});

const rigParts: RigPart[] = [
  tripodLeg(0, -3.4),
  tripodLeg((Math.PI * 2) / 3, -3.1),
  tripodLeg((Math.PI * 4) / 3, -2.8),
  {
    // center column
    segments: cylinder(0.07, 1, "y"),
    assembled: pose([0, 0.2, 0]),
    exploded: pose([0, -0.7, 0]),
    knolled: pose([-2, -2.3, -1], [0, 0, quarterTurn]),
    cased: cased(insideBigCase),
  },
  {
    // tripod head
    segments: box(0.7, 0.28, 0.7),
    assembled: pose([0, 0.6, 0]),
    exploded: pose([0, 0.3, 0]),
    knolled: pose([-2, -2.3, 0.6]),
    cased: cased(insideBigCase),
  },
  {
    // camera body
    segments: box(1.5, 1.05, 1),
    assembled: pose([0, 1.3, 0]),
    exploded: pose([0, 1.6, 0]),
    knolled: pose([-0.4, -2.3, -0.9]),
    cased: cased(insideSmallCase),
  },
  {
    // lens. the rig points along +z
    segments: cylinder(0.4, 1.2, "z"),
    assembled: pose([0, 1.3, 1.1]),
    exploded: pose([0, 1.6, 2.3]),
    knolled: pose([1.2, -2.3, -0.9], [-quarterTurn, 0, 0]),
    cased: cased(insideSmallCase),
  },
  {
    // lens hood
    segments: cylinder(0.5, 0.3, "z"),
    assembled: pose([0, 1.3, 1.85]),
    exploded: pose([0, 1.6, 3.7]),
    knolled: pose([2.5, -2.3, -0.9], [-quarterTurn, 0, 0]),
    cased: cased(insideSmallCase),
  },
  {
    // battery, on the back
    segments: box(0.55, 0.75, 0.35),
    assembled: pose([0, 1.3, -0.68]),
    exploded: pose([0, 1.6, -1.9]),
    knolled: pose([-0.4, -2.3, 0.8], [quarterTurn, 0, 0]),
    cased: cased(insideSmallCase),
  },
  {
    // recording drive, on the side
    segments: box(0.14, 0.75, 0.5),
    assembled: pose([0.95, 1.3, 0]),
    exploded: pose([2.3, 1.7, 0]),
    knolled: pose([0.9, -2.3, 0.8], [0, 0, quarterTurn]),
    cased: cased(insideSmallCase),
  },
  {
    // monitor, on top
    segments: box(1, 0.62, 0.08),
    assembled: pose([-0.15, 2.25, -0.3], [-0.2, 0, 0]),
    exploded: pose([-0.15, 3.4, -0.3], [-0.2, 0, 0]),
    knolled: pose([2.3, -2.3, 0.8], [-quarterTurn, 0, 0]),
    cased: cased(insideSmallCase),
  },
  {
    // cable, drooping from the camera to the floor and running off
    segments: [
      line([0.75, 1, -0.3], [1.1, 0.2, -0.45]),
      line([1.1, 0.2, -0.45], [1.3, -1.2, -0.55]),
      line([1.3, -1.2, -0.55], [1.7, -2.3, -0.7]),
      line([1.7, -2.3, -0.7], [3.4, -2.3, -1.4]),
    ],
    assembled: pose([0, 0, 0]),
    exploded: pose([1.6, 0, -0.6]),
    knolled: pose([2.4, 0, 1.6]),
    cased: cased(insideBigCase),
  },
];

// -- everything else --------------------------------------------------------
// the supporting shapes. each sits in one fixed place, and a scene only says how visible it is

const room: Segment[] = [
  // floor grid
  ...Array.from({ length: 13 }, (_, index) =>
    line([index - 6, 0, -5], [index - 6, 0, 5]),
  ),
  ...Array.from({ length: 11 }, (_, index) =>
    line([-6, 0, index - 5], [6, 0, index - 5]),
  ),
  // the screen, on the far wall
  ...box(8, 4.5, 0.05, [0, 3.2, -5]),
  // the stage in front of it, with two chairs for the q&a
  ...box(6, 0.4, 1.6, [0, 0.2, -3.8]),
  ...box(0.5, 0.8, 0.5, [-0.7, 0.8, -3.8]),
  ...box(0.5, 0.8, 0.5, [0.7, 0.8, -3.8]),
  // rows of seats, rising toward the back
  ...Array.from({ length: 6 }, (_, row) =>
    line([-4.5, 0.25 * row, row - 1.5], [4.5, 0.25 * row, row - 1.5]),
  ),
];

// what the camera sees: four lines from the lens out to a frame. it belongs to the rig and moves with it
const frustum: Segment[] = [
  ...[-1, 1].flatMap((a) =>
    [-1, 1].map((b) => line([0, 1.3, 2], [a * 5.5, 1.3 + b * 3.1, 22])),
  ),
  ...box(11, 6.2, 0, [0, 1.3, 22]),
];

// the brief: a sheet of paper with lines of text
const sheet: Segment[] = [
  ...box(2.2, 3, 0.03),
  ...Array.from({ length: 7 }, (_, index) =>
    line(
      [-0.8, 1 - index * 0.32, 0.03],
      [index % 3 === 2 ? 0.2 : 0.8, 1 - index * 0.32, 0.03],
    ),
  ),
];

// talent audio: a recorder with two microphones cabled into it
const audio: Segment[] = [
  ...box(0.5, 0.9, 0.3, [2.6, -1.85, 1]),
  ...[3.4, 4.1].flatMap((x) => [
    ...cylinder(0.09, 0.8, "y", [x, -1.2, 1]),
    ...ring(0.16, "y", [x, -0.75, 1], 10),
    line([x, -1.6, 1], [x, -2.3, 1]),
    line([x, -2.3, 1], [2.85, -2.3, 1]),
  ]),
];

// the two flight cases, each with a handle
const cases: Segment[] = [
  ...box(2.6, 1.1, 1.5, insideBigCase),
  line([-1.7, -1.05, 0.75], [-0.9, -1.05, 0.75]),
  ...box(1.9, 0.9, 1.3, insideSmallCase),
  line([1.4, -1.25, 0.95], [2, -1.25, 0.95]),
];

// the recording drive beside its two backups, with a line for each copy
const drives: Segment[] = [
  ...[-2.2, 0, 2.2].flatMap((x) => box(1.3, 0.22, 0.85, [x, 0.4, 0])),
  line([-1.45, 0.4, 0], [-0.75, 0.4, 0]),
  line([0.75, 0.4, 0], [1.45, 0.4, 0]),
];

// a cross through each drive, for when it is wiped
const wipe: Segment[] = [-2.2, 0, 2.2].flatMap((x) => [
  line([x - 0.65, 0.52, -0.42], [x + 0.65, 0.52, 0.42]),
  line([x - 0.65, 0.52, 0.42], [x + 0.65, 0.52, -0.42]),
]);

// the recording light
const recording: Segment[] = [
  ...ring(0.22, "z", [1.5, 2.9, 0], 14),
  ...ring(0.1, "z", [1.5, 2.9, 0], 10),
];

// the rig-space shapes move with the rig. red marks the ones about recording
const props = {
  room: { segments: room, onRig: false, red: false },
  sheet: { segments: sheet, onRig: false, red: false },
  audio: { segments: audio, onRig: false, red: false },
  cases: { segments: cases, onRig: false, red: false },
  drives: { segments: drives, onRig: false, red: false },
  wipe: { segments: wipe, onRig: false, red: true },
  frustum: { segments: frustum, onRig: true, red: true },
  recording: { segments: recording, onRig: true, red: true },
};
type PropName = keyof typeof props;
const propNames = Object.keys(props) as PropName[];

// -- scenes -----------------------------------------------------------------
// one arrangement of everything, plus where it is looked at from

type Scene = {
  // looking direction: turn is around the vertical axis, tilt is how far down from above. zoom is closeness
  turn: number;
  tilt: number;
  zoom: number;
  // how visible the rig is, how much of each layout it uses, and where the whole rig stands
  rig: number;
  layout: Partial<Record<RigLayout, number>>;
  rigPosition: Vec3;
  rigTurn: number;
  rigScale: number;
  // how visible each supporting shape is. anything left out is hidden
  props: Partial<Record<PropName, number>>;
};

const scene = (overrides: Partial<Scene>): Scene => ({
  turn: 0.6,
  tilt: 0.14,
  zoom: 1,
  rig: 1,
  layout: { assembled: 1 },
  rigPosition: [0, 0, 0],
  rigTurn: 0,
  rigScale: 1,
  props: {},
  ...overrides,
});

const scenes = {
  assembled: scene({}),
  brief: scene({ rig: 0, tilt: 0.05, zoom: 1.2, props: { sheet: 1 } }),
  // straight down on the room: a floorplan
  floorplan: scene({ rig: 0, tilt: 1.25, zoom: 0.7, props: { room: 1 } }),
  // the same room from inside, with the rig standing at the back and its view reaching the stage
  siteVisit: scene({
    tilt: 0.32,
    zoom: 0.8,
    rigPosition: [0, 0.7, 4.2],
    rigTurn: Math.PI,
    rigScale: 0.3,
    props: { room: 0.8, frustum: 0.9 },
  }),
  knolled: scene({ tilt: 0.85, zoom: 0.95, layout: { knolled: 1 } }),
  exploded: scene({ zoom: 0.9, layout: { exploded: 1 } }),
  packed: scene({ tilt: 0.3, layout: { cased: 1 }, props: { cases: 1 } }),
  unpacking: scene({ layout: { exploded: 1 }, props: { cases: 0.35 } }),
  verified: scene({ turn: 1.1, zoom: 1.15, props: { frustum: 0.45 } }),
  audio: scene({
    zoom: 0.9,
    rigPosition: [-1.2, 0, 0],
    props: { audio: 1 },
  }),
  recording: scene({
    turn: 0.9,
    zoom: 1.1,
    props: { frustum: 0.9, recording: 1 },
  }),
  secured: scene({ rig: 0, tilt: 0.5, zoom: 1.1, props: { drives: 1 } }),
  struck: scene({ layout: { exploded: 1 }, props: { cases: 0.6 } }),
  wiped: scene({
    rig: 0,
    tilt: 0.5,
    zoom: 1.1,
    props: { drives: 0.4, wipe: 1 },
  }),
  returned: scene({
    tilt: 0.3,
    zoom: 0.75,
    layout: { cased: 1 },
    props: { cases: 1 },
  }),
  closing: scene({ rig: 0.45, zoom: 0.9 }),
};

// what each step turns the model into. via is an in-between it passes through on the way:
// setup goes from the cases, through loose parts, to the assembled unit, and breakdown runs that backward
const stepScenes: Record<string, { via?: Scene; settle: Scene }> = {
  brief: { settle: scenes.brief },
  research: { settle: scenes.floorplan },
  "site-visit": { settle: scenes.siteVisit },
  "gear-list": { settle: scenes.knolled },
  prepare: { settle: scenes.exploded },
  pack: { settle: scenes.packed },
  arrival: { via: scenes.unpacking, settle: scenes.assembled },
  verify: { settle: scenes.verified },
  "talent-audio": { settle: scenes.audio },
  record: { settle: scenes.recording },
  secure: { settle: scenes.secured },
  strike: { via: scenes.assembled, settle: scenes.struck },
  reset: { settle: scenes.wiped },
  return: { settle: scenes.returned },
};

// -- drawing ----------------------------------------------------------------

// the share of a section's scroll over which the model changes into that section's scene. after that it holds
const morphWindow = 0.6;
// the model also keeps turning slowly the whole way down the page, this much per section
const turnPerSection = 0.35;
const cameraDistance = 14;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);
const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;
const mixVec = (from: Vec3, to: Vec3, amount: number): Vec3 => [
  mix(from[0], to[0], amount),
  mix(from[1], to[1], amount),
  mix(from[2], to[2], amount),
];

// one scene part of the way to another
const mixScenes = (from: Scene, to: Scene, amount: number): Scene => {
  // a rig that is hidden in one of the two scenes has no meaningful place there,
  // so it fades in or out where the other scene has it instead of flying across
  const rigFrom = from.rig === 0 ? to : from;
  const rigTo = to.rig === 0 ? from : to;

  return {
    turn: mix(from.turn, to.turn, amount),
    tilt: mix(from.tilt, to.tilt, amount),
    zoom: mix(from.zoom, to.zoom, amount),
    rig: mix(from.rig, to.rig, amount),
    layout: Object.fromEntries(
      rigLayouts.map((layout) => [
        layout,
        mix(rigFrom.layout[layout] ?? 0, rigTo.layout[layout] ?? 0, amount),
      ]),
    ),
    rigPosition: mixVec(rigFrom.rigPosition, rigTo.rigPosition, amount),
    rigTurn: mix(rigFrom.rigTurn, rigTo.rigTurn, amount),
    rigScale: mix(rigFrom.rigScale, rigTo.rigScale, amount),
    props: Object.fromEntries(
      propNames.map((name) => [
        name,
        mix(from.props[name] ?? 0, to.props[name] ?? 0, amount),
      ]),
    ),
  };
};

// turns a point around the x axis, then y, then z
const rotate = ([x, y, z]: Vec3, [rx, ry, rz]: Vec3): Vec3 => {
  let c = Math.cos(rx);
  let s = Math.sin(rx);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ry);
  s = Math.sin(ry);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(rz);
  s = Math.sin(rz);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
};

const place = (point: Vec3, at: Pose): Vec3 => {
  const [x, y, z] = rotate(
    [point[0] * at.scale, point[1] * at.scale, point[2] * at.scale],
    at.rotation,
  );
  return [x + at.position[0], y + at.position[1], z + at.position[2]];
};

const restPose = pose([0, 0, 0]);

function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  current: Scene,
  extraTurn: number,
) {
  context.clearRect(0, 0, width, height);
  context.lineWidth = 1;
  context.lineCap = "round";

  // on wide screens the model stands to the right of the text. on narrow ones it sits behind it, fainter
  const isWide = width >= 1024;
  const centerX = width * (isWide ? 0.66 : 0.5);
  const centerY = height * 0.54;
  const strength = isWide ? 0.75 : 0.4;
  const focalLength = Math.min(width * 1.5, height) * 1.6 * current.zoom;
  const view: Vec3 = [current.tilt, 0, 0];
  const rigPose = pose(
    current.rigPosition,
    [0, current.rigTurn, 0],
    current.rigScale,
  );

  const drawSegments = (
    segments: Segment[],
    at: Pose,
    onRig: boolean,
    alpha: number,
    red: boolean,
  ) => {
    if (alpha <= 0.01) return;

    for (const segment of segments) {
      const ends = [0, 3].map((offset) => {
        let point = place(
          [segment[offset], segment[offset + 1], segment[offset + 2]],
          at,
        );
        if (onRig) point = place(point, rigPose);
        // the whole world turns in front of the viewer, then tips forward by the tilt
        point = rotate(point, [0, current.turn + extraTurn, 0]);
        return rotate(point, view);
      });

      const depths = ends.map((point) => cameraDistance - point[2]);
      // a line that reaches behind the viewer can't be drawn
      if (depths[0] < 0.5 || depths[1] < 0.5) continue;

      // lines further away are fainter, which is what makes the drawing read as solid
      const nearness = clamp01(
        1.5 - (depths[0] + depths[1]) / 2 / cameraDistance,
      );
      context.strokeStyle = red
        ? `rgba(248, 113, 113, ${alpha * strength * (0.4 + 0.6 * nearness)})`
        : `rgba(255, 255, 255, ${alpha * strength * (0.25 + 0.75 * nearness)})`;
      context.beginPath();
      context.moveTo(
        centerX + (ends[0][0] * focalLength) / depths[0],
        centerY - (ends[0][1] * focalLength) / depths[0],
      );
      context.lineTo(
        centerX + (ends[1][0] * focalLength) / depths[1],
        centerY - (ends[1][1] * focalLength) / depths[1],
      );
      context.stroke();
    }
  };

  for (const part of rigParts) {
    // each part sits at the mix of its four arrangements that the scene asks for
    const at = pose([0, 0, 0], [0, 0, 0], 0, 0);
    for (const layout of rigLayouts) {
      const weight = current.layout[layout] ?? 0;
      const target = part[layout];
      for (let axis = 0; axis < 3; axis += 1) {
        at.position[axis] += target.position[axis] * weight;
        at.rotation[axis] += target.rotation[axis] * weight;
      }
      at.scale += target.scale * weight;
      at.alpha += target.alpha * weight;
    }
    drawSegments(part.segments, at, true, at.alpha * current.rig, false);
  }

  for (const name of propNames) {
    const prop = props[name];
    const alpha = (current.props[name] ?? 0) * (prop.onRig ? current.rig : 1);
    drawSegments(prop.segments, restPose, prop.onRig, alpha, prop.red);
  }
}

// -- the page ---------------------------------------------------------------

// an alternate take on the production timeline. the same steps, but the schedule is told by one 3d line drawing
// that fills the background and keeps changing as the page scrolls:
// - each step turns the drawing into something that stands for it: the brief, the floorplan, the gear laid out,
//   the cases, the assembled rig, the drives
// - on-site setup assembles the rig from loose parts, and breakdown takes it apart again
// - the drawing only moves with the scroll, so the reader is the one playing it
export function FocusFeaturesTimeline({
  projectId,
  section,
  phases,
  steps,
}: FocusFeaturesTimelineProps) {
  const projectData = projectOverviewData.find(
    (project) => project.id === projectId,
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // the intro, every step, and the closing, top to bottom. each one has a scene
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // the steps in the order the phases list them
  const orderedSteps = phases.flatMap((phase) =>
    phase.steps.flatMap((stepId) => {
      const step = steps.find((candidate) => candidate.id === stepId);
      return step ? [{ step, phase }] : [];
    }),
  );
  const stepCount = orderedSteps.length;
  const active = orderedSteps[activeIndex];
  const stepIds = orderedSteps.map(({ step }) => step.id).join(",");

  useEffect(() => {
    const scroller = scrollerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!scroller || !canvas || !context) return;

    // one scene per section: the intro, each step (a step without one keeps the assembled rig), and the closing
    const sectionScenes: { via?: Scene; settle: Scene }[] = [
      { settle: scenes.assembled },
      ...stepIds
        .split(",")
        .map((id) => stepScenes[id] ?? { settle: scenes.assembled }),
      { settle: scenes.closing },
    ];

    let frameId = 0;

    const update = () => {
      frameId = 0;

      // match the canvas to the screen, at the screen's real pixel density so the lines stay sharp
      const density = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (
        canvas.width !== Math.round(width * density) ||
        canvas.height !== Math.round(height * density)
      ) {
        canvas.width = Math.round(width * density);
        canvas.height = Math.round(height * density);
      }
      context.setTransform(density, 0, 0, density, 0, 0);

      // the current section is the last one whose top has crossed the middle of the screen
      const middle = window.innerHeight / 2;
      let index = 0;
      sectionRefs.current.forEach((element, sectionIndex) => {
        if (element && element.getBoundingClientRect().top <= middle) {
          index = sectionIndex;
        }
      });
      const rect = sectionRefs.current[index]?.getBoundingClientRect();
      const through = rect ? clamp01((middle - rect.top) / rect.height) : 0;

      // as a section comes in, the model changes from the previous section's scene into this one's, then holds
      const { via, settle } = sectionScenes[index] ?? sectionScenes[0];
      const previous = sectionScenes[index - 1]?.settle ?? settle;
      const morph = clamp01(through / morphWindow);
      const current = via
        ? morph < 0.5
          ? mixScenes(previous, via, smooth(morph * 2))
          : mixScenes(via, settle, smooth(morph * 2 - 1))
        : mixScenes(previous, settle, smooth(morph));

      drawScene(
        context,
        width,
        height,
        current,
        (index + through) * turnPerSection,
      );

      if (progressRef.current) {
        const progress = clamp01((index - 1 + through) / stepCount);
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
      // section 0 is the intro, so step numbering starts one later
      setActiveIndex(Math.min(index - 1, stepCount - 1));
    };

    const queueUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      scroller.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, [stepCount, stepIds]);

  return (
    // this is the element that scrolls. it has no snapping: the model follows the scroll exactly
    <div
      ref={scrollerRef}
      className={`focus-features-timeline relative h-dvh w-full overflow-y-auto ${projectData?.backgroundClassName} ${projectData?.textColorClassName}`}
    >
      {/* the model. it stays pinned to the screen while everything else scrolls over it,
          and the negative margin stops it from pushing the page down by a screen */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none sticky top-0 mb-[-100dvh] block h-dvh w-full"
        aria-hidden="true"
      />

      <div className="px-md lg:px-xl py-sm sticky top-0 z-40 flex flex-col gap-2">
        <div className="gap-md flex items-center justify-between">
          <ProjectBackLink projectId={projectId} />
          {/* where the reader is in the schedule */}
          {active && (
            <p
              className="roboto-mono gap-sm flex min-w-0 items-baseline text-xs md:text-sm"
              aria-live="polite"
            >
              <span className="shrink-0 opacity-70">
                {active.step.number} / {String(stepCount).padStart(2, "0")}
              </span>
              <span className="truncate">{active.phase.label}</span>
            </p>
          )}
        </div>
        <div className="h-px w-full bg-white/20">
          <div
            ref={progressRef}
            className="h-px w-full origin-left bg-red-400"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      <div className="px-md lg:px-xl relative z-10 flex w-full flex-col">
        <header
          ref={(element) => {
            sectionRefs.current[0] = element;
          }}
          className="gap-md flex min-h-dvh max-w-xl flex-col justify-center"
        >
          <h5 className="opacity-70">{section.eyebrow}</h5>
          <h1 className="text-balance">{section.title}</h1>
          <p className="roboto-narrow text-xl text-pretty md:text-2xl">
            {section.intro}
          </p>
          <p className="text-sm opacity-70 md:text-base">
            {section.timingNote}
          </p>
        </header>

        {orderedSteps.map(({ step, phase }, index) => (
          // every step is taller than the screen, which gives the model room to change before the text has passed
          <section
            key={step.id}
            ref={(element) => {
              sectionRefs.current[index + 1] = element;
            }}
            className="flex min-h-[130dvh] max-w-xl flex-col justify-center"
          >
            {/* the panel keeps the text readable where the drawing runs behind it */}
            <div className="gap-md p-md -mx-md flex flex-col bg-black/20 backdrop-blur-sm lg:mx-0">
              <div className="flex flex-col gap-1">
                <span className="roboto-mono text-xs opacity-70 md:text-sm">
                  {phase.label} / {step.number} / {step.label}
                </span>
                <span className="roboto-wide text-xl font-bold text-red-400 md:text-2xl">
                  {step.marker}
                </span>
              </div>
              <h2>{step.title}</h2>
              <p className="text-base text-pretty md:text-lg">{step.text}</p>
              {step.extraDetails.length > 0 && (
                <ul className="gap-sm flex flex-col">
                  {step.extraDetails.map((detail) => (
                    <li
                      key={detail}
                      className="gap-sm flex items-baseline text-sm opacity-70 md:text-base"
                    >
                      <span
                        className="roboto-mono w-4 shrink-0"
                        aria-hidden="true"
                      >
                        +
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        <footer
          ref={(element) => {
            sectionRefs.current[stepCount + 1] = element;
          }}
          className="flex min-h-dvh max-w-3xl flex-col justify-center"
        >
          <p className="roboto-narrow text-2xl font-light text-balance md:text-4xl">
            {section.closing}
          </p>
        </footer>
      </div>
    </div>
  );
}
