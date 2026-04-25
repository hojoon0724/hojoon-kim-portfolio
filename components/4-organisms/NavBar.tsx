"use client";

import { useState } from "react";
import { Button, Icon } from "../1-atoms";

export function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    {
      name: "Work",
      href: "#work",
      isDropdown: true,
      isCta: false,
      items: [
        { name: "MOindi", href: "#moindi" },
        { name: "enSRQ", href: "#ensrq" },
        { name: "Rocket City New Music", href: "#rocket-city-new-music" },
        { name: "Selected Works", href: "#selected-works" },
      ],
    },
    { name: "Contact", href: "#contact", isCta: true },
  ];

  function Dropdown({ items }: { items: { name: string; href: string }[] }) {
    return (
      <ul
        className={`dropdown mt-2xl mr-md absolute bg-surface-light backdrop-blur-lg rounded-lg shadow-lg shadow-gray-970/50 right-0 text-right ${isDropdownOpen ? "block" : "hidden"}`}
      >
        {items.map((subItem) => (
          <li
            key={subItem.name}
            className="px-md py-xs transition-colors duration-200 text-on-surface-light hover:bg-surface-accent w-auto"
          >
            <a href={subItem.href} className="text-nowrap">
              {subItem.name}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="nav-container w-full max-w-7xl mx-auto px-sm py-md sticky top-0 z-50">
      <nav className="flex items-center justify-between bg-surface-heavy/60 text-on-surface-heavy backdrop-blur-lg rounded-lg w-full border-2 border-surface-inverted/40 h-12 overflow-clip">
        <div className="logo text-xl font-semibold roboto-wide pl-md">Hojoon Kim</div>
        <ul className="flex items-stretch h-full">
          {navItems.map((item) => {
            if (item.isCta) {
              return (
                <Button key={item.name} variant="filled" color="accent" text={item.name} size="small" url={item.href} className="h-full opacity-90 hover:opacity-100" />
              );
            } else {
              return (
                <li
                  key={item.name}
                  className="px-md transition-colors duration-200 relative cursor-pointer h-full flex items-center"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  <a href={item.href} className="flex items-center gap-sm text-right roboto-mono font-semibold">
                    {item.name}
                    <div
                      className={`icon-container w-6 h-6 ${isDropdownOpen ? "-rotate-90" : ""} transition-transform duration-200`}
                    >
                      <Icon icon="angle.angle-left" color="on-surface-heavy" />
                    </div>
                  </a>
                  {item.isDropdown && <Dropdown items={item.items} />}
                </li>
              );
            }
          })}
        </ul>
      </nav>
    </div>
  );
}
