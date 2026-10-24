"use client";

import { loadDemoData, saveDemoData } from "@/demos/moindi/lib/demo-storage";
import { useCallback, useEffect, useState } from "react";

// useState that survives reloads within the browser tab.
// renders with the fallback first, then swaps in the stored value after mount so server and client markup match
export function useDemoStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(loadDemoData(key, fallback));
    // fallback is only the starting value, so a new object each render shouldn't reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // saves on write rather than in an effect, so the fallback never overwrites what's stored before it loads
  const setStoredValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved =
          next instanceof Function ? next(previous) : next;
        saveDemoData(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue] as const;
}
