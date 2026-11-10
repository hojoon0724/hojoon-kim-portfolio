"use client";

import type { ProjectInterface } from "@/demos/moindi/types";
import { useState } from "react";
import { Button } from "./Button";
import { StakeBreakdown } from "./StakeBreakdown";

// the original's purchase-shares-calculator: pick a stake by slider, percent or dollars (shares are $1 each),
// and the breakdown above shows it as the purchase segment. there's no checkout page in the demo,
// so checkout does nothing
export function PurchaseSharesCalculator({
  project,
}: {
  project: ProjectInterface;
}) {
  const maxShares = project.availableShares;
  const toPercent = (shares: number) =>
    +((shares * 100) / project.totalShares).toFixed(2);

  const [shares, setShares] = useState(0);
  // kept as typed, so the field doesn't reformat mid-keystroke
  const [percentText, setPercentText] = useState("0");

  const setFromShares = (value: number) => {
    const clamped = Math.min(Math.max(Math.floor(value) || 0, 0), maxShares);
    setShares(clamped);
    setPercentText(String(toPercent(clamped)));
  };

  const setFromPercent = (text: string) => {
    setPercentText(text);
    const percent = Math.max(parseFloat(text) || 0, 0);
    setShares(
      Math.min(Math.floor((percent / 100) * project.totalShares), maxShares),
    );
  };

  const canCheckout = shares > 0 && shares <= maxShares;

  return (
    <div className="purchase-shares-calculator flex w-full flex-col items-center justify-center gap-(--standard-space)">
      <StakeBreakdown project={project} purchaseShares={shares} />
      <input
        className="w-full accent-(--surface-primary)"
        type="range"
        min={0}
        max={maxShares}
        step={1}
        value={shares}
        aria-label="Shares to buy"
        onChange={(event) => setFromShares(+event.target.value)}
      />
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="flex flex-row items-center justify-center gap-1 lg:gap-4">
          <div className="flex items-center border">
            <input
              className="w-24 py-2 pr-1 text-right"
              type="number"
              step="0.01"
              min={0}
              max={toPercent(maxShares)}
              value={percentText}
              aria-label="Stake as a percent"
              onChange={(event) => setFromPercent(event.target.value)}
              onBlur={() => setPercentText(String(toPercent(shares)))}
            />
          </div>
          <span className="pr-1">%</span>
          <div className="text-[2rem]">=</div>
          <span className="pl-1">$</span>
          <div className="flex items-center border">
            <input
              className="w-28 py-2 pl-1"
              type="number"
              step="1"
              min={0}
              max={maxShares}
              value={shares}
              aria-label="Stake in dollars"
              onChange={(event) => setFromShares(+event.target.value)}
            />
          </div>
        </div>
        <Button
          className="w-full lg:w-fit"
          color="primary"
          disabled={!canCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
