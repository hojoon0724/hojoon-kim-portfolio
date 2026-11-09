"use client";

import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import { useInView } from "@/hooks";
import { useEffect, useState, type CSSProperties } from "react";
import {
  componentParts,
  FIRST_LINE_MS,
  HOLD_MS,
  LINE_GAP_MS,
  MAX_LINES,
  lineViews,
  MockComponent,
  MockEditor,
  owners,
  relays,
  REMOVE_MS,
  THEME_MS,
  typeMs,
  writeQueue,
  type Relay,
} from "./MoindiCollaborationV1";

// guides for building the section, never rendered
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notes = {
  purpose:
    "Prove I move fluidly between design and code by showing what happened: the CTO and I passed features back and forth, and each pass made the other's work better. When I started, she made my logic lean; when she started, I finished her UI.",
  layout:
    "One screen, no inner scrolling. The component and its code are the proof: pick who started, and the code types out, hands off, and the other person's pass lands. Under it, each version says what it was, with a stat for what the pass improved. Phones stack the component over a short editor; wider screens put the editor beside everything else.",
};

const copy = {
  title: "Both Sides of the Relay",
  message:
    "Whoever picked up a feature second left it better than they found it.",
  body: "The CTO and I passed features back and forth with no spec in between. I'd hand her an interface that was done and logic that worked, and she'd make it lean. She'd hand me lean logic on a plain form, and I'd turn it into the product. We read each other's code, not each other's notes.",
};

// what each version was, and what the pass after it made better. keyed by relay, one per step
const stepStories: Record<string, { caption: string; gain?: string }[]> = {
  "me-first": [
    {
      caption:
        "My first version: the interface is finished, and the logic works the long way round.",
    },
    {
      caption:
        "Her pass: the same behavior in half the logic. The interface didn't move.",
      gain: "Leaner logic",
    },
  ],
  "cto-first": [
    {
      caption: "Her first version: lean logic that works, on a generic form.",
    },
    {
      caption:
        "My pass: her logic stays, and the form becomes the component people actually use.",
      gain: "Finished UI",
    },
  ],
};

// lines of code in a version, not counting blank ones
const lineCount = (relay: Relay, step: number) =>
  relay.lines.filter((line) => line.versions[step]).length;

// the version tabs: who wrote it, how much code it is, and what it improved on
function StepTabs({
  relay,
  activeStep,
  onSelect,
}: {
  relay: Relay;
  activeStep: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="gap-xs grid grid-cols-2" role="group" aria-label="Version">
      {relay.steps.map((step, index) => {
        const gain = stepStories[relay.id][index].gain;
        return (
          <button
            key={index}
            type="button"
            aria-pressed={index === activeStep}
            onClick={() => onSelect(index)}
            className={`roboto-mono px-sm py-xs flex cursor-pointer flex-col items-start border border-current text-left text-xs transition-colors duration-200 md:text-sm ${index === activeStep ? "bg-gray-950 text-white" : "hover:bg-current/10"}`}
          >
            <span className="font-bold">
              v{index + 1} · {owners[step.owner]}
            </span>
            <span className="opacity-70">
              {lineCount(relay, index)} lines{gain ? ` · ${gain}` : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// one component, passed back and forth: pick who started and watch the other person's pass land
export function MoindiCollaboration({ id }: { id: string }) {
  const [relayIndex, setRelayIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [written, setWritten] = useState(0);
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

  const goToStep = (index: number) => {
    const ownerChanges =
      relay.steps[index].owner !== relay.steps[activeStep].owner;
    setHandoffFrom(ownerChanges ? activeStep : null);
    setActiveStep(index);
    setWritten(0);
  };

  const selectRelay = (index: number) => {
    setRelayIndex(index);
    setActiveStep(0);
    setWritten(0);
    setHandoffFrom(null);
  };

  // types each version line by line once the stage is on screen, then holds and hands off to the next one
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

  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      // phones: exactly one screen tall, and the editor takes whatever height is left, so nothing scrolls inside.
      // md and up: as tall as the editor needs at full size, centered in the screen
      className="py-sm md:py-lg flex h-[calc(100dvh-var(--spacing-nav))] flex-col md:h-auto md:justify-center"
      snapToEnd
    >
      <div className="gap-sm md:gap-md px-md lg:px-xl mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col md:flex-none">
        <div className="gap-xs md:gap-md flex shrink-0 flex-col">
          <div className="gap-sm flex flex-wrap items-end justify-between">
            <h2>{copy.title}</h2>
            <div className="gap-xs flex" role="group" aria-label="Who started">
              {relays.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={index === relayIndex}
                  onClick={() => selectRelay(index)}
                  className={`roboto-mono px-sm py-xs cursor-pointer border border-current text-xs font-bold uppercase transition-colors duration-200 md:text-sm ${index === relayIndex ? "bg-gray-950 text-white" : "hover:bg-current/10"}`}
                >
                  {option.tab}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full border-b" />
        </div>

        {/* phones: component, editor (takes the leftover height), versions, text.
            wider: the editor runs down the left, everything else stacks on the right */}
        <div
          ref={stageRef}
          className="gap-sm md:gap-x-md md:gap-y-md grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto_auto] [grid-template-areas:'component'_'editor'_'steps'_'text'] md:flex-none md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:grid-rows-[auto_auto_minmax(0,1fr)] md:[grid-template-areas:'editor_component'_'editor_steps'_'editor_text']"
        >
          {/* md and up: at least tall enough for the longest version at full size (13px, 1.4em lines, plus the
              title bar and padding the editor's font sizing allows for). it spans every row, so when the text beside
              it runs taller, it stretches to match; the code stays at 13px */}
          <div
            className="[container-type:size] min-h-16 [grid-area:editor] md:min-h-(--editor-h)"
            style={
              {
                "--editor-h": `calc(${MAX_LINES * 1.4 * 13}px + 3.25rem)`,
              } as CSSProperties
            }
          >
            <MockEditor
              key={relay.id}
              views={views}
              step={activeStep}
              owner={relay.steps[activeStep].owner}
              minFontPx={2}
            />
          </div>

          <div className="[grid-area:component]">
            <MockComponent parts={parts} />
          </div>

          <div className="gap-xs flex flex-col [grid-area:steps]">
            <StepTabs
              relay={relay}
              activeStep={activeStep}
              onSelect={goToStep}
            />
            {/* every caption stacked in one cell, so switching never changes the height */}
            <div className="grid text-sm text-pretty [grid-template-areas:'caption'] md:text-base">
              {relays.flatMap((option, optionIndex) =>
                stepStories[option.id].map((story, stepIndex) => {
                  const shown =
                    optionIndex === relayIndex && stepIndex === activeStep;
                  return (
                    <p
                      key={`${option.id}-${stepIndex}`}
                      className={`[grid-area:caption] ${shown ? "" : "invisible"}`}
                      aria-hidden={!shown || undefined}
                      aria-live={shown ? "polite" : undefined}
                    >
                      {story.caption}
                    </p>
                  );
                }),
              )}
            </div>
          </div>

          <div className="gap-xs flex flex-col justify-end [grid-area:text]">
            <h3 className="text-base font-bold text-balance md:text-2xl">
              {copy.message}
            </h3>
            <p className="text-sm text-pretty max-md:hidden md:text-lg">
              {copy.body}
            </p>
          </div>
        </div>
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
