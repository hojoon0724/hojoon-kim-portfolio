// the display-ready summary the database architecture section shows, written out as fixed values.
// it was calculated once from the other files in this folder and is no longer recalculated, so changing those files does not change it.
// money appears only as totals: there is no single ledger entry or individual fee in here.

export type DatabaseStory = {
  totals: {
    events: number;
    contacts: number;
    repertoire: number;
    venues: number;
    ledger: number;
  };
  eventCounts: { scheduled: number; planned: number };
  event: {
    id: string;
    season: string;
    eventNumber: string;
    eventStage: number;
    title: string;
    date: string;
    time: string;
    status: string;
    counts: { repertoire: number; musicians: number; staff: number };
  };
  venue: {
    id: string;
    name: string;
    location: string;
    otherEvents: string[];
  };
  program: {
    id: string;
    title: string;
    composerId: string;
    composer: string;
    year: string;
    duration: string;
    instrumentation: string[];
  }[];
  programMinutes: number;
  musicians: {
    id: string;
    name: string;
    instrument: string;
    concerts: number;
    alsoComposer: boolean;
  }[];
  crew: { id: string; name: string; role: string }[];
  ledger: {
    entries: number;
    total: number;
    groups: { name: string; entries: number; total: number }[];
  };
  questions: {
    question: string;
    answer: string;
    detail: string;
    tables: string[];
  }[];
  seasons: { season: string; year: string; events: number; entries: number }[];
};

