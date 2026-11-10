// mock numbers for the visitor's portfolio page. the original had no portfolio page to port, so this is
// invented to show the look: ten holdings across the core and npc artists, a year of value and royalties,
// recent activity and a watchlist. every dollar figure is whole dollars; shares were bought at $1 each

const ASSETS = "/moindi/demo";

export interface Holding {
  id: string;
  title: string;
  artistName: string;
  coverSrc: string;
  // the allocation chart's buckets
  genreGroup: string;
  shares: number;
  costInDollars: number;
  valueInDollars: number;
  royaltiesInDollars: number;
}

export const holdings: Holding[] = [
  {
    id: "kanevercetti-run-it-back",
    title: "Run It Back",
    artistName: "Kane Vercetti",
    coverSrc: `${ASSETS}/projects/kanevercettirunitback.webp`,
    genreGroup: "Hip-Hop & R&B",
    shares: 6_000,
    costInDollars: 6_000,
    valueInDollars: 8_940,
    royaltiesInDollars: 912,
  },
  {
    id: "zaylencroix-between-the-sheets",
    title: "Between the Sheets",
    artistName: "Zaylen Croix",
    coverSrc: `${ASSETS}/projects/zaylencroixbetweenthesheets.webp`,
    genreGroup: "Hip-Hop & R&B",
    shares: 5_000,
    costInDollars: 5_000,
    valueInDollars: 5_875,
    royaltiesInDollars: 640,
  },
  {
    id: "lil-circuit-loot-box-emotions",
    title: "Loot Box Emotions",
    artistName: "Lil Circuit",
    coverSrc: `${ASSETS}/aux-releases/lil-circuit-loot-box-emotions.webp`,
    genreGroup: "Hip-Hop & R&B",
    shares: 2_500,
    costInDollars: 2_500,
    valueInDollars: 5_210,
    royaltiesInDollars: 186,
  },
  {
    id: "chrome-magnolia-starlight-block-party",
    title: "Starlight Block Party",
    artistName: "Chrome Magnolia",
    coverSrc: `${ASSETS}/aux-releases/chrome-magnolia-starlight-block-party.webp`,
    genreGroup: "Funk & Electronic",
    shares: 4_000,
    costInDollars: 4_000,
    valueInDollars: 4_780,
    royaltiesInDollars: 402,
  },
  {
    id: "oliverhayes-better-with-time",
    title: "Better With Time",
    artistName: "Oliver Hayes",
    coverSrc: `${ASSETS}/projects/oliverhayesbetterwithtime.webp`,
    genreGroup: "Pop & Acoustic",
    shares: 4_000,
    costInDollars: 4_000,
    valueInDollars: 4_310,
    royaltiesInDollars: 488,
  },
  {
    id: "neon-harbor-rooftop-signals",
    title: "Rooftop Signals",
    artistName: "Neon Harbor",
    coverSrc: `${ASSETS}/aux-releases/neon-harbor-rooftop-signals.webp`,
    genreGroup: "Funk & Electronic",
    shares: 3_000,
    costInDollars: 3_000,
    valueInDollars: 3_620,
    royaltiesInDollars: 298,
  },
  {
    id: "threerivertrio-crossfade-dreams",
    title: "Crossfade Dreams",
    artistName: "Three River Trio",
    coverSrc: `${ASSETS}/projects/threerivertriocrossfadedreams.webp`,
    genreGroup: "Jazz & Classical",
    shares: 3_500,
    costInDollars: 3_500,
    valueInDollars: 3_185,
    royaltiesInDollars: 215,
  },
  {
    id: "riot-daisy-sugar-crash-anthem",
    title: "Sugar Crash Anthem",
    artistName: "Riot Daisy",
    coverSrc: `${ASSETS}/aux-releases/riot-daisy-sugar-crash-anthem.webp`,
    genreGroup: "Rock & Punk",
    shares: 2_000,
    costInDollars: 2_000,
    valueInDollars: 2_690,
    royaltiesInDollars: 121,
  },
  {
    id: "ghost-metro-subway-lanterns",
    title: "Subway Lanterns",
    artistName: "Ghost Metro",
    coverSrc: `${ASSETS}/aux-releases/ghost-metro-subway-lanterns.webp`,
    genreGroup: "Rock & Punk",
    shares: 2_450,
    costInDollars: 2_450,
    valueInDollars: 2_105,
    royaltiesInDollars: 133,
  },
  {
    id: "aria-sol-chambers-of-light",
    title: "Chambers of Light",
    artistName: "Aria Sol",
    coverSrc: `${ASSETS}/aux-releases/aria-sol-chambers-of-light.webp`,
    genreGroup: "Jazz & Classical",
    shares: 1_500,
    costInDollars: 1_500,
    valueInDollars: 1_560,
    royaltiesInDollars: 84,
  },
];

export interface MonthlyPoint {
  // the first of the month, utc
  month: Date;
  valueInDollars: number;
}

const month = (year: number, monthIndex: number) =>
  new Date(Date.UTC(year, monthIndex, 1));

// what the holdings were worth at each month's end, dec 2025 to nov 2026. it climbs as shares are bought
// and as they gain; the last point matches the holdings' current value
export const portfolioValueHistory: MonthlyPoint[] = [
  11_800, 14_250, 15_900, 19_400, 21_050, 24_800, 23_900, 28_600, 31_200,
  34_750, 38_900, 42_275,
].map((valueInDollars, i) => ({ month: month(2025, 11 + i), valueInDollars }));

