"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Every page image is the same height but the widths vary slightly, so pages
// are sized by height and take their natural width.
const PAGE_IMAGE_HEIGHT = 2100;
const PAGE_IMAGE_WIDTHS: Record<string, number> = {
  "season-brochure-01.png": 1500,
  "season-brochure-02.png": 1500,
  "season-brochure-03.png": 1482,
  "season-brochure-04.png": 1440,
  "season-brochure-05.png": 1446,
  "season-brochure-06.png": 1425,
  "season-brochure-07.png": 1407,
  "season-brochure-08.png": 1389,
  "season-brochure-09.png": 1389,
  "season-brochure-10.png": 1407,
  "season-brochure-11.png": 1425,
  "season-brochure-12.png": 1446,
  "season-brochure-13.png": 1440,
  "season-brochure-14.png": 1482,
  "season-brochure-15.png": 1500,
  "season-brochure-16.png": 1500,
};

const PAGE_DISPLAY_HEIGHT_PX = 480; // h-120

const getPageImageWidth = (src: string) =>
  PAGE_IMAGE_WIDTHS[src.split("/").pop() ?? ""] ?? 1500;

const imageToDisplayPx = (imageWidth: number) =>
  (imageWidth * PAGE_DISPLAY_HEIGHT_PX) / PAGE_IMAGE_HEIGHT;

function BrochurePage({ src }: { src: string }) {
  const width = getPageImageWidth(src);

  return (
    <div className="brochure-page-container relative h-120 shrink-0">
      <Image
        className="brochure-page block h-120 w-auto max-w-none"
        src={src}
        alt="Brochure Page"
        width={width}
        height={PAGE_IMAGE_HEIGHT}
      />
    </div>
  );
}

const FLIP_DURATION_MS = 700;

