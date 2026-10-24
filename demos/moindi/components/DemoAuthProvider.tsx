"use client";

import {
  DEMO_CURRENT_USER_ID,
  moindiDemoUsers,
} from "@/demos/moindi/data/users";
import { loadDemoData, saveDemoData } from "@/demos/moindi/lib/demo-storage";
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
  logIn: (user: UserInterface) => void;
  logOut: () => void;
  findEasterEgg: (id: string) => void;
}

const DemoAuthContext = createContext<DemoAuth | null>(null);

// JSON turns createdAt into a string, so it's revived on the way back in
function loadSession(): SessionStorage | null {
  const stored = loadDemoData<SessionStorage | null>(SESSION_KEY, null);
  return stored ? { ...stored, createdAt: new Date(stored.createdAt) } : null;
}

// every visit to the demo gets a session, logged in or not, so easter eggs can be tracked from the start.
// the user is pre-filled with the demo's mock user; logging in just flips loggedIn
function createSession(): SessionStorage {
  return {
    key: crypto.randomUUID(),
    user: demoUser,
    easterEggsFound: [],
    loggedIn: false,
    createdAt: new Date(),
  };
}

// fake auth for the demo, mounted by the demo layout, so the session starts as soon as /moindi/demo opens.
// it lives in sessionStorage: it survives reloads in the tab, and signing out of the demo clears it
export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  // null only until the stored session is read (or a new one is created) after mount
  const [session, setSession] = useState<SessionStorage | null>(null);

  const updateSession = useCallback((next: SessionStorage) => {
    setSession(next);
    saveDemoData(SESSION_KEY, next);
  }, []);

  // read after mount so server and client render the same markup
  useEffect(() => {
    const stored = loadSession();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(stored);
    } else {
      updateSession(createSession());
    }
  }, [updateSession]);

  const logIn = useCallback(
    (user: UserInterface) =>
      updateSession({ ...(session ?? createSession()), user, loggedIn: true }),
    [session, updateSession],
  );

  // stays in the same session, so easter eggs found so far are kept
  const logOut = useCallback(() => {
    if (session) updateSession({ ...session, loggedIn: false });
  }, [session, updateSession]);

  const findEasterEgg = useCallback(
    (id: string) => {
      if (!session || session.easterEggsFound.includes(id)) return;
      updateSession({
        ...session,
        easterEggsFound: [...session.easterEggsFound, id],
      });
    },
    [session, updateSession],
  );

  const user = !session ? undefined : session.loggedIn ? session.user : null;

  const value = useMemo(
    () => ({ user, session, logIn, logOut, findEasterEgg }),
    [user, session, logIn, logOut, findEasterEgg],
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
