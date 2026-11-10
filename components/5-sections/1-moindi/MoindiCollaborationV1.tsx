"use client";

import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import { useInView } from "@/hooks";
import { useEffect, useState } from "react";

// guides for building the section, never rendered
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notes = {
  purpose:
    "Show I can work with developers from either side of the relay: my first version ships a finished UI on logic that works, and she makes the logic lean; her first version is lean logic on a generic UI, and I finish it. The CTO owned the architecture and stack; below that, the code had no owners.",
  layout:
    "One component getting built. A mock editor (colored token bars in VS Code's dark theme, no text) beside the component it renders, with the who-starts tabs and both versions' captions under the component. Each version types line by line; on a handoff, removed lines flash red and collapse, then new and rewritten lines are typed with green and blue gutters. The component builds like it does while coding: elements land unstyled, get rough styling, then final touches. Starting with me: long code, the UI built alongside it, then her pass cuts the code and the UI doesn't change. Starting with her: short code, a generic UI, then my pass rewrites her parts in place and adds new ones.",
};

const copy = {
  title: "Both Sides of the Relay",
  paragraphs: [
    "The CTO owned the architecture and chose the stack. After that, the code didn't really have owners.",
    "When a feature started with me, the first version came with the UI finished and logic that worked, and she'd make the logic lean. When it started with her, the logic was lean and the interface was generic, and I'd finish it. Neither of us had to explain our side of the work to the other.",
  ],
  closing:
    "I can write the first version of the logic, and I can take a developer's UI and finish it.",
};

export type Owner = "me" | "cto";

export const owners: Record<Owner, string> = {
  me: "Me",
  cto: "CTO",
};

type TokenType = "k" | "c" | "f" | "v" | "s" | "t" | "n" | "p";

// each person's editor: I work in VS Code's Dark+, she works in Light+, so whoever is holding the code shows at a glance
export const editorThemes = {
  me: {
    background: "bg-[#1E1E1E]",
    titleBar: "bg-[#252526]",
    caret: "bg-[#AEAFAD]",
    tokens: {
      k: "#569CD6", // keyword, html tag
      c: "#C586C0", // control flow
      f: "#DCDCAA", // function
      v: "#9CDCFE", // variable, attribute
      s: "#CE9178", // string
      t: "#4EC9B0", // type
      n: "#B5CEA8", // number
      p: "#D4D4D4", // punctuation
    },
  },
  cto: {
    background: "bg-[#FFFFFF]",
    titleBar: "bg-[#F3F3F3]",
    caret: "bg-[#000000]",
    tokens: {
      k: "#0000FF",
      c: "#AF00DB",
      f: "#795E26",
      v: "#001080",
      s: "#A31515",
      t: "#267F99",
      n: "#098658",
      p: "#3B3B3B",
    },
  },
} satisfies Record<
  Owner,
  {
    background: string;
    titleBar: string;
    caret: string;
    tokens: Record<TokenType, string>;
  }
>;

export type EditorTheme = (typeof editorThemes)[Owner];

// a line is written "indent:tokens", each token a color letter and a width in characters, e.g. "2:k5 v8 p1".
// "" is a blank line, null means the line isn't in that version
type LineSpec = string | null;

// the parts of the rendered component, and the two looks a part can have
export type UiPart = "card" | "title" | "bar" | "control" | "amount" | "button";
type UiLook = "generic" | "polished";
// "title:generic" is the title part in its generic look
type UiSection = `${UiPart}:${UiLook}`;

interface CodeLine {
  id: string;
  // one spec per step of the relay
  versions: LineSpec[];
  // the part of the component each version of this line renders, if any. a rewritten line that keeps its part
  // switches it from one look to the other instead of rebuilding it
  ui?: (UiSection | null)[];
  // a part this line gives its final touches (spacing, sizes, details) once it's typed. until then the part has
  // its rough styling. a part with no such line in a version goes straight to final
  finish?: UiPart;
}

function parseLine(spec: string) {
  const [indent, tokens = ""] = spec.split(":");
  return {
    indent: Number(indent) || 0,
    tokens: tokens
      .split(" ")
      .filter(Boolean)
      .map((token) => ({
        type: token[0] as TokenType,
        width: Number(token.slice(1)),
      })),
  };
}

interface RelayStep {
  owner: Owner;
  caption: string;
}

