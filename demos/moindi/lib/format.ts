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
