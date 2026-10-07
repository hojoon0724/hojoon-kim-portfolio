"use client";

import { useInView } from "@/hooks";
import { applyBezier, readBezier } from "@/lib/bezier";
import { useEffect, useState } from "react";

interface ScrambleRevealTextProps {
  text: string;
  className?: string;
  durationMs?: number;
  delayMs?: number;
  finishByMs?: number;
  threshold?: number;
  easeOut?: boolean;
  startAnimation?: boolean;
  resetOnLeave?: boolean;
  characters?: string;
  scrambleLength?: number;
  scrambleIntervalMs?: number;
}

const defaultCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&@$";

// settled: how many characters from the left show the real text
// glyphs: the random characters standing in for the next few, which are still scrambling
type Frame = { settled: number; glyphs: string[] };

const emptyFrame: Frame = { settled: 0, glyphs: [] };

function pickGlyphs(characters: string, count: number): string[] {
  return Array.from(
    { length: count },
    () => characters[Math.floor(Math.random() * characters.length)],
  );
}

export function ScrambleRevealText({
  text,
  className,
  durationMs = 800,
  delayMs = 0,
  finishByMs = 0,
  threshold = 0.3,
  easeOut = false,
  startAnimation = false,
  resetOnLeave = false,
  characters = defaultCharacters,
  scrambleLength = 4,
  scrambleIntervalMs = 50,
}: ScrambleRevealTextProps) {
  const [ref, isInView] = useInView<HTMLSpanElement>(threshold, !resetOnLeave);
  const [frame, setFrame] = useState<Frame>(emptyFrame);

  const revealed = startAnimation || isInView;
  const length = text.length;

  // finishByMs counts from the reveal, so the delay comes out of the animation time
  const calculatedDurationMs =
    finishByMs > 0 ? Math.max(0, finishByMs - delayMs) : durationMs;

  useEffect(() => {
    if (!revealed) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const bezier = easeOut ? readBezier("--bezier-count-up") : null;
    let frameId = 0;
    let startTime = 0;
    let lastScrambleTime = 0;
    let lastSettled = -1;

    const tick = (now: number) => {
      if (startTime === 0) startTime = now + delayMs;

      const elapsed = now - startTime;
      const progress =
        reduceMotion || calculatedDurationMs === 0
          ? 1
          : Math.min(1, Math.max(0, elapsed / calculatedDurationMs));
      // easeOut: most of the text arrives early, then it slows as it nears the end. otherwise an even pace
      const easedProgress = bezier ? applyBezier(bezier, progress) : progress;

      // the scrambling stretch leads the settled text, and runs off the end so the last characters settle too
      const head = Math.floor(easedProgress * (length + scrambleLength));
      const settled =
        progress === 1 ? length : Math.max(0, head - scrambleLength);
      const scrambling = Math.min(length, head) - settled;

      // new random characters when the settled edge moves, and otherwise every scrambleIntervalMs
      if (
        settled !== lastSettled ||
        now - lastScrambleTime >= scrambleIntervalMs
      ) {
        lastSettled = settled;
        lastScrambleTime = now;
        setFrame({ settled, glyphs: pickGlyphs(characters, scrambling) });
      }

      if (progress < 1) frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    // going back to the start here means a second reveal doesn't flash the finished text first
    return () => {
      window.cancelAnimationFrame(frameId);
      setFrame(emptyFrame);
    };
  }, [
    revealed,
    length,
    calculatedDurationMs,
    delayMs,
    easeOut,
    characters,
    scrambleLength,
    scrambleIntervalMs,
  ]);

  const { settled, glyphs } = revealed ? frame : emptyFrame;

  return (
    <span ref={ref} className={className}>
      {/* every character keeps the space of the real one from the start, so nothing moves as the text builds */}
      <span aria-hidden="true">
        {text.split("").map((character, index) => {
          if (index < settled) return <span key={index}>{character}</span>;

          const glyph = glyphs[index - settled];
          if (!glyph || /\s/.test(character)) {
            return (
              <span key={index} className="invisible">
                {character}
              </span>
            );
          }

          // the real character stays in place, hidden, and the random one is centred over it
          return (
            <span key={index} className="relative">
              <span className="invisible">{character}</span>
              <span className="absolute top-0 left-1/2 -translate-x-1/2">
                {glyph}
              </span>
            </span>
          );
        })}
      </span>
      {/* screen readers get the finished text once instead of every random character */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
