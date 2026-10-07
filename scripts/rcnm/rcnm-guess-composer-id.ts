import { contacts as rawContacts } from "../../rcnm-raw-data/contacts";
import { repertoire as rawRepertoire } from "../../rcnm-raw-data/repertoire";
import { createId, isSinglePerson, type RawRecord } from "./rcnm-clean-utils";

// usage: npm run guess-composers (prints the matches, changes nothing)
// some composers are entered by last name only ("Quinones"). this matches them to a full name
// in the contacts or the other composers ("Christian Quinones") so they end up with the same id.
// the clean-repertoire, clean-events and add-composers scripts use it.

// names the matching can't work out: misspellings, and last names with no full name anywhere in the data
const composerNameCorrections: Record<string, string> = {
  Chapman: "Evan Chapman",
  Lunsqui: "Alexandre Lunsqui",
  Tompkins: "Joseph Tompkins",
  "Haruka Fuji": "Haruka Fujii",
};

function getLastName(name: string): string {
  return createId(name.split(/\s+/).pop() ?? "");
}

const composerNames = [
  ...new Set(
    (rawRepertoire as RawRecord[]).flatMap((piece) => piece.composer ?? []),
  ),
];
const contactNames = (rawContacts as RawRecord[]).flatMap(
  (contact) => contact.name ?? [],
);

// last name -> the full names that end with it, keyed by id so spelling variants count once
const fullNamesByLastName = new Map<string, Map<string, string>>();
for (const name of [...contactNames, ...composerNames]) {
  if (!name.includes(" ") || !isSinglePerson(name)) continue;

  const lastName = getLastName(name);
  const fullNames = fullNamesByLastName.get(lastName) ?? new Map();
  if (!fullNames.has(createId(name))) fullNames.set(createId(name), name);
  fullNamesByLastName.set(lastName, fullNames);
}

function getMatches(name: string): string[] {
  return [...(fullNamesByLastName.get(createId(name))?.values() ?? [])];
}

// "Quinones" -> "Christian Quinones". left alone unless exactly one full name matches
export function guessComposerName(name: string): string {
  if (composerNameCorrections[name]) return composerNameCorrections[name];
  if (name.includes(" ") || !isSinglePerson(name)) return name;

  const matches = getMatches(name);
  return matches.length === 1 ? matches[0] : name;
}

export function guessComposerId(name: string): string {
  return createId(guessComposerName(name));
}

export function withFullComposerNames(repertoire: RawRecord[]): RawRecord[] {
  return repertoire.map((piece) => ({
    ...piece,
    composer: piece.composer ? guessComposerName(piece.composer) : null,
  }));
}

// only when run directly, not when another script imports it
if (process.argv[1] === import.meta.filename) {
  const lastNameOnly = composerNames.filter(
    (name) => !name.includes(" ") && isSinglePerson(name),
  );

  for (const name of lastNameOnly) {
    const matches = getMatches(name);
    const result = composerNameCorrections[name]
      ? `${composerNameCorrections[name]} (corrected)`
      : matches.length === 1
        ? `${matches[0]} (${guessComposerId(name)})`
        : matches.length === 0
          ? "no match"
          : `${matches.length} possible matches: ${matches.join(", ")}`;
    console.log(`${name} -> ${result}`);
  }
}
