"use client";

import { useInView } from "@/hooks";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { visualHeight } from "./frame";

// the palette from public/moindi/color-palette.svg, laid out as columns: one per scale, with the steps running
// down a shared axis so a step sits at the same height in every column

// the steps down the axis. most take two half rows; the gray's extra-light and extra-dark ends (30,
// 50, 950, 970) take one half row each, so their swatches are half as tall: 2:1 where the rest are square
const axisSteps = [
  30, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 970,
];
const shortSteps = [30, 50, 950, 970];
const isShort = (step: number) => shortSteps.includes(step);
const rowsFor = (step: number) => (isShort(step) ? 1 : 2);
// where each full step starts, counting half rows from 1
const axisStarts = axisSteps.reduce<number[]>(
  (starts, _step, index) => [
    ...starts,
    index === 0 ? 1 : starts[index - 1] + rowsFor(axisSteps[index - 1]),
  ],
  [],
);
const AXIS_ROWS = axisSteps.reduce((rows, step) => rows + rowsFor(step), 0);
// the axis's height in cells
const AXIS_CELLS = AXIS_ROWS / 2;
const axisStart = (step: number) => axisStarts[axisSteps.indexOf(step)];
// grid rows for a step; the header row comes first, so axis row n is grid row n + 1
const rowSpan = (step: number) =>
  `${axisStart(step) + 1} / span ${rowsFor(step)}`;

const primarySteps = [300, 350, 400, 450, 500, 550, 600, 650, 700];
const axisLabels = axisSteps;

interface Swatch {
  step: number;
  color: string;
  // its lane, for primary's two; 1 otherwise
  lane: number;
}

interface Column {
  name: string;
  hue: string;
  saturation: string;
  // lanes it covers
  span: number;
  swatches: Swatch[];
}

const tokenSwatches = (token: string, steps: number[], lane = 1) =>
  steps.map((step) => ({
    step,
    lane,
    color: `var(--moindi-${token}-${step})`,
  }));

const colorSteps = [100, 200, 300, 400, 500, 600, 700, 800, 900];

// the functional scales only exist in full in the guidelines (the product's tokens cover a few of their
// steps), so they're the guideline values
const hexSwatches = (hexes: string[]) =>
  hexes.map((color, index) => ({ step: colorSteps[index], color, lane: 1 }));

const paletteColumns = [
  {
    // all nine shades, 300 to 700 in steps of 50, stacked as rectangles in the space the other columns give
    // 300 to 700. orange's whole range fits where the others have five steps
    name: "primary",
    hue: "30°",
    saturation: "100%",
    span: 1,
    swatches: tokenSwatches("primary", primarySteps),
  },
  {
    name: "secondary",
    hue: "200°",
    saturation: "100%",
    span: 1,
    swatches: tokenSwatches("secondary", colorSteps),
  },
  {
    name: "gray",
    hue: "200°",
    saturation: "5%",
    span: 1,
    swatches: tokenSwatches("gray", axisSteps),
  },
  {
    name: "success",
    hue: "100°",
    saturation: "50%",
    span: 1,
    swatches: hexSwatches([
      "#D2ECC6",
      "#BBE2A7",
      "#A6D98C",
      "#79C653",
      "#62B03B",
      "#559933",
      "#407326",
      "#2B4C1A",
      "#203913",
    ]),
  },
  {
    name: "warning",
    hue: "50°",
    saturation: "100%",
    span: 1,
    swatches: hexSwatches([
      "#FFF2B3",
      "#FFEB8A",
      "#FFE566",
      "#FFD91A",
      "#EBC300",
      "#CCAA00",
      "#997F00",
      "#665500",
      "#4D4000",
    ]),
  },
  {
    name: "error",
    hue: "5°",
    saturation: "90%",
    span: 1,
    swatches: hexSwatches([
      "#FBBCB6",
      "#F99890",
      "#F7796E",
      "#F43625",
      "#DF1D0C",
      "#C21A0A",
      "#911308",
      "#610D05",
      "#490A04",
    ]),
  },
  {
    name: "info",
    hue: "215°",
    saturation: "50%",
    span: 1,
    swatches: hexSwatches([
      "#C6D6EC",
      "#A7BFE2",
      "#8CACD9",
      "#5383C6",
      "#3B6CB0",
      "#335D99",
      "#264673",
      "#1A2F4D",
      "#132339",
    ]),
  },
] as const satisfies Column[];

