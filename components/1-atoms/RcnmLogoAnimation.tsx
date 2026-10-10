"use client";

import { useEffect, useRef, useState } from "react";

interface RcnmLogoAnimationProps {
  // sizes and places the whole component. the replay button sits in the bottom right corner of this
  className?: string;
  // sizes and places the logo inside the component, for example "mx-auto w-1/2". it fills the component by default
  logoClassName?: string;
  startDelayMs?: number;
  // how far, in artwork units, the ends of the lines shake up and down while they are moving. 0 turns it off.
  // the artwork is 310 units tall, so 6 is a light tremble and 15 is rough
  noise?: number;
}

// the artwork is drawn with 10 unit wide round capped strokes on a 550 x 310 canvas. the row of dots sits on the center line
const viewBoxWidth = 550;
const viewBoxHeight = 310;
const centerY = viewBoxHeight / 2;
const firstColumnX = 5;
const lastColumnX = 545;

// one vertical line of the logo.
// - wave: where its ends are once the logo has risen (rcnm-pill-wave-single.svg)
// - separated: where they move to afterwards, for the few lines that change (rcnm-pill-wave-separated.svg)
// - half: set on the two lines of a doubled line. each only ever reaches one way from the center line
type LogoLine = {
  x: number;
  wave: [top: number, bottom: number];
  separated?: [top: number, bottom: number];
  half?: "top" | "bottom";
};

// left to right. two columns hold a doubled line: two lines that meet on the center line and move as one bar,
// then pull apart to leave the gap in the R and the opening of the C
const logoLines: LogoLine[] = [
  { x: 5, wave: [155, 155] },
  { x: 25, wave: [145, 165] },
  { x: 45, wave: [125, 185] },
  { x: 65, wave: [95, 215] },
  { x: 85, wave: [135, 175] },
  { x: 105, wave: [95, 195] },
  { x: 125, wave: [115, 195] },
  { x: 145, wave: [115, 155], separated: [115, 125], half: "top" },
  { x: 145, wave: [155, 205], separated: [165, 205], half: "bottom" },
  { x: 165, wave: [85, 225] },
  { x: 185, wave: [115, 195] },
  { x: 205, wave: [75, 235] },
  { x: 225, wave: [75, 235] },
  { x: 245, wave: [75, 155], separated: [75, 145], half: "top" },
  { x: 245, wave: [155, 235], separated: [165, 235], half: "bottom" },
  { x: 265, wave: [5, 265] },
  { x: 285, wave: [45, 305] },
  { x: 305, wave: [75, 265] },
  { x: 325, wave: [75, 245] },
  { x: 345, wave: [75, 235] },
  { x: 365, wave: [115, 195] },
  { x: 385, wave: [85, 225] },
  { x: 405, wave: [105, 205] },
  { x: 425, wave: [125, 205] },
  { x: 445, wave: [125, 185] },
  { x: 465, wave: [145, 165] },
  { x: 485, wave: [115, 195] },
  { x: 505, wave: [145, 165] },
  { x: 525, wave: [135, 175] },
  { x: 545, wave: [155, 155] },
];

// the curves that join the lines into the R, C, N and M (rcnm-pill-wave-extensions.svg).
// each is drawn on from its first point to its last
const extensionPaths = [
  "M105,95h20c11.05,0,20,8.95,20,20v10c0,11.05-8.95,20-20,20",
  "M125,145c11.05,0,20,8.95,20,20",
  "M245,75h0c0-11.05-8.95-20-20-20h0c-11.05,0-20,8.95-20,20h0",
  "M205,235h0c0,11.05,8.95,20,20,20h0c11.05,0,20-8.95,20-20h0",
  "M345,75h0c0-11.05-8.95-20-20-20h0c-11.05,0-20,8.95-20,20h0",
  "M425,125v-20s0,0,0,0c0-5.52-4.48-10-10-10h0c-5.52,0-10,4.48-10,10h0",
  "M445,125h0c0-5.52-4.48-10-10-10h0c-5.52,0-10,4.48-10,10h0",
];

// the four moves happen one after another. the first three together take about a second
const holdMs = 400;
const attackMs = 100;
const decayMs = 500;
// how long the row sits as dots between the decay and the final rise
const restMs = -0;
const finalMs = 450;
const pauseMs = -200;
// how long after the animation ends the replay button appears
const replayButtonDelayMs = 500;
const extensionsMs = 500;
// the furthest a line reaches from the center line at the top of the bang
const maxReach = 150;
// how much of that reach the outermost lines get. the middle of the row always gets all of it
const edgeReach = 0.45;

