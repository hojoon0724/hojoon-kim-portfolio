// -- contact types ---------------------------------------------------
export type MembershipTier = {
  order: number;
  name: "Voyager" | "Cassini" | "Gemini" | "Member" | "Small Donor";
  benefits: string[];
};

export const CONTACT_CATEGORIES = {
  leadership: ["Co-Founder", "Board", "Advisor"],
  team: [
    "Staff",
    "Program Manager",
    "Intern",
    "Production",
    "Sound / Recording",
  ],
  artists: ["Musician", "Composer", "Local Collaborator"],
  supporters: [
    "VIP",
    "Founding Member",
    "Member",
    "New Member",
    "Sponsor",
    "Donor",
    "Community Ally",
  ],
  prospects: [
    "Potential Donor",
    "Potential Community Ally",
    "Potential Community Collaborator",
  ],
  venuesAndLogistics: [
    "Venue Host",
    "Venue Staff",
    "Rehearsal Space",
    "Musician Housing",
    "Event Supplies",
  ],
} as const;

export type ContactCategoryGroup = keyof typeof CONTACT_CATEGORIES;
export type ContactCategory =
  (typeof CONTACT_CATEGORIES)[ContactCategoryGroup][number];

export const INSTRUMENT_CATEGORIES = {
  strings: ["Violin", "Viola", "Cello", "Double Bass", "Harp", "Guitar"],
  woodwinds: ["Flute", "Oboe", "Clarinet", "Bassoon", "Saxophone"],
  brass: ["Trumpet", "Trombone", "French Horn", "Tuba"],
  percussion: ["Percussion", "Drum Set"],
  keyboard: ["Piano"],
  voice: ["Soprano", "Alto", "Tenor", "Bass"],
} as const;
export type InstrumentCategoryGroup = keyof typeof INSTRUMENT_CATEGORIES;
export type InstrumentCategory =
  (typeof INSTRUMENT_CATEGORIES)[InstrumentCategoryGroup][number];

export type Contact = {
  id: string; // must be unique
  // get id() {
  //   const name = [this.firstName, this.middleName, this.lastName]
  //     .filter(Boolean)
  //     .join("-");
  //   return name || this.organization;
  // },
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  spouse: string | null; // id of the contact's spouse if any

  organization: string | null;
  mailingAddress: string | null;
  generalLocation: {
    city: string | null;
    state: string | null;
    country: string | null;
  };
  phone: string | null;
  email: string | null;
  category: ContactCategory;

  venue: string | null; // venueId of the venue this contact is associated with
  instrument: InstrumentCategory | null;
  hiredFor: string[]; // list of event ids
  dietaryRestrictions: string | null;
  tShirtSize: string | null;
  instagram: string | null;

  membership: {
    foundingMember: boolean;
    history: {
      seasonId: string;
      membershipTier: MembershipTier;
      status: string;
    }[];
  };

  notes: string | null;
};

// -- contact types ---------------------------------------------------
// -
// -- season types ----------------------------------------------------

export type Season = {
  id: string; // ${this.seasonNumber}-${this.half.toLowerCase().replace(" / ", "-")}
  half: "Fall / Winter" | "Spring / Summer";
  seasonNumber: string; // 2 digits
  year: string;
  events: string[]; // event ids
};

// -- season types ----------------------------------------------------
// --
// -- event types -----------------------------------------------------

export type RcnmEvent = {
  id: string;
  // e.g. 02-01-0-sample-event
  // get id() {
  //   const slug = this.title
  //     .toLowerCase()
  //     .replace(/[^a-z0-9]+/g, "-")
  //     .replace(/^-+|-+$/g, "");
  //   return `${this.season}-${this.eventNumber}-${this.eventStage}-${slug}`;
  // },
  season: string; // season.seasonNumber
  eventNumber: string; // 2 digits
  eventStage: 0 | 1 | 2 | 3;
  title: string;
  eventDate: string;
  eventTime: string;
  venueId: string;
  musicians: string[]; // contact ids
  staff: string[]; // contact ids
  composers: string[]; // contact ids of the composers if any
  repertoire: {
    repertoireId: string; // repertoire id
    isCommission: boolean;
    commissionText: string | null;
    isPremiere: boolean;
    premiereText: string | null;
  }[];
  status: "Idea" | "Planning" | "Locked" | "Finished" | "Delayed";
  description: string;
  notes: string;
};

// -- event types ---------------------------------------------------
// --
// -- engagement types ----------------------------------------------

export type Engagement = {
  contactId: string;
  eventId: string;
  role: "Musician" | "Staff" | "Composer";
  instrument: InstrumentCategory | null;
  fee: number | null;
  ledgerEntryId: string | null; // ledger entry id associated with this engagement
  status: "Invited" | "Confirmed" | "Declined";
  needsHousing: boolean;
  housingContactId: string[]; // contact id for housing arrangements
  needsTravel: boolean;
};

// -- engagement types ----------------------------------------------
// --
// -- repertoire types ----------------------------------------------

export type Repertoire = {
  id: string; // ${this.composer}-${this.title}
  title: string;
  composer: string; // contact.id
  year: string;
  duration: string;
  instrumentation: string[];
  alternativeInstrumentation: string[];
  ensembleSize: string; // 1 through 11, 12+, flexible, open
  inEvents: string[]; // event ids
  recordings: string[]; // recording urls
  notes: string;
};

// -- repertoire types ----------------------------------------------
// --
// -- finance types -------------------------------------------------

export const LEDGER_ENTRY_CATEGORIES = {
  contributions: ["Donation", "Grant"],
  personnel: ["Artist Fees", "Staff Fees", "Staff Salary", "Commission"],
  travel: ["Flights", "Car", "Other Travel"],
  production: [
    "Venue",
    "Sound / Tech",
    "Gear Rental",
    "Instruments",
    "Score Music",
    "Media Production",
  ],
  hospitality: ["Event Supplies", "Food", "Beverage"],
  marketing: ["Marketing", "Printing"],
  operations: ["Operational", "CC Processing Fees", "Reimbursement"],
  other: ["Miscellaneous", "Tickets", "Merchandise"],
} as const;

export type LedgerEntryCategoryGroup = keyof typeof LEDGER_ENTRY_CATEGORIES;
export type LedgerEntryCategory =
  (typeof LEDGER_ENTRY_CATEGORIES)[LedgerEntryCategoryGroup][number];

export type LedgerEntry = {
  id: string;
  amount: number;
  type: "Income" | "Expense"; // indicates whether the ledger entry is an income or expense
  contact: string; // contact id
  date: string;
  seasonId: string | null; // season id
  eventId: string | null; // event id
  status: "To Process" | "Posted" | "Projection";
  description: string  | null;
  category: LedgerEntryCategory;
  attachment: string; // attachment file path or URL
  notes: string;
};

// -- finance types -------------------------------------------------
// --
// -- venue types ---------------------------------------------------

export type Venue = {
  id: string; // name kebab case
  name: string; // must be unique
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact: string[]; // contact id
  inEvents: string[]; // event ids
  website: string; // website URL
  capacity: number;
  photos: string[]; // photo file paths or URLs
  notes: string;
};
