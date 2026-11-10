"use client";

import { useInView } from "@/hooks";
import { useEffect, useState } from "react";
import { FitStage } from "@/components/2-molecules";
import { visualHeight } from "./frame";
import {
  APPEAR_LAST_START_MS,
  finalStep,
  letterBuilds,
  TWEEN_MS,
} from "./letters";
import {
  LETTERS,
  TypemarkLayer,
  type GlyphPhase,
  type VariantId,
} from "./typemark";

const STAGE = { w: 640, h: 360 };

// how long it stays empty before the source shape draws in, how long the source shape holds once it's in, and how
// long the finished typemark holds
const EMPTY_MS = 500;
const SOURCE_HOLD_MS = 100;
const FINISHED_HOLD_MS = 2600;
// both i's run their build twice as fast as the other letters
const I_TEMPO = 0.5;
// the next step starts while the last one is still settling: the curve spends its last stretch barely moving,
// and waiting it out reads as a pause. every piece picks up from wherever it is, so cutting in is seamless
const OVERLAP = 0.55;

// how long one step of a build holds the screen, before any tempo
const stepMs = (step: { drawMs: number; moveMs: number }) =>
  Math.max(step.drawMs, step.moveMs) * OVERLAP;
// a letter's whole build at its own pace
const buildMs = (index: number) =>
  letterBuilds[index].slice(1).reduce((sum, step) => sum + stepMs(step), 0);
// the n runs at whatever pace makes its build last exactly as long as the d's
const N_TEMPO = buildMs(LETTERS.indexOf("d")) / buildMs(LETTERS.indexOf("n"));

interface Frame {
  variant: VariantId;
  // how far along its build each letter is
  steps: number[];
  // the letter being built, if one is
  focus: number | null;
  tempo: number;
  // one phase for every letter, or one each
  phase: GlyphPhase | GlyphPhase[];
  // read out to screen readers; not shown
  caption: string;
  ms: number;
}

const atSource = LETTERS.map(() => 0);
const finished = LETTERS.map((_, index) => finalStep(index));

// the whole story: the icon, a copy of it for every letter, each letter built from its copy one step after another,
// then the finished typemark
const frames: Frame[] = [
  // nothing yet
  {
    variant: "source",
    steps: atSource,
    focus: null,
    tempo: 1,
    phase: "hidden",
    caption: "",
    ms: EMPTY_MS,
  },
  // the source shape drawn in, piece by piece. all six copies sit on the same spot, so only one draws in; the
  // rest stay hidden until it's whole
  {
    variant: "source",
    steps: atSource,
    focus: null,
    tempo: 1,
    phase: LETTERS.map((_, index) => (index === 0 ? "appear" : "hidden")),
    caption:
      "The source shape: four corners around a diamond. It's also the icon.",
    // done once the last piece looks in: its fade spends its second half barely changing, and waiting that out
    // reads as a pause on top of the hold below
    ms: APPEAR_LAST_START_MS + TWEEN_MS * OVERLAP,
  },
  // the other copies come in underneath it, unseen, ready to split off
  {
    variant: "source",
    steps: atSource,
    focus: null,
    tempo: 1,
    phase: "shown",
    caption: "",
    ms: SOURCE_HOLD_MS,
  },
  {
    variant: "horizontal",
    steps: atSource,
    // the first copy stays at full strength, since it's the one the build starts on; the rest wait dimmed
    focus: 0,
    tempo: 1,
    phase: "shown",
    caption: "One copy for every letter",
    // the m starts as the copies settle into place (they take 800ms), with no wait after
    ms: 800 * OVERLAP,
  },
  ...LETTERS.flatMap((letter, index): Frame[] => {
    const tempo = letter === "i" ? I_TEMPO : letter === "n" ? N_TEMPO : 1;
    const stepsWith = (step: number) =>
      LETTERS.map((_, other) =>
        other < index ? finalStep(other) : other === index ? step : 0,
      );
    return [
      ...letterBuilds[index].slice(1).map(
        (step, stepIndex): Frame => ({
          variant: "horizontal",
          steps: stepsWith(stepIndex + 1),
          focus: index,
          tempo,
          phase: "shown",
          caption: `${letter}: ${step.caption}`,
          // moves and lines can both be cut into as they settle: on the inertia curve a line is nearly drawn
          // well before its time is up, and waiting out the tail reads as a stall
          ms: stepMs(step) * tempo,
        }),
      ),
    ];
  }),
  {
    variant: "horizontal",
    steps: finished,
    focus: null,
    tempo: 1,
    phase: "shown",
    caption: "The finished typemark",
    ms: FINISHED_HOLD_MS,
  },
  // and everything fades back out before it starts over
  {
    variant: "horizontal",
    steps: finished,
    focus: null,
    tempo: 1,
    phase: "hidden",
    caption: "",
    ms: TWEEN_MS,
  },
];

// where reduced motion holds: the finished typemark
const FINISHED_FRAME = frames.length - 2;

// plays the frames in a loop while the slide is on screen, and starts over from the first frame each time it
// comes back into view. reduced motion skips the build and shows the finished typemark
export function IdentitySystem() {
  const [frameIndex, setFrameIndex] = useState(0);
  // bumped each time it leaves the screen, so the typemark remounts at the first frame instead of animating
  // back to it, and the next visit plays from the start
  const [run, setRun] = useState(0);
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const frame = frames[frameIndex];

  // off screen: back to the start, ready for the next time it comes into view
  useEffect(() => {
    if (inView || frameIndex === 0) return;
    const timeout = setTimeout(() => {
      setFrameIndex(0);
      setRun((count) => count + 1);
    }, 0);
    return () => clearTimeout(timeout);
  }, [inView, frameIndex]);

  useEffect(() => {
    if (!inView) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion && frameIndex === FINISHED_FRAME) return;
    const timeout = setTimeout(
      () =>
        setFrameIndex((index) =>
          reducedMotion ? FINISHED_FRAME : (index + 1) % frames.length,
        ),
      reducedMotion ? 0 : frame.ms,
    );
    return () => clearTimeout(timeout);
  }, [inView, frameIndex, frame.ms]);

  return (
    <div
      ref={ref}
      className={`p-sm md:p-md flex flex-col bg-(--moindi-gray-950) text-(--moindi-primary-500) ${visualHeight}`}
    >
      <div className="min-h-0 flex-1">
        <FitStage w={STAGE.w} h={STAGE.h}>
          <div
            role="img"
            aria-label="The MOindi typemark, each letter built from the icon"
            className="absolute inset-0"
          >
            <TypemarkLayer
              key={run}
              variant={frame.variant}
              stage={STAGE}
              box={{ x: 0, y: 0, ...STAGE }}
              clearspace={frame.variant === "source" ? 1 : 0.6}
              steps={frame.steps}
              focus={frame.focus}
              tempo={frame.tempo}
              phase={frame.phase}
            />
          </div>
        </FitStage>
      </div>
      <p className="sr-only" aria-live="polite">
        {frame.caption}
      </p>
    </div>
  );
}
