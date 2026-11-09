"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "tl" | "tr" | "bl" | "br" | "full" | "none";
type Edges<T> = { above: T; right: T; below: T; left: T };

const TILE_SIZE = 40;
const RANDOM_VIOLATION_PERCENT = 10; // need bc otherwise it's just diagonal lines

const VARIANTS: Variant[] = ["tl", "tr", "bl", "br", "full", "none"];

// true = color allowed
const TILE_EDGES: Record<Variant, Edges<boolean>> = {
  none: { above: false, right: false, below: false, left: false },
  full: { above: true, right: true, below: true, left: true },
  tl: { above: true, right: false, below: false, left: true },
  tr: { above: true, right: true, below: false, left: false },
  bl: { above: false, right: false, below: true, left: true },
  br: { above: false, right: true, below: true, left: false },
};

function buildCompatibilityMap() {
  const compatibility = {} as Record<Variant, Edges<Variant[]>>;

  for (const variant of VARIANTS) {
    compatibility[variant] = { above: [], right: [], below: [], left: [] };

    for (const neighbor of VARIANTS) {
      // check if edges match for each direction
      if (TILE_EDGES[neighbor].below === TILE_EDGES[variant].above) {
        compatibility[variant].above.push(neighbor);
      }
      if (TILE_EDGES[neighbor].left === TILE_EDGES[variant].right) {
        compatibility[variant].right.push(neighbor);
      }
      if (TILE_EDGES[neighbor].above === TILE_EDGES[variant].below) {
        compatibility[variant].below.push(neighbor);
      }
      if (TILE_EDGES[neighbor].right === TILE_EDGES[variant].left) {
        compatibility[variant].left.push(neighbor);
      }
    }
  }
  return compatibility;
}

const COMPATIBILITY = buildCompatibilityMap();

// basically try to get more horizontal lines by weighting none and full variants
const WEIGHTED_VARIANTS = VARIANTS.flatMap((variant) =>
  Array<Variant>(variant === "full" || variant === "none" ? 10 : 1).fill(
    variant,
  ),
);

const pick = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

function selectVariant(left: Variant | undefined): Variant {
  // random selection with violation chance
  if (Math.random() * 100 < RANDOM_VIOLATION_PERCENT) return pick(VARIANTS);
  if (!left) return pick(WEIGHTED_VARIANTS);
  return pick(
    WEIGHTED_VARIANTS.filter((v) => COMPATIBILITY[v].left.includes(left)),
  );
}

function generatePattern(columns: number, rows: number): Variant[][] {
  return Array.from({ length: rows }, () => {
    const row: Variant[] = [];
    for (let col = 0; col < columns; col++) {
      row.push(selectVariant(row[col - 1]));
    }
    return row;
  });
}

// stand-in for the angular BackgroundTileComponent: colors the corner/edges its variant allows
const TILE_SHAPES: Record<Variant, string | null> = {
  none: null,
  full: "0,0 40,0 40,40 0,40",
  tl: "0,0 40,0 0,40",
  tr: "0,0 40,0 40,40",
  bl: "0,0 40,40 0,40",
  br: "40,0 40,40 0,40",
};

// on a shuffle, each tile flips over around its diagonal and shows its new shape on the way back down
const FLIP_MS = 360;

function TileShape({ variant }: { variant: Variant }) {
  const shape = TILE_SHAPES[variant];
  return (
    <svg
      width={TILE_SIZE}
      height={TILE_SIZE}
      viewBox={`0 0 ${TILE_SIZE} ${TILE_SIZE}`}
      className="block"
      aria-hidden="true"
    >
      {shape && <polygon points={shape} fill="currentColor" />}
    </svg>
  );
}

function BackgroundTile({
  variant,
  turn,
  flipDelayMs,
}: {
  variant: Variant;
  // goes up with every shuffle; each new one flips the tile, even when it lands on the same shape
  turn: number;
  // how long the tile waits before flipping; left out, it swaps in place
  flipDelayMs?: number;
}) {
  const [shown, setShown] = useState(variant);
  const tileRef = useRef<HTMLDivElement>(null);
  const animate =
    flipDelayMs !== undefined &&
    typeof window !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!animate && shown !== variant) setShown(variant);

  useEffect(() => {
    const tile = tileRef.current;
    if (!animate || !tile) return;
    const half = FLIP_MS / 2;
    // each flip picks one of the two diagonals and a direction at random
    const axis = Math.random() < 0.5 ? "1, 1, 0" : "1, -1, 0";
    const dir = Math.random() < 0.5 ? 1 : -1;
    // up to edge-on, swap the shape, then the rest of the way round
    const up = tile.animate(
      [
        { transform: `rotate3d(${axis}, 0deg)` },
        { transform: `rotate3d(${axis}, ${dir * 90}deg)` },
      ],
      {
        duration: half,
        delay: (flipDelayMs ?? 0) + Math.random() * WAVE_JITTER_MS,
        easing: "ease-in",
        fill: "forwards",
      },
    );
    let down: Animation | undefined;
    up.onfinish = () => {
      setShown(variant);
      down = tile.animate(
        [
          { transform: `rotate3d(${axis}, ${-dir * 90}deg)` },
          { transform: `rotate3d(${axis}, 0deg)` },
        ],
        { duration: half, easing: "ease-out" },
      );
      up.cancel();
    };
    return () => {
      up.cancel();
      down?.cancel();
    };
  }, [turn, variant, animate, flipDelayMs]);

  return (
    <div
      className="shrink-0"
      style={{ width: TILE_SIZE, height: TILE_SIZE, perspective: 200 }}
    >
      <div ref={tileRef}>
        <TileShape variant={shown} />
      </div>
    </div>
  );
}

type RandomTilesProps = {
  // fixed size in px; leave out to fill the parent
  width?: number;
  height?: number;
  // change it to deal a new pattern. the tiles turn over to it in a wave from the top-left corner
  shuffle?: number;
  className?: string;
};

// how far apart neighboring tiles start turning, so the wave reads as moving across the pattern
const WAVE_STEP_MS = 20;
const WAVE_JITTER_MS = 330;

export function RandomTiles({
  width,
  height,
  shuffle = 0,
  className = "",
}: RandomTilesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState({ width: 0, height: 0 });
  const [grid, setGrid] = useState<Variant[][]>([]);
  // counts the patterns dealt by a shuffle. the first pattern appears as is; shuffled ones turn over
  const [turn, setTurn] = useState(0);

  const columns = Math.ceil((width ?? measured.width) / TILE_SIZE) + 1;
  const rows = Math.ceil((height ?? measured.height) / TILE_SIZE) + 1;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      setMeasured({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // generated after mount so the server and client don't render different random patterns
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrid(generatePattern(columns, rows));
  }, [columns, rows]);

  useEffect(() => {
    if (shuffle === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTurn((count) => count + 1);
    setGrid((current) =>
      generatePattern(current[0]?.length ?? 0, current.length),
    );
  }, [shuffle]);

  return (
    <div
      ref={containerRef}
      className={`block overflow-hidden text-[0px] leading-0 ${width === undefined ? "w-full" : ""} ${height === undefined ? "h-full" : ""} ${className}`}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="-mt-px flex gap-0 leading-0 first:mt-0">
          {row.map((variant, colIndex) => (
            <BackgroundTile
              key={colIndex}
              variant={variant}
              turn={turn}
              flipDelayMs={
                turn > 0 ? (colIndex + rowIndex) * WAVE_STEP_MS : undefined
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
