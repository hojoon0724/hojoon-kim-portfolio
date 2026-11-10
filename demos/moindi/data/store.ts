import type {
  ProductInterface,
  ReleaseInterface,
  ReleaseType,
} from "../types";
import { dummyArtists2026 } from "./npc-data";
import { coreUsers } from "./reference-core-users";

const ASSETS = "/moindi/demo";

// a stable stand-in for a random number, so the server and client renders agree
function seededNumber(seed: string, min: number, max: number) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return min + (hash % (max - min + 1));
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// the core artists' genres, which the reference data only describes in their bios
const coreGenres: Record<string, string> = {
  lunaveyne: "Indie Electronic",
  zaylencroix: "R&B",
  kanevercetti: "Hip-Hop",
  oliverhayes: "Acoustic Pop",
};

// the reference data has no release dates. the core artists are the store's headliners,
// so their catalog is dated newest: one release a month back from oct 2026, artists taking turns
const coreReleaseLists = coreUsers.map((user) => [
  ...user.singles.map((release) => ({ ...release, type: "single" as const })),
  ...user.albums.map((release) => ({ ...release, type: "album" as const })),
]);

const coreReleases: ReleaseInterface[] = coreUsers.flatMap((user, userIndex) =>
  coreReleaseLists[userIndex].map((release, releaseIndex) => {
    const id = `${user.userId}-${slugify(release.title)}`;
    const monthsBack = releaseIndex * coreUsers.length + userIndex;
    return {
      id,
      releaseType: release.type,
      genre: coreGenres[user.userId] ?? "",
      releaseDate: new Date(Date.UTC(2026, 9 - monthsBack, 1, 12)),
      title: release.title,
      coverArt: release.coverUrl,
      artistName: user.name,
      artistId: user.userId,
      tracks: [],
      downloadCount: seededNumber(id, 40_000, 250_000),
      availableCount: null,
      status: "available",
    };
  }),
);

const npcReleases: ReleaseInterface[] = dummyArtists2026.flatMap((artist) =>
  artist.releases.map((release) => ({
    id: `${artist.id}-${release.id}`,
    releaseType: release.releaseType as ReleaseType,
    genre: release.genre,
    releaseDate: release.releaseDate,
    title: release.title,
    coverArt: `${ASSETS}/aux-releases/${artist.id}-${release.coverArt}.webp`,
    artistName: release.artistName,
    artistId: artist.id,
    tracks: release.tracks.map((track) => ({
      ...track,
      audioUrl: "",
      artistId: artist.id,
      releaseId: `${artist.id}-${release.id}`,
      uploadedAt: release.releaseDate,
    })),
    downloadCount: seededNumber(`${artist.id}-${release.id}`, 1_000, 180_000),
    availableCount: null,
    status: "available",
  })),
);

export const storeReleases = [...coreReleases, ...npcReleases];

export function recentReleases(count: number) {
  return storeReleases
    .toSorted((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime())
    .slice(0, count);
}

export function mostDownloadedReleases(count: number) {
  return storeReleases
    .toSorted((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, count);
}

export interface FeaturedArtist {
  id: string;
  name: string;
  bio: string;
  bannerSrc: string;
}

// the carousel's slides: the core artists, who are the only ones with a full bio and banner set
export const featuredArtists: FeaturedArtist[] = coreUsers.map((user) => ({
  id: user.userId,
  name: user.name,
  // the reference bios mark titles with *asterisks*, which would show up literally
  bio: user.bio.replace(/\*/g, ""),
  bannerSrc: user.bannerUrl,
}));

// the original's demo-products, with the store's product shots, split between the core artists
const productSeeds = [
  ["tshirt", "T-Shirt", 1999, "Soft cotton tee with the artist logo printed on the front."],
  ["hoodie", "Hoodie", 3999, "Heavyweight hoodie built for late-night studio sessions."],
  ["tour-poster", "Tour Poster", 999, "Limited run tour poster on matte archival stock."],
  ["vinyl", "Vinyl Record", 2999, "180g pressing featuring the full release and bonus track."],
  ["sample-lofi", "Sample Pack: Lo-Fi Beats (USB)", 2499, "Curated pack of lo-fi drum loops and melodic samples on a USB drive."],
  ["cassette", "Limited Edition Cassette", 1299, "Retro cassette release with exclusive demo tracks and hand-numbered sleeves."],
  ["loopkit-synth", "Loop Kit: Synth Waves (USB)", 1999, "200+ royalty-free synth loops and one-shots delivered on a flash drive."],
  ["autograph-poster", "Autographed Poster", 2999, "Poster signed by the artist, perfect for collectors and fans."],
  ["stickers", "Sticker Set", 499, "Set of 10 high-quality vinyl stickers featuring album artwork and logos."],
  ["midi-funk", "MIDI Pack: Funk Grooves (USB)", 1499, "Funky basslines, chord progressions, and drum patterns on a USB drive."],
  ["pins", "Enamel Pin Set", 999, "Set of 3 collectible enamel pins featuring the artist’s signature designs."],
  ["bandana", "Bandana", 1299, "Custom bandana with artist-themed print, made from soft cotton."],
] as const;

export const storeProducts: ProductInterface[] = productSeeds.map(
  ([slug, name, priceInCents, description], index) => {
    const artist = coreUsers[index % coreUsers.length];
    return {
      id: `product-${slug}`,
      name,
      description,
      priceInCents,
      status: "available",
      images: [`${ASSETS}/core-products/prod-${slug}.webp`],
      availableCount: null,
      artistId: artist.userId,
      artistName: artist.name,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
  },
);

export function getReleaseById(id: string) {
  return storeReleases.find((release) => release.id === id);
}
