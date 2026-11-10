"use client";

import type { MonthlyPoint } from "@/demos/moindi/data/portfolio";
import { compactNumber, formatCurrency } from "@/demos/moindi/lib/format";
import { useState } from "react";

const monthLabel = (date: Date, withYear = false) =>
  date.toLocaleString("en-US", {
    month: "short",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });

const axisLabel = (dollars: number) => {
  const { number, suffix } = compactNumber(dollars);
  return `$${number}${suffix}`;
};

// three gridlines above zero, at a round step ($5k, $15k, $50k...) that clears the top value
function niceTicks(max: number) {
  const rough = max / 3;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step =
    [1, 1.5, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ??
    rough;
  return [0, step, step * 2, step * 3];
}

// a single-series area chart of the portfolio's value by month, in the market color.
// hovering (or touching) the plot moves a crosshair to the nearest month and shows its value
export function PortfolioValueChart({ points }: { points: MonthlyPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const ticks = niceTicks(Math.max(...points.map((p) => p.valueInDollars)));
  const yMax = ticks[ticks.length - 1];

  const x = (i: number) => (i / (points.length - 1)) * 100;
  const y = (value: number) => 100 - (value / yMax) * 100;
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.valueInDollars)}`)
    .join(" ");
  const area = `${line} L100,100 L0,100 Z`;

  const active = hovered === null ? null : points[hovered];

  return (
    <div className="portfolio-value-chart w-full pl-10">
      <div
        className="relative h-48 w-full touch-none md:h-56"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const fraction = (event.clientX - rect.left) / rect.width;
          setHovered(
            Math.min(
              points.length - 1,
              Math.max(0, Math.round(fraction * (points.length - 1))),
            ),
          );
        }}
        onPointerLeave={() => setHovered(null)}
      >
        {ticks.map((tick) => (
          <div
            key={tick}
            className="absolute inset-x-0"
            style={{ top: `${y(tick)}%` }}
          >
            <div className="border-t border-(--border-color) opacity-30" />
            <span className="space-mono absolute right-full mr-2 -translate-y-1/2 text-[0.625rem] opacity-60">
              {axisLabel(tick)}
            </span>
          </div>
        ))}

        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={area} fill="var(--surface-primary)" opacity={0.15} />
          <path
            d={line}
            fill="none"
            stroke="var(--surface-primary)"
            strokeWidth={2}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {active && hovered !== null && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 w-px bg-(--text-base) opacity-40"
              style={{ left: `${x(hovered)}%` }}
            />
            <div
              className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-(--surface-base) bg-(--surface-primary)"
              style={{
                left: `${x(hovered)}%`,
                top: `${y(active.valueInDollars)}%`,
              }}
            />
            <div
              className={`space-mono pointer-events-none absolute top-0 z-10 border bg-(--surface-base) px-2 py-1 text-xs whitespace-nowrap ${hovered > points.length / 2 ? "-ml-2 -translate-x-full" : "ml-2"}`}
              style={{ left: `${x(hovered)}%` }}
            >
              <div className="opacity-60">{monthLabel(active.month, true)}</div>
              <div className="font-bold">
                {formatCurrency(active.valueInDollars)}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="space-mono mt-1 flex justify-between text-[0.625rem] opacity-60">
        {points.map((p, i) => (
          <span key={i} className={i % 2 === 1 ? "hidden sm:inline" : ""}>
            {monthLabel(p.month)}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Portfolio value by month</caption>
        <tbody>
          {points.map((p, i) => (
            <tr key={i}>
              <th scope="row">{monthLabel(p.month, true)}</th>
              <td>{formatCurrency(p.valueInDollars)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
