import { formatCurrency } from "@/demos/moindi/lib/format";
import type {
  ChartSeriesItem,
  ColorTypes,
  FormatTypes,
} from "@/demos/moindi/types";
import Link from "next/link";

// tailwind needs non-dynamic class names
const BAR_CLASS: Record<ColorTypes, string> = {
  primary: "bg-(--surface-primary)",
  secondary: "bg-(--surface-secondary)",
  tertiary: "bg-(--surface-tertiary)",
};

function formatValue(item: ChartSeriesItem, format: FormatTypes) {
  switch (format) {
    case "currency":
      return formatCurrency(item.count);
    case "percentage":
      return `${Math.round((item.count / item.maxCount) * 100)}%`;
    case "fraction":
      return `${item.count.toLocaleString()} / ${item.maxCount.toLocaleString()}`;
    default:
      return item.count.toLocaleString();
  }
}

type ChartSeriesProps = {
  items: ChartSeriesItem[];
  format?: FormatTypes;
  color?: ColorTypes;
  // links each label to its item's link
  labelClickable?: boolean;
  className?: string;
};

// a ranked list of horizontal bars. a slimmed-down port of chart-series, chart-bar-item, chart-bar and
// chart-value: horizontal only, and the bars grow with a css transition instead of the in-viewport count-up
export function ChartSeries({
  items,
  format = "fraction",
  color = "secondary",
  labelClickable = false,
  className = "",
}: ChartSeriesProps) {
  if (items.length === 0)
    return <div className={className}>No data available.</div>;

  return (
    <ol
      className={`chart-series-container flex flex-col gap-(--standard-space) ${className}`}
    >
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="flex flex-col gap-1">
          <div className="flex items-end justify-between gap-2 text-sm">
            {labelClickable && item.link ? (
              <Link href={item.link} className="truncate">
                {item.label}
              </Link>
            ) : (
              <span className="truncate">{item.label}</span>
            )}
            <span className="space-mono shrink-0">
              {formatValue(item, format)}
            </span>
          </div>
          <div className="h-2 w-full bg-(--surface-tertiary-feather)">
            <div
              className={`h-full transition-[width] duration-1000 ${item.highlighted ? BAR_CLASS.primary : BAR_CLASS[color]}`}
              style={{
                width: `${item.maxCount ? (item.count / item.maxCount) * 100 : 0}%`,
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
