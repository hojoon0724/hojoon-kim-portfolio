import "@/demos/moindi/styles/button.css";
import type { FullColorTypes, SizeTypes } from "@/demos/moindi/types";
import Link from "next/link";
import { SvgIcon } from "./SvgIcon";

type LinkButtonProps = {
  href: string;
  variant?: "fill" | "outline" | "none" | "flat";
  size?: SizeTypes;
  color?: FullColorTypes;
  iconName?: string;
  iconPosition?: "left" | "right";
  className?: string;
  children: React.ReactNode;
};

// a Link styled like Button, from the original's link-button
export function LinkButton({
  href,
  variant = "fill",
  size = "medium",
  color = "default",
  iconName,
  iconPosition = "left",
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <div className={`button-container h-full ${className}`}>
      <Link href={href} className="h-full w-full">
        <div
          className={`button-base button-${size} button-${variant} button-${color}-${variant} h-full w-full gap-2`}
        >
          {iconName && (
            <SvgIcon
              className={`aspect-square h-[150%] ${iconPosition === "right" ? "order-2" : ""}`}
              iconName={iconName}
              color={color}
              onButton
              onButtonVariant={
                variant === "flat"
                  ? "flat"
                  : variant === "fill"
                    ? "fill"
                    : "outline"
              }
            />
          )}
          {children}
        </div>
      </Link>
    </div>
  );
}
