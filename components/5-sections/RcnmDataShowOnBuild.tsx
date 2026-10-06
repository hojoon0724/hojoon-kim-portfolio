import "server-only";

import { Section } from "@/components/1-atoms";
import { contacts } from "@/rcnm-raw-data/contacts-clean";
import { events } from "@/rcnm-raw-data/events-clean";
import { ledger } from "@/rcnm-raw-data/ledger-clean";
import { repertoire } from "@/rcnm-raw-data/repertoire-clean";
import { venues } from "@/rcnm-raw-data/venues-clean";

type DataRecord = Record<string, unknown>;

// oldest first; events with no date (ideas) go last
function sortByDate(records: DataRecord[]): DataRecord[] {
  return [...records].sort((a, b) =>
    String(a.eventDate ?? "9999").localeCompare(String(b.eventDate ?? "9999")),
  );
}

const datasets: { name: string; records: DataRecord[] }[] = [
  { name: "contacts", records: contacts },
  { name: "events", records: sortByDate(events) },
  { name: "ledger", records: ledger },
  { name: "repertoire", records: repertoire },
  { name: "venues", records: venues },
];

// the clean files drop null keys, so collect every key that appears in any record
function getColumns(records: DataRecord[]): string[] {
  return [...new Set(records.flatMap((record) => Object.keys(record)))];
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    const separator = value.some((item) => typeof item === "object")
      ? " | "
      : ", ";
    return value.map(formatValue).join(separator);
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key}: ${formatValue(item)}`)
      .join(", ");
  }
  return String(value);
}

function DataTable({ records }: { records: DataRecord[] }) {
  const columns = getColumns(records);

  return (
    <div className="border-line-on-base/20 max-h-[70vh] overflow-auto border">
      <table className="roboto-mono w-full border-collapse text-left text-xs">
        <thead className="bg-surface-heavy sticky top-0">
          <tr>
            <th className="px-sm py-xs font-normal opacity-50">#</th>
            {columns.map((column) => (
              <th key={column} className="px-sm py-xs whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className="border-line-on-base/10 border-t">
              <td className="px-sm py-xs opacity-50">{index + 1}</td>
              {columns.map((column) => {
                const text = formatValue(record[column]);
                return (
                  <td
                    key={column}
                    className="px-sm py-xs max-w-80 truncate"
                    title={text}
                  >
                    {text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
          <DataTable records={records} />
        </details>
      ))}
    </Section>
  );
}
