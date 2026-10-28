"use client";

import Link from "next/link";
import { Button } from "./Button";
import { useDemoAuth } from "./DemoAuthProvider";
import { useEasterEgg } from "@/demos/moindi/hooks/use-easter-egg";
import { useDemoSidebar } from "./DemoSidebarProvider";
import { SvgIcon } from "./SvgIcon";
import { UserMenu } from "./UserMenu";

export function DemoNav() {
  const { user, logIn } = useDemoAuth();
  const triggerEasterEgg = useEasterEgg();
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useDemoSidebar();

  // there's nothing to sign up for, so joining finds an easter egg and then logs in
  const openJoinModal = () =>
    triggerEasterEgg("join", {
      confirmButtonText: "Continue",
      onConfirm: () => logIn(),
    });

  // sticky rather than the original's fixed, so the demo page doesn't need top padding to clear it
  return (
    <nav className="sticky top-0 z-1000 flex h-(--nav-height) w-full items-center justify-between bg-(--gray-900) text-white shadow-[0_-4px_8px_8px_rgba(0,0,0,0.75)]">
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center justify-between">
        <div className="logo-container relative z-50 flex h-full w-fit items-center gap-2 px-(--standard-space) py-4">
          {user && (
            // both icons sit side by side and slide, so toggling swaps one for the other
            <button
              type="button"
              className="sidebar-toggle-button relative flex h-8 w-8 overflow-clip"
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-expanded={sidebarOpen}
              onClick={toggleSidebar}
            >
              <div
                className={`flex h-full w-full transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
              >
                <SvgIcon
                  iconName="sidebar-hide"
                  color="primary"
                  className="shrink-0"
                />
                <SvgIcon
                  iconName="sidebar-show"
                  color="primary"
                  className="shrink-0"
                />
              </div>
            </button>
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
            <UserMenu user={user} />
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
                onClick={() => logIn()}
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
