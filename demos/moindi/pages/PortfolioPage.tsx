"use client";

import { useDemoAuth } from "@/demos/moindi/components/DemoAuthProvider";
import { ImageContainer } from "@/demos/moindi/components/ImageContainer";
import { PortfolioValueChart } from "@/demos/moindi/components/PortfolioValueChart";
import { SvgIcon } from "@/demos/moindi/components/SvgIcon";
import { leaderboardStats } from "@/demos/moindi/data/leaderboard-stats";
import { dummyArtists2026 } from "@/demos/moindi/data/npc-data";
import {
  holdings,
  closingSoon,
  genreGroups,
  nextPayout,
  portfolioValueHistory,
  recentActivity,
  watchlistArtistIds,
  type ActivityKind,
} from "@/demos/moindi/data/portfolio";
import { compactNumber, formatCurrency } from "@/demos/moindi/lib/format";

const ACTIVITY_ICON: Record<ActivityKind, string> = {
  buy: "cart",
  royalty: "cash",
  funded: "check-circle",
  release: "music",
};

// gains and losses always carry a sign, so they never rely on color alone
function signedCurrency(dollars: number) {
  return `${dollars < 0 ? "−" : "+"}${formatCurrency(Math.abs(dollars))}`;
}

function signedPercent(percent: number) {
  return `${percent < 0 ? "−" : "+"}${Math.abs(percent).toFixed(1)}%`;
}

const gainClass = (amount: number) =>
  amount < 0 ? "text-(--text-loss)" : "text-(--text-gain)";

const shortDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

