import { ChartSeries } from "@/demos/moindi/components/ChartSeries";
import { SvgIcon } from "@/demos/moindi/components/SvgIcon";
import {
  getLeaderboard,
  LEADERBOARD_CATEGORY_COLORS,
  type LeaderboardCategory,
} from "@/demos/moindi/lib/leaderboard";
import type { ColorTypes } from "@/demos/moindi/types";

// tailwind needs non-dynamic class names. matches the bar colors in ChartSeries
const SWATCH_CLASS: Record<ColorTypes, string> = {
  primary: "bg-(--surface-primary)",
  secondary: "bg-(--surface-secondary)",
  tertiary: "bg-(--surface-tertiary)",
};

// the leaderboard charts, one row per category. each row is labeled with its color,
// so the bar colors read as market, streaming and earnings
export function LeaderboardPage() {
  const charts = getLeaderboard();
  const categories = Object.entries(LEADERBOARD_CATEGORY_COLORS) as [
    LeaderboardCategory,
    ColorTypes,
  ][];

  return (
    <div className="flex w-full flex-col p-(--standard-space)">
      <div className="flex w-full flex-col border">
        <div className="flex items-center justify-between border p-(--standard-space)">
          <h3 className="-my-2!">Leaderboards</h3>
          <div className="h-10 w-10">
            <SvgIcon iconName="globe" />
          </div>
        </div>
        {categories.map(([category, color]) => (
          <div key={category} className="flex flex-col">
            <div
              className={`flex items-center gap-(--standard-space-half) border px-(--standard-space) py-(--standard-space-half) ${SWATCH_CLASS[color]} ${color === "tertiary" ? "text-(--text-on-surface-inverted)" : "text-(--text-on-surface-base)"}`}
            >
              <span
                className={`h-3 w-3 ${color !== "tertiary" ? "bg-(--text-on-surface-base)" : "bg-(--text-on-surface-inverted)"}`}
                aria-hidden
              />
              <h4 className="space-mono m-0! text-base font-bold uppercase">
                {category}
              </h4>
            </div>
            <div className="grid md:grid-cols-3">
              {charts
                .filter((chart) => chart.category === category)
                .map((chart) => (
                  <div
                    key={chart.title}
                    className="flex flex-col gap-(--standard-space) border p-(--standard-space)"
                  >
                    <h4 className="space-mono -my-2! mb-(--standard-space-half) text-center font-bold">
                      {chart.title}
                    </h4>
                    <ChartSeries
                      items={chart.items}
                      format={chart.format}
                      color={chart.color}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
