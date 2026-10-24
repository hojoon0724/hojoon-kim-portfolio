import type { ContentStatus } from "./common-types";
import type { TrackInterface } from "./track";

export type ReleaseType = "album" | "single" | "ep";

export interface ReleaseInterface {
  id: string;
  releaseType: ReleaseType;
  genre: string;
  releaseDate: Date;
  title: string;
  coverArt: string;
  artistName: string;
  artistId: string;
  tracks: TrackInterface[];
  downloadCount: number;
  availableCount: number | null; // null is infinite
  status: ContentStatus;
}

export interface ReleasePurchaseInterface {
  id: string;
  userId: string;
  releaseId: string;
  releaseName: string;
  releaseCoverArt: string;
  artistId: string;
  artistName: string;
  trackDetails: {
    trackName: string;
    trackUrl: string;
  }[];
  priceInCents: number;
  createdAt: Date;
  updatedAt: Date;
}