// A page that turns about its right edge, unfurling to the right.
//
// The container is as wide as the page below it. The turning page sits on the
// container's right edge (its hinge), and its box is as wide as the front page,
// which matches the width of the page it turns onto. Both faces are
// right-aligned in that box, so the turned page lands exactly where the next
// resting page is drawn and nothing snaps when the fold index advances.
//
// The back page can be a little narrower than the box it lands in, which leaves
// a thin strip between it and the hinge. Until the fold index advances that
// strip would be empty, so the edge of the upcoming below page is drawn there.
// It's the page that becomes the next container's below page, in the same spot.
function FlippablePage({
  frontSrc,
  belowSrc,
  upcomingBelowSrc,
  backSrc,
  flipped,
  onClick,
}: {
  frontSrc: string;
  belowSrc?: string;
  upcomingBelowSrc?: string;
  backSrc?: string;
  flipped: boolean;
  onClick: () => void;
}) {
  const gapWidthPx =
    backSrc && upcomingBelowSrc
      ? Math.max(
          0,
          imageToDisplayPx(getPageImageWidth(frontSrc)) -
            imageToDisplayPx(getPageImageWidth(backSrc)),
        )
      : 0;

  return (
    <div
      className="brochure-turning-container relative h-120 cursor-pointer"
      onClick={onClick}
    >
      {/* On the last page there's nothing below it. The front page stands in,
          hidden, so the container keeps its width. */}
      <div
        className={`brochure-next-below relative ${belowSrc ? "" : "invisible"}`}
      >
        <BrochurePage src={belowSrc ?? frontSrc} />
      </div>
      {upcomingBelowSrc && gapWidthPx > 0 && (
        <div
          className="brochure-upcoming-below absolute top-0 left-full overflow-hidden"
          style={{
            width: `${gapWidthPx}px`,
            // only shown once the page has passed halfway, while it's over here
            opacity: flipped ? 1 : 0,
            transition: `opacity 0s linear ${FLIP_DURATION_MS / 2}ms`,
          }}
        >
          <BrochurePage src={upcomingBelowSrc} />
        </div>
      )}
      <div className="brochure-turning-page absolute inset-y-0 right-0 drop-shadow-lg perspective-distant">
        <div
          className="relative h-full origin-right transition-transform ease-in-out transform-3d"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transitionDuration: `${FLIP_DURATION_MS}ms`,
          }}
        >
          <div className="brochure-inside-page relative backface-hidden">
            <BrochurePage src={frontSrc} />
          </div>
          {backSrc && (
            <div
              className="brochure-behind absolute inset-0 flex justify-end backface-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              <BrochurePage src={backSrc} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function S06_EnsrqBarrelRollBrochure() {
  // pages continue rolling to the right
  // order
  // 16
  // 1 - 14
  // 1 - 2 - 13
  // 1 - 2 - 3 - 12
  // 1 - 2 - 3 - 4 - 11
  // 1 - 2 - 3 - 4 - 5 - 10
  // 1 - 2 - 3 - 4 - 5 - 6 - 9
  // 1 - 2 - 3 - 4 - 5 - 6 - 7 - 8
  // last page's other side has the next last page

  // show the last 3 with the prev overflowing

  const path = "/ensrq/s06/brochure-pages";
  const insidePages = [
    "season-brochure-16.png",
    "season-brochure-01.png",
    "season-brochure-02.png",
    "season-brochure-03.png",
    "season-brochure-04.png",
    "season-brochure-05.png",
    "season-brochure-06.png",
    "season-brochure-07.png",
  ];
  const outsidePages = [
    "season-brochure-16.png",
    "season-brochure-14.png",
    "season-brochure-13.png",
    "season-brochure-12.png",
    "season-brochure-11.png",
    "season-brochure-10.png",
    "season-brochure-09.png",
    "season-brochure-08.png",
  ];
  const insidePagePaths = insidePages.map((file) => `${path}/${file}`);
  const outsidePagePaths = outsidePages.map((file) => `${path}/${file}`);
  const [foldIndex, setFoldIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // Which fold the row is positioned for. It runs ahead of foldIndex while a
  // page is turning, so the row slides in step with the turn instead of
  // jumping when the fold index advances.
  const [offsetIndex, setOffsetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [frameWidth, setFrameWidth] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const isFlippingRef = useRef(false);
  const flipTimeoutRef = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(flipTimeoutRef.current);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      setFrameWidth(entry.contentRect.width);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Width of the row at rest: the turned pages plus the current container.
  // Positions within the row never change when the fold index advances, so
  // this is all that's needed to place it in the frame.
  const getRestingRowWidthPx = (index: number) => {
    const turnedPx = insidePagePaths
      .slice(1, index + 1)
      .reduce((sum, src) => sum + imageToDisplayPx(getPageImageWidth(src)), 0);
    const containerSrc = insidePagePaths[index + 1] ?? outsidePagePaths[index];

    return turnedPx + imageToDisplayPx(getPageImageWidth(containerSrc));
  };

  // Centered when the row fits in the frame. Otherwise its right edge is
  // pinned to the frame's right edge and the earlier pages overflow left.
  const rowWidthPx = getRestingRowWidthPx(offsetIndex);
  const rowOffsetPx = Math.round(
    rowWidthPx <= frameWidth
      ? (frameWidth - rowWidthPx) / 2
      : frameWidth - rowWidthPx,
  );

  // Turns the current page over, then moves on to the next one. The page is
  // keyed by foldIndex, so the next one mounts unflipped with no animation.
  const open = () => {
    if (isFlippingRef.current || foldIndex >= outsidePagePaths.length - 1) {
      return;
    }

    isFlippingRef.current = true;
    setIsAnimating(true);
    setFlipped(true);
    setOffsetIndex(foldIndex + 1);
    flipTimeoutRef.current = window.setTimeout(() => {
      setFoldIndex((prev) => prev + 1);
      setFlipped(false);
      setIsAnimating(false);
      isFlippingRef.current = false;
    }, FLIP_DURATION_MS);
  };

  // The reverse: the previous page mounts already turned, then turns back.
  const close = () => {
    if (isFlippingRef.current || foldIndex <= 0) {
      return;
    }

    isFlippingRef.current = true;
    setIsAnimating(true);
    setFoldIndex((prev) => prev - 1);
    setFlipped(true);
    // wait for the turned page to paint before turning it back
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        setFlipped(false);
        setOffsetIndex(foldIndex - 1);
      }),
    );
    flipTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      isFlippingRef.current = false;
    }, FLIP_DURATION_MS);
  };

  return (
    <div className="ensrq-barrel-roll-brochure-container group relative mx-auto flex w-full max-w-200 flex-col items-center">
      <div
        ref={frameRef}
        className="brochure-frame relative h-120 w-[calc(100%-6rem)]"
      >
        <div
          className="brochure-pages-area absolute top-0 left-0 flex w-max flex-row"
          style={{
            transform: `translateX(${rowOffsetPx}px)`,
            transition: isAnimating
              ? `transform ${FLIP_DURATION_MS}ms ease-in-out`
              : "none",
            // hold off until the frame has been measured
            visibility: frameWidth > 0 ? "visible" : "hidden",
          }}
        >
          <div
            className="brochure-outside-page flex cursor-pointer flex-row"
            onClick={close}
          >
            {Array.from({ length: foldIndex + 1 }, (_, i) => {
              if (i === 0) return null;
              return <BrochurePage key={i} src={insidePagePaths[i]} />;
            })}
          </div>
          <FlippablePage
            key={foldIndex}
            belowSrc={insidePagePaths[foldIndex + 1]}
            upcomingBelowSrc={insidePagePaths[foldIndex + 2]}
            frontSrc={outsidePagePaths[foldIndex]}
            backSrc={outsidePagePaths[foldIndex + 1]}
            flipped={flipped}
            onClick={open}
          />
        </div>
      </div>
      <div className="page-turn-indicators pointer-events-none absolute inset-0 flex items-center justify-between">
        <div
          className={`close-indicator pointer-events-auto flex h-8 w-12 cursor-pointer items-center justify-center rounded-full border opacity-60 transition-opacity lg:opacity-0 ${foldIndex === 0 ? "pointer-events-none cursor-not-allowed group-hover:opacity-20" : "group-hover:opacity-60"}`}
          onClick={close}
        >
          &#9664;
        </div>
        <div
          className={`open-indicator pointer-events-auto flex h-8 w-12 cursor-pointer items-center justify-center rounded-full border opacity-60 transition-opacity lg:opacity-0 ${foldIndex === insidePagePaths.length - 1 ? "pointer-events-auto cursor-not-allowed group-hover:opacity-20" : "group-hover:opacity-60"}`}
          onClick={open}
        >
          &#9654;
        </div>
      </div>
    </div>
  );
}
