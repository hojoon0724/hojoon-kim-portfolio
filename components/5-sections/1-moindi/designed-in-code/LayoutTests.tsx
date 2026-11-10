"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { toggleButtonClass } from "./shared";

// every theme ran the same tests, so each one has a file per theme
export const themes = ["Light", "Dark", "Accent", "Secondary"] as const;
export type Theme = (typeof themes)[number];

const layoutTests = [
  { file: "logo", label: "Logo" },
  { file: "statement", label: "Statement" },
  // { file: "text", label: "Text" },
  { file: "text-accent", label: "Accent text" },
  { file: "icons-buttons", label: "Icons & buttons" },
];

// the test files are named by the theme's main color
const themeFilePrefixes: Record<Theme, string> = {
  Light: "bright",
  Dark: "dark",
  Accent: "orange",
  Secondary: "blue",
};

const themeCycleMs = 3000;

// each tile stacks every theme's version and fades to the active one, so they're all loaded before a switch.
// a slight stagger across the tiles makes the switch read as a wave
function LayoutTestTile({
  test,
  index,
  activeTheme,
}: {
  test: (typeof layoutTests)[number];
  index: number;
  activeTheme: Theme;
}) {
  return (
    <div className="relative aspect-video w-full">
      {themes.map((theme) => (
        // served as-is: next's optimizer re-encodes without the color profile, which flattens display p3 to srgb
        <Image
          key={theme}
          src={`/moindi/layout-tests/${themeFilePrefixes[theme]}-${test.file}.png`}
          alt={
            theme === activeTheme
              ? `${test.label} test in the ${theme.toLowerCase()} theme`
              : ""
          }
          fill
          unoptimized
          className={`object-cover transition-opacity duration-500 ${theme === activeTheme ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: `${index * 60}ms` }}
        />
      ))}
    </div>
  );
}

// the tiles' arrangement: where the theme buttons go, and how many tiles across
interface Arrangement {
  buttons: "top" | "side";
  columns: number;
  tileWidth: number;
  gap: number;
}

// the space between tiles and around the buttons: tighter in small rooms like a phone's
const gapFor = (width: number) => (width < 500 ? 6 : 12);
// room the buttons take: a row of four across the top, or a column down the side
const BUTTON_ROW_H = 30;
const BUTTON_COLUMN_W = 96;
const columnOptions = [1, 2, 4];

// the biggest the 16:9 tiles can be in a box, trying the buttons on top and at the side, and the tiles in one
// column, a 2x2 grid or one row
function bestArrangement(width: number, height: number): Arrangement {
  const GAP = gapFor(width);
  let best: Arrangement = { buttons: "top", columns: 2, tileWidth: 0, gap: GAP };
  for (const buttons of ["top", "side"] as const) {
    const areaW = buttons === "side" ? width - BUTTON_COLUMN_W - GAP : width;
    const areaH = buttons === "top" ? height - BUTTON_ROW_H - GAP : height;
    for (const columns of columnOptions) {
      const rows = layoutTests.length / columns;
      const tileWidth = Math.min(
        (areaW - GAP * (columns - 1)) / columns,
        ((areaH - GAP * (rows - 1)) / rows) * (16 / 9),
      );
      if (tileWidth > best.tileWidth)
        best = { buttons, columns, tileWidth, gap: GAP };
    }
  }
  return best;
}

// the seed: four small tests in four color themes, stepping to the next theme every few seconds.
// picking one restarts the wait; held still for reduced motion, where the buttons still switch it
export function LayoutTests() {
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0]);
  const areaRef = useRef<HTMLDivElement>(null);
  const [arrangement, setArrangement] = useState<Arrangement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = setTimeout(() => {
      setActiveTheme(themes[(themes.indexOf(activeTheme) + 1) % themes.length]);
    }, themeCycleMs);
    return () => clearTimeout(timeout);
  }, [activeTheme]);

  // picks the arrangement that makes the tiles biggest in the room there is, again whenever it changes
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setArrangement(bestArrangement(width, height));
    });
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  const buttons = arrangement?.buttons ?? "top";
  const columns = arrangement?.columns ?? 2;
  const tileWidth = Math.floor(arrangement?.tileWidth ?? 0);
  const gap = arrangement?.gap ?? 4;
  const gridWidth = columns * tileWidth + gap * (columns - 1);

  // fills the height it's given: the slide's visual area on phones, and as tall as the showcase frames on md
  // and up (an iphone 17 pro at most 280px wide, or what the viewport leaves)
  return (
    <div className="md:p-md h-full p-1.5 bg-(--moindi-gray-600) text-(--moindi-gray-50) md:h-[min(calc(280px*150/71.9),calc(100svh-24rem))]">
      {/* the room to fill. the buttons and tiles sit together as one group, centered in it */}
      <div
        ref={areaRef}
        className="flex size-full min-h-0 items-center justify-center"
      >
        <div
          className={`flex w-full ${buttons === "side" ? "flex-row items-start justify-between" : "flex-col"} ${arrangement ? "" : "w-full"} `}
          style={{ gap }}
        >
          <div
            className={`grid shrink-0 gap-1 md:gap-1.5 ${buttons === "side" ? "grid-cols-1" : "grid-cols-4"}`}
            // at the side it's a fixed column; on top it spans exactly the tiles' width
            style={{
              width:
                buttons === "side"
                  ? BUTTON_COLUMN_W
                  : arrangement
                    ? gridWidth
                    : undefined,
            }}
            role="group"
            aria-label="Color theme"
          >
            {themes.map((theme) => (
              <button
                key={theme}
                type="button"
                aria-pressed={theme === activeTheme}
                onClick={() => setActiveTheme(theme)}
                className={`${toggleButtonClass(theme === activeTheme)} px-1! py-1! text-[10px]! md:text-xs!`}
              >
                {theme}
              </button>
            ))}
          </div>
          <div
            className="grid"
            style={
              {
                gap,
                gridTemplateColumns: `repeat(${columns}, ${arrangement ? `${tileWidth}px` : "minmax(0, 1fr)"})`,
              } as CSSProperties
            }
          >
            {layoutTests.map((test, index) => (
              <LayoutTestTile
                key={test.file}
                test={test}
                index={index}
                activeTheme={activeTheme}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
