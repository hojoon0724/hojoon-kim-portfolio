import type { ReleaseInterface, ReleaseType } from "../types";
import { DEMO_CURRENT_USER_ID } from "./users";

// luna veyne's back catalog, newest first. no audio, so tracks stay empty
export const moindiDemoReleases: ReleaseInterface[] = [
  lunaRelease("neon-glow", "Neon Glow", "single", "Synth Pop", "2025-06-13"),
  lunaRelease(
    "driftcurrent",
    "Driftcurrent",
    "album",
    "Dream Pop",
    "2024-10-04",
  ),
  lunaRelease("glass-petals", "Glass Petals", "ep", "Indie Pop", "2024-03-22"),
  lunaRelease("farsighted", "Farsighted", "single", "Dream Pop", "2023-08-18"),
  lunaRelease("paper-wings", "Paper Wings", "ep", "Indie Folk", "2022-11-11"),
];

function lunaRelease(
  slug: string,
  title: string,
  releaseType: ReleaseType,
  genre: string,
  releaseDate: string,
): ReleaseInterface {
  return {
    id: `${DEMO_CURRENT_USER_ID}-release-${slug}`,
    releaseType,
    genre,
    releaseDate: new Date(releaseDate),
    title,
    coverArt: `/moindi/demo-assets/releases/lunaveyne_${slug}.png`,
    artistName: "Luna Veyne",
    artistId: DEMO_CURRENT_USER_ID,
    tracks: [],
    downloadCount: 0,
    availableCount: null,
    status: "available",
  };
}
