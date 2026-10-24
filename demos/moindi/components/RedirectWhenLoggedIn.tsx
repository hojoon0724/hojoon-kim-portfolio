"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDemoAuth } from "./DemoAuthProvider";

// demo auth only exists in the browser, so the redirect can't happen on the server
export function RedirectWhenLoggedIn({ to }: { to: string }) {
  const { user } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(to);
  }, [user, router, to]);

  return null;
}
