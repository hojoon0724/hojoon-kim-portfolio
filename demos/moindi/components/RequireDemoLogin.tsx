"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDemoAuth } from "./DemoAuthProvider";

// guards logged-in demo pages: sends logged-out visitors to `redirectTo`
// and renders nothing meanwhile, so the page doesn't flash before the redirect
export function RequireDemoLogin({
  redirectTo,
  children,
}: {
  redirectTo: string;
  children: React.ReactNode;
}) {
  const { user } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    // undefined means the stored session hasn't been read yet, so wait instead of redirecting
    if (user === null) router.replace(redirectTo);
  }, [user, router, redirectTo]);

  return user ? children : null;
}
