import type { ProjectInterface, ProjectType } from "../types";
import { DEMO_CURRENT_USER_ID, moindiDemoUsers } from "./users";

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
  // the visitor's own offering, shown on their profile. kept out of explore, so they aren't offered their own shares
  {
    ...placeholderProject(
      DEMO_CURRENT_USER_ID,
      "Echos in Amber",
      "album",
      ["Jazz", "Lo-Fi"],
      20000,
      4200,
      6000,
    ),
    description:
      "A debut album recorded entirely between market open and close. Eleven tracks of slow, patient jazz " +
      "built around one idea: the best returns come to whoever waits longest. Side A is all upright bass " +
      "and brushed snare, written over a year of morning walks past the same bank. Side B speeds up, " +
      "trading the long holds for short, restless loops sampled from old earnings calls. Backers get a " +
      "share of streaming and sales revenue for the life of the record, plus their name in the liner " +
      'notes under "Early Investors". Funds go to mixing, mastering, and a small vinyl pressing.',
    public: false,
    heroSrcSet: "/moindi/demo/projects/defaultproject.webp",
  },
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
