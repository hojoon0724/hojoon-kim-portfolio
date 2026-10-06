interface HoverTooltipProps {
  children: React.ReactNode;
  tooltipText: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function HoverTooltip({
  children,
  tooltipText,
  position = "bottom",
}: HoverTooltipProps) {
  return (
    <div className="group relative">
      {children}
      <div
        className={`absolute ${position === "top" ? "bottom-full mb-2" : position === "bottom" ? "top-full mt-2" : position === "left" ? "right-full mr-2" : "left-full ml-2"} hidden w-max rounded bg-black p-2 text-white group-hover:block`}
      >
        {tooltipText}
      </div>
    </div>
  );
}
