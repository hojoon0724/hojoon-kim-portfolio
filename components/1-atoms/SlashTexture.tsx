"use client";

import { useId } from "react";

// the original's slash-texture: two thin diagonal strokes repeated as a pattern, in the bar's color
export function SlashTexture({
  color,
  scale = 0.35,
}: {
  color: string;
  scale?: number;
}) {
  // useId can include characters a url(#...) reference trips over
  const id = `slash-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={16 * scale}
          height={36 * scale}
        >
          <g fill={color} transform={`scale(${scale})`}>
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
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
