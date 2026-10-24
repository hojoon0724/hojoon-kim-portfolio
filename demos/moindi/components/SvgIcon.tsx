import type { FullColorTypes } from "@/demos/moindi/types";

export type IconButtonVariant = "fill" | "outline" | "flat";

// tailwind needs non-dynamic class names, so they're spelled out here
const FILL_TEXT_CLASS: Record<FullColorTypes, string> = {
  default: "text-(--fill-default)",
  primary: "text-(--fill-primary)",
  secondary: "text-(--fill-secondary)",
  tertiary: "text-(--fill-tertiary)",
  success: "text-(--fill-success)",
  error: "text-(--error-500)",
  info: "text-(--info-500)",
  inverse: "text-(--gray-100)",
};

const BUTTON_TEXT_CLASS: Record<
  IconButtonVariant,
  Record<FullColorTypes, string>
> = {
  fill: {
    default: "text-(--button-default-fill-text)",
    primary: "text-(--button-primary-fill-text)",
    secondary: "text-(--button-secondary-fill-text)",
    tertiary: "text-(--button-tertiary-fill-text)",
    success: "text-(--button-success-fill-text)",
    error: "text-(--button-error-fill-text)",
    info: "text-(--button-info-fill-text)",
    inverse: "text-(--button-inverse-fill-text)",
  },
  outline: {
    default: "text-(--button-default-outline-text)",
    primary: "text-(--button-primary-outline-text)",
    secondary: "text-(--button-secondary-outline-text)",
    tertiary: "text-(--button-tertiary-outline-text)",
    success: "text-(--button-success-outline-text)",
    error: "text-(--button-error-outline-text)",
    info: "text-(--button-info-outline-text)",
    inverse: "text-(--button-inverse-outline-text)",
  },
  flat: {
    default: "text-(--button-default-flat-text)",
    primary: "text-(--button-primary-flat-text)",
    secondary: "text-(--button-secondary-flat-text)",
    tertiary: "text-(--button-tertiary-flat-text)",
    success: "text-(--button-success-flat-text)",
    error: "text-(--button-error-flat-text)",
    info: "text-(--button-info-flat-text)",
    inverse: "text-(--button-inverse-flat-text)",
  },
};

type SvgIconProps = {
  iconName: string;
  onButton?: boolean;
  onButtonVariant?: IconButtonVariant;
  color?: FullColorTypes;
  className?: string;
};

export function SvgIcon({
  iconName,
  onButton = false,
  onButtonVariant = "fill",
  color = "default",
  className = "",
}: SvgIconProps) {
  const colorClass = onButton
    ? BUTTON_TEXT_CLASS[onButtonVariant][color]
    : FILL_TEXT_CLASS[color];

  return (
    <div
      className={`svg-icon-container flex aspect-square h-full items-center justify-center ${colorClass} ${className}`}
    >
      <svg width="100%" height="100%" aria-hidden="true">
        <use href={`/moindi/icons.svg#${iconName}`} />
      </svg>
    </div>
  );
}
