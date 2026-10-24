// sessionStorage helpers for the moindi demo. keys are prefixed so they can't collide with the rest of the portfolio.
// only call these in effects or event handlers: sessionStorage doesn't exist during server rendering

const PREFIX = "moindi-demo:";

export function loadDemoData<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function saveDemoData<T>(key: string, value: T) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or blocked; the demo keeps working in memory
  }
}

export function removeDemoData(key: string) {
  try {
    sessionStorage.removeItem(PREFIX + key);
  } catch {
    // nothing to clean up if storage is blocked
  }
}

export function clearDemoData() {
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith(PREFIX)) sessionStorage.removeItem(key);
    }
  } catch {
    // nothing to clean up if storage is blocked
  }
}
