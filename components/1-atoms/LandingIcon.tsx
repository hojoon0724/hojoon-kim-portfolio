"use client";

import { useEffect, useState } from "react";

const hotelColors = ["bg-(--hotel-white)", "bg-(--hotel-red)"];
const kiloColors = ["bg-(--kilo-yellow)", "bg-(--kilo-blue)"];
const letterClassNames = ["hotel", "kilo"] as const;
const letterPauseUnits = 1;
const morseCode = [
  [0, 0, 0, 0],
  [1, 0, 1],
] as const;

const letterStartIndices = morseCode.reduce<number[]>((starts, letter, letterIndex) => {
  if (letterIndex === 0) {
    starts.push(0);
    return starts;
  }

  starts.push(starts[letterIndex - 1] + morseCode[letterIndex - 1].length);
  return starts;
}, []);

const morseSegments = morseCode.flatMap((letter, letterIndex) => {
  const startIndex = letterStartIndices[letterIndex];

  return letter.map((bit, segmentIndex) => {
    const units = bit === 1 ? 2 : 1;

    return {
      bit,
      letterIndex,
      flatIndex: startIndex + segmentIndex,
      units,
    };
  });
});

const totalUnits =
  morseSegments.reduce<number>((sum, segment) => sum + segment.units, 0) + letterPauseUnits * (morseCode.length - 1);

const createVisibilityState = (isVisible: boolean) => morseSegments.map(() => isVisible);
const createStretchState = (stretchDash: boolean) =>
  morseSegments.map((segment) => (segment.bit === 1 ? stretchDash : false));

export function LandingIcon({
  initialAnimationDuration = 1000,
  startAnimation = true,
}: {
  initialAnimationDuration?: number;
  startAnimation?: boolean;
}) {
  const [iconColors, setIconColors] = useState(hotelColors);
  const [visibleSegments, setVisibleSegments] = useState<boolean[]>(() => createVisibilityState(!startAnimation));
  const [stretchedDashes, setStretchedDashes] = useState<boolean[]>(() => createStretchState(!startAnimation));

  const unitMs = Math.max(80, Math.floor(initialAnimationDuration / totalUnits));

  useEffect(() => {
    if (!startAnimation) {
      setVisibleSegments(createVisibilityState(true));
      setStretchedDashes(createStretchState(true));
      return;
    }

    setVisibleSegments(createVisibilityState(false));
    setStretchedDashes(createStretchState(false));

    let elapsedMs = 0;
    const timeouts: number[] = [];

    morseSegments.forEach((segment, index) => {
      timeouts.push(
        window.setTimeout(() => {
          setVisibleSegments((prev) => {
            const next = [...prev];
            next[index] = true;
            return next;
          });
        }, elapsedMs),
      );

      if (segment.bit === 1) {
        timeouts.push(
          window.setTimeout(() => {
            setStretchedDashes((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
          }, elapsedMs + 20),
        );
      }

      elapsedMs += segment.units * unitMs;

      const isLetterBoundary =
        index < morseSegments.length - 1 && segment.letterIndex !== morseSegments[index + 1].letterIndex;
      if (isLetterBoundary) {
        elapsedMs += letterPauseUnits * unitMs;
      }
    });

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [startAnimation, unitMs]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIconColors((prev) => (prev === hotelColors ? kiloColors : hotelColors));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const renderSegment = (index: number, colorClass: string) => {
    const segment = morseSegments[index];
    const isDash = segment.bit === 1;
    const isVisible = visibleSegments[index];
    const isStretched = stretchedDashes[index];
    const revealDurationMs = segment.units * unitMs;

    if (!isVisible) {
      return null;
    }

    return (
      <div
        key={`segment-${index}`}
        className={`${isDash && isStretched ? "w-10" : "w-3"} h-3 drop-shadow-lg rounded-full origin-center ${colorClass}`}
        style={{
          animation: startAnimation
            ? `landingIconScaleIn ${revealDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1) both`
            : undefined,
          transitionProperty: "width, background-color",
          transitionDuration: `${revealDurationMs}ms, 600ms`,
          transitionTimingFunction: "ease-out, ease-in-out",
        }}
      />
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes landingIconScaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
      <div className="flex gap-6 justify-center my-8">
        {morseCode.map((letter, letterIndex) => {
          const startIndex = letterStartIndices[letterIndex];
          const hasVisibleSegment = letter.some((_, segmentIndex) => visibleSegments[startIndex + segmentIndex]);

          if (!hasVisibleSegment) {
            return null;
          }

          return (
            <div key={`letter-${letterIndex}`} className={`${letterClassNames[letterIndex]} flex gap-2`}>
              {letter.map((_, segmentIndex) => renderSegment(startIndex + segmentIndex, iconColors[letterIndex]))}
            </div>
          );
        })}
      </div>
    </>
  );
}
