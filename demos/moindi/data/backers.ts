import type { ProjectInterface } from "../types";
import { dummyArtists2026 } from "./npc-data";

export interface Backer {
  id: string;
  name: string;
  photoSrc: string;
}

// a project's recent backers, drawn from the npc artists. which ones depends on the project id, so it's
// stable between renders, and there are never more than the project has investors
export function recentBackers(project: ProjectInterface, count = 12): Backer[] {
  let offset = 0;
  for (const char of project.id)
    offset = (offset * 31 + char.charCodeAt(0)) >>> 0;

  const length = Math.min(
    count,
    project.investors.length,
    dummyArtists2026.length,
  );
  return Array.from({ length }, (_, i) => {
    const artist = dummyArtists2026[(offset + i) % dummyArtists2026.length];
    return {
      id: artist.id,
      name: artist.name,
      photoSrc: `/moindi/demo/aux-user-profile-pictures/${artist.id}.webp`,
    };
  });
}