// every size comes off one swatch's width (--cell). a swatch fills its lane and its rows exactly, with no gaps
// between swatches: a full step is a cell tall, so it's square, and a short one is half that, so it's 2:1.
// the columns sit edge to edge, with no gaps or padding between them

// the step labels' column: three digits at the label size (0.24 of a cell, about 0.6em a digit) and a little
// room before the panels
const LABEL_W = 0.55;
const HEADER_H = 1.4;

// grid tracks across: the labels, then each column's lanes
const columnStarts = paletteColumns.map(
  (_, index) =>
    2 +
    paletteColumns
      .slice(0, index)
      .reduce((count, column) => count + column.span, 0),
);
const LANES = paletteColumns.reduce((count, column) => count + column.span, 0);
const WIDTH_CELLS = LABEL_W + LANES;
const HEIGHT_CELLS = HEADER_H + AXIS_CELLS;
// the largest cell that lets the whole palette fit its box both ways
const cellVar = `min(100cqw / ${WIDTH_CELLS}, 100cqh / ${HEIGHT_CELLS})`;

// grid columns a palette column's panel covers
const panelSpan = (index: number) =>
  `${columnStarts[index]} / span ${paletteColumns[index].span}`;

const gridStyle: CSSProperties = {
  gridTemplateColumns: [
    `calc(${LABEL_W} * var(--cell))`,
    `repeat(${LANES}, var(--cell))`,
  ].join(" "),
  gridTemplateRows: `calc(${HEADER_H} * var(--cell)) repeat(${AXIS_ROWS}, calc(var(--cell) / 2))`,
};

// text sized off the cell, so it always fits inside a column
const fontSize = (ratio: number): CSSProperties => ({
  fontSize: `calc(var(--cell) * ${ratio})`,
});

type RoleName = (typeof paletteColumns)[number]["name"];

// a color from the palette by scale and step, so the mockup uses exactly what the columns show
const paletteColor = (name: RoleName, step: number) =>
  paletteColumns
    .find((column) => column.name === name)
    ?.swatches.find((swatch) => swatch.step === step)?.color ?? "transparent";