// each move's curve lives in styles/_animations.css. the values here are only used if the variable can't be read
const curves = {
  attack: {
    variable: "--bezier-rcnm-logo-attack",
    fallback: [0.38, 0.03, 0, 1],
  },
  decay: {
    variable: "--bezier-rcnm-logo-decay",
    fallback: [0.4, 0.11, 0.82, 0.13],
  },
  final: {
    variable: "--bezier-rcnm-logo-final",
    fallback: [0, 0.8, 0.31, 1.01],
  },
  extensions: {
    variable: "--bezier-rcnm-logo-extensions",
    fallback: [0.92, 0.3, 0.91, 0.71],
  },
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// the same "random" number every time for the same inputs, so the motion looks noisy but never changes between runs
const seeded = (line: number, side: number, step = 0) => {
  const value =
    Math.sin(line * 12.9898 + side * 37.719 + step * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

// the shake picks a new random position this often and glides to it
const shakeStepMs = 45;
// an end this close to the center line shakes less, so a dot never jitters
const fullShakeDistance = 40;

// a value between -1 and 1 that keeps changing. every end of every line is offset in time, so they never move together
const shakeAt = (elapsedMs: number, line: number, side: number) => {
  const time = elapsedMs / shakeStepMs + seeded(line, side + 2);
  const step = Math.floor(time);
  const glide = time - step;
  const value =
    seeded(line, side, step) * (1 - glide) +
    seeded(line, side, step + 1) * glide;
  return value * 2 - 1;
};

// turns a css cubic-bezier into a function from time (0 to 1) to progress, the way the browser runs a css animation.
// a bezier gives x and y for a hidden parameter, so the parameter that lands on the wanted time is searched for first
const readBezier = (
  element: Element,
  curve: { variable: string; fallback: number[] },
) => {
  const values = window
    .getComputedStyle(element)
    .getPropertyValue(curve.variable)
    .match(/-?\d*\.?\d+/g)
    ?.map(Number);
  const [x1, y1, x2, y2] = values?.length === 4 ? values : curve.fallback;

  const along = (parameter: number, first: number, second: number) =>
    3 * (1 - parameter) * (1 - parameter) * parameter * first +
    3 * (1 - parameter) * parameter * parameter * second +
    parameter * parameter * parameter;

  return (time: number) => {
    if (time <= 0) return 0;
    if (time >= 1) return 1;

    let low = 0;
    let high = 1;
    let parameter = time;
    for (let pass = 0; pass < 20; pass += 1) {
      if (along(parameter, x1, x2) < time) low = parameter;
      else high = parameter;
      parameter = (low + high) / 2;
    }
    return along(parameter, y1, y2);
  };
};

// the rcnm logo building itself:
// 1. starts as a row of dots (rcnm-pill-rest.svg)
// 2. attack: every line, the outer ones included, shoots out to its own height, like a waveform hit by one loud sound
// 3. decay: the lines fall back to the dots, and hold there for a beat
// 4. final: the lines go out again, this time to the shape of the logo (rcnm-pill-wave-single.svg), and stay there
// 5. extensions: the doubled lines pull apart (rcnm-pill-wave-separated.svg) while the curves that
//    form the letters are drawn on (rcnm-pill-wave-extensions.svg)
// each of the four moves has its own curve in the stylesheet.
// it plays once, the first time it is scrolled into view. the replay button in the corner plays it again
export function RcnmLogoAnimation({
  className = "",
  logoClassName = "w-full",
  startDelayMs = 0,
  noise = 2,
}: RcnmLogoAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  // set by the effect below, which owns the animation
  const replayRef = useRef<() => void>(() => {});
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const lines = Array.from(svg.querySelectorAll("line"));
    const extensions = Array.from(svg.querySelectorAll("path"));
    let frameId = 0;
    let timeoutId = 0;
    let replayButtonTimeoutId = 0;

    // the button only comes in once the logo has been sitting finished for a moment
    const queueReplayButton = () => {
      replayButtonTimeoutId = window.setTimeout(
        () => setShowReplay(true),
        replayButtonDelayMs,
      );
    };

    const easeAttack = readBezier(svg, curves.attack);
    const easeDecay = readBezier(svg, curves.decay);
    const easeFinal = readBezier(svg, curves.final);
    const easeExtensions = readBezier(svg, curves.extensions);

    const decayStartMs = holdMs + attackMs;
    const finalStartMs = decayStartMs + decayMs + restMs;
    const extensionsStartMs = finalStartMs + finalMs + pauseMs;
    const totalMs = extensionsStartMs + extensionsMs;

    const draw = (elapsedMs: number) => {
      // how much of the bang is showing: up to 1 during the attack, back to 0 during the decay
      const loudness =
        elapsedMs < decayStartMs
          ? easeAttack(clamp01((elapsedMs - holdMs) / attackMs))
          : 1 - easeDecay(clamp01((elapsedMs - decayStartMs) / decayMs));
      const rise = easeFinal(clamp01((elapsedMs - finalStartMs) / finalMs));
      const formed = easeExtensions(
        clamp01((elapsedMs - extensionsStartMs) / extensionsMs),
      );

      // the shake follows the motion: as strong as the bang is loud, then again while the lines travel to the logo,
      // fading as they arrive. nothing shakes while the row rests or once the logo has formed
      const shakiness = Math.max(
        clamp01(loudness),
        rise > 0 ? clamp01(1 - rise) : 0,
      );

      lines.forEach((line, index) => {
        const { x, wave, separated = wave, half } = logoLines[index];
        // 0 at the center of the row, 1 at its two ends
        const distanceFromCenter =
          Math.abs(x - viewBoxWidth / 2) / ((lastColumnX - firstColumnX) / 2);

        // the bang: every line goes to its own height.
        // the middle of the row is louder than its ends, and the two sides of a line are close but not identical
        const reach =
          maxReach *
          loudness *
          (edgeReach +
            (1 - edgeReach) * (1 - distanceFromCenter * distanceFromCenter));
        const level = seeded(index, 0);
        const bangUp = half === "bottom" ? 0 : reach * (0.2 + 0.8 * level);
        const bangDown =
          half === "top"
            ? 0
            : reach * (0.2 + 0.8 * (0.6 * level + 0.4 * seeded(index, 1)));

        // the logo: the ends travel straight out from the center line to the wave, then on to where they separate
        const top = wave[0] + (separated[0] - wave[0]) * formed;
        const bottom = wave[1] + (separated[1] - wave[1]) * formed;

        // the bang is back at rest before the rise starts, so only one of the two is ever moving the line
        const up = bangUp + (centerY - top) * rise;
        const down = bangDown + (bottom - centerY) * rise;
        // each end shakes by itself. the inner end of a doubled line stays put, so the pair never comes apart
        const shakeUp =
          half === "bottom"
            ? 0
            : noise *
              shakiness *
              clamp01(up / fullShakeDistance) *
              shakeAt(elapsedMs, index, 0);
        const shakeDown =
          half === "top"
            ? 0
            : noise *
              shakiness *
              clamp01(down / fullShakeDistance) *
              shakeAt(elapsedMs, index, 1);

        line.setAttribute("y1", String(centerY - up - shakeUp));
        line.setAttribute("y2", String(centerY + down + shakeDown));
      });

      extensions.forEach((path) => {
        // pathLength is 1, so the offset is simply the share of the curve still to draw
        path.style.strokeDashoffset = String(1 - formed);
        // a round cap would show as a dot at the start of an undrawn curve
        path.style.visibility = formed > 0 ? "visible" : "hidden";
      });
    };

    const play = () => {
      // a replay can land in the middle of a run, so drop whatever is still going
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(replayButtonTimeoutId);
      setShowReplay(false);
      const startedAt = performance.now();

      const tick = (now: number) => {
        const elapsedMs = now - startedAt;
        draw(Math.min(elapsedMs, totalMs));
        if (elapsedMs < totalMs) frameId = window.requestAnimationFrame(tick);
        else queueReplayButton();
      };

      frameId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timeoutId = window.setTimeout(play, startDelayMs);
      },
      { threshold: 0.5 },
    );

    // with reduced motion the logo is simply shown finished. pressing replay is asking for the motion, so that still plays
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(totalMs);
      queueReplayButton();
    } else {
      observer.observe(svg);
    }

    replayRef.current = () => {
      observer.disconnect();
      play();
    };

    return () => {
      replayRef.current = () => {};
      observer.disconnect();
      window.clearTimeout(timeoutId);
      window.clearTimeout(replayButtonTimeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [startDelayMs, noise]);

  return (
    <div className={`relative ${className}`}>
      {/* the logo has its own box, so it can be smaller than the component without moving the button */}
      <div className={logoClassName}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="stroke-rcnm-red-500 block h-auto w-full overflow-visible"
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          role="img"
          aria-label="Rocket City New Music logo"
        >
          {/* at rest every line has both ends on the center line, and its round caps make it a dot */}
          {logoLines.map((line, index) => (
            <line
              key={index}
              x1={line.x}
              y1={centerY}
              x2={line.x}
              y2={centerY}
            />
          ))}
          {extensionPaths.map((path) => (
            <path
              key={path}
              d={path}
              pathLength={1}
              strokeDasharray={1}
              style={{ strokeDashoffset: 1, visibility: "hidden" }}
            />
          ))}
        </svg>
      </div>
      {/* pinned to the corner of the component, not of the logo.
          it stays out of the way, and out of reach, until the animation has finished */}
      <button
        type="button"
        onClick={() => replayRef.current()}
        disabled={!showReplay}
        aria-label="Replay the logo animation"
        className={`absolute right-0 bottom-0 h-6 w-6 transition-opacity duration-500 md:h-7 md:w-7 ${showReplay ? "cursor-pointer opacity-60 hover:opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {/* a circular arrow, drawn with the same round capped strokes as the logo */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12a8 8 0 1 0 2.34-5.66L4 8.5" />
          <path d="M4 4v4.5h4.5" />
        </svg>
      </button>
    </div>
  );
}
