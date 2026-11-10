"use client";

import { Button, Icon, MenuSvg } from "@/components/1-atoms";
import { useState } from "react";

export function NavBarWithDropdown() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>();
  const [hoveredDropdownItem, setHoveredDropdownItem] = useState<string | null>(
    null,
  );

  const navItems = [
    {
      name: "Work",
      href: "#work",
      isDropdown: true,
      items: [
        {
          text: "MOindi",
          href: "#moindi",
          svg: "moindi",
          fill: "hsl(30, 100%, 50%)",
        },
        {
          text: "enSRQ",
          href: "#ensrq",
          svg: "ensrq",
          fill: "oklch(0.7774 0.24 230)",
        },
        {
          text: "Rocket City New Music",
          href: "#rocket-city-new-music",
          svg: "rcnm",
          fill: "#fc3d21",
        },
        {
          text: "Selected Works",
          href: "#selected-works",
        },
      ],
    },
    { name: "Contact", href: "#contact", isCta: true },
  ];

  // Flat index for each top-level navItem (accounts for subitems between them)
  const flatItemIndices = (() => {
    let idx = 0;
    return navItems.map((item) => {
      const start = idx;
      idx += 1 + (item.items?.length ?? 0);
      return start;
    });
  })();

  // Total item count for reverse stagger calculation
  const totalItemCount = navItems.reduce(
    (sum, item) => sum + 1 + (item.items?.length ?? 0),
    0,
  );
  const delayStep = 100;

  return (
    <div className="nav-container fixed bottom-0 z-50 flex w-full items-end justify-end px-0 py-0 lg:top-0 lg:bottom-auto lg:px-0 lg:py-0">
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
            className={`py-3xl gap-lg flex h-full w-fit w-full flex-col items-center px-8 transition-transform duration-500 lg:w-auto lg:flex-row lg:items-stretch lg:justify-center lg:gap-0 lg:px-0 lg:py-0`}
          >
            {navItems.map((item, index) => {
              if (item.isCta) {
                const flatIndex = flatItemIndices[index];
                const reverseIndex = totalItemCount - 1 - flatIndex;
                const mobileDelay = isMobileMenuOpen
                  ? flatIndex * delayStep
                  : reverseIndex * delayStep;
                const mobileAnimationClass = isMobileMenuOpen
                  ? "animation-fade-in-down-8"
                  : "animation-fade-out-up-8";

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
              } else if (item.isDropdown) {
                const flatIndex = flatItemIndices[index];
                const reverseIndex = totalItemCount - 1 - flatIndex;
                const mobileDelay = isMobileMenuOpen
                  ? flatIndex * delayStep
                  : reverseIndex * delayStep;
                const mobileAnimationClass = isMobileMenuOpen
                  ? "animation-fade-in-down-8"
                  : "animation-fade-out-up-8";

                return (
                  <li
                    key={item.name}
                    className={`dropdown-container relative h-full ${mobileAnimationClass} lg:animation-none lg:opacity-100`}
                    style={{ animationDelay: `${mobileDelay}ms` }}
                  >
                    <div
                      className="dropdown-name gap-sm px-md -ml-7 hidden h-full cursor-pointer flex-row-reverse items-center justify-end lg:flex lg:flex-row"
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === item.name ? null : item.name,
                        )
                      }
                    >
                      {item.name}
                      <div
                        className={`icon-container h-6 w-6 ${openDropdown === item.name ? "-rotate-90" : "-rotate-90 lg:rotate-0"} transition-transform duration-200`}
                      >
                        <Icon
                          icon="angle.angle-left"
                          color="on-surface-heavy"
                        />
                      </div>
                    </div>

                    <div
                      className={`dropdown-menu-items-container lg:bg-surface-heavy top-full right-0 flex min-h-0 w-fit flex-col overflow-hidden transition-all duration-500 ease-(--bezier-movement-inertia-500) lg:absolute ${openDropdown === item.name ? "max-h-200" : "lg:max-h-0"}`}
                    >
                      {/* dropdown items */}
                      {item.items?.map((subItem, i) => {
                        // Flat index for this subitem globally
                        const subItemFlatIndex = flatItemIndices[index] + 1 + i;
                        const subItemReverseIndex =
                          totalItemCount - 1 - subItemFlatIndex;
                        const mobileDelay = isMobileMenuOpen
                          ? subItemFlatIndex * delayStep
                          : subItemReverseIndex * delayStep;

                        // Desktop animation based on dropdown state
                        const desktopSubItemCount = item.items?.length ?? 0;
                        const desktopMaxDelay = Math.max(
                          0,
                          (desktopSubItemCount - 1) * delayStep,
                        );
                        const desktopCurrentDelay = i * delayStep;
                        const desktopStaggerDelay =
                          openDropdown === item.name
                            ? desktopCurrentDelay
                            : desktopMaxDelay - desktopCurrentDelay;

                        const mobileAnimationClass = isMobileMenuOpen
                          ? "animation-fade-in-down-8"
                          : "animation-fade-out-up-8";
                        const desktopAnimationClass =
                          openDropdown === item.name
                            ? "lg:animation-fade-in-down-8"
                            : "lg:animation-fade-out-up-8";
                        const subItemHoverKey = `${item.name}-${subItem.text}`;
                        const isSubItemHovered =
                          hoveredDropdownItem === subItemHoverKey;
                        return (
                          <div
                            key={subItem.text}
                            className={`dropdown-menu-item flex h-[40px] min-w-[200px] items-center justify-start text-nowrap ${mobileAnimationClass} ${desktopAnimationClass} cursor-pointer duration-200`}
                            style={{
                              animationDelay: `${isMobileMenuOpen ? mobileDelay : desktopStaggerDelay}ms`,
                              backgroundColor: isSubItemHovered
                                ? subItem.fill
                                : "",
                            }}
                            onMouseEnter={() =>
                              setHoveredDropdownItem(subItemHoverKey)
                            }
                            onMouseLeave={() => setHoveredDropdownItem(null)}
                            onClick={() => {
                              setHoveredDropdownItem(null);
                              setOpenDropdown(null);
                            }}
                          >
                            {subItem.svg ? (
                              <MenuSvg
                                icon={subItem.svg}
                                fill={
                                  isSubItemHovered
                                    ? "surface-base-heavy"
                                    : subItem.fill
                                }
                              />
                            ) : (
                              <div className="sub-item-text hover:bg-on-surface-heavy hover:text-surface-heavy flex h-full w-full items-center justify-start px-2.5">
                                {subItem.text}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </li>
                );
              } else {
                const flatIndex = flatItemIndices[index];
                const reverseIndex = totalItemCount - 1 - flatIndex;
                const mobileDelay = isMobileMenuOpen
                  ? flatIndex * delayStep
                  : reverseIndex * delayStep;
                const mobileAnimationClass = isMobileMenuOpen
                  ? "animation-fade-in-down-8"
                  : "animation-fade-out-up-8";

                return (
                  <li
                    key={item.name}
                    className={`px-md relative flex h-auto w-fit cursor-pointer flex-col items-center justify-center transition-colors duration-200 lg:h-12 lg:w-auto ${mobileAnimationClass} lg:animation-none lg:opacity-100`}
                    style={{ animationDelay: `${mobileDelay}ms` }}
                    onClick={() =>
                      setOpenDropdown((prev) =>
                        prev === item.name ? null : item.name,
                      )
                    }
                  >
                    {/* normal item */}
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
            })}{" "}
          </ul>
        </nav>
      </div>
    </div>
  );
}