export const databaseStory: DatabaseStory = {
  totals: {
    events: 72,
    contacts: 370,
    repertoire: 330,
    venues: 29,
    ledger: 1178,
  },
  eventCounts: {
    scheduled: 34,
    planned: 38,
  },
  event: {
    id: "03-03-2-liftoff",
    season: "03",
    eventNumber: "03",
    eventStage: 2,
    title: "Liftoff",
    date: "December 14, 2024",
    time: "7:30 PM",
    status: "Finished",
    counts: {
      repertoire: 8,
      musicians: 7,
      staff: 4,
    },
  },
  venue: {
    id: "avilution",
    name: "Avilution",
    location: "Huntsville, AL",
    otherEvents: [
      "The Fundraiser",
      "p=mv",
      "Chaos Menu",
      "Please Repeat The Question",
    ],
  },
  program: [
    {
      id: "chris-coletti-perpetual-motion",
      title: "Perpetual Motion",
      composerId: "chris-coletti",
      composer: "Chris Coletti",
      year: "2024",
      duration: "",
      instrumentation: [
        "Cello",
        "Clarinet",
        "Flute",
        "Percussion",
        "Trumpet",
        "Viola",
        "Violin",
      ],
    },
    {
      id: "jessica-meyer-i-only-speak-of-the-sun",
      title: "I Only Speak of the Sun",
      composerId: "jessica-meyer",
      composer: "Jessica Meyer",
      year: "2018",
      duration: "11 min",
      instrumentation: ["Cello", "Viola", "Violin"],
    },
    {
      id: "christian-quinones-se-oyen-los-lamentos-por-doquier",
      title: "SE OYEN LOS LAMENTOS POR DOQUIER",
      composerId: "christian-quinones",
      composer: "Christian Quinones",
      year: "2021",
      duration: "7 min",
      instrumentation: ["Flute", "Percussion"],
    },
    {
      id: "scott-lee-liftoff",
      title: "Liftoff",
      composerId: "scott-lee",
      composer: "Scott Lee",
      year: "2014",
      duration: "17 min",
      instrumentation: [
        "Cello",
        "Clarinet",
        "Flute",
        "Trumpet",
        "Viola",
        "Violin",
      ],
    },
    {
      id: "paul-wiancko-american-haiku",
      title: "American Haiku",
      composerId: "paul-wiancko",
      composer: "Paul Wiancko",
      year: "2015",
      duration: "10 min",
      instrumentation: ["Cello", "Viola"],
    },
    {
      id: "kevin-puts-and-legions-will-rise",
      title: "And Legions Will Rise",
      composerId: "kevin-puts",
      composer: "Kevin Puts",
      year: "2001",
      duration: "17 min",
      instrumentation: ["Clarinet", "Percussion", "Violin"],
    },
    {
      id: "judd-greenstein-together",
      title: "Together",
      composerId: "judd-greenstein",
      composer: "Judd Greenstein",
      year: "2022",
      duration: "14 min",
      instrumentation: [
        "Cello",
        "Clarinet",
        "Flute",
        "Trumpet",
        "Viola",
        "Violin",
      ],
    },
    {
      id: "chris-coletti-annual-holiday-arrangement",
      title: "Annual Holiday Arrangement",
      composerId: "chris-coletti",
      composer: "Chris Coletti",
      year: "2024",
      duration: "3 min",
      instrumentation: [
        "Cello",
        "Clarinet",
        "Flute",
        "Percussion",
        "Trumpet",
        "Viola",
        "Violin",
      ],
    },
  ],
  programMinutes: 79,
  musicians: [
    {
      id: "jessica-meyer",
      name: "Jessica Meyer",
      instrument: "Viola",
      concerts: 2,
      alsoComposer: true,
    },
    {
      id: "chris-coletti",
      name: "Chris Coletti",
      instrument: "Trumpet",
      concerts: 6,
      alsoComposer: true,
    },
    {
      id: "james-kim",
      name: "James Kim",
      instrument: "Cello",
      concerts: 2,
      alsoComposer: false,
    },
    {
      id: "constance-volk",
      name: "Constance Volk",
      instrument: "Flute",
      concerts: 2,
      alsoComposer: false,
    },
    {
      id: "kari-landry",
      name: "Kari Landry",
      instrument: "Clarinet",
      concerts: 2,
      alsoComposer: false,
    },
    {
      id: "samantha-bennett",
      name: "Samantha Bennett",
      instrument: "Violin",
      concerts: 3,
      alsoComposer: false,
    },
    {
      id: "benjy-krauss",
      name: "Benjy Krauss",
      instrument: "Percussion",
      concerts: 4,
      alsoComposer: false,
    },
  ],
  crew: [
    {
      id: "hojoon-kim",
      name: "Hojoon Kim",
      role: "Co-Founder",
    },
    {
      id: "sean-ritenauer",
      name: "Sean Ritenauer",
      role: "Co-Founder",
    },
    {
      id: "hsuan-fong-chen",
      name: "Hsuan-Fong Chen",
      role: "Production",
    },
    {
      id: "sage-prescott",
      name: "Sage Prescott",
      role: "Staff",
    },
  ],
  ledger: {
    entries: 104,
    total: 27511.73,
    groups: [
      {
        name: "Artists and crew",
        entries: 13,
        total: 10450,
      },
      {
        name: "Food and hospitality",
        entries: 30,
        total: 6020.600000000001,
      },
      {
        name: "Travel",
        entries: 25,
        total: 5995.03,
      },
      {
        name: "Production",
        entries: 9,
        total: 4218.25,
      },
      {
        name: "Other",
        entries: 4,
        total: 492.55999999999995,
      },
      {
        name: "Marketing",
        entries: 2,
        total: 335.28999999999996,
      },
    ],
  },
  questions: [
    {
      question: "Which musicians come back?",
      answer: "29 of 72",
      detail: "musicians have played more than one concert",
      tables: ["contacts", "events"],
    },
    {
      question: "What does a full concert cost?",
      answer: "$22,283",
      detail: "average across 12 stage-2 concerts",
      tables: ["events", "ledger"],
    },
    {
      question: "Which room do we return to most?",
      answer: "7 events",
      detail: "at Stove House - The Electric Belle",
      tables: ["venues", "events"],
    },
    {
      question: "How much music have we programmed?",
      answer: "16 hours",
      detail: "126 works by 70 composers",
      tables: ["repertoire", "events", "contacts"],
    },
  ],
  seasons: [
    {
      season: "00",
      year: "2021",
      events: 1,
      entries: 20,
    },
    {
      season: "01",
      year: "2022",
      events: 7,
      entries: 187,
    },
    {
      season: "02",
      year: "2023",
      events: 6,
      entries: 202,
    },
    {
      season: "03",
      year: "2024",
      events: 6,
      entries: 312,
    },
    {
      season: "04",
      year: "2025",
      events: 8,
      entries: 339,
    },
    {
      season: "05",
      year: "2026",
      events: 6,
      entries: 113,
    },
  ],
};
