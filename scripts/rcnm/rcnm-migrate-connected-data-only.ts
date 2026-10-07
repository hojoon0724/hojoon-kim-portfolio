import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { events } from "../../data/rcnm-db-data-masked/events";
import { contacts } from "../../rcnm-raw-data/contacts-clean";
import { ledger } from "../../rcnm-raw-data/ledger-clean";
import { repertoire } from "../../rcnm-raw-data/repertoire-clean";
import { venues } from "../../rcnm-raw-data/venues-clean";

// usage: npm run migrate-connected
// copies only the records the events in data/rcnm-db-data-masked/events.ts are connected to.
// contacts and ledger are copied as they are (not masked yet), so run the mask script before committing.

const folderPath = resolve(import.meta.dirname, "../../data/rcnm-db-data-masked");

// file name -> the export name already used in that file
const toMigrate = {
  contacts: "contactsMasked",
  ledger: "ledgerMasked",
  repertoire: "repertoire",
  venues: "venues",
};

type DataRecord = Record<string, unknown> & { id: string };

function getList(record: Record<string, unknown>, key: string): string[] {
  const value = record[key];
  if (Array.isArray(value)) return value as string[];
  return typeof value === "string" ? [value] : [];
}

function keepOnly(ids: string[], allowed: Set<string>): string[] {
  return ids.filter((id) => allowed.has(id));
}

function writeMigratedFile(
  name: keyof typeof toMigrate,
  records: DataRecord[],
): void {
  const destinationPath = resolve(folderPath, `${name}.ts`);
  const output = `export const ${toMigrate[name]} = ${JSON.stringify(records, null, 2)};\n`;

  writeFileSync(destinationPath, output);

  console.log(`Wrote ${records.length} ${name} to ${destinationPath}`);
}

const eventIds = new Set(events.map((event) => event.id));

// venues and repertoire: the ones an event lists
const venueIds = new Set(events.flatMap((event) => getList(event, "venueId")));
const repertoireIds = new Set(
  events.flatMap((event) =>
    event.repertoire.map((piece) => piece.repertoireId),
  ),
);

const usedVenues = (venues as DataRecord[]).filter((venue) =>
  venueIds.has(venue.id),
);
const usedRepertoire = (repertoire as DataRecord[]).filter((piece) =>
  repertoireIds.has(piece.id),
);

// ledger: the entries that belong to one of the events
const usedLedger = (ledger as DataRecord[]).filter(
  (entry) => typeof entry.eventId === "string" && eventIds.has(entry.eventId),
);

// contacts: anyone an event, or one of the records above, points to
const contactIds = new Set([
  ...events.flatMap((event) => [
    ...getList(event, "musicians"),
    ...getList(event, "staff"),
    ...getList(event, "composers"),
  ]),
  ...usedRepertoire.flatMap((piece) => getList(piece, "composer")),
  ...usedVenues.flatMap((venue) => getList(venue, "contact")),
  ...usedLedger.flatMap((entry) => getList(entry, "contact")),
]);

const usedContacts = (contacts as DataRecord[]).filter((contact) =>
  contactIds.has(contact.id),
);

// drop the links to records that weren't migrated, so nothing points outside the set
const migratedContacts = usedContacts.map((contact) => {
  const { spouse, ...rest } = contact;
  const keepSpouse = typeof spouse === "string" && contactIds.has(spouse);

  return {
    ...rest,
    ...(keepSpouse ? { spouse } : {}),
    venue: keepOnly(getList(contact, "venue"), venueIds),
    hiredFor: keepOnly(getList(contact, "hiredFor"), eventIds),
  };
});

const migratedRepertoire = usedRepertoire.map((piece) => ({
  ...piece,
  inEvents: keepOnly(getList(piece, "inEvents"), eventIds),
}));

const migratedVenues = usedVenues.map((venue) => ({
  ...venue,
  inEvents: keepOnly(getList(venue, "inEvents"), eventIds),
}));

writeMigratedFile("contacts", migratedContacts);
writeMigratedFile("ledger", usedLedger);
writeMigratedFile("repertoire", migratedRepertoire);
writeMigratedFile("venues", migratedVenues);

// ids the events use that don't exist in the clean data
const allIds = {
  venues: new Set(venues.map((venue) => venue.id)),
  repertoire: new Set(repertoire.map((piece) => piece.id)),
  contacts: new Set(contacts.map((contact) => contact.id)),
};
const missing = [
  ...[...venueIds].filter((id) => !allIds.venues.has(id)),
  ...[...repertoireIds].filter((id) => !allIds.repertoire.has(id)),
  ...[...contactIds].filter((id) => !allIds.contacts.has(id)),
];
if (missing.length > 0) {
  console.log(
    `Not found in the clean data (${missing.length}):\n${missing.map((id) => `  ${id}`).join("\n")}`,
  );
}
