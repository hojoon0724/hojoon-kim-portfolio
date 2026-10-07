import { contacts } from "../../rcnm-raw-data/contacts-clean";
import { repertoire as rawRepertoire } from "../../rcnm-raw-data/repertoire";
import { repertoire } from "../../rcnm-raw-data/repertoire-clean";
import type {
  Contact,
  ContactCategory,
  InstrumentCategory,
} from "../../types/rcnm-db-types";
import {
  createId,
  isSinglePerson,
  separateName,
  writeCleanFile,
  type RawRecord,
} from "./rcnm-clean-utils";
import { guessComposerName } from "./rcnm-guess-composer-id";

// usage: npm run add-composers
// run it after clean-contacts and clean-repertoire: clean-contacts rebuilds contacts-clean.ts without the composers

// the clean contacts keep category, venue and instrument as lists
type ComposerContact = Omit<
  Contact,
  "category" | "venue" | "instrument" | "membership"
> & {
  category: ContactCategory[];
  venue: string[];
  instrument: InstrumentCategory[];
  membership: { foundingMember: boolean; history: [] };
};

// repertoire-clean.ts only has the composer id, so get the name back from the raw data
const composerNameById = new Map<string, string>();
for (const piece of rawRepertoire as RawRecord[]) {
  if (piece.composer) {
    const name = guessComposerName(piece.composer);
    composerNameById.set(createId(name), name);
  }
}

function createComposerContact(id: string, name: string): ComposerContact {
  // a single word is treated as a last name ("Trevino")
  const singleWord = !name.includes(" ");

  return {
    id,
    ...(singleWord
      ? { firstName: null, middleName: null, lastName: name }
      : separateName(name)),
    spouse: null,

    organization: null,
    mailingAddress: null,
    generalLocation: { city: null, state: null, country: null },
    phone: null,
    email: null,
    category: ["Composer"],

    venue: [],
    instrument: [],
    hiredFor: [],
    dietaryRestrictions: null,
    tShirtSize: null,
    instagram: null,

    membership: { foundingMember: false, history: [] },

    notes: null,
  };
}

const contactIds = new Set(contacts.map((contact) => contact.id));
const composerIds = new Set(
  repertoire.flatMap((piece) =>
    "composer" in piece && piece.composer ? [piece.composer] : [],
  ),
);

const missingComposers = [...composerIds]
  .filter((id) => !contactIds.has(id))
  .map((id) => ({ id, name: composerNameById.get(id) ?? id }));

const skipped = missingComposers.filter(({ name }) => !isSinglePerson(name));
const added = missingComposers
  .filter(({ name }) => isSinglePerson(name))
  .map(({ id, name }) => createComposerContact(id, name));

// composers who are already a contact get the "Composer" category instead of a new entry
let tagged = 0;
const existingContacts = contacts.map((contact) => {
  const category: string[] = contact.category;
  if (!composerIds.has(contact.id) || category.includes("Composer")) {
    return contact;
  }

  tagged++;
  return { ...contact, category: [...category, "Composer"] };
});

writeCleanFile("contacts", [...existingContacts, ...added]);

console.log(`Added ${added.length} composers`);
console.log(`Added the Composer category to ${tagged} existing contacts`);
if (skipped.length > 0) {
  console.log(
    `Skipped ${skipped.length}:\n${skipped.map(({ name }) => `  ${name}`).join("\n")}`,
  );
}
