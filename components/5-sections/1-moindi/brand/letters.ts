// how each letter of the typemark is built from the source shape (the icon), step by step. from the build files in
// public/moindi/logo-build, scaled from their 5-unit grid to the typemark's 56-unit cell so the last step of every
// letter lands exactly on the real typemark.
//
// every piece is a four-point polygon (a triangle repeats a point), so any two steps can be tweened point by point:
// moving, growing, flipping and cutting are all just points sliding to new places

export type Point = [number, number];
export type Quad = [Point, Point, Point, Point];
export interface PieceState {
  points: Quad;
  opacity: number;
  // how long this piece waits before it moves to this state, in ms. only for the step that sets it
  delay?: number;
  // jumps to this state when its delay is up instead of easing there, for a cut: the kept part just is its new
  // shape
  instant?: boolean;
  // where this step starts the piece from, instead of where the last step left it
  enterFrom?: Partial<Pick<PieceState, "opacity">>;
}
export type Pieces = Record<string, PieceState>;

export interface LetterStep {
  pieces: Pieces;
  // what this step does, said plainly
  caption: string;
  // how long its pieces take to move, and its new construction to draw, so the next step knows when to start
  moveMs: number;
  drawMs: number;
  // construction drawn over the letter while this step is on screen. items keep their id from step to step, so
  // they fade in when they first appear and fade out when a step drops them
  overlay?: OverlayItem[];
}

export type OverlayItem =
  // drawn from its first point out to the opposite corner, like dragging out a rectangle
  | { id: string; kind: "rect"; points: Quad }
  | { id: string; kind: "line"; from: Point; to: Point }
  | { id: string; kind: "point"; at: Point }
  // a vertical line the full height of the cell
  | { id: string; kind: "vertical"; x: number };

// how long a step's pieces take to move, and its construction to draw. a step lasts as long as what it changes
export const TWEEN_MS = 900;
export const DRAW_MS = 900;
const moveMs = (changed: PieceState[]) =>
  Math.max(
    0,
    ...changed.map((piece) =>
      piece.instant ? (piece.delay ?? 0) : TWEEN_MS + (piece.delay ?? 0),
    ),
  );
// the source shape's measurements: corner legs, the diamond's points, the cell's middle
const A = 22.35;
const B = 33.65;
const C = 5.65;
const D = 50.35;
const M = 28;

const shown = (points: Quad): PieceState => ({ points, opacity: 1 });
// a piece snapping to its trimmed shape at a cut
const cut = (points: Quad): PieceState => ({
  points,
  opacity: 1,
  instant: true,
});

// a piece fading out where it is. nothing shrinks or moves on the way out
const removed = (state: PieceState): PieceState => ({ ...state, opacity: 0 });

const shifted = (state: PieceState, dx: number, dy: number): PieceState => ({
  ...state,
  points: state.points.map(([x, y]) => [x + dx, y + dy]) as Quad,
});

// the icon: four corner triangles around a diamond, the diamond in quarters so its halves can move on their own
const source = {
  cTL: shown([
    [0, 0],
    [A, 0],
    [A, 0],
    [0, A],
  ]),
  cTR: shown([
    [56, 0],
    [B, 0],
    [B, 0],
    [56, A],
  ]),
  cBR: shown([
    [56, 56],
    [B, 56],
    [B, 56],
    [56, B],
  ]),
  cBL: shown([
    [0, 56],
    [A, 56],
    [A, 56],
    [0, B],
  ]),
  qTL: shown([
    [M, C],
    [C, M],
    [C, M],
    [M, M],
  ]),
  qTR: shown([
    [M, C],
    [D, M],
    [D, M],
    [M, M],
  ]),
  qBR: shown([
    [D, M],
    [M, D],
    [M, D],
    [M, M],
  ]),
  qBL: shown([
    [C, M],
    [M, D],
    [M, D],
    [M, M],
  ]),
};

type SourcePiece = keyof typeof source;
const quarters: SourcePiece[] = ["qTL", "qTR", "qBR", "qBL"];

