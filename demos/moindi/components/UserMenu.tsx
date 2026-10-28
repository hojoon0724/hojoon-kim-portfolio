"use client";

import { useDemoSignOut } from "@/demos/moindi/hooks/use-demo-sign-out";
import type { UserInterface } from "@/demos/moindi/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { SvgIcon } from "./SvgIcon";

// the original rendered the whole nav bar; here DemoNav owns the bar and this is just the hamburger and its dropdown.
// the sidebar toggle and admin panel link were left out: the demo has no sidebar or admin yet
export function UserMenu({ user }: { user: UserInterface }) {
  const demoSignOut = useDemoSignOut();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // closes on clicks outside the menu, like the original's document:click host listener
  useEffect(() => {
    if (!isOpen) return;
    const onDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [isOpen]);

  // the original read the balance from CreditService; the demo user carries it
  const userMenuTop = [
    {
      name: "Notifications",
      icon: "bell-o",
      url: "/moindi/demo/notifications",
    },
    { name: "Easter Eggs", icon: "diploma", url: "/moindi/demo/easter-eggs" },
    { name: "Settings", icon: "cog", url: "/moindi/demo/settings" },
  ];

  // links close the menu on click, which covers the original's close-on-navigation
  const close = () => setIsOpen(false);

  const signOut = () => {
    close();
    demoSignOut();
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-10 w-full cursor-pointer flex-row items-center justify-end gap-4"
    >
      <button
        type="button"
        className="hamburger-container h-12 w-12"
        aria-label="User menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <SvgIcon iconName="menu" color="primary" />
      </button>
      <div
        className={`user-menu-container absolute top-12.5 -right-(--standard-space) grid max-w-[calc(100vw-1rem)] items-end overflow-hidden bg-(--surface-base) text-(--text-on-surface-base) shadow-xl transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0">
          <div className="badge-container flex w-full flex-col items-start gap-(--standard-space-half) border p-(--standard-space)">
            <Link
              className="user-menu-item flex h-10 w-full items-center gap-(--standard-space-half)"
              href="/moindi/demo/profile"
              onClick={close}
            >
              {/* stands in for the original's user-badge, which hasn't been ported yet */}
              <div className="user-menu-icon relative aspect-square h-full overflow-hidden">
                <div className="absolute h-full w-full border" />
                {user.profileSrcSet ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    srcSet={user.profileSrcSet}
                    alt={user.displayName || user.firstName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    {(user.displayName || user.firstName).charAt(0)}
                  </div>
                )}
              </div>
              <div className="user-menu-text flex h-full items-center">
                <span className="ml-1 pr-(--standard-space) whitespace-nowrap">
                  My Profile
                </span>
              </div>
            </Link>
            {userMenuTop.map((item) => (
              <Link
                key={item.url}
                className="user-menu-item flex h-10 w-full items-center gap-(--standard-space-half)"
                href={item.url}
                onClick={close}
              >
                <div className="user-menu-icon h-full">
                  <SvgIcon iconName={item.icon} />
                </div>
                <div className="user-menu-text flex h-full items-center">
                  <span className="ml-1 pr-(--standard-space) whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              </Link>
            ))}
            <div className="my-(--standard-space-half) w-full border" />
            <div className="logout-row flex h-10 w-full items-center gap-(--standard-space-half) *:grow">
              <Button
                className="logout-button"
                color="error"
                iconName="sign-out"
                variant="outline"
                size="small"
                aria-label="Logout"
                onClick={signOut}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
