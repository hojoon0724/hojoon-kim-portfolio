import "server-only";

import { contactsMasked } from "@/data/rcnm-db-data-masked/contacts";
import { events } from "@/data/rcnm-db-data-masked/events";
import { ledgerMasked } from "@/data/rcnm-db-data-masked/ledger";
import { repertoire } from "@/data/rcnm-db-data-masked/repertoire";
import { totals as fullTotals } from "@/data/rcnm-db-data-masked/totals";
import { venues } from "@/data/rcnm-db-data-masked/venues";
import { LEDGER_ENTRY_CATEGORIES } from "@/types/rcnm-db-types";

// builds the small, display-ready summary the database story page shows.
// the table sizes and the per-season counts come from totals.ts, which is counted from the full data set.
// anything that names a person, a venue or a concert comes from the masked data.
// it runs on the server so the full data set never reaches the browser, and it only
// returns totals for money: no single ledger entry or individual fee leaves this file.

// the concert the story follows
const featuredEventId = "03-03-2-liftoff";
// the stage number of the full concerts, used for the average cost question
const fullConcertStage = 2;

type DataRecord = Record<string, unknown> & { id: string };

type EventRecord = DataRecord & {
  season: string;
  eventNumber: string;
  eventStage: number;
  title: string;
  eventDate: string;
  eventTime: string;
  venueId: string[];
  musicians: string[];
  staff: string[];
  repertoire: { repertoireId: string }[];
  status?: string;
};
type ContactRecord = DataRecord & {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  organization?: string;
  category: string[];
  instrument: string[];
};
type RepertoireRecord = DataRecord & {
  title: string;
  composer?: string;
  year?: string;
  duration?: string;
  instrumentation: string[];
};
type VenueRecord = DataRecord & {
  name: string;
  address?: { city?: string; state?: string };
};
type LedgerRecord = DataRecord & {
  amount?: number;
  type?: string;
  seasonId?: string;
  eventId?: string;
  category?: string;
};

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

const allEvents = events as EventRecord[];
const allContacts = contactsMasked as ContactRecord[];
const allRepertoire = repertoire as RepertoireRecord[];
const allVenues = venues as VenueRecord[];
const allLedger = ledgerMasked as LedgerRecord[];

const ledgerGroupLabels: Record<string, string> = {
  contributions: "Contributions",
  personnel: "Artists and crew",
  travel: "Travel",
  production: "Production",
  hospitality: "Food and hospitality",
  marketing: "Marketing",
  operations: "Operations",
  other: "Other",
};

function getContactName(id: string | undefined): string {
  const contact = allContacts.find((item) => item.id === id);
  if (!contact) return "Unknown";
  return (
    [contact.firstName, contact.middleName, contact.lastName]
      .filter(Boolean)
      .join(" ") ||
    contact.organization ||
    "Unknown"
  );
}

function getLedgerGroup(category: string | undefined): string {
  const group = Object.entries(LEDGER_ENTRY_CATEGORIES).find(([, categories]) =>
    (categories as readonly string[]).includes(category ?? ""),
  );
  return ledgerGroupLabels[group?.[0] ?? "other"];
}

function sumExpenses(entries: LedgerRecord[]): number {
  return entries
    .filter((entry) => entry.type === "Expense")
    .reduce((total, entry) => total + (entry.amount ?? 0), 0);
}

function formatDollars(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

// "2024-12-14" -> "December 14, 2024"
function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// "19:30" -> "7:30 PM"
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
}

function countMusicianConcerts(): Map<string, number> {
  const concerts = new Map<string, number>();
  for (const event of allEvents) {
    for (const id of event.musicians) {
      concerts.set(id, (concerts.get(id) ?? 0) + 1);
    }
  }
  return concerts;
}