export interface Relay {
  id: string;
  tab: string;
  steps: RelayStep[];
  // every line that appears in any step, in file order
  lines: CodeLine[];
}

// the same line in every step, optionally rendering the same part of the component
const same = (id: string, spec: string, ui?: UiSection): CodeLine => ({
  id,
  versions: [spec, spec],
  ui: ui && [ui, ui],
});

export const relays: Relay[] = [
  {
    id: "me-first",
    tab: "I start",
    steps: [
      {
        owner: "me",
        caption: "The UI is finished and the logic works, the long way round.",
      },
      {
        owner: "cto",
        caption: "She makes the logic lean. The UI doesn't change.",
      },
    ],
    // the card's parts land with rough styling while the logic is written, then the template lines at the end
    // give each one its final touches. it's a picture of the work, not a line-for-line render. parts only sit
    // on lines that survive her pass, so her rewrite leaves the card alone
    lines: [
      same("import-1", "0:k6 p2 t9 p2 k4 s15 p1"),
      same("import-2", "0:k6 p2 t14 p2 k4 s12 p1"),
      // her pass pulls in a helper for the leaner logic
      { id: "import-3", versions: [null, "0:k6 p2 f8 p2 k4 s18 p1"] },
      same("gap-1", ""),
      same("class", "0:k6 k5 t18 p2", "card:polished"),
      same("input", "2:v7 p3 f5 p1 t7 p3"),
      same("state", "2:v6 p3 f6 p1 n1 p2"),
      same("gap-2", ""),
      same("percent-fn", "2:f11 p1 v6 p2 t6 p3"),
      { id: "percent-temp", versions: ["4:k5 v5 p3 v6 p1 f9 p3", null] },
      {
        id: "percent-if",
        versions: ["4:c2 p2 v5 p3 n1 p3", "4:c6 f4 p1 v6 p2 v5 p1 v11 p2"],
        ui: ["title:polished", "title:polished"],
      },
      { id: "percent-zero", versions: ["6:c6 n1 p1", null] },
      { id: "percent-elseif", versions: ["4:p1 c4 c2 p2 v5 p3 v8 p3", null] },
      { id: "percent-max", versions: ["6:c6 v8 p1", null] },
      { id: "percent-close", versions: ["4:p1", null] },
      { id: "percent-return", versions: ["4:c6 v5 p1", null] },
      same("percent-end", "2:p1", "bar:polished"),
      same("gap-3", ""),
      same("total-fn", "2:f10 p4", "control:polished"),
      { id: "total-let", versions: ["4:k3 v5 p3 n1 p1", null] },
      {
        id: "total-for",
        versions: [
          "4:c3 p2 k5 v4 c2 k4 p1 v8 p3",
          "4:c6 k4 p1 v8 p1 f6 p2 v1 p2 v1 p4 v1 p1 v1 p2 n1 p2",
        ],
        ui: ["amount:polished", "amount:polished"],
      },
      { id: "total-add", versions: ["6:v5 p4 f5 p1 v4 p2", null] },
      { id: "total-for-close", versions: ["4:p1", null] },
      { id: "total-return", versions: ["4:c6 v5 p1", null] },
      same("total-end", "2:p1", "button:polished"),
      same("class-end", "0:p1"),
      same("gap-4", ""),
      { ...same("tpl-card", "0:p1 k3 v5 p2 s24 p2"), finish: "card" },
      {
        ...same("tpl-title", "2:p1 k2 v5 p2 s14 p2 v10 p2 k2 p1"),
        finish: "title",
      },
      { ...same("tpl-bar", "2:p1 k3 v5 p2 s18 p1 v6 p2 f9 p4"), finish: "bar" },
      {
        ...same("tpl-slider", "2:p1 k5 v5 p2 s22 p1 v8 p2 v6 p3"),
        finish: "control",
      },
      {
        ...same("tpl-amount", "2:p1 k4 v5 p2 s16 p2 p2 v6 p3 k4 p1"),
        finish: "amount",
      },
      {
        ...same("tpl-button", "2:p1 k6 v5 p2 s20 p2 v8 p2 k6 p1"),
        finish: "button",
      },
      same("tpl-end", "0:p2 k3 p1"),
    ],
  },
  {
    id: "cto-first",
    tab: "She starts",
    steps: [
      {
        owner: "cto",
        caption: "The logic is lean. The UI works, but it's generic.",
      },
      {
        owner: "me",
        caption: "I finish the UI: some sections go, new ones come in.",
      },
    ],
    lines: [
      same("import", "0:k6 p2 t9 p2 k4 s15 p1"),
      same("gap-1", ""),
      same("class", "0:k6 k5 t18 p2"),
      same("input", "2:v7 p3 f5 p1 t7 p3"),
      same("state", "2:v6 p3 f6 p1 n1 p2"),
      same("percent", "2:f11 p1 v6 p2 f4 p1 v6 p2 v5 p1 v11 p2"),
      { id: "format", versions: [null, "2:f9 p4 v4 p1 f12 p1 v6 p1 s3 p2"] },
      {
        id: "segments",
        versions: [null, "2:v8 p3 f8 p2 v7 p2 v5 p1 v9 p3"],
      },
      same("class-end", "0:p1"),
      same("gap-2", ""),
      {
        id: "tpl-card",
        versions: ["0:p1 k3 p1", "0:p1 k3 v5 p2 s24 p2"],
        ui: ["card:generic", "card:polished"],
      },
      {
        id: "tpl-title",
        versions: [
          "2:p1 k2 p1 v8 p2 k2 p1",
          "2:p1 k2 v5 p2 s14 p2 v10 p2 k2 p1",
        ],
        ui: ["title:generic", "title:polished"],
      },
      {
        id: "tpl-bar",
        versions: [null, "2:p1 k3 v5 p2 s18 p1 v6 p2 f9 p4"],
        ui: [null, "bar:polished"],
      },
      {
        id: "tpl-bar-segment",
        versions: [null, "4:p1 k4 v5 p2 s12 p1 v6 p2 v5 p3"],
      },
      { id: "tpl-bar-end", versions: [null, "2:p2 k3 p1"] },
      { id: "tpl-label", versions: ["2:p1 k5 p1 v7", null] },
      {
        id: "tpl-control",
        versions: [
          "4:p1 k5 v4 p2 s6 p1 p2",
          "2:p1 k5 v5 p2 s22 p1 v8 p2 v6 p3",
        ],
        ui: ["control:generic", "control:polished"],
      },
      { id: "tpl-label-end", versions: ["2:p2 k5 p1", null] },
      {
        id: "tpl-amount",
        versions: [null, "2:p1 k4 v5 p2 s16 p2 p2 f6 p1 v6 p4 k4 p1"],
        ui: [null, "amount:polished"],
      },
      {
        id: "tpl-button",
        versions: [
          "2:p1 k6 p1 v6 p2 k6 p1",
          "2:p1 k6 v5 p2 s20 p2 v8 p2 k6 p1",
        ],
        ui: ["button:generic", "button:polished"],
      },
      same("tpl-end", "0:p2 k3 p1"),
    ],
  },
];

