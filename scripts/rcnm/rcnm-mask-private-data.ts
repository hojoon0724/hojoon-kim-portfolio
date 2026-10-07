import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { contactsMasked as rawContacts } from "../../rcnm-raw-data/in-use-pre-masking/contacts";
import { events as rawEvents } from "../../rcnm-raw-data/in-use-pre-masking/events";
import { ledgerMasked as rawLedger } from "../../rcnm-raw-data/in-use-pre-masking/ledger";
import { repertoire as rawRepertoire } from "../../rcnm-raw-data/in-use-pre-masking/repertoire";
import { venues as rawVenues } from "../../rcnm-raw-data/in-use-pre-masking/venues";
import { createId } from "./rcnm-clean-utils";

// usage: npm run mask-private
// reads rcnm-raw-data/in-use-pre-masking, replaces the private details, writes data/rcnm-db-data-masked

const destinationFolder = resolve(
  import.meta.dirname,
  "../../data/rcnm-db-data-masked",
);

// contacts in these categories, or with no category, keep their real name
const keepNameCategories = [
  "Composer",
  "Musician",
  "Sound / Recording",
  "Event Supplies",
  "Production",
];

// true: phone, email and mailing address are replaced for every contact, including the ones who keep their name.
// false: the contacts who keep their name also keep their real phone, email and mailing address.
const maskContactDetailsForEveryone = true;

const fakeFirstNames = [
  "Avery",
  "Blake",
  "Casey",
  "Dana",
  "Ellis",
  "Finley",
  "Gray",
  "Harper",
  "Indigo",
  "Jules",
  "Kendall",
  "Logan",
  "Morgan",
  "Noel",
  "Oakley",
  "Parker",
  "Quinn",
  "Reese",
  "Sage",
  "Tatum",
  "Umber",
  "Vale",
  "Wren",
  "Zion",
];
const fakeLastNames = [
  "Abbott",
  "Briar",
  "Calloway",
  "Draper",
  "Ellery",
  "Fairbanks",
  "Garland",
  "Hollis",
  "Ingram",
  "Jessup",
  "Kingsley",
  "Lockwood",
  "Merritt",
  "Northcott",
  "Oakes",
  "Prescott",
  "Quimby",
  "Radcliffe",
  "Sterling",
  "Thackeray",
  "Underhill",
  "Vance",
  "Whitlock",
  "Yardley",
];
const fakeStreets = [
  "Maple St",
  "Oak Ave",
  "Cedar Ln",
  "Birch Rd",
  "Willow Way",
  "Juniper Ct",
  "Magnolia Dr",
  "Sycamore St",
  "Poplar Ave",
  "Hickory Ln",
];

type DataRecord = Record<string, unknown> & { id: string };
type Contact = DataRecord & {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  spouse?: string;
  phone?: string;
  email?: string;
  mailingAddress?: string;
  category: string[];
  venue: string[];
};
type Venue = DataRecord & {
  name: string;
  address?: Record<string, string>;
  contact: string[];
};

const contacts = rawContacts as Contact[];
const venues = rawVenues as Venue[];
const events = rawEvents as DataRecord[];
const ledger = rawLedger as DataRecord[];
const repertoire = rawRepertoire as DataRecord[];

