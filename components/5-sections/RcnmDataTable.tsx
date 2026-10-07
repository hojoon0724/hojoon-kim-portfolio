"use client";

import { useState } from "react";

type DataRecord = Record<string, unknown>;
type SortDirection = "ascending" | "descending";

interface RcnmDataTableProps {
  records: DataRecord[];
  columns: string[];
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

// numbers sort by value, everything else by its text; empty cells always go last
function sortRecords(
  records: DataRecord[],
  column: string,
  direction: SortDirection,
): DataRecord[] {
  const flip = direction === "ascending" ? 1 : -1;

  return [...records].sort((a, b) => {
    const textA = formatValue(a[column]);
    const textB = formatValue(b[column]);
    if (textA === "" || textB === "") {
      return Number(textA === "") - Number(textB === "");
    }

    const valueA = a[column];
    const valueB = b[column];
    if (typeof valueA === "number" && typeof valueB === "number") {
      return (valueA - valueB) * flip;
    }
    return textA.localeCompare(textB, undefined, { numeric: true }) * flip;
  });
}

export function RcnmDataTable({ records, columns }: RcnmDataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("ascending");

  // first click sorts ascending, second descending, third goes back to the original order
  function handleSort(column: string) {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection("ascending");
    } else if (sortDirection === "ascending") {
      setSortDirection("descending");
    } else {
      setSortColumn(null);
    }
  }

  const sortedRecords = sortColumn
    ? sortRecords(records, sortColumn, sortDirection)
    : records;

  return (
    <div className="border-line-on-base/20 max-h-[70vh] overflow-auto border">
      <table className="roboto-mono w-full border-collapse text-left text-xs">
        <thead className="bg-surface-heavy sticky top-0">
          <tr>
            <th className="px-sm py-xs font-normal opacity-50">#</th>
            {columns.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap"
                aria-sort={sortColumn === column ? sortDirection : "none"}
              >
                <button
                  type="button"
                  className="px-sm py-xs w-full cursor-pointer text-left font-bold"
                  onClick={() => handleSort(column)}
                >
                  {column}
                  <span className="ml-xs inline-block w-3">
                    {sortColumn === column &&
                      (sortDirection === "ascending" ? "▲" : "▼")}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map((record, index) => (
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