// how long a line takes to type, and the pauses around a version
export const typeMs = (spec: string) =>
  spec
    ? 30 + parseLine(spec).tokens.reduce((sum, t) => sum + t.width, 0) * 4
    : 0;
export const LINE_GAP_MS = 30;
export const FIRST_LINE_MS = 300;
// long enough for removed lines to flash and collapse before the rewrite starts
export const REMOVE_MS = 900;
export const HOLD_MS = 2200;
// how long the editor takes to change theme when the code changes hands; the code waits for it
export const THEME_MS = 500;

type LineChange = "same" | "added" | "changed" | "removed" | "absent";

function lineChange(line: CodeLine, step: number): LineChange {
  const current = line.versions[step];
  const previous = step > 0 ? line.versions[step - 1] : current;
  if (current === null) return previous === null ? "absent" : "removed";
  if (previous === null) return "added";
  return current === previous ? "same" : "changed";
}

// the lines a version types out, in file order: all of them for the first version, then only what's new or rewritten
export function writeQueue(relay: Relay, step: number) {
  return relay.lines.filter((line) => {
    if (line.versions[step] === null) return false;
    if (step === 0) return true;
    const change = lineChange(line, step);
    return change === "added" || change === "changed";
  });
}

export interface LineView {
  id: string;
  spec: string;
  // which version is on screen, or null while the line is hidden
  version: number | null;
  change: LineChange;
  // still being typed: the element it renders is on the page but not styled yet
  isTyping: boolean;
  isCaretLine: boolean;
}

