"use client";

import { storeLoggedOut } from "@/demos/moindi/components/DemoAuthProvider";
import { useRouter } from "next/navigation";

// signing out leaves the demo for the portfolio page it was opened from. the session is kept, just logged out,
// so logging back in picks up where the visitor left off.
// it's logged out in storage rather than with logOut(): logOut would set user to null while still on a
// guarded page, making DemoMain redirect to /moindi/demo and override this push.
// leaving the demo unmounts DemoAuthProvider, which reads the logged-out session back in on return
export function useDemoSignOut() {
  const router = useRouter();
  return () => {
    storeLoggedOut();
    router.push("/moindi");
  };
}
