import type { UserInterface } from "../types";

// the visitor's own account: whoever "logs in" to the demo becomes this user
export const DEMO_CURRENT_USER_ID = "demo-user";

export const moindiDemoUsers: UserInterface[] = [
  {
    id: DEMO_CURRENT_USER_ID,
    firstName: "Warren",
    lastName: "Buffer",
    bio: "",
    favorites: [],
    following: [],
    address: {
      countryCode: "US",
      postalCode: "10001",
      state: "NY",
      city: "New York",
      lat: 0,
      lng: 0,
      hash: "",
    },
    currentProject: `${DEMO_CURRENT_USER_ID}-project`,
    socials: {
      applemusic: "",
      facebook: "https://www.facebook.com/",
      instagram: "https://www.instagram.com/",
      personal: "https://hojoonkim.com/",
      soundcloud: "",
      spotify: "",
      youtube: "https://www.youtube.com/",
    },
    profileSrcSet: "/moindi/demo-assets/users/warren-buffer.png",
    bannerSrcSet: "/moindi/demo-assets/users/warren-buffer-banner.png",
    displayName: "Warren Buffer",
    badges: [],
    isArtist: true,
    earningsTotalInCents: 857459678,
    earningsAvailableInCents: 0,
    earningsPaidOutInCents: 0,
    releasesSoldCount: 0,
    productsSoldCount: 0,
    isFeatured: false,
    commentCredits: 0,
    profileViewsCount: 568795,
    totalLikesReceived: 78648,
    searchable: [],

    // fixed dates, so the server and client renders match
    // placeholders: DemoAuthProvider replaces both with the session's creation time
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    liquidInCentsInUsd: 10000000,
  },
  // placeholder artists, until the real dummy data replaces them
  placeholderArtist("artist-one", "Artist One", "Los Angeles", "CA", 1840),
  placeholderArtist("artist-two", "Artist Two", "Nashville", "TN", 1210),
  placeholderArtist("artist-three", "Artist Three", "Brooklyn", "NY", 2675),
  placeholderArtist("artist-four", "Artist Four", "Austin", "TX", 760),
];

// fills in everything a placeholder artist doesn't need to vary
function placeholderArtist(
  id: string,
  displayName: string,
  city: string,
  state: string,
  profileViewsCount: number,
): UserInterface {
  const [firstName, lastName] = displayName.split(" ");
  return {
    id,
    firstName,
    lastName,
    bio: "Placeholder artist bio.",
    favorites: [],
    following: [],
    address: {
      countryCode: "US",
      postalCode: "",
      state,
      city,
      lat: 0,
      lng: 0,
      hash: "",
    },
    currentProject: `${id}-project`,
    socials: {
      applemusic: "",
      facebook: "",
      instagram: "",
      personal: "",
      soundcloud: "",
      spotify: "",
      youtube: "",
    },
    profileSrcSet: "",
    bannerSrcSet: "",
    displayName,
    badges: [],
    isArtist: true,
    earningsTotalInCents: 0,
    earningsAvailableInCents: 0,
    earningsPaidOutInCents: 0,
    releasesSoldCount: 0,
    productsSoldCount: 0,
    isFeatured: false,
    commentCredits: 0,
    profileViewsCount,
    totalLikesReceived: 0,
    searchable: [],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    liquidInCentsInUsd: 0,
  };
}
