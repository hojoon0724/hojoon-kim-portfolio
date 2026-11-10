"use client";

import type { MonthlyPoint } from "@/demos/moindi/data/portfolio";
import { formatCurrency } from "@/demos/moindi/lib/format";
import { useState } from "react";

const monthLabel = (date: Date, withYear = false) =>
  date.toLocaleString("en-US", {
    month: withYear ? "short" : "narrow",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });

// a single-series column chart of royalties by month, in the earnings color.
// the readout above the bars shows the hovered month, or the total when nothing is hovered
export function RoyaltyBars({ points }: { points: MonthlyPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...points.map((p) => p.valueInDollars));
  const total = points.reduce((sum, p) => sum + p.valueInDollars, 0);
  const active = hovered === null ? null : points[hovered];

  return (
    <div className="royalty-bars flex w-full flex-col gap-(--standard-space-half)">
      <div className="space-mono flex items-baseline justify-between text-xs">
        <span className="opacity-60">
          {active ? monthLabel(active.month, true) : "Last 12 months"}
        </span>
        <span className="text-base font-bold">
          {formatCurrency(active ? active.valueInDollars : total)}
        </span>
      </div>

      <div
        className="flex h-36 items-end gap-0.5"
        onPointerLeave={() => setHovered(null)}
      >
        {points.map((p, i) => (
          // the hit target is the full column height, not just the bar
          <div
            key={i}
            className="flex h-full flex-1 items-end"
            onPointerEnter={() => setHovered(i)}
          >
            <div
              className={`w-full rounded-t-[4px] bg-(--surface-tertiary) transition-opacity ${hovered === null || hovered === i ? "opacity-100" : "opacity-40"}`}
              style={{ height: `${(p.valueInDollars / max) * 100}%` }}
            />
          </div>
        ))}
      </div>

      <div className="space-mono flex gap-0.5 text-[0.625rem] opacity-60">
        {points.map((p, i) => (
          <span key={i} className="flex-1 text-center">
            {monthLabel(p.month)}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Royalties paid by month</caption>
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
