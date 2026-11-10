import type { FullColorTypes } from "@/demos/moindi/types";
import { useId } from "react";

// the original's slash-texture: a strip of repeating diagonal slashes, used as a divider.
// fills its parent, so give the parent a height
export function SlashTexture({
  color = "secondary",
  scale = 100,
}: {
  color?: FullColorTypes;
  scale?: number;
}) {
  const patternId = `slash-pattern-${useId()}`;

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={(16 * scale) / 100}
          height={(36 * scale) / 100}
        >
          <g
            fill={`var(--surface-${color})`}
            transform={`scale(${scale / 100})`}
          >
            <rect
              x="-21.8"
              y="17"
              width="41.4"
              height="2"
              transform="rotate(-66.04 -1.1 18)"
            />
            <rect
              x="-5.8"
              y="17"
              width="41.4"
              height="2"
              transform="rotate(-66.04 14.9 18)"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
