export type ProjectType = "single" | "album" | "other";

export type ProjectStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "live"
  | "completed"
  | "cancelled";

export interface ProjectInterface {
  // these fields are auto-set from Firestore
  id: string;
  updatedAt: Date;

  creatorId: string;
  title: string;
  description: string;
  projectType: ProjectType;
  genres: string[];

  // these fields are editable by creator at /edit-project
  heroSrcSet: string;
  disabled: boolean;
  public: boolean;
  endDate: Date;
  projectGoal: number; // this is USD dollars. No cents
  availableShares: number; // this starts out at 100% of project goal and will decrease as shares are sold
  protectedShares: number; // these are shares that are reserved for the creator and cannot be sold
  soldShares: number;
  pendingShares: number;

  // these fields are set by admin or auto
  status: ProjectStatus;
  startDate?: Date; // exists once admin approves
  searchGenres: string[]; // alphanumeric, lowercase, no spaces

  // these fields are static
  totalShares: number; // this does not change, and can be used to compute %
  investors: string[]; // list of user ids
  createdAt: Date;
  creatorInfo: {
    displayName: string;
    profileSrcSet: string;
    geohash: string;
    lat: number;
    lng: number;
  };
}