function Palette({
  selected,
  onSelect,
}: {
  selected: RoleName;
  onSelect: (name: RoleName) => void;
}) {
  return (
    // a size container, so the cell can be worked out from the room it's given. md and up, it's as tall as the
    // visual and exactly as wide as the palette needs at that height (its shape is the palette's), so the
    // mockup gets the rest
    <div
      className="@container-[size] hidden shrink-0 items-center justify-center md:flex md:aspect-(--palette-ratio) md:h-full"
      style={
        {
          "--palette-ratio": `${WIDTH_CELLS} / ${HEIGHT_CELLS}`,
        } as CSSProperties
      }
    >
      <div
        className="roboto-mono relative grid tabular-nums"
        style={
          {
            "--cell": cellVar,
            ...gridStyle,
          } as CSSProperties
        }
      >
        {/* each column's panel is its button, behind its header and swatches. columns sit edge to
            edge */}
        {paletteColumns.map((column, index) => (
          <button
            key={`panel-${column.name}`}
            type="button"
            aria-pressed={column.name === selected}
            aria-label={`Show where ${column.name} is used`}
            onClick={() => onSelect(column.name)}
            className={`cursor-pointer transition-[background-color] ${
              column.name === selected
                ? "bg-(--moindi-gray-30)"
                : "bg-(--moindi-gray-30)/60 hover:bg-(--moindi-gray-30)"
            }`}
            style={{
              gridColumn: panelSpan(index),
              gridRow: "1 / -1",
            }}
          />
        ))}

        {axisLabels.map((step) => (
          <span
            key={`axis-${step}`}
            className="flex items-center justify-end"
            style={{
              gridColumn: 1,
              gridRow: rowSpan(step),
              paddingRight: "calc(var(--cell) * 0.08)",
              ...fontSize(0.24),
            }}
          >
            {step}
          </span>
        ))}

        {/* headers and swatches let clicks through to the panel under them, and the columns not picked fade */}
        {paletteColumns.map((column, index) => (
          <div
            key={`header-${column.name}`}
            className={`pointer-events-none flex flex-col items-center justify-center text-center leading-tight transition-opacity duration-800 ${column.name === selected ? "" : "opacity-40"}`}
            style={{
              gridColumn: panelSpan(index),
              gridRow: 1,
            }}
          >
            <span className="font-bold uppercase" style={fontSize(0.15)}>
              {column.name}
            </span>
            <span style={fontSize(0.2)}>{column.hue}</span>
            <span className="opacity-60" style={fontSize(0.17)}>
              {column.saturation}
            </span>
          </div>
        ))}

        {paletteColumns.flatMap((column, index) => {
          const swatchClass = `pointer-events-none border border-(--moindi-gray-500) transition-opacity duration-800 ${column.name === selected ? "" : "opacity-30"}`;
          // primary's shades are equal rectangles, stacked so 300 and 700 are
          // centered on the other columns' 300 and 700. that's four steps between centers for eight
          // rectangles, so each is half a cell tall, and the stack sits a quarter cell inside the 300-700 rows
          // at each end
          if (column.name === "primary") {
            return [
              <div
                key="primary"
                className="flex flex-col"
                style={{
                  paddingBlock: "calc(var(--cell) * 0.25)",
                  gridColumn: columnStarts[index],
                  gridRow: `${axisStart(300) + 1} / ${axisStart(700) + rowsFor(700) + 1}`,
                }}
              >
                {column.swatches.map((swatch) => (
                  <div
                    key={swatch.step}
                    className={`flex-1 ${swatchClass}`}
                    style={{ backgroundColor: swatch.color }}
                  ></div>
                ))}
              </div>,
            ];
          }
          return column.swatches.map((swatch) => (
            <div
              key={`${column.name}-${swatch.step}`}
              className={swatchClass}
              style={{
                gridColumn: columnStarts[index] + swatch.lane - 1,
                gridRow: rowSpan(swatch.step),
                backgroundColor: swatch.color,
              }}
            />
          ));
        })}

        {/* the picked column's outline, 2px outside its panel and drawn last, so it sits over every swatch
            and its neighbors. it's placed by position rather than grid column, so it can slide to the next
            pick */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-10 outline-2 outline-offset-2 outline-(--moindi-gray-950) transition-[left,width] duration-800 ease-[cubic-bezier(0.36,0.07,0.19,0.97)] motion-reduce:transition-none"
          style={(() => {
            const index = paletteColumns.findIndex(
              (column) => column.name === selected,
            );
            return {
              left: `calc(var(--cell) * ${LABEL_W + columnStarts[index] - 2})`,
              width: `calc(var(--cell) * ${paletteColumns[index].span})`,
            };
          })()}
        />
      </div>
    </div>
  );
}

// phones: the palette turned on its side, a row per scale with the shades running lightest to darkest left to
// right, sized to the container's width. the same rules as the columns: 30, 50, 950 and 970 are half as wide,
// and primary's nine shades share the 300 to 700 stretch with 300 and 700 centered on the others'
function PaletteRows({
  selected,
  onSelect,
}: {
  selected: RoleName;
  onSelect: (name: RoleName) => void;
}) {
  // a track per half step: short steps take one, the rest two
  const rowStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${AXIS_ROWS}, minmax(0, 1fr))`,
  };
  // grid columns for a step
  const stepColumns = (step: number) =>
    `${axisStart(step)} / span ${rowsFor(step)}`;

  return (
    <div className="roboto-mono flex shrink-0 flex-col tabular-nums md:hidden">
      <div className="mb-1 grid" style={rowStyle}>
        {axisSteps.map((step) => (
          <span
            key={step}
            className="text-center text-[7px] leading-none"
            style={{ gridColumn: stepColumns(step) }}
          >
            {isShort(step) ? "" : step}
          </span>
        ))}
      </div>
      {paletteColumns.map((column) => {
        const isOn = column.name === selected;
        return (
          <button
            key={column.name}
            type="button"
            aria-pressed={isOn}
            aria-label={`Show where ${column.name} is used`}
            onClick={() => onSelect(column.name)}
            className={`grid cursor-pointer items-stretch outline-2 outline-offset-2 transition-[height,opacity,outline-color] duration-600 ease-[cubic-bezier(0.36,0.07,0.19,0.97)] motion-reduce:transition-none ${isOn ? "relative z-10 h-4 outline-(--moindi-gray-950)" : "h-2.5 opacity-40 outline-transparent"}`}
            style={rowStyle}
          >
            {column.name === "primary" ? (
              // 300 and 700 centered on the others': the stretch is ten half steps, so it's inset half a half
              // step (5%) at each end
              <span
                className="flex px-[5%]"
                style={{
                  gridColumn: `${axisStart(300)} / ${axisStart(700) + rowsFor(700)}`,
                }}
              >
                {column.swatches.map((swatch) => (
                  <span
                    key={swatch.step}
                    className="flex-1 border border-(--moindi-gray-500)"
                    style={{ backgroundColor: swatch.color }}
                  />
                ))}
              </span>
            ) : (
              column.swatches.map((swatch) => (
                <span
                  key={swatch.step}
                  className="border border-(--moindi-gray-500)"
                  style={{
                    gridColumn: stepColumns(swatch.step),
                    backgroundColor: swatch.color,
                  }}
                />
              ))
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---- the mockup ----
// a barebones screen of the product with no real words: text is a bar and images are blocks, like the code in
// the collaboration section. every bar or block that carries color plays a role; the ones playing the picked
// role stay at full strength and the rest fade, so the screen shows where that color is allowed

const ROLE_CYCLE_MS = 3000;

const RoleContext = createContext<RoleName>("primary");

// set inside a part, so a part nested in one doesn't fade or outline a second time
const InsidePartContext = createContext(false);

// whether the screen's highlight is on. each color first shows its screen as it really is, then highlights
const HighlightContext = createContext(false);

// one piece of the mockup that plays a role. once the highlight is on, it stays at full strength when its role
// is picked, fades otherwise, and gets a dashed frame when it's a color (picking gray shows the whole
// hierarchy, so no frames). before that, everything shows as it is
function Part({
  role,
  className = "",
  style,
  children,
}: {
  role: RoleName;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const selected = useContext(RoleContext);
  const isHighlighted = useContext(HighlightContext);
  const isNested = useContext(InsidePartContext);
  const isOn = role === selected;
  const isFramed = isHighlighted && isOn && role !== "gray";
  // a dashed frame drawn as a border on an overlay rather than an outline, which iOS Safari can clip on a
  // part holding an svg. it sits 4px outside the part and fades in over its neighbors. its own compositing
  // layer (translateZ) keeps Safari from drawing faded neighbors, which have their own layers for the fade,
  // over it once their transitions settle
  const frame = `relative after:pointer-events-none after:absolute after:-inset-1 after:border-2 after:border-dashed after:border-(--moindi-gray-950) after:transition-opacity after:duration-700 max-md:after:border ${
    isFramed
      ? "z-10 transform-[translateZ(0)] after:opacity-100"
      : "after:opacity-0"
  }`;
  const effect = isNested
    ? ""
    : `${frame} ${isHighlighted && !isOn ? "opacity-25 grayscale" : ""}`;
  return (
    <span
      className={`transition-[opacity,filter] duration-700 ${effect} ${className}`}
      style={style}
    >
      <InsidePartContext.Provider value>{children}</InsidePartContext.Provider>
    </span>
  );
}

// a line of text: a rounded bar, as wide as the words it stands in for
function Bar({
  w,
  role = "gray",
  color = "var(--moindi-gray-500)",
  thick = false,
}: {
  w: number;
  role?: RoleName;
  color?: string;
  thick?: boolean;
}) {
  return (
    <Part
      role={role}
      className={`inline-block shrink-0 rounded-[1px] ${thick ? "h-[0.8em]" : "h-[0.55em]"}`}
      style={{ width: `${w}em`, backgroundColor: color }}
    />
  );
}

// an image or avatar
function Block({ className = "" }: { className?: string }) {
  return (
    <Part
      role="gray"
      className={`block shrink-0 bg-(--moindi-gray-200) ${className}`}
    />
  );
}

const dark = "var(--moindi-gray-950)";
const mid = "var(--moindi-gray-500)";
const box = "border border-(--moindi-gray-200) bg-(--moindi-gray-30)";

// the top of every screen
// the mockup's nav height, in em
const NAV_EM = 3.4;
// a shipped size in px, scaled to the mockup: the shipped nav is 60px tall
const px = (value: number) => `${(value / 60) * NAV_EM}em`;

function MockNav() {
  // the shipped nav, as it is: the dark bar, the sidebar toggle, the logo and the menu, all in orange. it's
  // the real chrome rather than a proxy, so it sits outside the roles and never fades. sizes are the shipped
  // ones scaled from its 60px bar: logo 28px, toggle 32px, menu 48px, 16px padding, 8px gap
  const icon = (name: string, size: number) => (
    <svg
      className="block shrink-0"
      style={{ width: px(size), height: px(size) }}
      aria-hidden="true"
    >
      <use href={`/moindi/icons.svg#${name}`} />
    </svg>
  );
  return (
    <div
      className="flex shrink-0 items-center bg-(--moindi-gray-900) text-(--moindi-primary-500) shadow-[0_0_0.6em_rgba(0,0,0,0.5)]"
      style={{
        height: px(60),
        paddingInline: px(16),
        gap: px(8),
      }}
    >
      {icon("sidebar-show", 32)}
      <svg
        viewBox="0 0 376 56"
        className="block w-auto"
        style={{ height: px(28) }}
        aria-hidden="true"
      >
        <path
          d="M50.35,0l-22.35,22.35L5.65,0h44.69ZM33.65,56h22.35v-22.35l-22.35,22.35ZM0,33.65v22.35h22.35L0,33.65ZM86.35,0l-22.35,22.35V0h22.35ZM97.65,0l22.35,22.35V0h-22.35ZM97.65,56h22.35v-22.35l-22.35,22.35ZM64,33.65v22.35h22.35l-22.35-22.35ZM128,0l12.2,12.2v31.6l-12.2,12.2V0ZM171.8,12.2v31.6l12.2,12.2V0l-12.2,12.2ZM320,0l12.2,12.2v31.6l-12.2,12.2V0ZM363.8,12.2v31.6l12.2,12.2V0l-12.2,12.2ZM248,0v33.65L214.35,0h33.65ZM225.65,56l-33.65-33.65v33.65h33.65ZM312,0v22.35L289.65,0h22.35ZM289.65,56h22.35v-22.35l-22.35,22.35ZM256,5.65v44.69l22.35-22.35-22.35-22.35Z"
          fill="currentColor"
        />
      </svg>
      <span className="ml-auto">{icon("menu", 48)}</span>
    </div>
  );
}