// each step changes some pieces and keeps the rest as they were
function build(
  extra: Pieces,
  changes: {
    caption: string;
    overlay?: OverlayItem[];
    set: (pieces: Pieces) => Pieces;
  }[],
): LetterStep[] {
  const steps: LetterStep[] = [
    {
      pieces: { ...source, ...extra },
      caption: "Start from the source shape",
      moveMs: 0,
      drawMs: 0,
    },
  ];
  for (const change of changes) {
    const previous = settled(steps[steps.length - 1].pieces);
    const changed = change.set(previous);
    const previousOverlay = steps[steps.length - 1].overlay ?? [];
    const drawsSomething = (change.overlay ?? []).some(
      (item) => !previousOverlay.some((other) => other.id === item.id),
    );
    steps.push({
      pieces: { ...previous, ...changed },
      caption: change.caption,
      overlay: change.overlay,
      moveMs: moveMs(Object.values(changed)),
      drawMs: drawsSomething ? DRAW_MS : 0,
    });
  }
  return steps;
}

// pieces taken out one after another in quick succession, in the order given
const STAGGER_MS = 110;
const remove = (pieces: Pieces, ids: string[]) =>
  Object.fromEntries(
    ids.map((id, index) => [
      id,
      { ...removed(pieces[id]), delay: index * STAGGER_MS },
    ]),
  );

// a step's delays only apply to that step, so pieces carried into the next one move without waiting
const settled = (pieces: Pieces): Pieces =>
  Object.fromEntries(
    Object.entries(pieces).map(([id, piece]) => [
      id,
      { points: piece.points, opacity: piece.opacity },
    ]),
  );

const letterM = build({}, [
  {
    caption: "Drop the top corners and the top of the diamond",
    set: (p) => remove(p, ["cTL", "cTR", "qTL", "qTR"]),
  },
  {
    caption: "Slide the diamond's lower half up to the top edge",
    set: (p) => ({
      qBL: shifted(p.qBL, 0, -M),
      qBR: shifted(p.qBR, 0, -M),
    }),
  },
]);

const letterO = build({}, [
  { caption: "Take out the diamond", set: (p) => remove(p, quarters) },
]);

// the i, built with a compass-and-ruler construction. the rectangle at 45° spans the gap between a corner
// triangle and the diamond: two of its corners are the ends of the triangle's long edge, the other two the ends of
// the diamond's edge. the lines that bisect it, square to its sides, cross at its middle, and the vertical line through that point is where the
// i gets cut. the left side's construction is mirrored on the right
const gapRect: Quad = [
  [0, A],
  [A, 0],
  [M, C],
  [C, M],
];
const crossing: Point = [(0 + M) / 2, (A + C) / 2];
// the cut, from the edge of the cell
const CUT = crossing[0];

const mirror = (point: Point): Point => [56 - point[0], point[1]];
const mid = (a: Point, b: Point): Point => [
  (a[0] + b[0]) / 2,
  (a[1] + b[1]) / 2,
];
// a line through two points, carried on past both of them, so it shows what it lines up with
const BEYOND = 7;
const extended = (from: Point, to: Point) => {
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const [ux, uy] = [(to[0] - from[0]) / length, (to[1] - from[1]) / length];
  return {
    from: [from[0] - ux * BEYOND, from[1] - uy * BEYOND] as Point,
    to: [to[0] + ux * BEYOND, to[1] + uy * BEYOND] as Point,
  };
};
const construction = {
  rects: [
    { id: "rectL", kind: "rect", points: gapRect },
    { id: "rectR", kind: "rect", points: gapRect.map(mirror) as Quad },
  ] satisfies OverlayItem[],
  // the rectangle's two midlines: each joins the middles of opposite sides, so it crosses them at a right angle
  bisectors: [
    {
      id: "bisectL1",
      kind: "line",
      ...extended(mid(gapRect[0], gapRect[1]), mid(gapRect[2], gapRect[3])),
    },
    {
      id: "bisectL2",
      kind: "line",
      ...extended(mid(gapRect[1], gapRect[2]), mid(gapRect[3], gapRect[0])),
    },
    {
      id: "bisectR1",
      kind: "line",
      ...extended(
        mirror(mid(gapRect[0], gapRect[1])),
        mirror(mid(gapRect[2], gapRect[3])),
      ),
    },
    {
      id: "bisectR2",
      kind: "line",
      ...extended(
        mirror(mid(gapRect[1], gapRect[2])),
        mirror(mid(gapRect[3], gapRect[0])),
      ),
    },
  ] satisfies OverlayItem[],
  points: [
    { id: "crossL", kind: "point", at: crossing },
    { id: "crossR", kind: "point", at: mirror(crossing) },
  ] satisfies OverlayItem[],
  cuts: [
    { id: "cutL", kind: "vertical", x: CUT },
    { id: "cutR", kind: "vertical", x: 56 - CUT },
  ] satisfies OverlayItem[],
};