// the same input always gives the same number, so a rerun produces the same fake data
function hash(text: string): number {
  let value = 2166136261;
  for (const char of text) {
    value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  }
  return value >>> 0;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getList(record: DataRecord, key: string): string[] {
  const value = record[key];
  return Array.isArray(value) ? (value as string[]) : [];
}

function keepsName(contact: Contact): boolean {
  return (
    contact.category.length === 0 ||
    contact.category.some((category) => keepNameCategories.includes(category))
  );
}

function getFullName(contact: {
  firstName?: string;
  lastName?: string;
}): string {
  return [contact.firstName, contact.lastName].filter(Boolean).join(" ");
}

// -- fake names -------------------------------------------------------

const takenIds = new Set(contacts.map((contact) => contact.id));
const takenLastNames = new Set<string>();

function createFakeName(contact: Contact) {
  let seed = hash(contact.id);
  for (;;) {
    const firstName = fakeFirstNames[seed % fakeFirstNames.length];
    const lastName =
      fakeLastNames[Math.floor(seed / 97) % fakeLastNames.length];
    const id = createId(`${firstName} ${lastName}`);
    // no two fake people share a last name, so "Abbott reimburse" points to one person
    if (!takenIds.has(id) && !takenLastNames.has(lastName)) {
      takenIds.add(id);
      takenLastNames.add(lastName);
      return { id, firstName, lastName };
    }
    seed++;
  }
}

const maskedNameContacts = contacts.filter((contact) => !keepsName(contact));
const fakeNameById = new Map(
  maskedNameContacts.map((contact) => [contact.id, createFakeName(contact)]),
);
const contactIdMap = new Map(
  [...fakeNameById].map(([id, fake]) => [id, fake.id]),
);

// a first name someone else also has ("Jonathan") can't be replaced everywhere
const keptFirstNames = new Set(
  contacts.filter(keepsName).map((contact) => contact.firstName?.toLowerCase()),
);
const firstNameReplacementById = new Map(
  maskedNameContacts.map((contact) => [
    contact.id,
    {
      real: contact.firstName ?? "",
      fake: fakeNameById.get(contact.id)!.firstName,
    },
  ]),
);
const sharedFirstNames = [...firstNameReplacementById.values()]
  .map(({ real }) => real)
  .filter((real) => keptFirstNames.has(real.toLowerCase()));

// the real names also show up in free text ("Staff Fees - Jane Doe", "Jane Doe's House", "Doe reimburse", "from Jane")
// full names are replaced first, then last names, then first names nobody else has
const nameReplacements = [
  ...maskedNameContacts.map((contact) => ({
    real: getFullName(contact),
    fake: getFullName(fakeNameById.get(contact.id)!),
  })),
  ...maskedNameContacts.map((contact) => ({
    real: contact.lastName ?? "",
    fake: fakeNameById.get(contact.id)!.lastName,
  })),
  ...[...firstNameReplacementById.values()].filter(
    ({ real }) => !sharedFirstNames.includes(real),
  ),
].filter(({ real }) => real.length > 2);

// linkedContactIds: the contacts a record points to. their first names are replaced even when shared
function getReplacements(linkedContactIds: string[]) {
  return [
    ...nameReplacements,
    ...linkedContactIds.flatMap((id) => firstNameReplacementById.get(id) ?? []),
  ];
}

function replaceNames<T>(text: T, linkedContactIds: string[] = []): T {
  if (typeof text !== "string") return text;
  return getReplacements(linkedContactIds).reduce(
    (result, { real, fake }) =>
      result.replace(new RegExp(`\\b${escapeRegExp(real)}\\b`, "gi"), fake),
    text as string,
  ) as T;
}

// same idea for ids, which are words joined by dashes: "2024-12-16-staff-fees-jane-doe"
function replaceNamesInId(id: string, linkedContactIds: string[] = []): string {
  return getReplacements(linkedContactIds)
    .reduce(
      (result, { real, fake }) =>
        result.replaceAll(`-${createId(real)}-`, `-${createId(fake)}-`),
      `-${id}-`,
    )
    .slice(1, -1);
}

function mapIds(ids: string[], idMap: Map<string, string>): string[] {
  return ids.map((id) => idMap.get(id) ?? id);
}

// -- fake contact details ---------------------------------------------

// 555-0100 to 555-0199 are reserved for fiction
const fakeAreaCodes = ["256", "205", "334", "251"];
let phoneCount = 0;
function createFakePhone(): string {
  const areaCode = fakeAreaCodes[Math.floor(phoneCount / 100) % 4];
  const lineNumber = String(phoneCount % 100).padStart(2, "0");
  phoneCount++;
  return `(${areaCode}) 555-01${lineNumber}`;
}

function createFakeEmail(contact: Contact): string {
  const { firstName, lastName, id } = contact;
  return firstName && lastName
    ? `${createId(firstName)}.${createId(lastName)}@example.com`
    : `info@${id}.example.com`;
}

// seeded by the real street, so two people at one address (and their venue) still match
function createFakeStreet(realAddress: string): string {
  const seed = hash(realAddress.split(",")[0].trim().toLowerCase());
  return `${100 + (seed % 900)} ${fakeStreets[seed % fakeStreets.length]}`;
}

// -- contacts ---------------------------------------------------------

const maskedContacts = contacts.map((contact) => {
  const fakeName = fakeNameById.get(contact.id);
  const maskDetails = Boolean(fakeName) || maskContactDetailsForEveryone;

  // middleName is dropped for a fake name
  const { middleName, ...withoutMiddleName } = contact;
  const named: Contact = fakeName
    ? { ...withoutMiddleName, ...fakeName }
    : { ...withoutMiddleName, ...(middleName ? { middleName } : {}) };

  return {
    ...named,
    ...(contact.spouse
      ? { spouse: contactIdMap.get(contact.spouse) ?? contact.spouse }
      : {}),
    ...(contact.phone && maskDetails ? { phone: createFakePhone() } : {}),
    ...(contact.email && maskDetails ? { email: createFakeEmail(named) } : {}),
    ...(contact.mailingAddress && maskDetails
      ? {
          mailingAddress: `${createFakeStreet(contact.mailingAddress)}, Huntsville, AL 35801`,
        }
      : {}),
  };
});

// -- venues -----------------------------------------------------------

// a venue named after a masked person is a private home: rename it and replace its address
const maskedVenues = venues.map((venue) => {
  const name = replaceNames(venue.name);
  if (name === venue.name) {
    return { ...venue, contact: mapIds(venue.contact, contactIdMap) };
  }

  return {
    ...venue,
    id: createId(name),
    name,
    ...(venue.address
      ? {
          address: {
            ...venue.address,
            street: createFakeStreet(venue.address.street),
            city: "Huntsville",
            state: "AL",
            postalCode: "35801",
          },
        }
      : {}),
    contact: mapIds(venue.contact, contactIdMap),
  };
});

const venueIdMap = new Map(
  venues.map((venue, index) => [venue.id, maskedVenues[index].id]),
);

const finalContacts = maskedContacts.map((contact) => ({
  ...contact,
  venue: mapIds(contact.venue, venueIdMap),
}));

// -- events, ledger, repertoire ---------------------------------------

const maskedEvents = events.map((event) => ({
  ...event,
  title: replaceNames(event.title),
  ...("description" in event
    ? { description: replaceNames(event.description) }
    : {}),
  venueId: mapIds(getList(event, "venueId"), venueIdMap),
  musicians: mapIds(getList(event, "musicians"), contactIdMap),
  staff: mapIds(getList(event, "staff"), contactIdMap),
  ...("composers" in event
    ? { composers: mapIds(getList(event, "composers"), contactIdMap) }
    : {}),
}));

const maskedLedger = ledger.map((entry) => {
  const linkedContactIds = getList(entry, "contact");

  return {
    ...entry,
    id: replaceNamesInId(entry.id, linkedContactIds),
    contact: mapIds(linkedContactIds, contactIdMap),
    description: replaceNames(entry.description, linkedContactIds),
  };
});

const maskedRepertoire = repertoire.map((piece) => ({
  ...piece,
  ...(typeof piece.composer === "string"
    ? { composer: contactIdMap.get(piece.composer) ?? piece.composer }
    : {}),
}));

// -- check and write --------------------------------------------------

const output = {
  contacts: { exportName: "contactsMasked", records: finalContacts },
  events: { exportName: "events", records: maskedEvents },
  ledger: { exportName: "ledgerMasked", records: maskedLedger },
  repertoire: { exportName: "repertoire", records: maskedRepertoire },
  venues: { exportName: "venues", records: maskedVenues },
};

// nothing is written if a real value that should be gone is still somewhere in the output
const detailsMasked = contacts.filter(
  (contact) => maskContactDetailsForEveryone || !keepsName(contact),
);
// a business venue keeps its address, even when it's also a contact's mailing address
const publicStreets = new Set(
  maskedVenues
    .filter((venue, index) => venue.id === venues[index].id)
    .map((venue) => venue.address?.street),
);
function getPrivateStreet(address?: string): string | undefined {
  const street = address?.split(",")[0].trim();
  return street && /^\d/.test(street) && !publicStreets.has(street)
    ? street
    : undefined;
}

const privateValues = [
  ...nameReplacements.map(({ real }) => real),
  ...maskedNameContacts.map((contact) => contact.id),
  ...detailsMasked.flatMap((contact) => [
    contact.phone,
    contact.email,
    getPrivateStreet(contact.mailingAddress),
  ]),
  ...venues
    .filter((venue, index) => venue.id !== maskedVenues[index].id)
    .flatMap((venue) => [venue.id, venue.address?.street]),
].filter((value): value is string => Boolean(value));

const outputText = JSON.stringify(output).toLowerCase();
const leaks = [...new Set(privateValues)].filter((value) =>
  new RegExp(
    `(?<![a-z0-9])${escapeRegExp(value.toLowerCase())}(?![a-z0-9])`,
  ).test(outputText),
);

if (leaks.length > 0) {
  console.error(
    `Not written. ${leaks.length} private values are still in the output:\n${leaks.map((value) => `  ${value}`).join("\n")}`,
  );
  process.exit(1);
}

for (const [name, { exportName, records }] of Object.entries(output)) {
  const destinationPath = resolve(destinationFolder, `${name}.ts`);
  writeFileSync(
    destinationPath,
    `export const ${exportName} = ${JSON.stringify(records, null, 2)};\n`,
  );
  console.log(`Wrote ${records.length} ${name} to ${destinationPath}`);
}

console.log(
  `Masked the names of ${maskedNameContacts.length} contacts and the contact details of ${detailsMasked.length}`,
);
if (sharedFirstNames.length > 0) {
  console.log(
    `First names shared with someone who keeps their name, only replaced on records linked to the masked person: ${sharedFirstNames.join(", ")}`,
  );
}
