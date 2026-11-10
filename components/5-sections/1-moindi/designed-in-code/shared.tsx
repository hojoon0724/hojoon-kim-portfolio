"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// the bordered toggle buttons the slides share
export const toggleButtonClass = (active: boolean) =>
  `roboto-mono px-sm py-xs cursor-pointer border border-current text-xs font-bold uppercase transition-colors duration-200 md:text-sm ${active ? "bg-current/20" : "hover:bg-current/10"}`;

export interface SlideAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  // the file isn't in public/ yet: a dashed frame at its size names the file to add instead
  placeholder?: boolean;
}

// an image, or a dashed stand-in at the same size until the file is added
export function AssetImage({
  asset,
  className = "",
}: {
  asset: SlideAsset;
  className?: string;
}) {
  if (asset.placeholder) {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-current/30 bg-current/5 p-4 text-center font-mono text-xs opacity-80 ${className}`}
        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
        role="img"
        aria-label={`${asset.alt} (coming soon)`}
      >
        <span className="font-bold uppercase">Asset needed</span>
        <span className="break-all">public{asset.src}</span>
        <span className="opacity-70">{asset.alt}</span>
      </div>
    );
  }

  // served as-is: next's optimizer re-encodes without the color profile, which flattens display p3 to srgb
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      unoptimized
      className={`h-auto w-full ${className}`}
    />
  );
}

// a date some way off, set after mount so the server and client agree, then a tick every second
export function useCountdown(durationMs: number) {
  const [endDate, setEndDate] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEndDate(start + durationMs);
    setNow(start);
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [durationMs]);

  if (endDate === null || now === null) return null;

  const totalSeconds = Math.max(0, Math.floor((endDate - now) / 1000));
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    endDate: new Date(endDate),
    text: `${pad(Math.floor(totalSeconds / 86400))}d ${pad(Math.floor((totalSeconds % 86400) / 3600))}h ${pad(Math.floor((totalSeconds % 3600) / 60))}m ${pad(totalSeconds % 60)}s`,
  };
}
