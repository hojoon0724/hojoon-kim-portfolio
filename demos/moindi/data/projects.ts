import type { ProjectInterface, ProjectType } from "../types";
import { moindiDemoUsers } from "./users";

// placeholder projects, one per placeholder artist, until the real dummy data replaces them.
// no images yet: ImageContainer shows an empty frame for a blank srcset
export const moindiDemoProjects: ProjectInterface[] = [
  placeholderProject(
    "artist-one",
    "Project One",
    "single",
    ["Pop"],
    10000,
    3500,
    2000,
  ),
  placeholderProject(
    "artist-two",
    "Project Two",
    "album",
    ["Country", "Folk"],
    25000,
    9000,
    5000,
  ),
  placeholderProject(
    "artist-three",
    "Project Three",
    "single",
    ["Hip Hop"],
    15000,
    11000,
    2500,
  ),
  placeholderProject(
    "artist-four",
    "Project Four",
    "other",
    ["Electronic"],
    5000,
    800,
    1000,
  ),
];

// shares are $1 each, so the goal is also the total share count
function placeholderProject(
  creatorId: string,
  title: string,
  projectType: ProjectType,
  genres: string[],
  projectGoal: number,
  soldShares: number,
  protectedShares: number,
): ProjectInterface {
  const creator = moindiDemoUsers.find((user) => user.id === creatorId)!;
  return {
    id: `${creatorId}-project`,
    updatedAt: new Date("2025-01-01"),
    creatorId,
    title,
    description: "Placeholder project description.",
    projectType,
    genres,
    heroSrcSet: "",
    disabled: false,
    public: true,
    endDate: new Date("2026-12-31"),
    projectGoal,
    availableShares: projectGoal - soldShares - protectedShares,
    protectedShares,
    soldShares,
    pendingShares: 0,
    status: "live",
    startDate: new Date("2025-01-01"),
    searchGenres: genres.map((genre) => genre.toLowerCase().replace(/\W/g, "")),
    totalShares: projectGoal,
    // one made-up buyer per $250 sold, so the leaderboard has buyer counts to rank
    investors: Array.from(
      { length: Math.round(soldShares / 250) },
      (_, i) => `${creatorId}-investor-${i}`,
    ),
    createdAt: new Date("2025-01-01"),
    creatorInfo: {
      displayName: creator.displayName,
      profileSrcSet: creator.profileSrcSet,
      geohash: "",
      lat: creator.address.lat,
      lng: creator.address.lng,
    },
  };
}
