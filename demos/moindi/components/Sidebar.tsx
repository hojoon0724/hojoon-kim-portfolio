"use client";

import { useDemoSignOut } from "@/demos/moindi/hooks/use-demo-sign-out";
import type { UserInterface } from "@/demos/moindi/types";
import Link from "next/link";
import { useState } from "react";
import { useDemoSidebar } from "./DemoSidebarProvider";
import { SvgIcon } from "./SvgIcon";

type SidebarLink = { name: string; icon: string; url: string };

const LG_BREAKPOINT = 1024;

// stands in for the original's sidebar-item molecule.
// the icon column is the closed sidebar's width, so closing it leaves just the icons showing
function SidebarItem({
  name,
  url,
  icon,
  onClick,
}: {
  name: string;
  url?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="flex aspect-square h-full shrink-0 items-center justify-center">
        {icon}
      </div>
      <span className="whitespace-nowrap">{name}</span>
    </>
  );
  const className =
    "sidebar-item flex h-8 w-full items-center gap-(--standard-space) text-left";

  return url ? (
    <Link href={url} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}

// the original's /d/... routes are mapped onto /moindi/demo/[pagename]; most of those pages don't exist yet
function sidebarTop(user: UserInterface): (SidebarLink | "separator")[] {
  return [
    ...(user.isArtist
      ? [
          {
            name: "My Catalog",
            icon: "grid-bevel",
            url: "/moindi/demo/catalog",
          },
        ]
      : []),
    { name: "Dashboard", icon: "dashboard", url: "/moindi/demo/dashboard" },
    { name: "My Portfolio", icon: "suitcase", url: "/moindi/demo/portfolio" },
    { name: "My Activity", icon: "exchange", url: "/moindi/demo/activity" },
    // { name: "My Purchases", icon: "cart", url: "/moindi/demo/purchases" },
    // { name: "My Playlist", icon: "music", url: "/moindi/demo/playlist" },
    "separator",
    { name: "Explore", icon: "globe", url: "/moindi/demo/explore" },
    { name: "Trade", icon: "retweet", url: "/moindi/demo/trade" },
    {
      name: "Following",
      icon: "user-star",
      url: "/moindi/demo/following",
    },
    {
      name: "Favorites",
      icon: "heart",
      url: "/moindi/demo/favorites",
    },
    // { name: "What's On", icon: "globe", url: "/moindi/demo/whats-on" },
    // { name: "Store", icon: "shop", url: "/moindi/demo/store" },
    "separator",
    { name: "Leaderboard", icon: "chart-3d", url: "/moindi/demo/leaderboard" },
  ];
}

// open: pinned at full width. closed: hidden on mobile, an icon rail on desktop that widens while hovered
export function Sidebar({ user }: { user: UserInterface }) {
  const { isOpen, close: onClose } = useDemoSidebar();
  const [isHovering, setIsHovering] = useState(false);
  const signOut = useDemoSignOut();

  const onMouseEnter = () => {
    if (window.innerWidth >= LG_BREAKPOINT && !isOpen) setIsHovering(true);
  };

  // only closes on mobile after picking a link, where the open sidebar covers the page
  const onItemClick = (event: React.MouseEvent) => {
    const isLink = (event.target as HTMLElement).closest("a");
    if (isLink && isOpen && window.innerWidth < LG_BREAKPOINT) onClose();
  };

  const mobileState = isOpen
    ? "w-44 shadow-[8px_0px_8px_rgba(0,0,0,0.25)]"
    : "w-0";
  const desktopState = isOpen
    ? "lg:shadow-none"
    : isHovering
      ? "lg:w-46 lg:shadow-[8px_0px_8px_rgba(0,0,0,0.25)]"
      : "lg:w-12";

  // the spacer is the sidebar's room in <main> on desktop (the icon rail, or full width when open), so the page
  // beside it shrinks as it widens. hovering widens only the panel, which spills over the page like the original.
  // on mobile the spacer stays at 0 and the panel is fixed over the page instead
  const spacerState = isOpen ? "lg:w-44" : "lg:w-12";

  // z-30 keeps it above page content (tiles and accordion headers use z-10) and under the footer (z-40) and nav.
  // the desktop height leaves room for the footer (min-h-8 in the layout)
  return (
    <>
      <div
        className={`sidebar-spacer w-0 shrink-0 transition-all duration-300 ${spacerState}`}
      >
        <div
          className={`sidebar-container fixed top-(--nav-height) bottom-0 left-0 z-30 overflow-x-hidden overflow-y-auto bg-(--surface-base) text-(--text-base) transition-all duration-300 lg:sticky lg:h-[calc(100dvh-var(--nav-height)-2rem)] ${mobileState} ${desktopState}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="sidebar flex h-full w-44 flex-col justify-between gap-(--standard-space-double) px-(--standard-space)"
            onClick={onItemClick}
          >
            <div className="sidebar-top flex flex-col gap-2 pt-(--standard-space)">
              <SidebarItem
                name="My Profile"
                url="/moindi/demo/profile"
                icon={
                  user.profileSrcSet ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      srcSet={user.profileSrcSet}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center border">
                      {(user.displayName || user.firstName).charAt(0)}
                    </span>
                  )
                }
              />
              <hr />
              {sidebarTop(user).map((item, index) =>
                item === "separator" ? (
                  <hr key={`separator-${index}`} />
                ) : (
                  <SidebarItem
                    key={item.url}
                    name={item.name}
                    url={item.url}
                    icon={<SvgIcon iconName={item.icon} />}
                  />
                ),
              )}
            </div>
            <div className="sidebar-bottom flex flex-col gap-2 pb-(--standard-space)">
              <SidebarItem
                name="Settings"
                url="/moindi/demo/settings"
                icon={<SvgIcon iconName="cog" />}
              />
              <SidebarItem
                name="Logout"
                icon={<SvgIcon iconName="sign-out" />}
                onClick={signOut}
              />
            </div>
          </div>
        </div>
      </div>

      {/* closes the sidebar on mobile when tapping outside it */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 top-(--nav-height) z-20 bg-transparent lg:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      )}
    </>
  );
}
