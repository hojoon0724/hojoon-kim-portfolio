"use client";

import {
  DEMO_CURRENT_USER_ID,
  moindiDemoUsers,
} from "@/demos/moindi/data/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./Button";
import { clearDemoData } from "@/demos/moindi/lib/demo-storage";
import { useDemoAuth } from "./DemoAuthProvider";
import { useDemoModal } from "./DemoModalProvider";
import { JoinModalContent } from "./JoinModalContent";

const demoUser = moindiDemoUsers.find(
  (user) => user.id === DEMO_CURRENT_USER_ID,
)!;

export function DemoNav() {
  const { user, logIn } = useDemoAuth();
  const router = useRouter();
  const { openModal } = useDemoModal();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // signing out leaves the demo for the portfolio page it was opened from
  // clears storage directly instead of calling logOut(): logOut would set user to null while still on a
  // guarded page, making RequireDemoLogin redirect to /moindi/demo and override this push.
  // the in-memory session goes away when leaving the demo unmounts DemoAuthProvider
  const signOut = () => {
    setUserMenuOpen(false);
    clearDemoData();
    router.push("/moindi");
  };

  const openJoinModal = () =>
    openModal({
      title: "Join MOindi",
      content: <JoinModalContent />,
      confirmButtonText: "Join",
      onConfirm: () => logIn(demoUser),
    });

  // sticky rather than the original's fixed, so the demo page doesn't need top padding to clear it
  return (
    <nav className="sticky top-0 z-1000 flex h-(--nav-height) w-full items-center justify-between bg-(--gray-900) text-white shadow-[0_-4px_8px_8px_rgba(0,0,0,0.75)]">
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center justify-between">
        <div className="logo-container relative z-50 flex h-full w-fit items-center gap-2 px-(--standard-space) py-4">
          {user && (
            <div className="sidebar-toggle-icon flex aspect-square w-8 items-center justify-center">
              S
            </div>
          )}
          <Link href="/moindi/demo" className="flex h-full justify-center">
            <svg height="100%" viewBox="0 0 376 56" aria-label="MOindi">
              <path
                d="M50.35,0l-22.35,22.35L5.65,0h44.69ZM33.65,56h22.35v-22.35l-22.35,22.35ZM0,33.65v22.35h22.35L0,33.65ZM86.35,0l-22.35,22.35V0h22.35ZM97.65,0l22.35,22.35V0h-22.35ZM97.65,56h22.35v-22.35l-22.35,22.35ZM64,33.65v22.35h22.35l-22.35-22.35ZM128,0l12.2,12.2v31.6l-12.2,12.2V0ZM171.8,12.2v31.6l12.2,12.2V0l-12.2,12.2ZM320,0l12.2,12.2v31.6l-12.2,12.2V0ZM363.8,12.2v31.6l12.2,12.2V0l-12.2,12.2ZM248,0v33.65L214.35,0h33.65ZM225.65,56l-33.65-33.65v33.65h33.65ZM312,0v22.35L289.65,0h22.35ZM289.65,56h22.35v-22.35l-22.35,22.35ZM256,5.65v44.69l22.35-22.35-22.35-22.35Z"
                fill="var(--fill-primary)"
              />
            </svg>
          </Link>
        </div>

        <div className="nav-auth-container flex w-full items-center justify-end gap-4 px-(--standard-space) py-4">
          {user === undefined ? null : user ? (
            <div className="logged-in relative flex gap-2">
              <button
                type="button"
                className="user-menu flex flex-row items-center justify-end"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                <div className="user-photo-container">U</div>
                <div className="user-name-container">{user.displayName}</div>
              </button>
              <div className="hamburger-button">
                <div className="icon-hamburger relative aspect-square w-8">
                  ≡
                </div>
              </div>

              {userMenuOpen && (
                <div className="user-menu-dropdown absolute top-full right-0 z-10 mt-1 flex flex-col bg-white">
                  <button
                    type="button"
                    className="px-2 py-1 text-left"
                    onClick={signOut}
                  >
                    Join
                  </button>
                </div>
              )}
            </div>
          ) : (
            // the original linked to /auth/register and /auth/login; the demo just signs in the demo user
            <>
              <Button
                variant="outline"
                color="secondary"
                size="small"
                onClick={openJoinModal}
              >
                Join
              </Button>
              <Button
                variant="fill"
                color="primary"
                size="small"
                onClick={() => logIn(demoUser)}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