// royalties paid out each month over the same year
export const monthlyRoyalties: MonthlyPoint[] = [
  82, 104, 131, 158, 197, 214, 240, 268, 301, 336, 389, 412,
].map((valueInDollars, i) => ({ month: month(2025, 11 + i), valueInDollars }));

export const nextPayout = {
  date: new Date(Date.UTC(2026, 11, 1)),
  estimateInDollars: 431,
};

export type ActivityKind = "buy" | "royalty" | "funded" | "release";

export interface Activity {
  id: string;
  kind: ActivityKind;
  date: Date;
  title: string;
  detail: string;
  // signed: negative is money out, positive is money in. events without money leave it off
  amountInDollars?: number;
}

export const recentActivity: Activity[] = [
  {
    id: "a1",
    kind: "royalty",
    date: new Date("2026-11-08T14:00:00Z"),
    title: "Royalty payout",
    detail: "Kane Vercetti · Run It Back",
    amountInDollars: 84.12,
  },
  {
    id: "a2",
    kind: "buy",
    date: new Date("2026-11-03T18:20:00Z"),
    title: "Bought 500 shares",
    detail: "Lil Circuit · Loot Box Emotions",
    amountInDollars: -500,
  },
  {
    id: "a3",
    kind: "royalty",
    date: new Date("2026-10-28T14:00:00Z"),
    title: "Royalty payout",
    detail: "Zaylen Croix · Between the Sheets",
    amountInDollars: 61.4,
  },
  {
    id: "a4",
    kind: "buy",
    date: new Date("2026-10-21T21:05:00Z"),
    title: "Bought 1,000 shares",
    detail: "Chrome Magnolia · Starlight Block Party",
    amountInDollars: -1_000,
  },
  {
    id: "a5",
    kind: "funded",
    date: new Date("2026-10-14T09:30:00Z"),
    title: "Project fully funded",
    detail: "Neon Harbor · Rooftop Signals",
  },
  {
    id: "a6",
    kind: "royalty",
    date: new Date("2026-10-09T14:00:00Z"),
    title: "Royalty payout",
    detail: "Oliver Hayes · Better With Time",
    amountInDollars: 47.85,
  },
  {
    id: "a7",
    kind: "buy",
    date: new Date("2026-09-30T16:45:00Z"),
    title: "Bought 2,450 shares",
    detail: "Ghost Metro · Subway Lanterns",
    amountInDollars: -2_450,
  },
  {
    id: "a8",
    kind: "release",
    date: new Date("2026-09-22T12:00:00Z"),
    title: "New release",
    detail: "Riot Daisy dropped Sugar Crash Anthem",
  },
];

// artists the visitor is watching but doesn't hold. their numbers come from the leaderboard stats
export const watchlistArtistIds = [
  "static-oracle",
  "luna-avery",
  "juniper-lane",
  "velvet-arcade",
  "devan-cole",
];

export interface OpenRound {
  id: string;
  title: string;
  artistName: string;
  coverSrc: string;
  raisedInDollars: number;
  goalInDollars: number;
  closesAt: Date;
}

// funding rounds the visitor hasn't backed that close within the next few weeks, soonest first
export const closingSoon: OpenRound[] = [
  {
    id: "static-oracle-machine-choir",
    title: "Machine Choir",
    artistName: "Static Oracle",
    coverSrc: `${ASSETS}/aux-releases/static-oracle-machine-choir.webp`,
    raisedInDollars: 13_420,
    goalInDollars: 15_000,
    closesAt: new Date(Date.UTC(2026, 10, 14)),
  },
  {
    id: "juniper-lane-nashville-cheat-codes",
    title: "Nashville Cheat Codes",
    artistName: "Juniper Lane",
    coverSrc: `${ASSETS}/aux-releases/juniper-lane-nashville-cheat-codes.webp`,
    raisedInDollars: 18_760,
    goalInDollars: 25_000,
    closesAt: new Date(Date.UTC(2026, 10, 19)),
  },
  {
    id: "mira-bloom-paper-planets",
    title: "Paper Planets",
    artistName: "Mira Bloom",
    coverSrc: `${ASSETS}/aux-releases/mira-bloom-paper-planets.webp`,
    raisedInDollars: 6_150,
    goalInDollars: 12_000,
    closesAt: new Date(Date.UTC(2026, 10, 24)),
  },
  {
    id: "velvet-arcade-future-echoes",
    title: "Future Echoes",
    artistName: "Velvet Arcade",
    coverSrc: `${ASSETS}/aux-releases/velvet-arcade-future-echoes.webp`,
    raisedInDollars: 9_880,
    goalInDollars: 10_000,
    closesAt: new Date(Date.UTC(2026, 11, 2)),
  },
  {
    id: "desert-radio-motel-sunsets",
    title: "Motel Sunsets",
    artistName: "Desert Radio",
    coverSrc: `${ASSETS}/aux-releases/desert-radio-motel-sunsets.webp`,
    raisedInDollars: 4_310,
    goalInDollars: 8_000,
    closesAt: new Date(Date.UTC(2026, 11, 6)),
  },
];

// every genre group the allocation chart lists, held or not, so the empty ones show at 0%
export const genreGroups = [
  "Hip-Hop & R&B",
  "Funk & Electronic",
  "Pop & Acoustic",
  "Jazz & Classical",
  "Rock & Punk",
  "Country & Folk",
  "Indie & Alternative",
  "Soul & Gospel",
  "Latin",
  "Metal",
];
