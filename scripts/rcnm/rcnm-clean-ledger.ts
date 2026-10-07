import { ledger as rawLedger } from "../../rcnm-raw-data/ledger";
import {
  createEventId,
  createId,
  createUniqueIds,
  removeNotionLink,
  separateDateAndTime,
  writeCleanFile,
  type RawRecord,
} from "./rcnm-clean-utils";

// usage: npm run clean-ledger

// categories that were renamed in LEDGER_ENTRY_CATEGORIES
const renamedCategories: Record<string, string> = {
  Alcohol: "Beverage",
  "Ticket Sales": "Tickets",
};

// "$1,690.92" -> 1690.92
function cleanAmount(amount: string | null): number | null {
  if (!amount) return null;
  return Number(amount.replace(/[$,]/g, ""));
}

// falls back to the sign of the Math column ("-$250.00" is an expense) when In/Out is empty
function cleanType(entry: RawRecord): string | null {
  if (entry.inOut) return entry.inOut;
  if (!entry.math) return null;
  return entry.math.startsWith("-") ? "Expense" : "Income";
}

function cleanCategory(category: string | null): string | null {
  if (!category) return null;
  return renamedCategories[category] ?? category;
}

// "04-03-2-please-repeat-the-question" -> "04"
function getSeasonFromEventId(eventId: string | null): string | null {
  return eventId?.match(/^(\d{2})-\d{2}-/)?.[1] ?? null;
}

// blank rows only have the columns Notion fills in by itself
const filledEntries = (rawLedger as RawRecord[]).filter(
  (entry) => entry.name || entry.amount,
);

const dates = filledEntries.map((entry) => separateDateAndTime(entry.date).date);
const ids = createUniqueIds(
  filledEntries.map((entry, index) =>
    [dates[index] ?? "undated", entry.name ?? entry.category ?? "entry"].join(" "),
  ),
);

const cleanedLedger = filledEntries.map((entry, index) => {
  const eventId = removeNotionLink(entry.event).map(createEventId)[0] ?? null;

  return {
    id: ids[index],
    amount: cleanAmount(entry.amount),
    type: cleanType(entry),
    contact: removeNotionLink(entry.contact).map(createId),
    date: dates[index],
    seasonId: getSeasonFromEventId(eventId),
    eventId,
    status: entry.status,
    description: entry.name,
    category: cleanCategory(entry.category),
  };
});

writeCleanFile("ledger", cleanedLedger);