// where every line is, partway through typing a version. written counts lines started; it runs one past the
// queue so the last line can finish typing too
export function lineViews(
  relay: Relay,
  step: number,
  written: number,
): LineView[] {
  const queue = writeQueue(relay, step);
  const caretPosition = Math.min(written, queue.length) - 1;

  return relay.lines.map((line) => {
    const current = line.versions[step];
    const previous = step > 0 ? line.versions[step - 1] : null;
    const position = queue.indexOf(line);
    const base = { id: line.id, isTyping: false, isCaretLine: false };

    if (position !== -1) {
      if (position < written) {
        return {
          ...base,
          spec: current!,
          version: step,
          change: step === 0 ? "same" : lineChange(line, step),
          isTyping: position === written - 1 && written <= queue.length,
          isCaretLine: position === caretPosition,
        };
      }
      // a rewritten line keeps its old version until its turn comes
      if (previous !== null) {
        return { ...base, spec: previous, version: step - 1, change: "same" };
      }
      return { ...base, spec: current!, version: null, change: "same" };
    }
    if (current !== null) {
      return { ...base, spec: current, version: step, change: "same" };
    }
    // a removed line keeps its last version on screen while it collapses
    return {
      ...base,
      spec: previous ?? "",
      version: null,
      change: previous !== null ? "removed" : "absent",
    };
  });
}

// gutter marks in VS Code's diff colors
const gutterClass: Record<LineChange, string> = {
  same: "bg-transparent",
  added: "bg-[#2EA043]",
  changed: "bg-[#0078D4]",
  removed: "bg-[#F85149]",
  absent: "bg-transparent",
};

// one line of mock code. it types in left to right when it appears; removed lines flash red, then collapse;
// widths animate when a line is rewritten
function MockLine({ view, theme }: { view: LineView; theme: EditorTheme }) {
  const { indent, tokens } = parseLine(view.spec);
  const isShown = view.version !== null;

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] ease-out ${
        isShown
          ? "grid-rows-[1fr] opacity-100 duration-150"
          : view.change === "removed"
            ? "grid-rows-[0fr] opacity-0 delay-500 duration-500"
            : "grid-rows-[0fr] opacity-0 duration-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={`flex h-[1.4em] items-center transition-colors duration-300 ${
            view.change === "removed"
              ? "bg-[#F85149]/20"
              : view.change === "added"
                ? "bg-[#2EA043]/15"
                : ""
          }`}
        >
          <span
            className={`mr-[1.5ch] h-full w-0.75 shrink-0 transition-colors duration-300 ${gutterClass[view.change]}`}
          />
          <span
            className={`flex items-center gap-[0.6ch] transition-[clip-path] ease-linear ${
              isShown || view.change === "removed"
                ? "[clip-path:inset(0_0_0_0)]"
                : "[clip-path:inset(0_100%_0_0)]"
            }`}
            style={{
              paddingLeft: `${indent}ch`,
              transitionDuration: `${typeMs(view.spec)}ms`,
            }}
          >
            {tokens.map((token, index) => (
              <span
                key={index}
                className="h-[0.55em] rounded-[1px] transition-[width] duration-500"
                style={{
                  width: `${token.width}ch`,
                  backgroundColor: theme.tokens[token.type],
                }}
              />
            ))}
            {view.isCaretLine && (
              <span
                className={`h-[1.1em] w-0.5 animate-pulse ${theme.caret}`}
              />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

// the longest version of either relay. the editor is always this tall, so typing doesn't push the page around and
// switching who starts doesn't change the stage's height
export const MAX_LINES = Math.max(
  ...relays.flatMap((relay) =>
    relay.steps.map(
      (_, index) =>
        relay.lines.filter((line) => line.versions[index] !== null).length,
    ),
  ),
);

export function MockEditor({
  views,
  step,
  owner,
  minFontPx = 5,
}: {
  views: LineView[];
  step: number;
  owner: Owner;
  // the smallest the code text gets when the editor is short
  minFontPx?: number;
}) {
  const theme = editorThemes[owner];
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10 transition-colors duration-500 ${theme.background}`}
      role="img"
      aria-label={`Code for the component, version ${step + 1}`}
    >
      <div
        className={`flex h-7 shrink-0 items-center gap-1.5 px-3 transition-colors duration-500 ${theme.titleBar}`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#F85149]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#D29922]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2EA043]/80" />
        <span
          className={`ml-3 h-full w-24 border-t-2 border-[#0078D4] transition-colors duration-500 ${theme.background}`}
        />
      </div>
      {/* the editor's cell is a size container: the text shrinks until the longest version fits its height */}
      <div
        className="min-h-0 flex-1 py-3 pr-3 font-mono"
        style={{
          fontSize: `clamp(${minFontPx}px, calc((100cqh - 3.25rem) / ${MAX_LINES * 1.4}), 13px)`,
        }}
      >
        {views.map((view) => (
          <MockLine key={view.id} view={view} theme={theme} />
        ))}
      </div>
    </div>
  );
}

