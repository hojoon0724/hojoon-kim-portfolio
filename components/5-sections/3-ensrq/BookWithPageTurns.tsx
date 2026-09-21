"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface BookWithPageTurnsProps {
  path: string;
  // One image per view of the book, in order. The first and last are single
  // pages (the covers), so they're half the width of the inner images, which
  // are two-page spreads.
  pages: readonly string[];
  // width / height of a single page
  pageAspectRatio?: number;
}

type Size = { width: number; height: number };
type Side = "left" | "right";
// A face is one page's worth of an image: all of it for a cover, or one half
// of a spread.
type Face = { src: string; part: "whole" | Side };

// ready:  the book is at rest on this view
// turned: the right page has turned over onto the left, showing the next view
type Pose = "ready" | "turned";

// The book is laid out two pages wide, in page widths: the left page runs from
// 0 to 1, the spine is at 1, and the right page runs from 1 to 2. PAGE_PX is
// one page width, and the camera scales it to fit the viewport.
const PAGE_PX = 400;
const VIEW_MARGIN = 0.9;
const PERSPECTIVE_PX = 2400;
const TURN_MS = 900;
const IMAGE_SIZES = "(min-width: 896px) 896px, 100vw";
const DEFAULT_PAGE_ASPECT_RATIO = 1650 / 2550;

// What's on a side of the book at a given view. The front cover is alone on
// the right and the back cover is alone on the left. Every view in between is a
// spread, split down the spine.
const getFace = (
  srcs: readonly string[],
  view: number,
  side: Side,
): Face | undefined => {
  const last = srcs.length - 1;

  if (view === 0) {
    return side === "right" ? { src: srcs[0], part: "whole" } : undefined;
  }
  if (view === last) {
    return side === "left" ? { src: srcs[last], part: "whole" } : undefined;
  }
  return { src: srcs[view], part: side };
};

// Where the camera looks, in page widths from the left. A cover sits on its own
// side of the spine, so the camera centers on that page instead of the spine.
const getFocusX = (view: number, last: number) => {
  if (view === 0) return 1.5;
  if (view === last) return 0.5;
  return 1;
};

function PageFace({ face, alt }: { face: Face; alt: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* a spread is two pages wide, so it's drawn at twice the width of the
          box and shifted to show the half that's wanted */}
      <div
        className="absolute top-0 h-full"
        style={{
          width: face.part === "whole" ? "100%" : "200%",
          left: face.part === "right" ? "-100%" : 0,
        }}
      >
        <Image
          src={face.src}
          alt={alt}
          fill
          sizes={IMAGE_SIZES}
          loading="eager"
          draggable={false}
          className="object-fill select-none"
        />
      </div>
    </div>
  );
}

