// every countdown in the demo ends this long after the visitor's first look at one,
// so they're always ticking down instead of pointing at a fixed date that will pass
export const COUNTDOWN_DURATION_MS =
  (((7 * 24 + 2) * 60 + 47) * 60 + 15) * 1000; // 7d 2h 47m 15s

let endDate: Date | null = null;

// set on first call and kept for the rest of the visit, so moving between pages doesn't reset it.
// browser-only: call it after mount, since the server's clock isn't the visitor's
export function countdownEndDate() {
  endDate ??= new Date(Date.now() + COUNTDOWN_DURATION_MS);
  return endDate;
}
