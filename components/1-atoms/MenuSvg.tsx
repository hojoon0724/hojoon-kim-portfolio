import { MENU_SVG } from "@/data";

interface IconProps {
  className?: string;
  icon: string;
  fill?: string;
  hoverFill?: string;
}

export function MenuSvg({ className, icon, fill = "white" }: IconProps) {
  let svgHtml = "?";

  try {
    const raw: string = MENU_SVG[icon];
    const fillValue = `fill="${fill}"`;
    svgHtml = raw
      .replace(/fill=".*?"/g, fillValue)
      .replace(/fill='.*?'/g, fillValue)
      .replace(/fill\s*:\s*[^;"']+/g, `fill: ${fill}`);
  } catch {
    svgHtml = "?";
  }

  return (
    <div
      className={`menu-svg-container h-full w-full ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
