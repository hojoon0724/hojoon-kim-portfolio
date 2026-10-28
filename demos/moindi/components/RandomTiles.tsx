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

function BackgroundTile({ variant }: { variant: Variant }) {
  const shape = TILE_SHAPES[variant];
  return (
    <svg
      width={TILE_SIZE}
      height={TILE_SIZE}
      viewBox={`0 0 ${TILE_SIZE} ${TILE_SIZE}`}
      className="shrink-0"
      aria-hidden="true"
    >
      {shape && <polygon points={shape} fill="currentColor" />}
    </svg>
  );
}

type RandomTilesProps = {
  // fixed size in px; leave out to fill the parent
  width?: number;
  height?: number;
  className?: string;
};

export function RandomTiles({
  width,
  height,
  className = "",
}: RandomTilesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState({ width: 0, height: 0 });
  const [grid, setGrid] = useState<Variant[][]>([]);

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

  return (
    <div
      ref={containerRef}
      className={`block overflow-hidden text-[0px] leading-0 ${width === undefined ? "w-full" : ""} ${height === undefined ? "h-full" : ""} ${className}`}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="-mt-px flex gap-0 leading-0 first:mt-0">
          {row.map((variant, colIndex) => (
            <BackgroundTile key={colIndex} variant={variant} />
          ))}
        </div>
      ))}
    </div>
  );
}
