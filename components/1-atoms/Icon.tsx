import { SVG_ICONS } from "@/data";

interface IconProps {
  className?: string;
  icon: string;
  color?: string;
  onButton?: boolean;
  onButtonVariant?: "filled" | "outline" | "ghost";
}

export function Icon({
  className,
  icon,
  color = "on-surface-base",
  onButton = false,
  onButtonVariant = "filled",
}: IconProps) {
  let svgHtml = "?";

  try {
    const [category, iconName] = icon.split(".");
    const raw: string = SVG_ICONS[category][iconName];
    const fillValue = onButton
      ? `fill="var(--button-${color}-${onButtonVariant}-text)"`
      : `fill="var(--color-${color})"`;
    svgHtml = raw.replace(/fill=".*?"/g, fillValue);
  } catch {
    svgHtml = "?";
  }

  return (
    <div
      className={`svg-icon-container h-full flex justify-center items-center aspect-square ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
