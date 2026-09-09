"use client";

import { useScrollContext } from "@/app/ScrollProvider";
import Link from "next/link";

interface ScrollIndicatorProps {
  visibleSections: { id: string; label: string; bgTone: "dark" | "bright" }[];
  sectionInView: string;
  labelDurationMs?: number;
}

export function ScrollIndicator({
  visibleSections,
  sectionInView,
  labelDurationMs = 1200,
}: ScrollIndicatorProps) {
  const debug = false;
  const { activeTargetKey } = useScrollContext();
  const hideAnimationMs = 200;
  const hideDelayMs = Math.max(0, labelDurationMs - hideAnimationMs);
  const hideIndicator = ["expanded-summary", "project-page"].some((key) =>
    activeTargetKey?.includes(key),
  );

  // setup new mechanism to control the indicator
  // const [showLabel, setShowLabel] = useState(false);
  // const [hideIndicator, setHideIndicator] = useState(false);

  // hide indicator if activeTargetKeys include ["expanded-summary", "project-page"]
  // show label briefly when there's a change in the active section
  // show label briefly when hideIndicator becomes true from false

  return (
    <div
      className={`scroll-indicator-container p-sm pointer-events-none absolute inset-0 flex h-dvh w-dvw flex-col items-end justify-end ${hideIndicator ? "opacity-0 delay-300" : "opacity-100 delay-0 duration-1000"} transition-all`}
    >
      {/* debug */}
      {debug && (
        <div className="absolute z-50 text-black">
          {JSON.stringify({ activeTargetKey, hideIndicator })}
        </div>
      )}
      <div
        className={`indicators gap-sm pb-3xl flex flex-col items-end justify-center ${visibleSections.find((section) => section.id === sectionInView)?.bgTone === "bright" ? "text-gray-950" : "text-gray-100"} `}
      >
        {visibleSections.map((section) => {
          const isActive =
            sectionInView === section.id || activeTargetKey === section.id;

          return (
            <Link
              href={`#${section.id}`}
              key={section.id}
              className={`group scroll-indicator relative z-40 transition-all duration-300 ${isActive ? "max-w-3xl opacity-80" : "max-w-2xl opacity-50"} h-md gap-sm pointer-events-auto flex items-center justify-end overflow-visible transition-all duration-300 hover:max-w-192 hover:opacity-70`}
            >
              <div className="text-container flex h-full items-center justify-end">
                <div
                  className={`pointer-events-none text-nowrap transition-all group-hover:opacity-100 ${isActive ? "opacity-100" : "opacity-0 duration-200"}`}
                  style={
                    isActive
                      ? {
                          animation: `fade-out ${hideAnimationMs}ms var(--bezier-fade) forwards`,
                          animationDelay: `${hideDelayMs}ms`,
                        }
                      : undefined
                  }
                >
                  {section.label}
                </div>
              </div>
              <div
                className={`line h-px shrink-0 border ${isActive ? "w-3xl" : "w-2xl"} transition-all duration-300`}
              ></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