// a bento cell: a bordered box with the dashboard's title strip across the top
function BentoCell({
  title,
  aside,
  className = "",
  bodyClassName = "p-(--standard-space)",
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex min-w-0 flex-col border ${className}`}>
      <div className="flex items-baseline justify-between gap-(--standard-space) border-b-2 px-(--standard-space) py-(--standard-space-half)">
        <h4 className="space-grotesk m-0! font-semibold">{title}</h4>
        {aside && <div className="text-xs opacity-60">{aside}</div>}
      </div>
      <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

function StatTile({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-between gap-1 border p-(--standard-space) text-center">
      <div className="space-grotesk text-sm opacity-60">{label}</div>
      <div className="space-mono max-w-full truncate text-xl font-bold lg:text-2xl">
        {value}
      </div>
      {note && <div className="space-mono text-xs opacity-60">{note}</div>}
    </div>
  );
}

// the visitor's portfolio as a bento grid: value over time and the headline numbers, holdings beside
// the genre split, then royalties, recent activity and a watchlist. all of it is mock data, invented to
// show the look, except the cash, which is the visitor's real (fake) balance
export function PortfolioPage() {
  const { user } = useDemoAuth();
  if (!user) return null;

  const totalValue = holdings.reduce((sum, h) => sum + h.valueInDollars, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.costInDollars, 0);
  const totalGain = totalValue - totalCost;
  const totalRoyalties = holdings.reduce(
    (sum, h) => sum + h.royaltiesInDollars,
    0,
  );
  const cash = user.liquidInCentsInUsd / 100;

  // every genre group, largest first; the ones with no holdings stay at 0%
  const allocation = genreGroups
    .map((group) => {
      const value = holdings
        .filter((h) => h.genreGroup === group)
        .reduce((sum, h) => sum + h.valueInDollars, 0);
      return { group, value, share: (value / totalValue) * 100 };
    })
    .sort((a, b) => b.value - a.value);
  const largestShare = allocation[0]?.share ?? 0;

  const npcNames = new Map(dummyArtists2026.map((a) => [a.id, a.name]));
  const watchlist = watchlistArtistIds.flatMap((id) => {
    const stats = leaderboardStats.find((s) => s.artistId === id);
    return stats ? [{ id, name: npcNames.get(id) ?? id, stats }] : [];
  });

  return (
    <div className="portfolio-container grid w-full grid-cols-1 content-start border md:grid-cols-6 lg:grid-cols-12">
      <BentoCell
        title="Portfolio Value"
        aside="Dec 2025 – Nov 2026"
        className="md:col-span-6 lg:col-span-8"
      >
        <div className="mb-(--standard-space) flex flex-wrap items-baseline gap-x-(--standard-space) gap-y-1">
          <div className="space-mono text-4xl font-bold tracking-tight">
            {formatCurrency(totalValue)}
          </div>
          <div
            className={`space-mono text-sm font-bold ${gainClass(totalGain)}`}
          >
            {signedCurrency(totalGain)} (
            {signedPercent((totalGain / totalCost) * 100)})
            <span className="ml-1 font-normal opacity-70">all time</span>
          </div>
        </div>
        <PortfolioValueChart points={portfolioValueHistory} />
      </BentoCell>

      <div className="grid grid-cols-2 md:col-span-6 md:grid-cols-4 lg:col-span-4 lg:grid-cols-2">
        <StatTile
          label="Cash Available"
          value={formatCurrency(cash)}
          note="ready to invest"
        />
        <StatTile
          label="Invested"
          value={formatCurrency(totalCost)}
          note={`${holdings.length} projects`}
        />
        <StatTile
          label="Royalties Earned"
          value={formatCurrency(totalRoyalties)}
          note="all time"
        />
        <StatTile
          label="Next Payout"
          value={shortDate(nextPayout.date)}
          note={`est. ${formatCurrency(nextPayout.estimateInDollars)}`}
        />
      </div>

      <BentoCell
        title="Holdings"
        aside={`${holdings.length} projects`}
        className="md:col-span-6 lg:col-span-8"
        bodyClassName="overflow-x-auto"
      >
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="space-grotesk border-b text-left text-xs uppercase opacity-60">
              <th className="px-(--standard-space) py-(--standard-space-half) font-normal">
                Project
              </th>
              <th className="px-(--standard-space-half) text-right font-normal">
                Shares
              </th>
              <th className="px-(--standard-space-half) text-right font-normal">
                Cost
              </th>
              <th className="px-(--standard-space-half) text-right font-normal">
                Value
              </th>
              <th className="px-(--standard-space-half) text-right font-normal">
                Return
              </th>
              <th className="px-(--standard-space) text-right font-normal">
                Royalties
              </th>
            </tr>
          </thead>
          <tbody className="space-mono">
            {holdings.map((h) => {
              const gain = h.valueInDollars - h.costInDollars;
              return (
                <tr
                  key={h.id}
                  className="border-b last:border-b-0 hover:bg-(--surface-tertiary-feather)"
                >
                  <td className="px-(--standard-space) py-(--standard-space-half)">
                    <div className="flex min-w-0 items-center gap-(--standard-space-half)">
                      <div className="h-10 w-10 shrink-0 border">
                        <ImageContainer
                          srcSet={h.coverSrc}
                          description={`${h.title} cover art`}
                        />
                      </div>
                      <div className="min-w-0 font-sans">
                        <div className="space-grotesk truncate font-semibold">
                          {h.title}
                        </div>
                        <div className="space-grotesk truncate text-xs opacity-60">
                          {h.artistName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-(--standard-space-half) text-right">
                    {h.shares.toLocaleString()}
                  </td>
                  <td className="px-(--standard-space-half) text-right">
                    {formatCurrency(h.costInDollars)}
                  </td>
                  <td className="px-(--standard-space-half) text-right">
                    {formatCurrency(h.valueInDollars)}
                  </td>
                  <td
                    className={`px-(--standard-space-half) text-right font-bold ${gainClass(gain)}`}
                  >
                    {signedPercent((gain / h.costInDollars) * 100)}
                  </td>
                  <td className="px-(--standard-space) text-right">
                    {formatCurrency(h.royaltiesInDollars)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </BentoCell>

      <BentoCell
        title="Allocation"
        aside="by genre"
        className="md:col-span-3 lg:col-span-4"
      >
        <ol className="flex flex-col gap-(--standard-space)">
          {allocation.map(({ group, value, share }) => (
            <li key={group} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate">{group}</span>
                <span className="space-mono shrink-0">
                  {share.toFixed(1)}%
                  <span className="ml-2 text-xs opacity-60">
                    {formatCurrency(value)}
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-(--surface-tertiary-feather)">
                <div
                  className="h-full rounded-r-[4px] bg-(--surface-secondary)"
                  style={{ width: `${(share / largestShare) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      </BentoCell>

      <BentoCell
        title="Closing Soon"
        aside="open rounds"
        className="md:col-span-3 lg:col-span-4"
        bodyClassName=""
      >
        <ul>
          {closingSoon.map((round) => {
            const funded = (round.raisedInDollars / round.goalInDollars) * 100;
            return (
              <li
                key={round.id}
                className="flex items-center gap-(--standard-space-half) border-b px-(--standard-space) py-(--standard-space-half) last:border-b-0"
              >
                <div className="h-10 w-10 shrink-0 border">
                  <ImageContainer
                    srcSet={round.coverSrc}
                    description={`${round.title} cover art`}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="truncate text-sm font-semibold">
                      {round.title}
                    </div>
                    <div className="space-mono shrink-0 text-xs opacity-60">
                      {shortDate(round.closesAt)}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-(--surface-primary)">
                    <div
                      className="h-full bg-(--surface-tertiary) outline-2 outline-(--surface-base)"
                      style={{ width: `${funded}%` }}
                    />
                  </div>
                  <div className="flex justify-between gap-2 text-xs opacity-60">
                    <span className="truncate">{round.artistName}</span>
                    <span className="space-mono shrink-0">
                      {Math.floor(funded)}% of{" "}
                      {formatCurrency(round.goalInDollars)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </BentoCell>

      <BentoCell
        title="Recent Activity"
        className="md:col-span-3 lg:col-span-4"
        bodyClassName=""
      >
        <ul>
          {recentActivity.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-(--standard-space-half) border-b px-(--standard-space) py-(--standard-space-half) last:border-b-0"
            >
              <div className="h-5 w-5 shrink-0 opacity-70">
                <SvgIcon iconName={ACTIVITY_ICON[a.kind]} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{a.title}</div>
                <div className="truncate text-xs opacity-60">{a.detail}</div>
              </div>
              <div className="space-mono shrink-0 text-right text-xs">
                {a.amountInDollars !== undefined && (
                  <div className={`font-bold ${gainClass(a.amountInDollars)}`}>
                    {signedCurrency(a.amountInDollars)}
                  </div>
                )}
                <div className="opacity-60">{shortDate(a.date)}</div>
              </div>
            </li>
          ))}
        </ul>
      </BentoCell>

      <BentoCell
        title="Watchlist"
        aside="24h"
        className="md:col-span-3 lg:col-span-4"
        bodyClassName=""
      >
        <ul>
          {watchlist.map(({ id, name, stats }) => {
            const { number, suffix } = compactNumber(stats.marketCapInDollars);
            const change = stats.priceChange24hPercent;
            return (
              <li
                key={id}
                className="flex items-center justify-between gap-(--standard-space-half) border-b px-(--standard-space) py-(--standard-space-half) last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{name}</div>
                  <div className="space-mono text-xs opacity-60">
                    ${number}
                    {suffix} cap
                  </div>
                </div>
                <div
                  className={`space-mono flex shrink-0 items-center gap-1 text-sm font-bold ${gainClass(change)}`}
                >
                  <div className="h-3.5 w-3.5">
                    <SvgIcon
                      iconName={change < 0 ? "arrow-down" : "arrow-up"}
                    />
                  </div>
                  {signedPercent(change)}
                </div>
              </li>
            );
          })}
        </ul>
      </BentoCell>
    </div>
  );
}
