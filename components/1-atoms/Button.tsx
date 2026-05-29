import { ColorTypes, SizeTypes, VariantTypes } from "@/types/common-types";

interface ButtonProps {
  text: string;
  className?: string;
  variant?: VariantTypes;
  color?: ColorTypes;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: SizeTypes;
  url?: string;
  removePadding?: boolean;
  onClick?: () => void;
}

export function Button({
  variant = "filled",
  color = "accent",
  disabled = false,
  size = "md",
  text,
  type,
  url,
  className,
  removePadding,
  onClick,
}: ButtonProps) {
  const baseButtonClass =
    "inline-flex items-center justify-center transition-all duration-200 uppercase roboto-mono cursor-pointer border-4";

  const classMap = {
    filled: {
      accent:
        "bg-surface-accent text-on-surface-accent border-transparent hover:bg-surface-accent-hovered hover:text-on-surface-accent-hovered hover:border-transparent",
      secondary:
        "bg-surface-light text-on-surface-light border-transparent hover:bg-surface-light-hovered hover:text-on-surface-light-hovered hover:border-transparent",
      peak: "bg-surface-accent-peak text-on-surface-accent-peak border-transparent hover:bg-surface-accent-peak-hovered hover:text-on-surface-accent-peak-hovered hover:border-transparent",
    },
    outline: {
      accent:
        "bg-transparent text-accent-on-surface-base border-accent-on-surface-base hover:bg-surface-accent-hovered hover:text-on-surface-accent-hovered hover:border-accent",
      secondary:
        "bg-transparent text-on-surface-light border-surface-inverted hover:bg-surface-light hover:text-on-surface-base/70 hover:border-on-surface-base/70",
      peak: "bg-transparent text-peak-on-surface-base border-peak-on-surface-base hover:bg-surface-accent-peak-hovered hover:text-on-surface-accent-peak-hovered hover:border-peak",
    },
    ghost: {
      accent:
        "border-transparent bg-transparent text-accent-on-surface-base hover:border-transparent hover:bg-surface-accent-hovered hover:text-on-surface-accent",
      secondary:
        "border-transparent bg-transparent text-on-surface-base hover:border-transparent hover:bg-surface-light hover:text-on-surface-light",
      peak: "border-transparent bg-transparent text-peak-on-surface-base hover:border-transparent hover:bg-surface-accent-peak-hovered hover:text-on-surface-accent-peak",
    },
  };

  function getVariantClasses(variant: VariantTypes, color: ColorTypes): string {
    const stateClasses = classMap[variant][color];
    return stateClasses;
  }

  function getSizeClasses(size: SizeTypes): string {
    switch (size) {
      case "sm":
        return `${removePadding ? "" : "px-sm"} text-xs md:text-sm font-bold`;
      case "lg":
        return `${removePadding ? "" : "px-2xl py-sm"} text-base md:text-lg font-medium`;
      default:
      case "md":
        return `${removePadding ? "" : "px-lg py-xs"} text-base md:text-lg font-semibold`;
    }
  }

  const variantClasses = getVariantClasses(variant, color);
  const sizeClasses = getSizeClasses(size);
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
  const allClasses = `${baseButtonClass} ${variantClasses} ${sizeClasses} ${disabledClass} ${className}`;

  return (
    <button type={type} disabled={disabled} className={allClasses} onClick={onClick}>
      {text}
    </button>
  );
}
