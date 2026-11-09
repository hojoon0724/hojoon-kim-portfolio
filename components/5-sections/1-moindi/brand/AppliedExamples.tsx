"use client";

import { useState } from "react";
import { AssetImage } from "../design-in-code/shared";
import { toggleButtonClass } from "../design-in-code/shared";
import { visualHeight } from "./frame";

// pages from the guidelines' do / don't section, where choices are ranked rather than just marked right or wrong
const pages = [
  {
    id: "directional",
    label: "Correct vs. best",
    asset: {
      src: "/moindi/brand/applied-directional.jpg",
      width: 1920,
      height: 1080,
      alt: "Brand guidelines page: an office wall and a subway poster, each placement rated incorrect, correct or best",
    },
  },
  {
    id: "navbar",
    label: "A rule, bent",
    asset: {
      src: "/moindi/brand/applied-navbar.jpg",
      width: 1920,
      height: 1080,
      alt: "Brand guidelines page: brandmark placement on busy and quiet areas, and the nav bar clearspace exception",
    },
  },
] as const;

export function AppliedExamples() {
  const [pageId, setPageId] = useState<(typeof pages)[number]["id"]>(
    pages[0].id,
  );

  return (
    <div className={`gap-sm flex flex-col ${visualHeight}`}>
      <div className="gap-xs flex flex-wrap" role="group" aria-label="Page">
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            aria-pressed={page.id === pageId}
            onClick={() => setPageId(page.id)}
            className={toggleButtonClass(page.id === pageId)}
          >
            {page.label}
          </button>
        ))}
      </div>
      {/* every page stacked in one cell, so switching fades without a layout jump */}
      <div className="[container-type:size] grid min-h-0 flex-1 [grid-template-areas:'page']">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`mx-auto w-[min(100cqw,100cqh*16/9)] self-center transition-opacity duration-500 [grid-area:page] ${page.id === pageId ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={page.id !== pageId || undefined}
          >
            <AssetImage
              asset={page.asset}
              className="shadow-xl ring-1 ring-black/10"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
