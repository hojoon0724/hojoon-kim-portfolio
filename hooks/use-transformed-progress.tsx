"use client";
export function useTransformedProgress(
  progress: number,
  inputRange: [number, number],
  outputRange: [number, number],
) {
  const [inputStart, inputEnd] = inputRange;
  const [outputStart, outputEnd] = outputRange;
  const clampedProgress = Math.min(Math.max(progress, inputStart), inputEnd);
  const transformedProgress =
    ((clampedProgress - inputStart) / (inputEnd - inputStart)) *
      (outputEnd - outputStart) +
    outputStart;
  return transformedProgress;
}
