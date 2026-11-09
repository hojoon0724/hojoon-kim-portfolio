"use client";

import { Icon } from "@/components/1-atoms";
import { RandomTiles } from "@/demos/moindi/components/RandomTiles";
import { useId, useState } from "react";
import { toggleButtonClass } from "../design-in-code/shared";
import { SlashTexture } from "../design-in-code/MotionSamples";
import { visualHeight } from "./frame";
import { GLYPH, LETTERS, PITCH, TYPEMARK_PATH } from "./typemark";

const GRID_COLS = 44;
const GRID_ROWS = 26;

// the typemark repeated in a fixed order, each row starting one letter later, so it reads across and down.
// never shuffled: it's the typemark, not a texture
function MoindiGrid() {
  const id = `glyph-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      viewBox={`0 0 ${GRID_COLS * PITCH} ${GRID_ROWS * PITCH}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      role="img"
      aria-label="The MOindi grid: the typemark repeated, each row shifted by one letter"
    >
      <defs>
        {LETTERS.map((_, index) => (
          <symbol
            key={index}
            id={`${id}-${index}`}
            viewBox={`${index * PITCH} 0 ${GLYPH} ${GLYPH}`}
          >
            <path d={TYPEMARK_PATH} fill="currentColor" />
          </symbol>
        ))}
      </defs>
      {Array.from({ length: GRID_ROWS }, (_, row) =>
        Array.from({ length: GRID_COLS }, (_, col) => (
          <use
            key={`${row}-${col}`}
            href={`#${id}-${(col + row) % LETTERS.length}`}
            x={col * PITCH + 4}
            y={row * PITCH + 4}
            width={GLYPH}
            height={GLYPH}
          />
        )),
      )}
    </svg>
  );
}

const patterns = [
  { id: "grid", label: "MOindi Grid" },
  { id: "angle", label: "Angle Array" },
  { id: "slash", label: "Slash" },
] as const;

type PatternId = (typeof patterns)[number]["id"];

// the graphic elements from the guidelines, each live: the grid built from the typemark, the angle array dealt
// from its six tiles (shuffle it), and the slash pattern at its approved angle
export function BrandPatterns() {
  const [patternId, setPatternId] = useState<PatternId>("grid");
  const [shuffle, setShuffle] = useState(0);

  return (
    <div className={`gap-sm flex flex-col ${visualHeight}`}>
      <div className="gap-xs flex flex-wrap" role="group" aria-label="Pattern">
        {patterns.map((pattern) => (
          <button
            key={pattern.id}
            type="button"
            aria-pressed={pattern.id === patternId}
            onClick={() => setPatternId(pattern.id)}
            className={toggleButtonClass(pattern.id === patternId)}
          >
            {pattern.label}
          </button>
        ))}
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden border border-current/15 bg-(--moindi-gray-50) text-(--moindi-primary-500)">
        {patternId === "grid" && <MoindiGrid />}
        {patternId === "angle" && (
          <>
            <div
              className="absolute inset-0 bg-(--moindi-primary-500) text-(--moindi-gray-950)"
              role="img"
              aria-label="The angle array: a random pattern of triangle and square tiles"
            >
              <RandomTiles shuffle={shuffle} />
            </div>
            <button
              type="button"
              onClick={() => setShuffle((count) => count + 1)}
              aria-label="Shuffle the pattern"
              title="Shuffle"
              className="absolute right-3 bottom-3 flex cursor-pointer items-center border border-(--moindi-gray-950) bg-(--moindi-gray-30) p-2 text-(--moindi-gray-950) shadow-lg transition-colors hover:bg-(--moindi-gray-950) hover:text-(--moindi-gray-30)"
            >
              <Icon icon="shuffle" className="size-6" />
            </button>
          </>
        )}
        {patternId === "slash" && (
          <div
            role="img"
            aria-label="The slash pattern, framing a reserved area"
            className="p-lg absolute inset-0"
          >
            {/* used as a frame: a band of slashes around an area kept for something specific */}
            <div className="relative size-full">
              <SlashTexture color="var(--moindi-primary-500)" scale={1} />
              <div className="absolute inset-6 border border-(--moindi-primary-500)/40 bg-(--moindi-gray-50) md:inset-10" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
