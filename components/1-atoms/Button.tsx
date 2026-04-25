interface ButtonProps {
  className?: string;
  variant: "filled" | "outline" | "ghost";
  color: "accent" | "secondary";
  disabled?: boolean;
  text: string;
  type?: "button" | "submit" | "reset";
  size: "small" | "medium" | "large";
  url?: string;
  removePadding?: boolean;
  forceHover?: boolean;
}

export function Button({ variant, color, disabled, text, type, url, className, removePadding, size }: ButtonProps) {
  const baseButtonClass =
    "inline-flex items-center justify-center transition-all duration-200 uppercase roboto-mono cursor-pointer border-4";

  const classMap = {
    filled: {
      accent:
        "bg-surface-accent text-on-accent border-transparent hover:bg-surface-accent-hovered hover:text-on-surface-accent-hovered hover:border-transparent",
      secondary:
        "bg-surface-light text-on-surface-light border-transparent hover:bg-surface-light-hovered hover:text-on-surface-light-hovered hover:border-transparent",
    },
    outline: {
      accent:
        "bg-transparent text-accent-on-surface-base border-accent-on-surface-base hover:bg-surface-accent-hovered hover:text-on-surface-accent-hovered hover:border-accent",
      secondary:
        "bg-transparent text-on-surface-light border-surface-inverted hover:bg-surface-light hover:text-on-surface-base/70 hover:border-on-surface-base/70",
    },
    ghost: {
      accent:
        "border-transparent bg-transparent text-accent-on-surface-base hover:border-transparent hover:bg-surface-accent-hovered hover:text-on-surface-accent",
      secondary:
        "border-transparent bg-transparent text-on-surface-base hover:border-transparent hover:bg-surface-light hover:text-on-surface-light",
    },
  };

  function getVariantClasses(variant: "filled" | "outline" | "ghost", color: "accent" | "secondary"): string {
    const stateClasses = classMap[variant][color];
    return stateClasses;
  }

  function getSizeClasses(size: "small" | "medium" | "large"): string {
    switch (size) {
      case "small":
        return `${removePadding ? "" : "px-sm"} text-xs md:text-sm font-bold`;
      case "large":
        return `${removePadding ? "" : "px-2xl py-sm"} text-base md:text-lg font-medium`;
      default:
      case "medium":
        return `${removePadding ? "" : "px-lg py-xs"} text-base md:text-lg font-semibold`;
    }
  }

  const variantClasses = getVariantClasses(variant, color);
  const sizeClasses = getSizeClasses(size);
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
  const allClasses = `${baseButtonClass} ${variantClasses} ${sizeClasses} ${disabledClass} ${className}`;

  return (
    <button type={type} disabled={disabled} className={allClasses}>
      {text}
    </button>
  );
}
