"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

// the seed: four small tests in four color themes, stepping to the next theme every few seconds.
// picking one restarts the wait; held still for reduced motion, where the buttons still switch it
export function LayoutTests() {
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = setTimeout(() => {
      setActiveTheme(themes[(themes.indexOf(activeTheme) + 1) % themes.length]);
    }, themeCycleMs);
    return () => clearTimeout(timeout);
  }, [activeTheme]);

  // as tall as the showcase frames on md and up (an iphone 17 pro at most 280px wide, or what the viewport
  // leaves), and as tall as its content on phones. the tiles scale to fit whatever's left
  return (
    <div className="gap-md p-md lg:p-lg flex flex-col bg-(--moindi-gray-600) text-(--moindi-gray-50) md:h-[min(calc(280px*150/71.9),calc(100svh-24rem))] md:flex-row">
      <div className="gap-sm flex shrink-0 flex-col md:w-36">
        <div className="roboto-mono text-sm font-bold uppercase">
          Color theme
        </div>
        <div
          className="gap-xs grid grid-cols-4 md:grid-cols-1"
          role="group"
          aria-label="Color theme"
        >
          {themes.map((theme) => (
            <button
              key={theme}
              type="button"
              aria-pressed={theme === activeTheme}
              onClick={() => setActiveTheme(theme)}
              className={toggleButtonClass(theme === activeTheme)}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 min-w-0 flex-1 md:[container-type:size]">
        <div className="gap-md mx-auto grid w-full grid-cols-2 md:max-w-[calc((100cqh-var(--spacing-md))*16/9)]">
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
  );
}
