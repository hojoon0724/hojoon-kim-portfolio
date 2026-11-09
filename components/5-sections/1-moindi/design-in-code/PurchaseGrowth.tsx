"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AssetImage, useCountdown } from "./shared";

// a round as the shipped component shows it. a share is a dollar, so the goal is the total share count
const round = {
  title: "Shining Star",
  goal: 17300,
  artistShares: 680,
  soldShares: 1026,
};
const availableShares = round.goal - round.artistShares - round.soldShares;

const segmentStyles = {
  Artist: "bg-(--moindi-secondary-100) text-(--moindi-gray-900)",
  Sold: "bg-(--moindi-secondary-200) text-(--moindi-gray-900)",
  Available: "bg-(--moindi-secondary-500) text-white",
  Purchase: "bg-(--moindi-primary-500) text-(--moindi-gray-950)",
};

const percentOf = (shares: number) => (shares / round.goal) * 100;
const clampShares = (shares: number) =>
  Math.min(availableShares, Math.max(0, Math.round(shares)));

// the original's purchase-shares-calculator: the slider, the percent and the dollar amount all set the same
// purchase, and the share bar splits around it as it changes
function PurchaseCalculator() {
  const [purchase, setPurchase] = useState(3564);
  // what's typed in a field, kept as typed until it loses focus so the formatting doesn't fight the cursor
  const [draft, setDraft] = useState<{
    field: "percent" | "dollars";
    text: string;
  } | null>(null);
  const countdown = useCountdown(91 * 86400 * 1000 + 20 * 3600 * 1000);

  const segments = (
    [
      ["Artist", round.artistShares],
      ["Sold", round.soldShares],
      ["Available", availableShares - purchase],
      ["Purchase", purchase],
    ] as const
  ).filter(([, shares]) => shares > 0);

  const fieldValue = (field: "percent" | "dollars") =>
    draft?.field === field
      ? draft.text
      : field === "percent"
        ? percentOf(purchase).toFixed(2)
        : String(purchase);

  const onFieldChange = (field: "percent" | "dollars", text: string) => {
    setDraft({ field, text });
    const number = Number(text);
    if (text === "" || Number.isNaN(number)) return;
    setPurchase(
      clampShares(field === "percent" ? (number / 100) * round.goal : number),
    );
  };

  const fieldClass =
    "w-full min-w-0 border border-black/15 bg-white px-2 py-2 text-right font-mono text-sm [appearance:textfield] md:text-base [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="flex w-full flex-col border border-black/15 bg-(--moindi-gray-30) text-(--moindi-gray-900)">
      <div className="p-sm flex flex-wrap items-baseline justify-between gap-2 border-b border-black/15">
        <div className="text-xl font-medium md:text-2xl">{round.title}</div>
        <div className="font-mono text-xs md:text-sm">
          <span className="opacity-50">Ends in: </span>
          {countdown?.text}
        </div>
      </div>
      <div className="p-sm gap-sm flex flex-col">
        <div className="flex h-7 w-full font-mono text-[10px] md:text-xs">
          {segments.map(([label, shares]) => (
            <div
              key={label}
              className={`flex min-w-[3ch] items-center justify-center overflow-hidden transition-[width] duration-150 ${segmentStyles[label]}`}
              style={{ width: `${percentOf(shares)}%` }}
              title={`${label}: ${shares.toLocaleString()} shares`}
            >
              {percentOf(shares).toFixed(percentOf(shares) < 8 ? 0 : 2)}%
            </div>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={availableShares}
          value={purchase}
          onChange={(event) => setPurchase(clampShares(+event.target.value))}
          aria-label="Shares to buy"
          className="h-6 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-(--moindi-primary-500) [&::-moz-range-thumb]:shadow-[0_0_0.75rem_0.3rem_hsl(30_100%_50%/0.35)] [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-(--moindi-gray-200) [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-(--moindi-gray-200) [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--moindi-primary-500) [&::-webkit-slider-thumb]:shadow-[0_0_0.75rem_0.3rem_hsl(30_100%_50%/0.35)]"
        />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              max={percentOf(availableShares).toFixed(2)}
              value={fieldValue("percent")}
              onChange={(event) => onFieldChange("percent", event.target.value)}
              onBlur={() => setDraft(null)}
              aria-label="Percent of the round"
              className={`${fieldClass} max-w-24`}
            />
            <span className="font-mono">%</span>
          </div>
          <span className="font-mono text-xl">=</span>
          <div className="flex items-center gap-1">
            <span className="font-mono">$</span>
            <input
              type="number"
              inputMode="numeric"
              step="1"
              min={0}
              max={availableShares}
              value={fieldValue("dollars")}
              onChange={(event) => onFieldChange("dollars", event.target.value)}
              onBlur={() => setDraft(null)}
              aria-label="Amount in dollars"
              className={`${fieldClass} max-w-28`}
            />
          </div>
          {/* the demo stops short of checkout */}
          <span className="border border-black/20 bg-(--moindi-primary-500) px-4 py-2 font-mono text-sm font-bold uppercase">
            Checkout
          </span>
        </div>
      </div>
    </div>
  );
}

const sketch = {
  src: "/moindi/before-purchase-component.png",
  width: 1200,
  height: 681,
  alt: "The purchase block as first sketched in Figma: a record deal with a countdown, the artist and investor split, the shares left, and a purchase amount",
};

// the purchase block as sketched, above the control it grew into, working, as one right-aligned column.
// on md and up the column is as tall as the showcase frames: the sketch shrinks to whatever height the
// calculator leaves it and the calculator matches its width. the title sits in the space to its left when
// it fits there, otherwise above
export function PurchaseGrowth({ title }: { title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sketchRef = useRef<HTMLDivElement>(null);
  const [sketchWidth, setSketchWidth] = useState<number | null>(null);
  const [titleBeside, setTitleBeside] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const heading = titleRef.current;
    const sketchArea = sketchRef.current;
    if (!container || !heading || !sketchArea) return;
    const wide = window.matchMedia("(min-width: 48rem)");
    // the widest the sketch can be at the height it's given, capped by the space there is
    const measure = () => {
      const width = Math.min(
        container.clientWidth,
        (sketchArea.clientHeight * sketch.width) / sketch.height,
      );
      setSketchWidth(width);
      setTitleBeside(
        wide.matches &&
          container.clientWidth - width >= heading.scrollWidth + 32,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(sketchArea);
    wide.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={containerRef} className="gap-sm relative flex flex-col">
      <h3
        ref={titleRef}
        className={`roboto-mono w-max max-w-full text-sm font-bold uppercase md:text-base ${titleBeside ? "absolute top-0 left-0" : ""}`}
      >
        {title}
      </h3>
      <div
        className="gap-md flex w-full flex-col md:ml-auto md:h-[min(calc(280px*150/71.9),calc(100svh-24rem))] md:max-w-(--sketch-w)"
        style={
          sketchWidth
            ? ({ "--sketch-w": `${sketchWidth}px` } as CSSProperties)
            : undefined
        }
      >
        <figure className="gap-xs flex min-h-0 flex-col md:flex-1">
          <div
            ref={sketchRef}
            className="min-h-0 md:flex md:flex-1 md:flex-col md:justify-end"
          >
            <AssetImage
              asset={sketch}
              className="border border-current/15 md:max-h-full md:object-contain"
            />
          </div>
          <figcaption className="roboto-mono shrink-0 text-xs uppercase opacity-70">
            Figma, day one
          </figcaption>
        </figure>
        <figure className="gap-xs flex shrink-0 flex-col">
          <PurchaseCalculator />
          <figcaption className="roboto-mono text-xs uppercase opacity-70">
            In code. Drag the slider or type an amount
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
