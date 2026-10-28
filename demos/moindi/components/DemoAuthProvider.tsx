"use client";

import {
  DEMO_CURRENT_USER_ID,
  moindiDemoUsers,
} from "@/demos/moindi/data/users";
import { loadDemoData, saveDemoData } from "@/demos/moindi/lib/demo-storage";
import type { EasterEggId } from "@/demos/moindi/data/easter-eggs";
import type {
  AuthUserResponse,
  SessionStorage,
  UserInterface,
} from "@/demos/moindi/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SESSION_KEY = "session";

const demoUser = moindiDemoUsers.find(
  (user) => user.id === DEMO_CURRENT_USER_ID,
)!;

interface DemoAuth {
  // undefined until the session has been read or created, null when logged out
  user: AuthUserResponse;
  session: SessionStorage | null;
  logIn: () => void;
  logOut: () => void;
  findEasterEgg: (id: EasterEggId) => void;
  // for the user's own data the demo lets them change, like favorites and following
  updateUser: (update: (user: UserInterface) => UserInterface) => void;
}

const DemoAuthContext = createContext<DemoAuth | null>(null);

// JSON turns createdAt into a string, so it's revived on the way back in
function loadSession(): SessionStorage | null {
  const stored = loadDemoData<SessionStorage | null>(SESSION_KEY, null);
  if (!stored) return null;
  return {
    ...stored,
    createdAt: new Date(stored.createdAt),
    user: {
      ...stored.user,
      createdAt: new Date(stored.user.createdAt),
      updatedAt: new Date(stored.user.updatedAt),
    },
  };
}

// logs out in storage only, leaving the in-memory session (and the page's guards) alone.
// for leaving the demo: DemoAuthProvider reloads the stored session, progress and all, when the demo is reopened
export function storeLoggedOut() {
  const stored = loadSession();
  if (stored) saveDemoData(SESSION_KEY, { ...stored, loggedIn: false });
}

// every visit to the demo gets a session, logged in or not, so easter eggs can be tracked from the start.
// the user is pre-filled with the demo's mock user; logging in just flips loggedIn
// the user's account dates are stamped with the session's creation time, so it reads as a brand new account
function createSession(): SessionStorage {
  const now = new Date();
  return {
    key: crypto.randomUUID(),
    user: { ...demoUser, createdAt: now, updatedAt: now },
    easterEggsFound: [],
    loggedIn: false,
    createdAt: now,
  };
}

// fake auth for the demo, mounted by the demo layout, so the session starts as soon as /moindi/demo opens.
// it lives in sessionStorage: it survives reloads in the tab, and signing out of the demo clears it
export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  // null only until the stored session is read (or a new one is created) after mount
  const [session, setSession] = useState<SessionStorage | null>(null);

  // updates from the latest session rather than the one a callback closed over, so actions in a row
  // (finding an easter egg, then logging in from its modal) don't overwrite each other
  const updateSession = useCallback(
    (update: (previous: SessionStorage | null) => SessionStorage | null) => {
      setSession((previous) => {
        const next = update(previous);
        // saving here is idempotent, so strict mode running the updater twice is harmless
        if (next) saveDemoData(SESSION_KEY, next);
        return next;
      });
    },
    [],
  );

  // read after mount so server and client render the same markup
  useEffect(() => {
    const stored = loadSession();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(stored);
    } else {
      updateSession(() => createSession());
    }
  }, [updateSession]);

  // the demo has one user, already in the session, so logging in keeps it (and its balance and dates) as is
  const logIn = useCallback(() => {
    updateSession((previous) => ({
      ...(previous ?? createSession()),
      loggedIn: true,
    }));
  }, [updateSession]);

  // stays in the same session, so easter eggs found so far are kept
  const logOut = useCallback(() => {
    updateSession((previous) =>
      previous ? { ...previous, loggedIn: false } : previous,
    );
  }, [updateSession]);

  const findEasterEgg = useCallback(
    (id: EasterEggId) => {
      updateSession((previous) =>
        !previous || previous.easterEggsFound.includes(id)
          ? previous
          : { ...previous, easterEggsFound: [...previous.easterEggsFound, id] },
      );
    },
    [updateSession],
  );

  const updateUser = useCallback(
    (update: (user: UserInterface) => UserInterface) => {
      updateSession((previous) =>
        previous ? { ...previous, user: update(previous.user) } : previous,
      );
    },
    [updateSession],
  );

  const user = !session ? undefined : session.loggedIn ? session.user : null;

  const value = useMemo(
    () => ({ user, session, logIn, logOut, findEasterEgg, updateUser }),
    [user, session, logIn, logOut, findEasterEgg, updateUser],
  );

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const auth = useContext(DemoAuthContext);
  if (!auth) {
    throw new Error("useDemoAuth must be used inside DemoAuthProvider");
  }
  return auth;
}