// how far along a part is: unstyled while its line is typed, then its main styling, then its final touches
type PartLevel = "raw" | "rough" | "final";

export interface PartState {
  look: UiLook;
  level: PartLevel;
}

// what the component shows partway through a version: the part each on-screen line renders. a new part lands
// unstyled while its line is typed; a rewritten one keeps its old look until its line is done, then snaps to the
// new one. a part is final once the line that finishes it is typed, or straight away if no line does
export function componentParts(relay: Relay, step: number, views: LineView[]) {
  return new Map<UiPart, PartState>(
    relay.lines.flatMap((line, index) => {
      const view = views[index];
      if (view.version === null) return [];
      const isRewrite = view.change === "changed";
      const version =
        isRewrite && view.isTyping ? view.version - 1 : view.version;
      const section = line.ui?.[version];
      if (!section) return [];
      const [part, look] = section.split(":") as [UiPart, UiLook];

      const finisher = relay.lines.findIndex(
        (other) => other.finish === part && other.versions[step] !== null,
      );
      const finished =
        finisher === -1 ||
        (views[finisher].version === step && !views[finisher].isTyping);
      const level: PartLevel =
        view.isTyping && !isRewrite ? "raw" : finished ? "final" : "rough";

      return [[part, { look, level }] as const];
    }),
  );
}

// unstyled elements get a dashed outline, like a layout debugger, so empty ones still show at their minimum size
const RAW = "w-fit outline-1 outline-gray-400 outline-dashed";

// a part's classes at its level. looks with no rough classes use their final ones
function partClass(
  state: PartState,
  classes: Partial<Record<UiLook, { rough?: string; final: string }>>,
  raw = RAW,
) {
  if (state.level === "raw") return raw;
  const look = classes[state.look];
  if (!look) return "";
  return state.level === "rough" ? (look.rough ?? look.final) : look.final;
}

