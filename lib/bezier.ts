// easing for animations that are driven from javascript instead of css (CountUp, ScrambleRevealText)

export type BezierPoints = [number, number, number, number];

// used when the css variable can't be read. same values as --bezier-count-up
const fallbackBezier: BezierPoints = [0.16, 1, 0.3, 1];

// "cubic-bezier(0.16, 1, 0.3, 1)" -> [0.16, 1, 0.3, 1]
export function readBezier(variableName: string): BezierPoints {
  const numbers = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .match(/-?\d*\.?\d+/g)
    ?.map(Number);
  return numbers?.length === 4 ? (numbers as BezierPoints) : fallbackBezier;
}

// the same curve css draws for cubic-bezier(x1, y1, x2, y2): find where the curve reaches this point in time, read its height
export function applyBezier(
  [x1, y1, x2, y2]: BezierPoints,
  progress: number,
): number {
  const curve = (t: number, a: number, b: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;

  let low = 0;
  let high = 1;
  for (let i = 0; i < 20; i++) {
    const middle = (low + high) / 2;
    if (curve(middle, x1, x2) < progress) low = middle;
    else high = middle;
  }
  return curve((low + high) / 2, y1, y2);
}
