import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

// shared by the rcnm-clean-*.ts scripts
const folderPath = resolve(import.meta.dirname, "../rcnm-raw-data");

export type RawRecord = Record<string, string | null>;

export function createId(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// names repeat, so number the repeats to keep ids unique
export function createUniqueIds(names: string[]): string[] {
  const seenIds = new Map<string, number>();
  return names.map((name) => {
    const id = createId(name);
    const count = (seenIds.get(id) ?? 0) + 1;
    seenIds.set(id, count);
    return count === 1 ? id : `${id}-${count}`;
  });
}

const nameSuffixPattern = /^(Jr|Sr|II|III|IV)\.?$/i;
const namePrefixPattern = /^(Dr|Mr|Mrs|Ms)\.?$/i;

// "Jose Valdez Jr" -> first: Jose, last: Valdez Jr / "Penelope S. Keene" -> middle: S.
export function separateName(name: string): {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
} {
  const parts = name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter((part) => part && !namePrefixPattern.test(part));

  let suffix = "";
  if (parts.length > 2 && nameSuffixPattern.test(parts[parts.length - 1])) {
    suffix = ` ${parts.pop()}`;
  }

  const firstName = parts[0] ?? null;
  const lastName = parts.length > 1 ? parts[parts.length - 1] + suffix : null;
  const middleName = parts.slice(1, -1).join(" ") || null;

  return { firstName, middleName, lastName };
}

export function splitList(value: string | null): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// "Venue Name (https://app.notion.com/p/...), Other (https://...)" -> ["Venue Name", "Other"]
export function removeNotionLink(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\s*\(https:\/\/app\.notion\.com\/[^)]*\),?\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

// "12/16/2023" / "12/16/2023 19:30 (PST)" -> { date: "2023-12-16", time: "19:30" }
export function separateDateAndTime(value: string | null): {
  date: string | null;
  time: string | null;
} {
  const match = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}:\d{2}))?/);
  if (!match) return { date: value ?? null, time: null };

  const [, month, day, year, time] = match;
  return { date: `${year}-${month}-${day}`, time: time ?? null };
}

// drops null keys at every level, plus any object left empty by that (e.g. generalLocation)
export function removeNullKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(removeNullKeys);
  if (value === null || typeof value !== "object") return value;

  const entries = Object.entries(value)
    .map(([key, item]) => [key, removeNullKeys(item)] as const)
    .filter(
      ([, item]) =>
        item !== null &&
        !(
          typeof item === "object" &&
          !Array.isArray(item) &&
          Object.keys(item).length === 0
        ),
    );
  return Object.fromEntries(entries);
}

// repertoire ids are built from composer + title, in both the repertoire and events scripts
export function createRepertoireIds(repertoire: RawRecord[]): string[] {
  return createUniqueIds(
    repertoire.map((piece) =>
      [piece.composer, piece.name].filter(Boolean).join(" "),
    ),
  );
}

// writes rcnm-raw-data/<name>-clean.ts
export function writeCleanFile(name: string, records: unknown[]): void {
  const destinationPath = resolve(folderPath, `${name}-clean.ts`);
  const output = `export const ${name} = ${JSON.stringify(removeNullKeys(records), null, 2)};\n`;

  writeFileSync(destinationPath, output);

  console.log(`Wrote ${records.length} ${name} to ${destinationPath}`);
}
