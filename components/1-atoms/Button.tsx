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
  color = "primary",
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
      primary: "bg-surface-primary text-on-primary border-transparent",
      secondary: "bg-surface-secondary text-on-secondary border-transparent",
      tertiary: "bg-surface-inverted text-on-inverted border-transparent",
    },
    outline: {
      primary:
        "bg-transparent text-primary border-primary hover:bg-surface-primary hover:text-on-primary hover:border-primary",
      secondary:
        "bg-transparent text-on-surface-base border-secondary hover:bg-surface-secondary hover:text-on-secondary hover:border-secondary",
      tertiary: "bg-transparent text-on-base border-surface-inverted hover:bg-surface-inverted hover:text-on-inverted",
    },
    ghost: {
      primary:
        "border-transparent bg-transparent text-primary hover:border-transparent hover:bg-surface-primary hover:text-on-primary",
      secondary:
        "border-transparent bg-transparent text-secondary-text hover:border-transparent hover:bg-surface-secondary hover:text-on-secondary",
      tertiary:
        "border-transparent bg-transparent text-on-base hover:border-transparent hover:bg-surface-inverted hover:text-on-inverted",
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
