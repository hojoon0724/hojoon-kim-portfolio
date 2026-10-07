import "server-only";

import { Section } from "@/components/1-atoms";
import { contactsMasked } from "@/data/rcnm-db-data-masked/contacts";
import { events } from "@/data/rcnm-db-data-masked/events";
import { ledgerMasked } from "@/data/rcnm-db-data-masked/ledger";
import { repertoire } from "@/data/rcnm-db-data-masked/repertoire";
import { venues } from "@/data/rcnm-db-data-masked/venues";

import { RcnmDataTable } from "./RcnmDataTable";

type DataRecord = Record<string, unknown>;

const datasets: { name: string; records: DataRecord[] }[] = [
  { name: "contacts", records: contactsMasked },
  { name: "events", records: events },
  { name: "ledger", records: ledgerMasked },
  { name: "repertoire", records: repertoire },
  { name: "venues", records: venues },
];

// the clean files drop null keys, so collect every key that appears in any record
function getColumns(records: DataRecord[]): string[] {
  return [...new Set(records.flatMap((record) => Object.keys(record)))];
}

// the clean data holds real contact and financial records, so this only renders in development
export function RcnmDataShowOnBuild() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Section className="rcnm-data-show py-2xl gap-lg" fullWidth>
      <div className="px-md gap-sm flex flex-col">
        <h2>RCNM Clean Data</h2>
        <div className="gap-md flex flex-row flex-wrap text-sm">
          {datasets.map(({ name, records }) => (
            <a key={name} href={`#rcnm-data-${name}`} className="underline">
              {name} ({records.length})
            </a>
          ))}
        </div>
      </div>

      {datasets.map(({ name, records }) => (
        <details key={name} id={`rcnm-data-${name}`} className="px-md">
          <summary className="py-sm cursor-pointer">
            <span className="text-xl">{name}</span>
            <span className="ml-sm text-sm opacity-50">
              {records.length} records, {getColumns(records).length} fields
            </span>
          </summary>
          <RcnmDataTable records={records} columns={getColumns(records)} />
        </details>
      ))}
    </Section>
  );
}
