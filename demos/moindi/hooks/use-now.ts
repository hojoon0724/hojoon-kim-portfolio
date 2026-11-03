"use client";

import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// the time, in whole seconds so the snapshot holds still between ticks.
// null on the server and during hydration, so time-dependent markup only appears after mount
export function useNow() {
  const seconds = useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
  return seconds === null ? null : new Date(seconds * 1000);
}
