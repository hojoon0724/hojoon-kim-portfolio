"use client";

import Image from "next/image";

export interface ImageAsset {
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
  asset: ImageAsset;
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

// the earlier name, kept so existing data doesn't need renaming
export type SlideAsset = ImageAsset;
