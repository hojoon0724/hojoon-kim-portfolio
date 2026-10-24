import "@/demos/moindi/styles/button.css";
import type { FullColorTypes, SizeTypes } from "@/demos/moindi/types";
import type { ButtonHTMLAttributes } from "react";
import { SvgIcon } from "./SvgIcon";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  variant?: "fill" | "outline" | "none" | "flat";
  size?: SizeTypes;
  color?: FullColorTypes;
  iconName?: string;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  showIcon?: boolean;
};

export function Button({
  variant = "fill",
  size = "medium",
  color = "default",
  iconName,
  iconPosition = "left",
  iconOnly = false,
  showIcon = true,
  type = "button",
  className = "",
  children,
  ...buttonProps
}: ButtonProps) {
  const buttonClasses = `relative h-full w-full button-base button-${size}${iconOnly ? "-icon-only" : ""} button-${variant} button-${color}-${variant} ${className}`;

  return (
    <div className="button-container flex items-center justify-center">
      <button type={type} className={buttonClasses} {...buttonProps}>
        {iconName && (
          <div
            className={`icon-width-container flex aspect-square h-[200%] items-center justify-center transition-all delay-0 ease-in-out ${showIcon ? "max-w-50 duration-1000" : "max-w-0 duration-200"} ${iconPosition === "right" ? "order-2" : ""}`}
          >
            {/* "loading" was the angular spinner, which hasn't been ported yet */}
            {iconName !== "loading" && (
              <SvgIcon
                className={`${iconPosition === "right" ? "ml-1" : "mr-1"} transition-colors duration-200`}
                iconName={iconName}
                color={color}
                onButton
                onButtonVariant={variant === "none" ? "outline" : variant}
              />
            )}
          </div>
        )}
        {children}
      </button>
    </div>
  );
}
