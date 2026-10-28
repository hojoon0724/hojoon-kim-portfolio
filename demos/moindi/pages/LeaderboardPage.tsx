import { ChartSeries } from "@/demos/moindi/components/ChartSeries";
import { SvgIcon } from "@/demos/moindi/components/SvgIcon";
import { getLeaderboard } from "@/demos/moindi/lib/leaderboard";

// the top artists by revenue, buyers and profile views, side by side
export function LeaderboardPage() {
  return (
    <div className="flex w-full flex-col p-(--standard-space)">
      <div className="flex w-full flex-col border">
        <div className="flex items-center justify-between border p-(--standard-space)">
          <h3 className="-my-2">Leaderboards</h3>
          <div className="h-10 w-10">
            <SvgIcon iconName="globe" />
          </div>
        </div>
        <div className="grid md:grid-cols-3">
          {getLeaderboard().map((chart) => (
            <div
              key={chart.title}
              className="flex flex-col gap-(--standard-space) border p-(--standard-space)"
            >
              <h4 className="space-mono -my-2 mb-(--standard-space-half) text-center font-bold">
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
    </div>
  );
}