export function getDatabaseStory(): DatabaseStory {
  const event = allEvents.find((item) => item.id === featuredEventId);
  if (!event) throw new Error(`Event not found: ${featuredEventId}`);

  const venue = allVenues.find((item) => item.id === event.venueId[0]);
  if (!venue) throw new Error(`Venue not found for ${featuredEventId}`);

  // repertoire, with each piece's composer looked up in contacts
  const program = event.repertoire.flatMap(({ repertoireId }) => {
    const piece = allRepertoire.find((item) => item.id === repertoireId);
    if (!piece) return [];
    return {
      id: piece.id,
      title: piece.title,
      composerId: piece.composer ?? "",
      composer: getContactName(piece.composer),
      year: piece.year ?? "",
      duration: piece.duration ?? "",
      instrumentation: piece.instrumentation,
    };
  });
  const composerIds = new Set(program.map((piece) => piece.composerId));

  // people
  const concertsByMusician = countMusicianConcerts();
  const musicians = event.musicians.map((id) => ({
    id,
    name: getContactName(id),
    instrument:
      allContacts.find((item) => item.id === id)?.instrument.join(", ") ?? "",
    concerts: concertsByMusician.get(id) ?? 0,
    alsoComposer: composerIds.has(id),
  }));
  const crew = event.staff.map((id) => {
    const categories =
      allContacts.find((item) => item.id === id)?.category ?? [];
    return {
      id,
      name: getContactName(id),
      role: categories.find((category) => category !== "Musician") ?? "Crew",
    };
  });

  // ledger: only group totals leave this function
  const eventLedger = allLedger.filter((entry) => entry.eventId === event.id);
  const groups = new Map<string, { entries: number; total: number }>();
  for (const entry of eventLedger) {
    if (entry.type !== "Expense") continue;
    const name = getLedgerGroup(entry.category);
    const group = groups.get(name) ?? { entries: 0, total: 0 };
    groups.set(name, {
      entries: group.entries + 1,
      total: group.total + (entry.amount ?? 0),
    });
  }

  // questions that need more than one table to answer
  const returning = [...concertsByMusician.values()].filter(
    (concerts) => concerts > 1,
  ).length;

  const fullConcertCosts = allEvents
    .filter(
      (item) =>
        item.eventStage === fullConcertStage && item.status === "Finished",
    )
    .map((item) =>
      sumExpenses(allLedger.filter((entry) => entry.eventId === item.id)),
    )
    .filter((cost) => cost > 0);
  const averageCost =
    fullConcertCosts.reduce((total, cost) => total + cost, 0) /
    Math.max(1, fullConcertCosts.length);

  const eventsByVenue = allVenues
    .map((item) => ({
      name: item.name,
      events: allEvents.filter((eventItem) =>
        eventItem.venueId.includes(item.id),
      ).length,
    }))
    .sort((a, b) => b.events - a.events);

  const programmedIds = new Set(
    allEvents.flatMap((item) =>
      item.repertoire.map((piece) => piece.repertoireId),
    ),
  );
  const programmed = allRepertoire.filter((piece) =>
    programmedIds.has(piece.id),
  );
  const programmedMinutes = programmed.reduce(
    (total, piece) => total + (parseInt(piece.duration ?? "") || 0),
    0,
  );

  return {
    totals: fullTotals.counts,
    eventCounts: fullTotals.eventCounts,
    event: {
      id: event.id,
      season: event.season,
      eventNumber: event.eventNumber,
      eventStage: event.eventStage,
      title: event.title,
      date: formatDate(event.eventDate),
      time: formatTime(event.eventTime),
      status: event.status ?? "",
      counts: {
        repertoire: event.repertoire.length,
        musicians: event.musicians.length,
        staff: event.staff.length,
      },
    },
    venue: {
      id: venue.id,
      name: venue.name,
      location: [venue.address?.city, venue.address?.state]
        .filter(Boolean)
        .join(", "),
      otherEvents: allEvents
        .filter(
          (item) => item.id !== event.id && item.venueId.includes(venue.id),
        )
        .map((item) => item.title),
    },
    program,
    programMinutes: program.reduce(
      (total, piece) => total + (parseInt(piece.duration) || 0),
      0,
    ),
    musicians,
    crew,
    ledger: {
      entries: eventLedger.length,
      total: sumExpenses(eventLedger),
      groups: [...groups]
        .map(([name, group]) => ({ name, ...group }))
        .sort((a, b) => b.total - a.total),
    },
    questions: [
      {
        question: "Which musicians come back?",
        answer: `${returning} of ${concertsByMusician.size}`,
        detail: "musicians have played more than one concert",
        tables: ["contacts", "events"],
      },
      {
        question: "What does a full concert cost?",
        answer: formatDollars(averageCost),
        detail: `average across ${fullConcertCosts.length} stage-${fullConcertStage} concerts`,
        tables: ["events", "ledger"],
      },
      {
        question: "Which room do we return to most?",
        answer: `${eventsByVenue[0].events} events`,
        detail: `at ${eventsByVenue[0].name}`,
        tables: ["venues", "events"],
      },
      {
        question: "How much music have we programmed?",
        answer: `${Math.round(programmedMinutes / 60)} hours`,
        detail: `${programmed.length} works by ${new Set(programmed.map((piece) => piece.composer)).size} composers`,
        tables: ["repertoire", "events", "contacts"],
      },
    ],
    seasons: fullTotals.seasons,
  };
}
