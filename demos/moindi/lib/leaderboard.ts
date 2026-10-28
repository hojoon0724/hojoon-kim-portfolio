import { moindiDemoProjects } from "@/demos/moindi/data/projects";
import { moindiDemoUsers } from "@/demos/moindi/data/users";
import type {
  ChartSeriesItem,
  ColorTypes,
  FormatTypes,
} from "@/demos/moindi/types";

export interface LeaderboardChart {
  title: string;
  items: ChartSeriesItem[];
  format: FormatTypes;
  color: ColorTypes;
}

// ranks artists by a value, scaled against the top one, the way the original's leaderboard service did
function rank(values: { label: string; count: number }[]): ChartSeriesItem[] {
  const maxCount = Math.max(0, ...values.map((value) => value.count));
  return values
    .filter((value) => value.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((value, index) => ({ ...value, maxCount, specialRank: index + 1 }));
}

// the leaderboard, worked out from the demo data instead of the original's backend
export function getLeaderboard(): LeaderboardChart[] {
  const artists = moindiDemoUsers.filter((user) => user.isArtist);
  const projectsBy = (artistId: string) =>
    moindiDemoProjects.filter((project) => project.creatorId === artistId);

  return [
    {
      title: "Top by Revenue",
      format: "currency",
      color: "primary",
      // shares are $1 each
      items: rank(
        artists.map((artist) => ({
          label: artist.displayName,
          count: projectsBy(artist.id).reduce(
            (sum, p) => sum + p.soldShares,
            0,
          ),
        })),
      ),
    },
    {
      title: "Top by Buyers",
      format: "string",
      color: "secondary",
      items: rank(
        artists.map((artist) => ({
          label: artist.displayName,
          count: new Set(projectsBy(artist.id).flatMap((p) => p.investors))
            .size,
        })),
      ),
    },
    {
      title: "Top by Profile Views",
      format: "string",
      color: "tertiary",
      items: rank(
        artists.map((artist) => ({
          label: artist.displayName,
          count: artist.profileViewsCount,
        })),
      ),
    },
  ];
}