// what fills between each side's corners once they've swapped. before it's added it sits flat across the middle
const fillLeft: Quad = [
  [0, A],
  [A, A],
  [A, B],
  [0, B],
];
const fillRight: Quad = [
  [B, A],
  [56, A],
  [56, B],
  [B, B],
];
const flat = (quad: Quad): PieceState => ({
  points: quad.map(([x]) => [x, M]) as Quad,
  opacity: 0,
});

// what the cut takes off each side: the middle of the corners and the fill, past the line. it's there all along
// under the pieces it overlaps, unseen, and at the cut it stays put and fades
const cutAwayLeft: Quad = [
  [CUT, CUT],
  [A, A],
  [A, B],
  [CUT, 56 - CUT],
];
const cutAwayRight: Quad = cutAwayLeft.map(mirror) as Quad;
const hidden = (points: Quad): PieceState => ({ points, opacity: 0 });
const fadingFrom = (points: Quad): PieceState => ({
  points,
  opacity: 0,
  enterFrom: { opacity: 1 },
});

const letterI = build(
  {
    fillL: flat(fillLeft),
    fillR: flat(fillRight),
    cutL: hidden(cutAwayLeft),
    cutR: hidden(cutAwayRight),
  },
  [
    {
      caption:
        "Draw a rectangle at 45° from the corners' edges to the diamond's",
      overlay: construction.rects,
      set: () => ({}),
    },
    {
      caption: "Bisect it both ways, square to its sides",
      overlay: [...construction.rects, ...construction.bisectors],
      set: () => ({}),
    },
    {
      caption: "Mark where they cross, and draw a vertical line through it",
      overlay: [
        ...construction.rects,
        ...construction.bisectors,
        ...construction.points,
        ...construction.cuts,
      ],
      set: () => ({}),
    },
    {
      caption: "Fade out the diamond and the construction. Keep the line",
      overlay: construction.cuts,
      set: (p) => remove(p, quarters),
    },
    {
      caption:
        "Move the top corners to the bottom, and the bottom ones to the top",
      overlay: construction.cuts,
      set: (p) => ({
        cTL: shifted(p.cTL, 0, B),
        cTR: shifted(p.cTR, 0, B),
        cBL: shifted(p.cBL, 0, -B),
        cBR: shifted(p.cBR, 0, -B),
      }),
    },
    {
      caption: "Fill the gap between them",
      overlay: construction.cuts,
      set: () => ({ fillL: shown(fillLeft), fillR: shown(fillRight) }),
    },
    {
      caption: "Cut away the middle along the line",
      overlay: construction.cuts,
      set: () => ({
        cutL: fadingFrom(cutAwayLeft),
        cutR: fadingFrom(cutAwayRight),
        cTL: cut([
          [0, B],
          [CUT, B],
          [CUT, 56 - CUT],
          [0, 56],
        ]),
        cBL: cut([
          [0, A],
          [CUT, A],
          [CUT, CUT],
          [0, 0],
        ]),
        cTR: cut([
          [56, B],
          [56 - CUT, B],
          [56 - CUT, 56 - CUT],
          [56, 56],
        ]),
        cBR: cut([
          [56, A],
          [56 - CUT, A],
          [56 - CUT, CUT],
          [56, 0],
        ]),
        fillL: cut([
          [0, A],
          [CUT, A],
          [CUT, B],
          [0, B],
        ]),
        fillR: cut([
          [56 - CUT, A],
          [56, A],
          [56, B],
          [56 - CUT, B],
        ]),
      }),
    },
  ],
);

