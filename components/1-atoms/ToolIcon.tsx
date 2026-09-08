import Image from "next/image";
import type { CSSProperties } from "react";

interface ToolIconProps {
  toolId: string;
  pixelSize: number;
  className?: string;
  style?: CSSProperties;
}

export function ToolIcon({
  toolId,
  pixelSize,
  className,
  style,
}: ToolIconProps) {
  return (
    <Image
      src={`/icons/tools/icons_${toolId}.webp`}
      alt={toolId}
      width={pixelSize}
      height={pixelSize}
      className={className}
      style={style}
    />
  );
}
