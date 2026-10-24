export type Socials = Record<
  | "applemusic"
  | "facebook"
  | "instagram"
  | "personal"
  | "soundcloud"
  | "spotify"
  | "youtube",
  string
>;

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  favorites: string[];
  following: string[];
  address: {
    countryCode: string; // ISO 3166-1 alpha-2 country code
    postalCode: string; // zip code in US, postal code in Canada, etc.
    state: string;
    city: string;
    lat: number;
    lng: number;
    hash: string;
  };
  currentProject: string | null;
  socials: Socials;
  profileSrcSet: string;
  bannerSrcSet: string;
  displayName: string;
  badges: string[];
  isArtist: boolean;
  stripeConnectId?: string; // for creators
  stripeConnectReady?: boolean;
  stripeCustomerId?: string; // for customer billing/portal access
  earningsTotalInCents: number;
  earningsAvailableInCents: number;
  earningsPaidOutInCents: number;
  releasesSoldCount: number;
  productsSoldCount: number;
  isFeatured: boolean;
  commentCredits: number;
  profileViewsCount: number;
  totalLikesReceived: number;
  searchable: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface UserStreak {
  id: string;
  currentStreak: number;
  maxStreak: number;
  lastActive: string;
  streak: string[];
}
