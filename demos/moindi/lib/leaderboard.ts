import {
  leaderboardStats,
  type ArtistMarketStats,
} from "@/demos/moindi/data/leaderboard-stats";
import { dummyArtists2026 } from "@/demos/moindi/data/npc-data";
import { coreUsers } from "@/demos/moindi/data/reference-core-users";
import type {
  ChartSeriesItem,
  ColorTypes,
  FormatTypes,
} from "@/demos/moindi/types";

export interface LeaderboardChart {
  category: LeaderboardCategory;
  title: string;
  items: ChartSeriesItem[];
  format: FormatTypes;
  color: ColorTypes;
}

const CHART_LENGTH = 10;

const artistNames = new Map<string, string>([
  ...coreUsers.map((user) => [user.userId, user.name] as const),
  ...dummyArtists2026.map((artist) => [artist.id, artist.name] as const),
]);

// ranks artists by one stat, scaled against the top one, the way the original's leaderboard service did.
// artists at zero or below (a falling share price, say) are left off
function rank(stat: keyof Omit<ArtistMarketStats, "artistId">) {
  const ranked = leaderboardStats
    .filter((stats) => stats[stat] > 0)
    .toSorted((a, b) => b[stat] - a[stat])
    .slice(0, CHART_LENGTH);
  const maxCount = ranked[0]?.[stat] ?? 0;

  return ranked.map(
    (stats, index): ChartSeriesItem => ({
      label: artistNames.get(stats.artistId) ?? stats.artistId,
      count: stats[stat],
      maxCount,
      specialRank: index + 1,
    }),
  );
}

// three categories of three charts. the color says which category a chart is in:
// market in moindi's orange, since investing is the core of it, streaming in blue, earnings in gray
// (the page lists the categories in this order)
export const LEADERBOARD_CATEGORY_COLORS = {
  Market: "primary",
  Streaming: "secondary",
  Earnings: "tertiary",
} as const satisfies Record<string, ColorTypes>;

export type LeaderboardCategory = keyof typeof LEADERBOARD_CATEGORY_COLORS;

const charts: {
  category: LeaderboardCategory;
  title: string;
  format: FormatTypes;
  stat: keyof Omit<ArtistMarketStats, "artistId">;
}[] = [
  {
    category: "Market",
    title: "Top by Market Cap",
    format: "currency",
    stat: "marketCapInDollars",
  },
  {
    category: "Market",
    title: "Top Gainers (24h)",
    format: "change",
    stat: "priceChange24hPercent",
  },
  {
    category: "Market",
    title: "Most Traded (24h)",
    format: "currency",
    stat: "tradingVolume24hInDollars",
  },
  {
    category: "Streaming",
    title: "Monthly Listeners",
    format: "string",
    stat: "monthlyListeners",
  },
  {
    category: "Streaming",
    title: "Total Streams",
    format: "string",
    stat: "totalStreams",
  },
  {
    category: "Streaming",
    title: "Playlist Adds",
    format: "string",
    stat: "playlistAdds",
  },
  {
    category: "Earnings",
    title: "Royalties Paid to Holders",
    format: "currency",
    stat: "royaltiesPaidInDollars",
  },
  {
    category: "Earnings",
    title: "Merch Sales",
    format: "currency",
    stat: "merchSalesInDollars",
  },
  {
    category: "Earnings",
    title: "Release Sales",
    format: "currency",
    stat: "releaseSalesInDollars",
  },
];

export function getLeaderboard(): LeaderboardChart[] {
  return charts.map(({ category, title, format, stat }) => ({
    category,
    title,
    format,
    color: LEADERBOARD_CATEGORY_COLORS[category],
    items: rank(stat),
  }));
}
