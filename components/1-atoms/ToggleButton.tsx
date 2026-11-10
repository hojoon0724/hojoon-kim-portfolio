"use client";

import type { ButtonHTMLAttributes } from "react";

// the bordered, uppercase toggle button: outlined in the text color, tinted when active. the class is exported
// too, for places that need it on something other than a plain button
export const toggleButtonClass = (active: boolean) =>
  `roboto-mono px-sm py-xs cursor-pointer border border-current text-xs font-bold uppercase transition-colors duration-200 md:text-sm ${active ? "bg-current/20" : "hover:bg-current/10"}`;

export interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

export function ToggleButton({
  active,
  className = "",
  type = "button",
  ...rest
}: ToggleButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={`${toggleButtonClass(active)} ${className}`}
      {...rest}
    />
  );
}
