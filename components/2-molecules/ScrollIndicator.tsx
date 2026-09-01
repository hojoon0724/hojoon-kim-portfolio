import Link from "next/link";

interface ScrollIndicatorProps {
  visibleSections: { id: string; label: string; bgTone: "dark" | "bright" }[];
  sectionInView: string;
  showLabel: boolean;
}

export function ScrollIndicator({visibleSections, sectionInView, showLabel}: ScrollIndicatorProps) {
  return (
    <div className="scroll-indicator-container p-sm pointer-events-none absolute inset-0 flex h-dvh w-dvw flex-col items-end justify-end">
        <div
          className={`indicators gap-sm pb-3xl flex flex-col items-end justify-center ${visibleSections.find((section) => section.id === sectionInView)?.bgTone === "bright" ? "text-gray-950" : "text-gray-100"} `}
        >
          {visibleSections.map((section) => (
            <Link
              href={`#${section.id}`}
              key={section.id}
              className={`group scroll-indicator relative z-40 transition-all duration-300 ${sectionInView === section.id ? "max-w-3xl opacity-80" : "max-w-2xl opacity-50"} h-md gap-sm pointer-events-auto flex items-center justify-end overflow-visible transition-all duration-300 hover:max-w-192 hover:opacity-70`}
            >
              <div className="text-container flex h-full items-center justify-end">
                <div
                  className={`pointer-events-none text-nowrap transition-all group-hover:opacity-100 ${showLabel && sectionInView === section.id ? "opacity-100" : "opacity-0 duration-200"}`}
                >
                  {section.label}
                </div>
              </div>
              <div
                className={`line h-px shrink-0 border ${sectionInView === section.id ? "w-3xl" : "w-2xl"} transition-all duration-300`}
              ></div>
            </Link>
          ))}
        </div>
      </div>
  );
}