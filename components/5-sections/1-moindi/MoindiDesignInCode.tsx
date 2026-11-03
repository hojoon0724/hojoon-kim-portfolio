"use client";

import {
  ParallelScrollRows,
  type ParallelScrollRow,
} from "@/components/3-compounds";
import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import Image from "next/image";
import { useState } from "react";

// guides for building the section, never rendered. what it shows is in textSections
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notes = {
  purpose:
    "Show the speed and why it existed: no Figma-to-dev handoff. A sketch for alignment, then straight into production code.",
  layout:
    "First the layout tests side by side in one color theme, with a switch that fades them all to another theme, so it's clear how the themes fit together. Then the sketch over what shipped, per device, as rows that scroll sideways together so each column compares like with like.",
};

// every theme ran the same tests, so each one has a file per theme
const themes = ["Light", "Dark", "Accent", "Secondary"] as const;
const layoutTests = [
  { file: "logo", label: "Logo" },
  { file: "statement", label: "Statement" },
  // { file: "text", label: "Text" },
  { file: "text-accent", label: "Accent text" },
  { file: "icons-buttons", label: "Icons & buttons" },
];

type Theme = (typeof themes)[number];

// the test files are named by the theme's main color
const themeFilePrefixes: Record<Theme, string> = {
  Light: "bright",
  Dark: "dark",
  Accent: "orange",
  Secondary: "blue",
};

const textSections = [
  {
    title: "Design in Code",
    copy: "I started rough: style samples, a few page sketches and some larger components, just enough to find MOindi's design language to guide everything after.",
  },
  {
    title: "Straight to Production",
    copy: "From there, I built the component library and the prototype in Angular, not Figma. The moment a design was finished, it was ready for production. What you saw was what shipped.",
  },
];

// the padding that puts content where a "px-md lg:px-xl max-w-7xl mx-auto" container would, on a full-width element
const contentInset =
  "px-[calc(var(--spacing-md)+max(0px,(100%-var(--container-7xl))/2))] lg:px-[calc(var(--spacing-xl)+max(0px,(100%-var(--container-7xl))/2))]";

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
    <figure className="gap-xs flex flex-col">
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
    </figure>
  );
}

// each before and after pair is the same size, so the two rows line up
const devices = [
  { file: "mbp", label: "Browser", width: 1512, height: 945 },
  { file: "ipad", label: "Tablet", width: 1180, height: 820 },
  { file: "iphone", label: "Mobile", width: 393, height: 852 },
];

const beforeAfterRows: ParallelScrollRow[] = [
  { stage: "before", label: "Figma, day one" },
  { stage: "after", label: "Production, many versions later" },
].map(({ stage, label }) => ({
  label,
  images: devices.map((device) => ({
    src: `/moindi/${device.file}-${stage}.png`,
    alt: `${device.label} layout, ${stage}`,
    width: device.width,
    height: device.height,
  })),
}));

// the layout tests in whichever color theme is picked, then the sketch over what it became
export function MoindiDesignInCode({ id }: { id: string }) {
  const [activeTheme, setActiveTheme] = useState<Theme>(themes[0]);

  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      className="flex items-center py-16"
      snapToEnd
    >
      <div className="gap-2xl flex w-full flex-col">
        <div className="gap-lg px-md lg:px-xl mx-auto flex w-full max-w-7xl flex-col">
          <h2>{textSections[0].title}</h2>
          <p className="max-w-prose text-lg text-pretty md:text-xl">
            {textSections[0].copy}
          </p>
        </div>

        <div
          className={`palette-test gap-md p-lg flex flex-col bg-(--moindi-gray-600) text-(--moindi-gray-50) transition-colors duration-500`}
        >
          <div className="color-picker-container px-md lg:px-xl mx-auto w-full max-w-7xl">
            <div className="font-mono font-bold uppercase">Color Theme</div>
            <div
              className="gap-xs grid grid-cols-4 justify-start"
              role="group"
              aria-label="Color theme"
            >
              {themes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  aria-pressed={theme === activeTheme}
                  onClick={() => setActiveTheme(theme)}
                  className={`roboto-mono px-sm py-xs cursor-pointer border border-current text-xs font-bold uppercase transition-colors duration-200 md:text-sm ${theme === activeTheme ? "bg-current/20" : "hover:bg-current/10"}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          <div className="gap-lg p-md lg:p-xl mx-auto grid w-full max-w-400 grid-cols-2">
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
        <div className="text-part-2 gap-lg px-md lg:px-xl mx-auto flex w-full max-w-7xl flex-col">
          <h2>{textSections[1].title}</h2>
          <p className="max-w-prose text-lg text-pretty md:text-xl">
            {textSections[1].copy}
          </p>
        </div>

        <ParallelScrollRows
          rows={beforeAfterRows}
          columnLabels={devices.map((device) => device.label)}
          rowClassName="h-[clamp(220px,32vw,420px)]"
          insetClassName={contentInset}
        />
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