// the component the code renders, built the way it is while coding: a new element lands on the page unstyled at
// its minimum size when its line is started, gets its main styling when the line is finished, and its spacing and
// details in a final pass. a rewritten element stays put and snaps to its new look. fonts come from the global
// styles, so they're there from the start
export function MockComponent({ parts }: { parts: Map<UiPart, PartState> }) {
  const card = parts.get("card");
  const title = parts.get("title");
  const bar = parts.get("bar");
  const control = parts.get("control");
  const amount = parts.get("amount");
  const button = parts.get("button");

  const barLevel = bar?.level;
  const controlLevel = control?.level;
  const amountLevel = amount?.level;

  return (
    <div
      className="p-md roboto-base h-72 border border-gray-950/20 bg-white text-base text-gray-950 max-md:[zoom:0.7]"
      role="img"
      aria-label={
        !card
          ? "The share purchase card, not built yet"
          : card.look === "polished"
            ? "The share purchase card, in its finished design"
            : "A plain, unstyled version of the share purchase card"
      }
    >
      {card && (
        <div
          aria-hidden="true"
          className={partClass(
            card,
            {
              generic: {
                final: "p-md flex h-full flex-col gap-3 border border-gray-400",
              },
              polished: {
                rough: "flex flex-col gap-1 border border-gray-200",
                final:
                  "p-md flex h-full flex-col justify-center gap-4 border border-gray-200",
              },
            },
            `${RAW} min-h-4 min-w-8`,
          )}
        >
          {title && (
            <div
              className={partClass(title, {
                generic: { final: "text-xl font-bold" },
                polished: {
                  rough: "roboto-wide font-bold",
                  final: "roboto-wide text-lg font-bold",
                },
              })}
            >
              Buy shares
            </div>
          )}

          {bar &&
            (barLevel === "raw" ? (
              <div className={RAW}>
                <span>20%</span>
                <span>35%</span>
                <span>35%</span>
                <span>10%</span>
              </div>
            ) : (
              <div
                className={
                  barLevel === "final"
                    ? "roboto-mono flex h-7 w-full text-[10px]"
                    : "flex w-full text-xs"
                }
              >
                {[
                  ["20%", "bg-gray-950 text-white"],
                  ["35%", "bg-gray-400"],
                  ["35%", "bg-gray-100"],
                  ["10%", "bg-moindi-orange"],
                ].map(([percent, colors], index) => (
                  <span
                    key={index}
                    className={`${colors} ${barLevel === "final" ? "flex items-center justify-center" : ""}`}
                    style={{ width: percent }}
                  >
                    {percent}
                  </span>
                ))}
              </div>
            ))}

          {/* the generic text box and the slider are the same control, in the same place in the card */}
          {control &&
            (controlLevel === "raw" ? (
              // a bare input shows its label and value; the slider is empty spans with nothing to size them yet
              <div className={`${RAW} min-h-1 min-w-1`}>
                {control.look === "generic" && "Percent 1.25"}
              </div>
            ) : control.look === "generic" ? (
              <div className="flex flex-col gap-1 text-sm">
                Percent
                <span className="h-6 w-40 border border-gray-500 bg-white px-1 text-xs leading-6">
                  1.25
                </span>
              </div>
            ) : (
              <div className="relative h-5">
                <span className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-gray-200" />
                <span className="bg-moindi-orange absolute top-1/2 h-1 w-[40%] -translate-y-1/2" />
                <span
                  className={`bg-moindi-orange absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 ${
                    controlLevel === "final"
                      ? "h-5 w-5 border border-gray-700"
                      : "h-3 w-3"
                  }`}
                />
              </div>
            ))}

          {amount && (
            <div
              className={partClass(amount, {
                polished: {
                  rough: "flex justify-between",
                  final: "roboto-mono flex items-baseline justify-between",
                },
              })}
            >
              <span
                className={
                  amountLevel === "final" ? "text-2xl font-semibold" : ""
                }
              >
                $250
              </span>
              <span
                className={amountLevel === "final" ? "text-sm opacity-70" : ""}
              >
                1.25% of the project
              </span>
            </div>
          )}

          {button && (
            <div
              className={partClass(button, {
                generic: {
                  final:
                    "w-20 border border-gray-500 bg-gray-200 px-2 py-0.5 text-center text-sm",
                },
                polished: {
                  rough: "bg-moindi-orange w-full text-center",
                  final:
                    "roboto-mono bg-moindi-orange w-full border border-gray-700 py-2 text-center text-xs font-bold uppercase",
                },
              })}
            >
              {button.look === "polished" ? "Purchase" : "Submit"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// who starts the relay, and each version with its full caption. the version buttons share a minimum height so a
// longer caption doesn't change their size
function StageControls({
  relayIndex,
  activeStep,
  onSelectRelay,
  onSelectStep,
}: {
  relayIndex: number;
  activeStep: number;
  onSelectRelay: (index: number) => void;
  onSelectStep: (index: number) => void;
}) {
  return (
    <div className="gap-md flex flex-col">
      <div
        className="gap-xs flex flex-wrap"
        role="group"
        aria-label="Who starts"
      >
        {relays.map((option, index) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={index === relayIndex}
            onClick={() => onSelectRelay(index)}
            className={`roboto-mono px-sm py-xs cursor-pointer border border-gray-700 text-xs font-bold uppercase transition-colors duration-200 md:text-sm ${index === relayIndex ? "bg-gray-950 text-white" : "hover:bg-gray-950/10"}`}
          >
            {option.tab}
          </button>
        ))}
      </div>

      <div className="gap-xs flex flex-col" role="group" aria-label="Version">
        {relays[relayIndex].steps.map((option, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={index === activeStep}
            onClick={() => onSelectStep(index)}
            className={`roboto-mono px-sm py-xs gap-x-sm grid min-h-16 cursor-pointer grid-cols-[2ch_4ch_1fr] items-start border border-gray-700 text-left text-xs transition-colors duration-200 md:text-sm ${index === activeStep ? "bg-gray-950 text-white" : "hover:bg-gray-950/10"}`}
          >
            <span className="font-bold">v{index + 1}</span>
            <span className="font-bold">{owners[option.owner]}</span>
            <span>{option.caption}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// v1, kept for reference: the whole relay on one screen, with the full editor beside the component.
// MoindiCollaboration builds on its parts
export function MoindiCollaborationV1({ id }: { id: string }) {
  const [relayIndex, setRelayIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  // how many lines of the current version's write queue have been typed
  const [written, setWritten] = useState(0);
  // while the editor changes theme for a new owner, the code it held stays on screen as it was
  const [handoffFrom, setHandoffFrom] = useState<number | null>(null);
  const [stageRef, stageInView] = useInView<HTMLDivElement>(0.4, true);

  const relay = relays[relayIndex];
  const lastStep = relay.steps.length - 1;
  const shownStep = handoffFrom ?? activeStep;
  const views = lineViews(
    relay,
    shownStep,
    handoffFrom === null ? written : Infinity,
  );

  const parts = componentParts(relay, shownStep, views);

  // a step that changes who holds the code waits for the theme change before it starts typing
  const goToStep = (index: number) => {
    const ownerChanges =
      relay.steps[index].owner !== relay.steps[activeStep].owner;
    setHandoffFrom(ownerChanges ? activeStep : null);
    setActiveStep(index);
    setWritten(0);
  };

  // types the version line by line once the stage is on screen, then holds and hands off to the next version.
  // each line starts once the one before it has finished typing; the extra tick at the end finishes the last line
  useEffect(() => {
    if (!stageInView) return;
    if (handoffFrom !== null) {
      const timeout = setTimeout(() => setHandoffFrom(null), THEME_MS);
      return () => clearTimeout(timeout);
    }
    const lineQueue = writeQueue(relay, activeStep);

    let delay: number;
    if (written <= lineQueue.length) {
      const previousSpec = lineQueue[written - 1]?.versions[activeStep] ?? "";
      delay =
        written === 0
          ? activeStep === 0
            ? FIRST_LINE_MS
            : REMOVE_MS
          : typeMs(previousSpec) + LINE_GAP_MS;
    } else if (activeStep < lastStep) {
      delay = HOLD_MS;
    } else {
      return;
    }

    const timeout = setTimeout(() => {
      if (written <= lineQueue.length) {
        setWritten(written + 1);
      } else {
        const next = activeStep + 1;
        const ownerChanges =
          relay.steps[next].owner !== relay.steps[activeStep].owner;
        setHandoffFrom(ownerChanges ? activeStep : null);
        setActiveStep(next);
        setWritten(0);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [stageInView, written, relay, activeStep, lastStep, handoffFrom]);

  const selectRelay = (index: number) => {
    setRelayIndex(index);
    setActiveStep(0);
    setWritten(0);
    setHandoffFrom(null);
  };

  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      // exactly one screen tall: the header and text stay put and the stage takes whatever height is left
      className="py-sm md:py-lg flex h-[calc(100dvh-var(--spacing-nav))] flex-col"
    >
      <div className="gap-sm md:gap-md px-md lg:px-xl mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
        <div className="gap-xs md:gap-md flex shrink-0 flex-col">
          <h2>{copy.title}</h2>
          <div className="w-full border-b" />
        </div>

        {/* phones: anything that doesn't fit scrolls here rather than growing the section */}
        <div
          ref={stageRef}
          className="gap-sm md:gap-md grid min-h-0 flex-1 grid-cols-1 max-md:overflow-y-auto md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
        >
          <div className="@container-[size] h-full min-h-60">
            <MockEditor
              key={relay.id}
              views={views}
              step={activeStep}
              owner={relay.steps[activeStep].owner}
            />
          </div>

          {/* the component on top; the controls sit at the bottom, level with the bottom of the editor */}
          <div className="gap-sm md:gap-md flex min-h-0 flex-col justify-between">
            <MockComponent parts={parts} />
            <StageControls
              relayIndex={relayIndex}
              activeStep={activeStep}
              onSelectRelay={selectRelay}
              onSelectStep={goToStep}
            />
          </div>
        </div>

        <div className="gap-xs lg:gap-xl grid shrink-0 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <h3 className="text-lg font-bold text-balance md:text-2xl">
            {copy.closing}
          </h3>
          <div className="gap-xs flex flex-col text-sm text-pretty md:text-lg">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
