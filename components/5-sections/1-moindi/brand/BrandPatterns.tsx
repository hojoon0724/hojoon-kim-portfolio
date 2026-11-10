"use client";

import { Icon } from "@/components/1-atoms";
import { useInView } from "@/hooks";
import { RandomTiles } from "@/demos/moindi/components/RandomTiles";
import { Fragment, useEffect, useId, useState } from "react";
import { toggleButtonClass } from "../designed-in-code/shared";
import { SlashTexture } from "../designed-in-code/MotionSamples";
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

// the grid's palettes, as in the logo tests (public/moindi/layout-tests/*-logo.png): the dark test's inverse,
// gray on the accent, then the bright, blue and dark backgrounds under a primary pattern, then the quieter
// low-contrast versions of the blue and dark ones (layout-tests/screenshot--*.png), the pattern a shade darker
// than its own background. the picker sets the three groups apart
const gridPalettes: {
  label: string;
  group: "accent" | "full" | "low";
  bg: string;
  fg: string;
}[] = [
  {
    label: "Orange",
    group: "accent",
    bg: "var(--moindi-primary-500)",
    fg: "var(--moindi-gray-900)",
  },
  {
    label: "Bright",
    group: "full",
    bg: "var(--moindi-gray-30)",
    fg: "var(--moindi-primary-500)",
  },
  {
    label: "Light blue",
    group: "full",
    bg: "var(--moindi-secondary-100)",
    fg: "var(--moindi-primary-500)",
  },
  {
    label: "Dark blue",
    group: "full",
    bg: "var(--moindi-secondary-800)",
    fg: "var(--moindi-primary-500)",
  },
  {
    label: "Dark",
    group: "full",
    bg: "var(--moindi-gray-900)",
    fg: "var(--moindi-primary-500)",
  },
  {
    label: "Light blue, low contrast",
    group: "low",
    bg: "var(--moindi-secondary-100)",
    fg: "color-mix(in srgb, var(--moindi-secondary-500) 13%, var(--moindi-secondary-100))",
  },
  {
    label: "Dark blue, low contrast",
    group: "low",
    bg: "var(--moindi-secondary-800)",
    fg: "color-mix(in srgb, black 14%, var(--moindi-secondary-800))",
  },
  {
    label: "Dark, low contrast",
    group: "low",
    bg: "var(--moindi-gray-800)",
    fg: "color-mix(in srgb, black 14%, var(--moindi-gray-800))",
  },
];
const GRID_CYCLE_MS = 2500;

// the grid, cycling through its palettes on its own. picking one jumps to it and the cycle carries on from there
function CyclingMoindiGrid() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [inViewRef, isInView] = useInView<HTMLDivElement>(0.4);

  // a timeout per palette rather than one interval, so a pick gets its full turn before the next. only while
  // it's on screen: off screen it holds where it is
  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(
      () => setPaletteIndex((index) => (index + 1) % gridPalettes.length),
      GRID_CYCLE_MS,
    );
    return () => clearTimeout(timeout);
  }, [paletteIndex, isInView]);

  return (
    <>
      <div
        ref={inViewRef}
        className="absolute inset-0 transition-colors duration-700 motion-reduce:transition-none"
        style={{
          backgroundColor: gridPalettes[paletteIndex].bg,
          color: gridPalettes[paletteIndex].fg,
        }}
      >
        <MoindiGrid />
      </div>
      <div
        role="group"
        aria-label="Palette"
        className="absolute right-3 bottom-3 flex gap-1 border border-(--moindi-gray-950) bg-(--moindi-gray-30) p-1 shadow-lg"
      >
        {gridPalettes.map((palette, index) => (
          <Fragment key={palette.label}>
            {/* a divider wherever a new group starts: the accent, full contrast, then low contrast */}
            {index > 0 && palette.group !== gridPalettes[index - 1].group && (
              <span
                aria-hidden="true"
                className="mx-0.5 w-px self-stretch bg-(--moindi-gray-300)"
              />
            )}
            <button
              type="button"
              aria-label={palette.label}
              aria-pressed={index === paletteIndex}
              title={palette.label}
              onClick={() => setPaletteIndex(index)}
              className={`flex size-7 cursor-pointer items-center justify-center border-2 transition-[opacity,border-color,outline-color] ${
                index === paletteIndex
                  ? "border-(--moindi-gray-30) outline-2 outline-(--moindi-gray-950)"
                  : "border-transparent opacity-40 outline-2 outline-transparent hover:opacity-100"
              }`}
              style={{ backgroundColor: palette.bg }}
            >
              <span
                className="size-2.5"
                style={{ backgroundColor: palette.fg }}
              />
            </button>
          </Fragment>
        ))}
      </div>
    </>
  );
}

const patterns = [
  { id: "grid", label: "MOindi Grid" },
  { id: "angle", label: "Angle Array" },
  { id: "slash", label: "Slash" },
] as const;

// the slash lines: each color at one row, then each again at two. every line uses the same slashes; a thicker
// one stacks more rows of them, each row one slash tall, so the slashes always show whole. a slash's tile is
// 36 units tall, drawn here at half size
const SLASH_SCALE = 0.5;
const SLASH_ROW = 36 * SLASH_SCALE;

// light and dark mode: the same primary and secondary lines, with the gray line and the background swapping
// ends of the gray scale
const slashModes = {
  light: {
    label: "Light",
    bg: "var(--moindi-gray-30)",
    colors: [
      "var(--moindi-primary-500)",
      "var(--moindi-secondary-500)",
      "var(--moindi-gray-900)",
    ],
  },
  dark: {
    label: "Dark",
    bg: "var(--moindi-gray-900)",
    colors: [
      "var(--moindi-primary-500)",
      "var(--moindi-secondary-500)",
      "var(--moindi-gray-30)",
    ],
  },
};
type SlashMode = keyof typeof slashModes;

function SlashLines() {
  const [mode, setMode] = useState<SlashMode>("light");
  const { bg, colors } = slashModes[mode];
  const lines = [1, 2].flatMap((rows) =>
    colors.map((color) => ({ rows, color })),
  );

  return (
    <>
      <div
        role="img"
        aria-label={`The slash pattern in ${slashModes[mode].label.toLowerCase()} mode: horizontal lines of slashes, edge to edge, in different thicknesses and colors`}
        className="absolute inset-0 flex flex-col justify-evenly transition-colors duration-500 motion-reduce:transition-none"
        style={{ backgroundColor: bg }}
      >
        {/* each one a horizontal line running from one edge to the other, never a fill or a frame */}
        {lines.map((line, index) => (
          <div
            key={index}
            className="relative w-full"
            style={{ height: SLASH_ROW * line.rows }}
          >
            <SlashTexture color={line.color} scale={SLASH_SCALE} />
          </div>
        ))}
      </div>
      <div
        role="group"
        aria-label="Mode"
        className="absolute right-3 bottom-3 flex gap-1 border border-(--moindi-gray-950) bg-(--moindi-gray-30) p-1 shadow-lg"
      >
        {(Object.keys(slashModes) as SlashMode[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={key === mode}
            onClick={() => setMode(key)}
            className={`cursor-pointer px-2 py-1 font-mono text-xs uppercase transition-colors ${
              key === mode
                ? "bg-(--moindi-gray-950) text-(--moindi-gray-30)"
                : "text-(--moindi-gray-950) opacity-40 hover:opacity-100"
            }`}
          >
            {slashModes[key].label}
          </button>
        ))}
      </div>
    </>
  );
}

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
        {patternId === "grid" && <CyclingMoindiGrid />}
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
        {patternId === "slash" && <SlashLines />}
      </div>
    </div>
  );
}