// the n's guides run along two of the diamond's edges, across the whole cell: they're where the two corners stop
// growing. the top-right edge sits on y = x - A, the bottom-left on y = x + A
const nGuides: OverlayItem[] = [
  { id: "edgeTR", kind: "line", ...extended([A, 0], [56, B]) },
  { id: "edgeBL", kind: "line", ...extended([0, A], [B, 56]) },
];

const letterN = build({}, [
  {
    caption: "Draw guides along the diamond's two edges",
    overlay: nGuides,
    set: () => ({}),
  },
  {
    caption: "Fade out everything but two corners",
    overlay: nGuides,
    set: (p) => remove(p, ["cTL", "cBR", ...quarters]),
  },
  {
    caption: "Grow the corners out to the guides",
    overlay: nGuides,
    set: () => ({
      cTR: shown([
        [56, 0],
        [A, 0],
        [A, 0],
        [56, B],
      ]),
      cBL: shown([
        [0, 56],
        [B, 56],
        [B, 56],
        [0, A],
      ]),
    }),
  },
  {
    caption: "Fade out the guides",
    set: () => ({}),
  },
]);

const letterD = build({}, [
  {
    caption: "Fade out the left corners and the diamond's left half",
    set: (p) => remove(p, ["cTL", "qTL", "qBL", "cBL"]),
  },
  {
    caption: "Slide the right half over to the left edge",
    set: (p) => ({
      qTR: shifted(p.qTR, -M, 0),
      qBR: shifted(p.qBR, -M, 0),
    }),
  },
]);

// in typemark order: M, O, i, n, d, i
export const letterBuilds: LetterStep[][] = [
  letterM,
  letterO,
  letterI,
  letterN,
  letterD,
  letterI,
];

export const finalStep = (letter: number) => letterBuilds[letter].length - 1;

// the source shape's pieces in the order they appear when it's drawn in from nothing: the corners around, then
// the diamond's quarters around
const APPEAR_ORDER = ["cTL", "cTR", "cBR", "cBL", "qTL", "qTR", "qBR", "qBL"];
export const APPEAR_STAGGER_MS = 90;

// a letter's pieces with nothing showing, from whatever step it's at. kept per step so the same object comes
// back every time and a glyph only tweens when it really changes
const hiddenCache = new Map<string, Pieces>();
export function hiddenPieces(letter: number, step: number): Pieces {
  const key = `${letter}-${step}`;
  let pieces = hiddenCache.get(key);
  if (!pieces) {
    pieces = Object.fromEntries(
      Object.entries(letterBuilds[letter][step].pieces).map(([id, piece]) => [
        id,
        { points: piece.points, opacity: 0 },
      ]),
    );
    hiddenCache.set(key, pieces);
  }
  return pieces;
}

// the source shape fading in piece by piece, one after another
const appearCache = new Map<number, Pieces>();
export function appearingPieces(letter: number): Pieces {
  let pieces = appearCache.get(letter);
  if (!pieces) {
    pieces = Object.fromEntries(
      Object.entries(letterBuilds[letter][0].pieces).map(([id, piece]) => {
        const order = APPEAR_ORDER.indexOf(id);
        return [
          id,
          order === -1 ? piece : { ...piece, delay: order * APPEAR_STAGGER_MS },
        ];
      }),
    );
    appearCache.set(letter, pieces);
  }
  return pieces;
}
// when the last piece to come in starts its fade, and how long a fade takes
export const APPEAR_LAST_START_MS =
  (APPEAR_ORDER.length - 1) * APPEAR_STAGGER_MS;