// the shipped sidebar, closed to its icon rail, as it is: the profile picture, the links in their groups and
// settings and logout at the bottom. real chrome like the nav, so it never fades. sizes are the shipped ones:
// a 48px rail, 32px items 8px apart, 8px padding
const sidebarGroups = [
  ["grid-bevel", "dashboard", "suitcase", "exchange"],
  ["globe", "retweet", "user-star", "heart"],
  ["chart-3d"],
];

function MockSidebar() {
  const item = (name: string) => (
    <svg
      key={name}
      className="block shrink-0"
      style={{ width: px(32), height: px(32) }}
      aria-hidden="true"
    >
      <use href={`/moindi/icons.svg#${name}`} />
    </svg>
  );
  const rule = (key: string) => (
    <hr key={key} className="w-full border-(--moindi-gray-200)" />
  );
  return (
    <div
      className="flex shrink-0 flex-col items-center justify-between bg-(--moindi-gray-50) text-(--moindi-gray-950)"
      style={{ width: px(48), padding: px(8), gap: px(16) }}
    >
      <div className="flex flex-col items-center" style={{ gap: px(8) }}>
        {/* the profile picture */}
        <span
          className="block shrink-0 border border-(--moindi-gray-400) bg-(--moindi-gray-200)"
          style={{ width: px(32), height: px(32) }}
        />
        {sidebarGroups.flatMap((group, index) => [
          rule(`rule-${index}`),
          ...group.map(item),
        ])}
      </div>
      <div className="flex flex-col items-center" style={{ gap: px(8) }}>
        {item("cog")}
        {item("sign-out")}
      </div>
    </div>
  );
}

