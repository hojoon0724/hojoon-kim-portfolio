"use client";

import { Button, Icon } from "@/components/1-atoms";
import { useState } from "react";

type NavItem = {
  name: string;
  href: string;
  isCta?: boolean;
};

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: "About", href: "/#about" },
    { name: "Work", href: "/#work" },
  ];

  const totalItemCount = navItems.length;
  const delayStep = 100;

  return (
    <div className="nav-container pointer-events-none fixed bottom-0 z-50 flex w-full items-end justify-end px-0 py-0 lg:pointer-events-auto lg:top-0 lg:bottom-auto lg:px-0 lg:py-0">
      <div
        className={`lg:px-sm lg:py-md z-50 mx-auto w-full max-w-7xl ${isMobileMenuOpen ? "translate-y-0 duration-500 ease-(--bezier-movement-inertia-500)" : "translate-y-[calc(100%-var(--spacing-nav))] delay-300 duration-1000 ease-(--bezier-movement-inertia-1000) lg:translate-y-0"} transition-transform`}
      >
        <nav
          className={`bg-surface-heavy/40 text-on-heavy lg:h-nav relative flex h-auto w-full flex-col items-start justify-start rounded-t-lg px-0 backdrop-blur-lg transition-transform duration-500 lg:flex-row lg:items-center lg:justify-between lg:rounded-lg lg:py-0`}
        >
          <div className="nav-left flex h-full w-full items-center lg:w-auto">
            <div className="lg:hidden">
              <div className="mobile-menu-toggle-container h-nav w-nav bg-surface-accent flex cursor-pointer items-center justify-center rounded-tl-lg">
                <div
                  className="icon-container h-8 w-8"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                >
                  <Icon icon="interface.menu" color="on-surface-accent-peak" />
                </div>
              </div>
            </div>
            <div className="logo roboto-wide pl-xl lg:pl-md text-xl font-semibold">
              Hojoon Kim
            </div>
          </div>

          <ul
            className={`py-3xl gap-lg lg:pr-md flex h-full w-full flex-col items-center px-8 transition-transform duration-500 lg:w-auto lg:flex-row lg:items-stretch lg:justify-center lg:gap-0 lg:py-0`}
          >
            {navItems.map((item, index) => {
              const flatIndex = index;
              const reverseIndex = totalItemCount - 1 - flatIndex;
              const mobileDelay = isMobileMenuOpen
                ? flatIndex * delayStep
                : reverseIndex * delayStep;
              const mobileAnimationClass = isMobileMenuOpen
                ? "animation-fade-in-down-8"
                : "animation-fade-out-up-8";

              if (item.isCta) {
                return (
                  <li
                    key={item.name}
                    className={`${mobileAnimationClass} lg:animation-none h-full w-full lg:opacity-100`}
                    style={{ animationDelay: `${mobileDelay}ms` }}
                  >
                    <Button
                      variant="filled"
                      color="accent"
                      text={item.name}
                      size="sm"
                      url={item.href}
                      className="h-full w-full opacity-90 hover:opacity-100 lg:rounded-r-lg"
                    />
                  </li>
                );
              } else {
                return (
                  <li
                    key={item.name}
                    className={`px-md relative flex h-auto w-fit cursor-pointer flex-col items-center justify-center transition-colors duration-200 lg:h-12 lg:w-auto ${mobileAnimationClass} lg:animation-none lg:opacity-100`}
                    style={{ animationDelay: `${mobileDelay}ms` }}
                  >
                    <a
                      href={item.href}
                      className="roboto-mono flex h-full min-h-8 w-full items-center justify-start font-semibold lg:min-h-0 lg:justify-end"
                    >
                      <div className="item-container gap-sm -ml-8 flex flex-row-reverse items-center text-center lg:ml-0 lg:flex-row">
                        {item.name}
                      </div>
                    </a>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
