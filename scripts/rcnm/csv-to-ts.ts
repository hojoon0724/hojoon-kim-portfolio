import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const folderPath = resolve(import.meta.dirname, "../../rcnm-raw-data");
const fileName = {
  contacts: "contacts.csv",
  events: "events.csv",
  ledger: "ledger.csv",
  repertoire: "repertoire.csv",
  venues: "venues.csv",
};

// handles quoted fields, escaped quotes ("") and line breaks inside quotes
function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (inQuotes) {
      if (char === '"' && csv[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && csv[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

// "Date Created" -> "dateCreated", "22 Level" -> "22Level"
function toCamelCase(header: string): string {
  const words = header.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word[0].toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

// two columns can collapse to the same key (e.g. "Instrument" and "Instrument "), so number the repeats
function toUniqueKeys(headers: string[]): string[] {
  const seen = new Map<string, number>();
  return headers.map((header) => {
    const key = toCamelCase(header);
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    return count === 1 ? key : `${key}${count}`;
  });
}

// usage: npm run csv-to-ts -- contacts
const target = process.argv[2];

if (!target || !(target in fileName)) {
  console.error(
    `Specify which file to handle: ${Object.keys(fileName).join(" | ")}`,
  );
  process.exit(1);
}

const filePath = resolve(folderPath, fileName[target as keyof typeof fileName]);
const destinationPath = filePath.replace(/\.csv$/, ".ts");
const csv = readFileSync(filePath, "utf8").replace(/^﻿/, "");

const [headers, ...rows] = parseCsv(csv);
const keys = toUniqueKeys(headers);

const records = rows
  .filter((row) => row.some((value) => value.trim() !== ""))
  .map((row) =>
    Object.fromEntries(
      keys.map((key, index) => [key, row[index]?.trim() || null]),
    ),
  );

const output = `export const ${target} = ${JSON.stringify(records, null, 2)};\n`;

writeFileSync(destinationPath, output);

console.log(`Wrote ${records.length} ${target} to ${destinationPath}`);
