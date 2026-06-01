"use client";

import { Button, Icon, MenuSvg } from "@/components/1-atoms";
import { useState } from "react";

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>();
  const [hoveredDropdownItem, setHoveredDropdownItem] = useState<string | null>(null);

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
  const totalItemCount = navItems.reduce((sum, item) => sum + 1 + (item.items?.length ?? 0), 0);
  const delayStep = 100;

  return (
    <div className="nav-container fixed bottom-0 flex justify-end items-end w-full z-50 px-0 py-0 lg:bottom-auto lg:top-0 lg:px-0 lg:py-0">
      <div
        className={`w-full max-w-7xl mx-auto lg:px-sm lg:py-md z-50 ${isMobileMenuOpen ? "translate-y-0 duration-500 ease-[var(--bezier-movement-inertia-500)]" : "translate-y-[calc(100%-var(--spacing-nav))] lg:translate-y-0 delay-300 duration-1000 ease-[var(--bezier-movement-inertia-1000)]"} transition-transform`}
      >
        <nav
          className={`flex items-start lg:items-center flex-col w-full lg:flex-row justify-start lg:justify-between backdrop-blur-lg rounded-t-lg lg:rounded-lg bg-surface-heavy/60 text-on-heavy transition-transform duration-500 lg:h-nav h-auto lg:py-0 px-0 relative`}
        >
          <div className="nav-left flex items-center h-full w-full lg:w-auto">
            <div className="lg:hidden">
              <div className="mobile-menu-toggle-container h-nav w-nav bg-surface-accent-peak rounded-tl-lg flex items-center justify-center cursor-pointer">
                <div className="icon-container h-8 w-8" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
                  <Icon icon="interface.menu" color="on-surface-accent-peak" />
                </div>
              </div>
            </div>
            <div className="logo text-xl font-semibold roboto-wide pl-xl lg:pl-md">Hojoon Kim</div>
          </div>

          <ul
            className={`flex flex-col lg:justify-center items-center lg:flex-row lg:items-stretch h-full py-3xl lg:py-0 gap-lg lg:gap-0 w-fit lg:w-auto px-8 lg:px-0 transition-transform duration-500`}
          >
            {navItems.map((item, index) => {
              if (item.isCta) {
                const flatIndex = flatItemIndices[index];
                const reverseIndex = totalItemCount - 1 - flatIndex;
                const mobileDelay = isMobileMenuOpen ? flatIndex * delayStep : reverseIndex * delayStep;
                const mobileAnimationClass = isMobileMenuOpen ? "animation-fade-in-down-8" : "animation-fade-out-up-8";

                return (
                  <li
                    key={item.name}
                    className={`${mobileAnimationClass} lg:animation-none lg:opacity-100 h-full w-full`}
                    style={{ animationDelay: `${mobileDelay}ms` }}
                  >
                    <Button
                      variant="filled"
                      color="primary"
                      text={item.name}
                      size="sm"
                      url={item.href}
                      className="h-full opacity-90 hover:opacity-100 lg:rounded-r-lg w-full"
                    />
                  </li>
                );
              } else if (item.isDropdown) {
                const flatIndex = flatItemIndices[index];
                const reverseIndex = totalItemCount - 1 - flatIndex;
                const mobileDelay = isMobileMenuOpen ? flatIndex * delayStep : reverseIndex * delayStep;
                const mobileAnimationClass = isMobileMenuOpen ? "animation-fade-in-down-8" : "animation-fade-out-up-8";

                return (
                  <li
                    key={item.name}
                    className={`dropdown-container h-full relative ${mobileAnimationClass} lg:animation-none lg:opacity-100`}
                    style={{ animationDelay: `${mobileDelay}ms` }}
                  >
                    <div
                      className="dropdown-name h-full flex flex-row-reverse lg:flex-row justify-end -ml-7 items-center gap-sm cursor-pointer px-md"
                      onClick={() => setOpenDropdown((prev) => (prev === item.name ? null : item.name))}
                    >
                      {item.name}
                      <div
                        className={`icon-container w-6 h-6 ${openDropdown === item.name ? "-rotate-90" : "-rotate-90 lg:rotate-0"} transition-transform duration-200`}
                      >
                        <Icon icon="angle.angle-left" color="on-surface-heavy" />
                      </div>
                    </div>

                    <div
                      className={`dropdown-menu-items-container lg:bg-surface-heavy overflow-hidden flex flex-col lg:absolute w-fit top-full right-0 min-h-0 transition-all duration-500 ease-[--bezier-movement-inertia-500] ${openDropdown === item.name ? "max-h-200" : "lg:max-h-0"}`}
                    >
                      {/* dropdown items */}
                      {item.items?.map((subItem, i) => {
                        // Flat index for this subitem globally
                        const subItemFlatIndex = flatItemIndices[index] + 1 + i;
                        const subItemReverseIndex = totalItemCount - 1 - subItemFlatIndex;
                        const mobileDelay = isMobileMenuOpen
                          ? subItemFlatIndex * delayStep
                          : subItemReverseIndex * delayStep;

                        // Desktop animation based on dropdown state
                        const desktopSubItemCount = item.items?.length ?? 0;
                        const desktopMaxDelay = Math.max(0, (desktopSubItemCount - 1) * delayStep);
                        const desktopCurrentDelay = i * delayStep;
                        const desktopStaggerDelay =
                          openDropdown === item.name ? desktopCurrentDelay : desktopMaxDelay - desktopCurrentDelay;

                        const mobileAnimationClass = isMobileMenuOpen
                          ? "animation-fade-in-down-8"
                          : "animation-fade-out-up-8";
                        const desktopAnimationClass =
                          openDropdown === item.name ? "lg:animation-fade-in-down-8" : "lg:animation-fade-out-up-8";
                        const subItemHoverKey = `${item.name}-${subItem.text}`;
                        const isSubItemHovered = hoveredDropdownItem === subItemHoverKey;
                        return (
                          <div
                            key={subItem.text}
                            className={`dropdown-menu-item min-w-[200px] h-[40px] flex justify-start items-center text-nowrap ${mobileAnimationClass} ${desktopAnimationClass} cursor-pointer duration-200`}
                            style={{
                              animationDelay: `${isMobileMenuOpen ? mobileDelay : desktopStaggerDelay}ms`,
                              backgroundColor: isSubItemHovered ? subItem.fill : "",
                            }}
                            onMouseEnter={() => setHoveredDropdownItem(subItemHoverKey)}
                            onMouseLeave={() => setHoveredDropdownItem(null)}
                            onClick={() => {
                              setHoveredDropdownItem(null);
                              setOpenDropdown(null);
                            }}
                          >
                            {subItem.svg ? (
                              <MenuSvg
                                icon={subItem.svg}
                                fill={isSubItemHovered ? "surface-base-heavy" : subItem.fill}
                              />
                            ) : (
                              <div className="sub-item-text px-2.5 hover:bg-on-surface-heavy hover:text-surface-heavy w-full h-full flex justify-start items-center">
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
                const mobileDelay = isMobileMenuOpen ? flatIndex * delayStep : reverseIndex * delayStep;
                const mobileAnimationClass = isMobileMenuOpen ? "animation-fade-in-down-8" : "animation-fade-out-up-8";

                return (
                  <li
                    key={item.name}
                    className={`px-md transition-colors duration-200 relative cursor-pointer h-auto lg:h-12 flex flex-col items-center w-fit lg:w-auto justify-center ${mobileAnimationClass} lg:animation-none lg:opacity-100`}
                    style={{ animationDelay: `${mobileDelay}ms` }}
                    onClick={() => setOpenDropdown((prev) => (prev === item.name ? null : item.name))}
                  >
                    {/* normal item */}
                    <a
                      href={item.href}
                      className="roboto-mono font-semibold w-full h-full flex items-center justify-start lg:justify-end min-h-8 lg:min-h-0"
                    >
                      <div className="item-container flex flex-row-reverse lg:flex-row items-center gap-sm text-center -ml-8 lg:ml-0">
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
