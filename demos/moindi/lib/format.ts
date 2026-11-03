// shared number formatting for the demo; shares are $1 each, so share counts format as dollars too

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(dollars: number) {
  return currencyFormatter.format(dollars);
}

export function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

// the original's project page (/d/e/p/:id) hasn't been ported, so project links go to trade for now.
// change this once a project page exists
export function projectUrl(projectId: string) {
  return `/moindi/demo/trade?project=${projectId}`;
}

// "US" → 🇺🇸, from the two regional-indicator letters
export function countryFlag(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/[A-Z]/g, (letter) =>
      String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65),
    );
}

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryName(countryCode: string) {
  return countryNames.of(countryCode.toUpperCase()) ?? countryCode;
}

const COMPACT_UNITS = [
  { size: 1_000, suffix: "k" },
  { size: 1_000_000, suffix: "M" },
  { size: 1_000_000_000, suffix: "B" },
];

// 978398 → { number: 978.3, suffix: "k" }, split so the number can still count up on its own.
// rounds down to one decimal, so it never overstates and never reaches 1000k
export function compactNumber(value: number) {
  const unit = COMPACT_UNITS.findLast(({ size }) => value >= size);
  if (!unit) return { number: value, suffix: "" };
  // multiplying first keeps whole tenths exact, so 4100 doesn't floor to 4.0k
  return {
    number: Math.floor((value * 10) / unit.size) / 10,
    suffix: unit.suffix,
  };
}
