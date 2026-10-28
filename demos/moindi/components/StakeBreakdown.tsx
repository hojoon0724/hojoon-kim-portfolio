import "@/demos/moindi/styles/stake-breakdown.css";
import type { ColorTypes, ProjectInterface } from "@/demos/moindi/types";

type StakeBreakdownProps = {
  project: ProjectInterface;
  purchaseShares?: number;
  color?: ColorTypes;
  // rounds narrow segments to whole percents so they fit
  small?: boolean;
  className?: string;
};

// how a project's shares split between the artist, buyers so far, what's left, and a pending purchase.
// the original's hover tooltips are a native title here
export function StakeBreakdown({
  project,
  purchaseShares = 0,
  color = "secondary",
  small = false,
  className = "",
}: StakeBreakdownProps) {
  const segments = [
    { label: "Artist", shares: project.protectedShares },
    { label: "Sold", shares: project.soldShares },
    { label: "Available", shares: project.availableShares - purchaseShares },
    { label: "Purchase", shares: purchaseShares },
  ]
    .map((segment) => {
      const percent = (segment.shares / project.totalShares) * 100;
      return {
        ...segment,
        percent: +percent.toFixed(2),
        percentShort: +percent.toFixed(0),
      };
    })
    .filter((segment) => segment.percent > 0);

  return (
    <div
      className={`stake-breakdown space-mono flex h-8 w-full text-sm ${color}-breakdown ${className}`}
    >
      {segments.map((segment) => (
        <div
          key={segment.label}
          className={`${segment.label.toLowerCase()}-share flex h-full min-w-[3ch] flex-col items-center justify-center`}
          style={{ width: `${segment.percent}%` }}
          title={`${segment.label} (${segment.shares.toLocaleString()} Shares)`}
        >
          {small && segment.percent < 21
            ? segment.percentShort
            : segment.percent}
          %
        </div>
      ))}
    </div>
  );
}
