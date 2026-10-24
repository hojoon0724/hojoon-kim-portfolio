import type { UserInterface } from "../types";

// the visitor's own account: whoever "logs in" to the demo becomes this user
export const DEMO_CURRENT_USER_ID = "demo-user";

export const moindiDemoUsers: UserInterface[] = [
  {
    id: DEMO_CURRENT_USER_ID,
    firstName: "Demo",
    lastName: "Listener",
    bio: "",
    favorites: [],
    following: [],
    address: {
      countryCode: "US",
      postalCode: "",
      state: "",
      city: "",
      lat: 0,
      lng: 0,
      hash: "",
    },
    currentProject: null,
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
    displayName: "Demo Listener",
    badges: [],
    isArtist: false,
    earningsTotalInCents: 0,
    earningsAvailableInCents: 0,
    earningsPaidOutInCents: 0,
    releasesSoldCount: 0,
    productsSoldCount: 0,
    isFeatured: false,
    commentCredits: 0,
    profileViewsCount: 0,
    totalLikesReceived: 0,
    searchable: [],

    // fixed dates, so the server and client renders match
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];
