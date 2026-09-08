import { SVG_ICONS } from "@/data";

interface IconProps {
  className?: string;
  icon: string;
  color?: string;
  // onButton?: boolean;
  // onButtonVariant?: VariantTypes;
}

export function Icon({
  className,
  icon,
  color = "currentColor",
  // onButton = false,
  // onButtonVariant = "filled",
}: IconProps) {
  let svgHtml = "?";

  try {
    // const raw: string = SVG_ICONS[icon];
    // const fillValue = onButton
    //   ? `fill="var(--button-${color}-${onButtonVariant}-text)"`
    //   : `fill="${color}"`;
    // svgHtml = raw.replace(/fill=".*?"/g, fillValue);
    // svgHtml = raw.replace(/style="[^"]*fill:[^;"]*;?[^"]*"/g, fillValue);
    svgHtml = SVG_ICONS[icon];
  } catch {
    svgHtml = "?";
  }

  return (
    <div
      className={`svg-icon-container flex aspect-square h-full items-center justify-center ${className ?? ""}`}
      style={{ color: color || "currentColor" }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
