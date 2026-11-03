"use client";

import Image from "next/image";
import { useRef } from "react";

export interface ParallelScrollImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ParallelScrollRow {
  label: string;
  images: ParallelScrollImage[];
}

interface ParallelScrollRowsProps {
  rows: ParallelScrollRow[];
  // one per column, shown under the last row so they line up with every row above
  columnLabels?: string[];
  // sets the row height; each image's width follows from its own aspect ratio
  rowClassName?: string;
  // side padding for the labels and the start and end of each row. on a full-width component it can line the
  // content up with a narrower container while scrolled images still run out to the screen's edges
  insetClassName?: string;
  className?: string;
}

// rows of images that scroll sideways as one: scrolling any row moves the rest to the same spot.
// rows line up column for column when each column's images share a size
export function ParallelScrollRows({
  rows,
  columnLabels,
  rowClassName = "h-40",
  insetClassName = "",
  className = "",
}: ParallelScrollRowsProps) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // the rows this one moves fire their own scroll events, but they're already in place, so the 1px check ends it there
  const syncScroll = (source: HTMLDivElement) => {
    for (const row of rowRefs.current) {
      if (
        row &&
        row !== source &&
        Math.abs(row.scrollLeft - source.scrollLeft) > 1
      ) {
        row.scrollLeft = source.scrollLeft;
      }
    }
  };

  return (
    <div className={`gap-md flex flex-col ${className}`}>
      {rows.map((row, rowIndex) => {
        const isLast = rowIndex === rows.length - 1;
        return (
          // keyed by position, so swapping a row's images keeps its scroll position
          <div key={rowIndex} className="gap-xs flex flex-col">
            <span
              className={`roboto-mono text-xs font-bold uppercase md:text-sm ${insetClassName}`}
            >
              {row.label}
            </span>
            <div
              ref={(element) => {
                rowRefs.current[rowIndex] = element;
              }}
              className={`gap-sm flex overflow-x-auto overscroll-x-contain ${insetClassName}`}
              onScroll={(event) => syncScroll(event.currentTarget)}
            >
              {row.images.map((image, imageIndex) => (
                <figure
                  key={image.src}
                  className="gap-xs flex shrink-0 flex-col"
                >
                  <div className={`${rowClassName} border`}>
                    {/* served as-is: next's optimizer re-encodes without the color profile,
                        which flattens display p3 screenshots to srgb */}
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      unoptimized
                      className="h-full w-auto"
                    />
                  </div>
                  {isLast && columnLabels?.[imageIndex] && (
                    <figcaption className="roboto-mono text-xs uppercase opacity-70">
                      {columnLabels[imageIndex]}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