// One page turn: the book at view `step` turns over into view `step + 1`.
//
// The right page is a flap hinged on the spine. It lifts off, swings over, and
// lands on the left, so its front is the right page of this view and its back
// is the left page of the next. Underneath, the right page of the next view is
// already in place for the flap to uncover. The left page of this view stays
// put and is covered when the flap lands.
//
// On the last view there's nothing left to turn, so only its page is drawn.
//
// The camera slides along with the turn. Each pose is framed the same as the
// book at rest on that view, so the last pose of one scene is the same picture
// as the first pose of the next, which lets the scene swap without a jump.
function BookScene({
  srcs,
  step,
  pose,
  transitionMs,
  view,
  pageAspectRatio,
  onNext,
  onPrev,
}: {
  srcs: readonly string[];
  step: number;
  pose: Pose;
  transitionMs: number;
  view: Size;
  pageAspectRatio: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const last = srcs.length - 1;
  const pageH = PAGE_PX / pageAspectRatio;
  // one scale for every view, so pages stay the same size as the book opens
  const scale = Math.min(
    (view.width * VIEW_MARGIN) / (PAGE_PX * 2),
    (view.height * VIEW_MARGIN) / pageH,
  );
  const focusX = getFocusX(pose === "turned" ? step + 1 : step, last) * PAGE_PX;

  const leftFace = getFace(srcs, step, "left");
  const nextRightFace =
    step < last ? getFace(srcs, step + 1, "right") : undefined;
  const flapFront = step < last ? getFace(srcs, step, "right") : undefined;
  const flapBack = step < last ? getFace(srcs, step + 1, "left") : undefined;

  const pageStyle = (x: number) => ({
    left: x * PAGE_PX,
    top: 0,
    width: PAGE_PX,
    height: pageH,
  });
  const transition =
    transitionMs > 0 ? `transform ${transitionMs}ms ease-in-out` : "none";

  return (
    <div
      className="book-camera absolute top-0 left-0 origin-top-left"
      style={{
        transform: `translate(${view.width / 2}px, ${view.height / 2}px) scale(${scale}) translate(${-focusX}px, ${-pageH / 2}px)`,
        transition,
      }}
    >
      <div
        className="book-frame relative"
        style={{ width: PAGE_PX * 2, height: pageH }}
      >
        {leftFace && (
          <div
            className="book-left-page absolute cursor-pointer"
            style={pageStyle(0)}
            onClick={onPrev}
          >
            <PageFace face={leftFace} alt={`Book page ${step + 1}`} />
          </div>
        )}
        {/* drawn before the flap so the flap paints over it */}
        {nextRightFace && (
          <div className="book-next-right-page absolute" style={pageStyle(1)}>
            <PageFace face={nextRightFace} alt="" />
          </div>
        )}
        {flapFront && flapBack && (
          // The shadow filter and the perspective live here, one level above
          // the 3D flap. A filter on the flap itself flattens its two faces
          // into one picture, which then turns over as a mirror image.
          <div
            className="book-flap-stage absolute cursor-pointer"
            style={{ ...pageStyle(1), perspective: PERSPECTIVE_PX }}
            onClick={onNext}
          >
            <div
              className="book-flap absolute inset-0 transform-3d"
              style={{
                transformOrigin: "left center",
                transform: `rotateY(${pose === "turned" ? -180 : 0}deg)`,
                transition,
              }}
            >
              <div className="book-flap-front absolute inset-0 backface-hidden">
                <PageFace face={flapFront} alt={`Book page ${step + 1}`} />
              </div>
              {/* turned over once by the hinge and once here, so it lands
                  facing the right way round */}
              <div
                className="book-flap-back absolute inset-0 backface-hidden"
                style={{ transform: "rotateY(180deg)" }}
              >
                <PageFace face={flapBack} alt="" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function BookWithPageTurns({
  path,
  pages,
  pageAspectRatio = DEFAULT_PAGE_ASPECT_RATIO,
}: BookWithPageTurnsProps) {
  const dev = false;
  const pageSrcs = pages.map((page) => `${path}/${page}`);
  const lastStep = pageSrcs.length - 1;

  // the view the book is on, and whether its right page is mid-turn
  const [step, setStep] = useState(0);
  const [pose, setPose] = useState<Pose>("ready");
  const [transitionMs, setTransitionMs] = useState(0);
  const [view, setView] = useState<Size>({ width: 0, height: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const isBusyRef = useRef(false);
  const timeoutRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(([entry]) => {
      setView({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  // Turns the right page over, then moves on to the next view. The next
  // view's scene mounts at rest, in the same picture.
  const next = () => {
    if (isBusyRef.current || step >= lastStep) return;

    isBusyRef.current = true;
    setTransitionMs(TURN_MS);
    setPose("turned");
    timeoutRef.current = window.setTimeout(() => {
      setStep((prev) => prev + 1);
      setPose("ready");
      setTransitionMs(0);
      isBusyRef.current = false;
    }, TURN_MS);
  };

  // The reverse: the previous view mounts already turned, then turns back.
  const prev = () => {
    if (isBusyRef.current || step <= 0) return;

    isBusyRef.current = true;
    setStep(step - 1);
    setPose("turned");
    setTransitionMs(0);
    // wait for the turned page to paint before turning it back
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = window.requestAnimationFrame(() => {
        setTransitionMs(TURN_MS);
        setPose("ready");
      });
    });
    timeoutRef.current = window.setTimeout(() => {
      setTransitionMs(0);
      isBusyRef.current = false;
    }, TURN_MS);
  };

  // a book needs at least a front and a back
  if (pageSrcs.length < 2) return null;

  const buttonClass =
    "flex h-8 w-12 items-center justify-center rounded-full border transition-opacity";

  return (
    <div className="book-with-page-turn-container h-full w-full">
      {dev && (
        <div className="dev-container flex items-start justify-start gap-4 border">
          {pageSrcs.map((src, index) => {
            const isCover = index === 0 || index === lastStep;
            return (
              <div
                key={index}
                className="relative h-60 shrink-0 border"
                style={{
                  aspectRatio: (isCover ? 1 : 2) * pageAspectRatio,
                }}
              >
                <Image
                  src={src}
                  alt={`Book page ${index + 1}`}
                  sizes="480px"
                  className="block object-contain"
                  fill
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="book-display-container mx-auto flex w-full flex-col items-center gap-4">
        <div
          ref={viewportRef}
          className="book-viewport relative aspect-4/3 w-full"
          style={{ visibility: view.width > 0 ? "visible" : "hidden" }}
        >
          {view.width > 0 && (
            <BookScene
              key={step}
              srcs={pageSrcs}
              step={step}
              pose={pose}
              transitionMs={transitionMs}
              view={view}
              pageAspectRatio={pageAspectRatio}
              onNext={next}
              onPrev={prev}
            />
          )}
        </div>
        <div className="book-controls flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous page"
            className={`${buttonClass} ${step === 0 ? "cursor-not-allowed opacity-20" : "cursor-pointer opacity-60 hover:opacity-100"}`}
            onClick={prev}
          >
            &#9664;
          </button>
          <span className="text-sm tabular-nums">
            {step + 1} / {pageSrcs.length}
          </span>
          <button
            type="button"
            aria-label="Next page"
            className={`${buttonClass} ${step === lastStep ? "cursor-not-allowed opacity-20" : "cursor-pointer opacity-60 hover:opacity-100"}`}
            onClick={next}
          >
            &#9654;
          </button>
        </div>
      </div>
    </div>
  );
}
