import Image from "next/image";

interface ToolIconProps {
  toolId: string;
  pixelSize: number;
}

export function ToolIcon({ toolId, pixelSize }: ToolIconProps) {
  return (
    <Image
      src={`/icons/icons_${toolId}.webp`}
      alt={toolId}
      width={pixelSize}
      height={pixelSize}
    />
  );
}