"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDemoAuth } from "./DemoAuthProvider";
import { Sidebar } from "./Sidebar";

const LANDING_PATH = "/moindi/demo";

// fills the layout's <main>. logged out, the page gets the full width (the landing page's tiles run edge to edge).
// logged in, it's a centered column with the sidebar beside the page, which shrinks as the sidebar widens.
// also guards every page but the landing page: logged-out visitors are sent back to it
export function DemoMain({ children }: { children: React.ReactNode }) {
  const { user } = useDemoAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === LANDING_PATH;

  useEffect(() => {
    // undefined means the stored session hasn't been read yet, so wait instead of redirecting
    if (user === null && !isLanding) router.replace(LANDING_PATH);
  }, [user, isLanding, router]);

  // inner pages render nothing until the session says logged in, so they don't flash before the redirect
  if (!user) {
    return (
      <div className="flex w-full flex-1">{isLanding ? children : null}</div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 lg:gap-4">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1">{children}</div>
    </div>
  );
}
