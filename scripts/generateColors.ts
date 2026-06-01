// make this script write the generated colors to styles/generatedColors.css

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const baseLumaArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const extendedLumaArray = [0.03, 0.05, ...baseLumaArray, 0.95, 0.97];

const primaryHue = 235;
const fixedChroma = 0.01;

function normalizeHue(hue: number): number {
  const normalized = hue % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function oklchToLinearRgb(lightness: number, chroma: number, hue: number): [number, number, number] {
  const hueRadians = (normalizeHue(hue) * Math.PI) / 180;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);

  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;

  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return [l, m, s];
}

function isInGamut(r: number, g: number, b: number): boolean {
  const epsilon = 1e-7;
  return r >= -epsilon && r <= 1 + epsilon && g >= -epsilon && g <= 1 + epsilon && b >= -epsilon && b <= 1 + epsilon;
}

// LMS → linear Display-P3 matrix (derived from Oklab LMS primaries → XYZ D65 → P3)
function isInP3GamutOklch(lightness: number, chroma: number, hue: number): boolean {
  const [l, m, s] = oklchToLinearRgb(lightness, chroma, hue);
  const r = 3.1279009 * l - 2.257195 * m + 0.129294 * s;
  const g = -1.0909852 * l + 2.4134438 * m - 0.3224586 * s;
  const bl = -0.0261442 * l - 0.508013 * m + 1.5341572 * s;
  return isInGamut(r, g, bl);
}

function findMaxChromaForLightness(lightness: number, hue: number): number {
  let low = 0;
  let high = 0.5;

  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (isInP3GamutOklch(lightness, mid, hue)) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low;
}

function generateMaxChromaOklchColors(lumaArray: number[] = extendedLumaArray, hue: number): string[] {
  return lumaArray.map((lightness) => {
    const maxChroma = findMaxChromaForLightness(lightness, hue);
    return `oklch(${lightness.toFixed(3)} ${maxChroma.toFixed(4)} ${normalizeHue(hue).toFixed(1)})`;
  });
}

function generateOklchColors(lumaArray: number[] = extendedLumaArray, chroma: number, hue: number): string[] {
  const normalizedHue = normalizeHue(hue);
  return lumaArray.map((lightness) => {
    const clampedLightness = Math.min(1, Math.max(0, lightness));
    const clampedChroma = Math.max(0, chroma);
    return `oklch(${clampedLightness.toFixed(3)} ${clampedChroma.toFixed(4)} ${normalizedHue.toFixed(1)})`;
  });
}

function findPeakChromaPointForHue(hue: number): { luma: number; chroma: number } {
  const cache = new Map<number, number>();
  const evaluate = (lightness: number): number => {
    const clamped = Math.min(1, Math.max(0, lightness));
    const key = Number(clamped.toFixed(6));
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const value = findMaxChromaForLightness(clamped, hue);
    cache.set(key, value);
    return value;
  };

  const coarseStep = 0.01;
  let bestLuma = 0;
  let bestChroma = evaluate(0);

  for (let luma = coarseStep; luma <= 1; luma += coarseStep) {
    const chroma = evaluate(luma);
    if (chroma > bestChroma) {
      bestChroma = chroma;
      bestLuma = luma;
    }
  }

  let left = Math.max(0, bestLuma - coarseStep);
  let right = Math.min(1, bestLuma + coarseStep);

  for (let i = 0; i < 28; i += 1) {
    const third = (right - left) / 3;
    const m1 = left + third;
    const m2 = right - third;
    const c1 = evaluate(m1);
    const c2 = evaluate(m2);

    if (c1 < c2) {
      left = m1;
    } else {
      right = m2;
    }
  }

  const refinedLuma = (left + right) / 2;
  const refinedChroma = evaluate(refinedLuma);

  if (refinedChroma > bestChroma) {
    return { luma: refinedLuma, chroma: refinedChroma };
  }

  return { luma: bestLuma, chroma: bestChroma };
}

function getInverseLumaLabel(lightness: number): number {
  const lumaScale = Math.round(Math.min(1, Math.max(0, lightness)) * 1000);
  return 1000 - lumaScale;
}

function createPaletteCssVariableBlock(variablePrefix: string, lumaArray: number[], values: string[]): string {
  const entries = values.map((color, index) => {
    const luma = lumaArray[index] ?? 0;
    const suffix = getInverseLumaLabel(luma);
    return { suffix, color };
  });

  return entries
    .slice()
    .sort((a, b) => a.suffix - b.suffix)
    .map(({ suffix, color }) => `  --${variablePrefix}-${suffix}: ${color};`)
    .join("\n");
}

function buildCssFileContent(maxChromaValues: string[], fixedChromaValues: string[], hue: number): string {
  const maxBlock = createPaletteCssVariableBlock(`primary`, extendedLumaArray, maxChromaValues);
  const fixedBlock = createPaletteCssVariableBlock(`neutral`, extendedLumaArray, fixedChromaValues);
  const peak = findPeakChromaPointForHue(hue);
  const peakColor = `oklch(${peak.luma.toFixed(3)} ${peak.chroma.toFixed(4)} ${normalizeHue(hue).toFixed(1)})`;

  return [
    "/* Auto-generated by scripts/generateColors.ts. Do not edit manually. */",
    ":root {",
    maxBlock,
    fixedBlock,
    `  --primary-peak: ${peakColor};`,
    `  --primary-peak-luma: ${peak.luma.toFixed(3)};`,
    "}",
    "",
  ].join("\n");
}

function writeGeneratedPaletteFile(hue: number, chroma: number): void {
  const maxChromaPalette = generateMaxChromaOklchColors(extendedLumaArray, hue);
  const fixedChromaPalette = generateOklchColors(extendedLumaArray, chroma, hue);
  const cssContent = buildCssFileContent(maxChromaPalette, fixedChromaPalette, hue);

  const outputPath = resolve(process.cwd(), "styles/generatedColors.css");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, cssContent, "utf8");

  console.log(`Generated ${outputPath}`);
}

const hueArg = Number(process.argv[2]);
const chromaArg = Number(process.argv[3]);

const hue = Number.isFinite(hueArg) ? hueArg : primaryHue;
const chroma = Number.isFinite(chromaArg) ? chromaArg : fixedChroma;

writeGeneratedPaletteFile(hue, chroma);