// a release page: the screen for primary, secondary and gray. one orange button, blue for everything that's
// interactive but not the point, grays for the rest
function ReleaseScreen() {
  return (
    <div className="flex flex-col gap-[1em] p-[1em]">
      {/* tabs: the current one taller and darker, a white tab with black text, standing up off the line, and the
          others shorter and lighter beside it */}
      <div className="flex items-end border-b border-(--moindi-gray-300)">
        <Part
          role="gray"
          className="flex border border-b-0 border-(--moindi-gray-400) bg-(--moindi-gray-30) px-[1.2em] pt-[0.8em] pb-[0.6em]"
        >
          <Bar w={3} color={dark} />
        </Part>
        {[3.5, 2.5].map((w) => (
          <span
            key={w}
            className="flex border border-b-0 border-(--moindi-gray-200) px-[1.2em] py-[0.35em]"
          >
            <Bar w={w} color="var(--moindi-gray-300)" />
          </span>
        ))}
      </div>

      <div className={`flex gap-[1em] p-[1em] ${box}`}>
        <Block className="aspect-square w-[32%]" />
        <div className="flex min-w-0 flex-1 flex-col gap-[0.7em]">
          <Bar w={7} color={dark} thick />
          <Bar w={10} color={mid} />
          <div className="flex gap-[0.4em]">
            {[2.5, 3].map((w) => (
              <Part
                key={w}
                role="secondary"
                className="flex bg-(--moindi-secondary-100) px-[0.4em] py-[0.3em]"
              >
                <Bar
                  w={w}
                  role="secondary"
                  color="var(--moindi-secondary-700)"
                />
              </Part>
            ))}
          </div>
          {/* funding progress */}
          <div className="flex h-[0.5em] bg-(--moindi-gray-200)">
            <Part
              role="secondary"
              className="block h-full w-[62%] bg-(--moindi-secondary-500)"
            />
          </div>
          <div className="flex justify-between">
            <Bar w={3} color={dark} />
            <Bar w={4} color={mid} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[0.6em]">
        {[4, 3].map((w) => (
          <div key={w} className={`flex flex-col gap-[0.5em] p-[0.8em] ${box}`}>
            <Bar w={2.5} color={mid} />
            <Bar w={w} color={dark} thick />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-[1em]">
        <Bar w={5} role="secondary" color="var(--moindi-secondary-500)" />
        {/* the one thing that matters */}
        <Part
          role="primary"
          className="flex border border-(--moindi-gray-950) bg-(--moindi-primary-500) px-[3em] py-[1em]"
        >
          <Bar w={4.5} role="primary" color={dark} thick />
        </Part>
      </div>
    </div>
  );
}

// a portfolio: the screen for success and error. gains in green, losses in red, and a field that needs fixing
function PortfolioScreen() {
  const holdings = [
    { name: 6, up: true },
    { name: 4.5, up: false },
    { name: 5, up: true },
  ];
  return (
    <div className="flex flex-col gap-[1em] p-[1em]">
      <div
        className={`flex items-end justify-between gap-[1.5em] p-[1em] ${box}`}
      >
        <div className="flex min-w-0 flex-col gap-[0.5em] overflow-hidden">
          <Bar w={4} color={mid} />
          <Bar w={7} color={dark} thick />
        </div>
        {/* a little chart of the week, rising */}
        <Part role="success" className="block w-[30%] shrink-0">
          <svg
            viewBox="-1 -1 62 26"
            className="block w-full"
            aria-hidden="true"
          >
            <polyline
              points="0,20 10,17 20,19 30,12 40,13 50,6 60,4"
              fill="none"
              stroke={paletteColor("success", 500)}
              strokeWidth="2"
            />
          </svg>
        </Part>
      </div>

      <div className={`flex flex-col ${box}`}>
        {holdings.map((holding, index) => {
          const role = holding.up ? "success" : "error";
          return (
            <div
              key={index}
              className="flex items-center gap-[0.8em] border-b border-(--moindi-gray-200) p-[0.8em] last:border-b-0"
            >
              <Block className="size-[2em]" />
              <div className="flex flex-1 flex-col gap-[0.4em]">
                <Bar w={holding.name} color={dark} />
                <Bar w={3} color={mid} />
              </div>
              <Bar w={3} color={dark} />
              <Part
                role={role}
                className="flex items-center gap-[0.3em] px-[0.4em] py-[0.25em]"
                style={{ backgroundColor: paletteColor(role, 100) }}
              >
                <span
                  className="text-[0.7em] leading-none"
                  style={{ color: paletteColor(role, 700) }}
                >
                  {holding.up ? "▲" : "▼"}
                </span>
                <Bar w={2} role={role} color={paletteColor(role, 700)} />
              </Part>
            </div>
          );
        })}
      </div>

      {/* a sell order asking for more than is held: the message under the field says so in red */}
      <div className="flex flex-col gap-[0.5em]">
        <Bar w={3.5} color={mid} />
        <span className="flex items-center justify-between border border-(--moindi-gray-300) bg-(--moindi-gray-30) p-[0.7em]">
          <Bar w={2.5} color={dark} />
          <Bar w={1.5} color={mid} />
        </span>
        <Bar w={9} role="error" color={paletteColor("error", 600)} />
      </div>
    </div>
  );
}

// the portfolio with a modal over it, the same page as success and error, checking before something can't be undone
function ConfirmScreen() {
  return (
    // not positioned itself, so the dark overlay covers the whole mockup, the nav and sidebar too
    <div className="h-full">
      <PortfolioScreen />
      <div className="absolute inset-0 flex items-center justify-center bg-(--moindi-gray-950)/40 p-[1.5em]">
        <div className="flex w-full max-w-[22em] flex-col gap-[0.8em] border border-(--moindi-gray-950) bg-(--moindi-gray-30) p-[1.2em] shadow-xl">
          <div className="flex items-center gap-[0.7em]">
            <Part role="warning" className="block size-[1.8em]">
              <svg
                viewBox="0 0 24 24"
                className="block size-full"
                aria-hidden="true"
              >
                <path d="M12 2 23 21H1Z" fill={paletteColor("warning", 400)} />
                <rect x="11" y="9" width="2" height="6" fill={dark} />
                <rect x="11" y="16.5" width="2" height="2" fill={dark} />
              </svg>
            </Part>
            <Bar w={7} color={dark} thick />
          </div>
          <Bar w={13} color={mid} />
          <Bar w={9} color={mid} />
          <div className="flex justify-end gap-[0.5em] pt-[0.4em]">
            <span className="flex border border-(--moindi-gray-400) px-[1.2em] py-[0.6em]">
              <Bar w={2.5} color={dark} />
            </span>
            <Part
              role="warning"
              className="flex border border-(--moindi-gray-950) px-[1.2em] py-[0.6em]"
              style={{ backgroundColor: paletteColor("warning", 400) }}
            >
              <Bar w={3} role="warning" color={dark} />
            </Part>
          </div>
        </div>
      </div>
    </div>
  );
}

// the portfolio with a notice across the top: worth knowing, nothing to act on
function NoticeScreen() {
  return (
    <div className="flex flex-col">
      <div className="px-[1em] pt-[1em]">
        <Part
          role="info"
          className="flex items-center gap-[0.7em] border-l-4 p-[0.8em]"
          style={{
            backgroundColor: paletteColor("info", 100),
            borderColor: paletteColor("info", 500),
          }}
        >
          <span
            className="flex size-[1.4em] shrink-0 items-center justify-center rounded-full font-bold text-(--moindi-gray-30)"
            style={{ backgroundColor: paletteColor("info", 500) }}
          >
            <span className="text-[0.8em] leading-none">i</span>
          </span>
          <span className="flex flex-col gap-[0.4em]">
            <Bar w={8} role="info" color={paletteColor("info", 700)} />
            <Bar w={12} role="info" color={paletteColor("info", 500)} />
          </span>
        </Part>
      </div>
      <PortfolioScreen />
    </div>
  );
}

// the screen that shows each color at work
const roleStories: Record<RoleName, { screen: ReactNode; label: string }> = {
  primary: {
    screen: <ReleaseScreen />,
    label: "A release page where only the main button is in the primary color",
  },
  secondary: {
    screen: <ReleaseScreen />,
    label:
      "A release page where the tags, link and progress bar are in the secondary color",
  },
  gray: {
    screen: <ReleaseScreen />,
    label: "A release page built from grays, with every color faded",
  },
  success: {
    screen: <PortfolioScreen />,
    label: "A portfolio where the gains and the rising chart are green",
  },
  warning: {
    screen: <ConfirmScreen />,
    label:
      "A confirmation modal over the portfolio, with a yellow warning sign and button",
  },
  error: {
    screen: <PortfolioScreen />,
    label: "A portfolio where the loss and an error message are red",
  },
  info: {
    screen: <NoticeScreen />,
    label: "A portfolio with a blue notice across the top",
  },
};

// how long the screens take to cross-fade when the color changes
const FADE_MS = 800;

const roleNames = paletteColumns.map((column) => column.name);

// how long each color shows its screen as it is before highlighting
const HIGHLIGHT_DELAY_MS = 1000;

function Mockup({ selected }: { selected: RoleName }) {
  // the color whose highlight is on. it catches up with the picked one after a beat, so every change first
  // shows the full page with nothing faded or framed, then fades the rest and frames the picked color
  const [highlighted, setHighlighted] = useState<RoleName | null>(null);
  useEffect(() => {
    const timeout = setTimeout(
      () => setHighlighted(selected),
      HIGHLIGHT_DELAY_MS,
    );
    return () => clearTimeout(timeout);
  }, [selected]);

  // every color's screen is stacked in the same place, and only the picked one is visible, so a
  // change cross-fades: the old one fades out as the new one fades in. stacking also keeps the box as big as
  // the biggest, so nothing shifts
  const layer = (role: RoleName) =>
    `[grid-area:stack] transition-opacity ease-in-out motion-reduce:transition-none ${role === selected ? "opacity-100" : "pointer-events-none opacity-0"}`;
  const fadeStyle = { transitionDuration: `${FADE_MS}ms` };

  return (
    <div className="gap-sm flex min-h-0 flex-1 flex-col md:min-w-0">
      <div
        role="img"
        aria-label={roleStories[selected].label}
        // a size container: the mockup is sized in em, so its text size comes off the room it has and the
        // tallest screen (about 38em with the nav) always fits without scrolling
        className="@container-[size] min-h-0 flex-1 overflow-hidden border border-(--moindi-gray-300) bg-(--moindi-gray-50)"
      >
        <div
          className="relative flex h-full flex-col"
          style={{ fontSize: "clamp(5px, calc(100cqh / 38), 11px)" }}
        >
          <MockNav />
          <div className="flex min-h-0 flex-1">
            <MockSidebar />
            <div className="grid min-w-0 flex-1 grid-rows-[minmax(0,1fr)] [grid-template-areas:'stack']">
              {roleNames.map((role) => (
                <RoleContext.Provider key={role} value={role}>
                  <HighlightContext.Provider
                    value={role === selected && highlighted === selected}
                  >
                    <div
                      className={`bg-(--moindi-gray-50) ${layer(role)}`}
                      style={fadeStyle}
                    >
                      {roleStories[role].screen}
                    </div>
                  </HighlightContext.Provider>
                </RoleContext.Provider>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// the palette beside a barebones screen of the product. pick a column and the screen shows where that color is
// used, with everything else faded
export function ColorRoles() {
  const [selected, setSelected] = useState<RoleName>("primary");
  const [inViewRef, isInView] = useInView<HTMLDivElement>(0.4);

  // moves on to the next color on its own. a timeout per color rather than one interval, so a pick gets its
  // full turn before the cycle carries on from it. only while it's on screen: off screen it holds where it is
  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const index = paletteColumns.findIndex(
        (column) => column.name === selected,
      );
      setSelected(paletteColumns[(index + 1) % paletteColumns.length].name);
    }, ROLE_CYCLE_MS);
    return () => clearTimeout(timeout);
  }, [selected, isInView]);
  return (
    <div
      ref={inViewRef}
      className={`gap-lg p-sm flex flex-col overflow-hidden border border-(--moindi-gray-800) bg-(--moindi-gray-100) text-(--moindi-gray-950) md:flex-row ${visualHeight}`}
    >
      <Palette selected={selected} onSelect={setSelected} />
      <PaletteRows selected={selected} onSelect={setSelected} />
      <Mockup selected={selected} />
    </div>
  );
}
