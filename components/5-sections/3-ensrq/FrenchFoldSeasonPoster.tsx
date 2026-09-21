"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Edge = "left" | "right" | "top" | "bottom";

type posterDetails = {
  width: number;
  height: number;
  widthRatio: number;
  heightRatio: number;
  scale: number;
  rotationToNext: number;
  unfoldingEdgeToNext: Edge | "none";
};

// The pages a poster folds down to, in the order they unfold: cover, quarter,
// half, full. The layout belongs to the fold, not to any one season's files, so
// it's indexed by position and every season's images are expected in this order
// and at these sizes.
const POSTER_LAYOUT: posterDetails[] = [
  {
    width: 1800,
    height: 2700,
    widthRatio: 2,
    heightRatio: 3,
    scale: 1,
    rotationToNext: 0,
    unfoldingEdgeToNext: "left",
  },
  {
    width: 3600,
    height: 2699,
    widthRatio: 4,
    heightRatio: 3,
    scale: 2,
    rotationToNext: -90,
    unfoldingEdgeToNext: "top",
  },
  {
    width: 5400,
    height: 3600,
    widthRatio: 6,
    heightRatio: 4,
    scale: 4,
    rotationToNext: 0,
    unfoldingEdgeToNext: "top",
  },
  {
    width: 5400,
    height: 7200,
    widthRatio: 6,
    heightRatio: 8,
    scale: 8,
    rotationToNext: 0,
    unfoldingEdgeToNext: "none",
  },
];

const LAST_PAGE_INDEX = POSTER_LAYOUT.length - 1;
const getPage = (index: number) => POSTER_LAYOUT[index];

// one file per page of POSTER_LAYOUT, in the same order
type PosterPages = readonly [string, string, string, string];

// All four images are the same pixels per ratio unit (900), so the ratios are
// used directly as sizes. One unit is drawn as UNIT_PX and the camera scales it
// to fit the viewport.
const UNIT_PX = 100;
const VIEW_MARGIN = 0.9;
const PERSPECTIVE_PX = 1600;
const UNFOLD_MS = 1200;
const TURN_MS = 800;
const IMAGE_SIZES = "(min-width: 672px) 672px, 100vw";

// How a page unfolds toward each edge. The page is a flap hinged on that edge:
// it lifts off the sheet, swings over the hinge, and lands beside where it was.
// dx / dy point from the page toward where it lands. CSS rotates the flap
// toward the viewer with these signs.
const EDGE_FOLDS = {
  left: { dx: -1, dy: 0, axis: "Y", flipDeg: -180 },
  right: { dx: 1, dy: 0, axis: "Y", flipDeg: 180 },
  top: { dx: 0, dy: -1, axis: "X", flipDeg: 180 },
  bottom: { dx: 0, dy: 1, axis: "X", flipDeg: -180 },
} as const;

// ready:    the page is folded up, as it rests
// turned:   still folded, but turned by rotationToNext
// unfolded: the flap has swung over, opening the sheet
type Pose = "ready" | "unfolded" | "turned";

type Size = { width: number; height: number };

const fitScale = (unitsW: number, unitsH: number, view: Size) =>
  Math.min(
    (view.width * VIEW_MARGIN) / (unitsW * UNIT_PX),
    (view.height * VIEW_MARGIN) / (unitsH * UNIT_PX),
  );

function PosterImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={IMAGE_SIZES}
      loading="eager"
      draggable={false}
      className="object-fill select-none"
    />
  );
}

// A page drawn across the whole unfolded sheet (the frame), rotated about the
// frame's center, then shifted so the given frame point lands at the top left.
// Clip it with a box of the size you want to see.
function FramePage({
  src,
  widthRatio,
  heightRatio,
  rotationDeg,
  frameW,
  frameH,
  originX,
  originY,
}: {
  src: string;
  widthRatio: number;
  heightRatio: number;
  rotationDeg: number;
  frameW: number;
  frameH: number;
  originX: number;
  originY: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: -originX * UNIT_PX,
        top: -originY * UNIT_PX,
        width: frameW * UNIT_PX,
        height: frameH * UNIT_PX,
      }}
    >
      <div
        className="absolute"
        style={{
          left: ((frameW - widthRatio) / 2) * UNIT_PX,
          top: ((frameH - heightRatio) / 2) * UNIT_PX,
          width: widthRatio * UNIT_PX,
          height: heightRatio * UNIT_PX,
          transform: `rotate(${rotationDeg}deg)`,
        }}
      >
        <PosterImage src={src} alt="" />
      </div>
    </div>
  );
}

// One unfold: page `pageIndex` opens up into page `pageIndex + 1`.
//
// The frame is the sheet once opened, in the page's own unrotated orientation.
// The page sits in one half of it. Its flap swings over onto the other half,
// and its back face shows that half of the next page. Underneath, the static
// leaf shows the half of the next page that the page was sitting on. Both
// halves are cut from the same image, so once open they read as the next page.
//
// The next page is drawn in the frame turned by the opposite of
// rotationToNext, so turning the whole sheet by rotationToNext stands it up.
// The sheet turns while still folded, before the flap opens, so the flap opens
// toward the edge as it appears on screen after the turn.
//
// The camera is what zooms and turns. Every pose is framed so that the last
// pose of one scene is the same picture as the first pose of the next, which
// lets the scene swap without a visible jump.
function PosterScene({
  srcs,
  pageIndex,
  pose,
  transitionMs,
  view,
}: {
  srcs: readonly string[];
  pageIndex: number;
  pose: Pose;
  transitionMs: number;
  view: Size;
}) {
  const page = getPage(pageIndex);
  const next = pageIndex < LAST_PAGE_INDEX ? getPage(pageIndex + 1) : undefined;
  const fold =
    next && page.unfoldingEdgeToNext !== "none"
      ? EDGE_FOLDS[page.unfoldingEdgeToNext]
      : undefined;

  const pageW = page.widthRatio;
  const pageH = page.heightRatio;
  const frameW = fold && fold.dx !== 0 ? pageW * 2 : pageW;
  const frameH = fold && fold.dy !== 0 ? pageH * 2 : pageH;
  // where the folded page sits in the frame, and where its flap lands
  const restX = fold && fold.dx < 0 ? pageW : 0;
  const restY = fold && fold.dy < 0 ? pageH : 0;
  const landX = fold ? restX + fold.dx * pageW : 0;
  const landY = fold ? restY + fold.dy * pageH : 0;

  let focusX = frameW / 2;
  let focusY = frameH / 2;
  let rotation = 0;
  let scale = fitScale(frameW, frameH, view);

  if (fold && next) {
    if (pose === "ready") {
      focusX = restX + pageW / 2;
      focusY = restY + pageH / 2;
      scale = fitScale(pageW, pageH, view);
    } else if (pose === "turned") {
      // still folded, but already turned so the unfold happens toward the
      // rotated edge
      focusX = restX + pageW / 2;
      focusY = restY + pageH / 2;
      rotation = page.rotationToNext;
      scale =
        Math.abs(rotation) % 180 === 90
          ? fitScale(pageH, pageW, view)
          : fitScale(pageW, pageH, view);
    } else {
      // open, and already turned, which is how the next page will rest
      rotation = page.rotationToNext;
      scale = fitScale(next.widthRatio, next.heightRatio, view);
    }
  }

  const flapTransform = (deg: number) =>
    fold ? `rotate${fold.axis}(${deg}deg)` : undefined;
  const boxStyle = (x: number, y: number) => ({
    left: x * UNIT_PX,
    top: y * UNIT_PX,
    width: pageW * UNIT_PX,
    height: pageH * UNIT_PX,
  });

  return (
    <div
      className="poster-camera absolute top-0 left-0 origin-top-left"
      style={{
        transform: `translate(${view.width / 2}px, ${view.height / 2}px) rotate(${rotation}deg) scale(${scale}) translate(${-focusX * UNIT_PX}px, ${-focusY * UNIT_PX}px)`,
        transition:
          transitionMs > 0 ? `transform ${transitionMs}ms ease-in-out` : "none",
      }}
    >
      <div
        className="poster-frame relative"
        style={{
          width: frameW * UNIT_PX,
          height: frameH * UNIT_PX,
        }}
      >
        {fold && next ? (
          <>
            {/* drawn first so the flap paints over it */}
            <div
              className="poster-static-leaf absolute overflow-hidden"
              style={boxStyle(restX, restY)}
            >
              <FramePage
                src={srcs[pageIndex + 1]}
                widthRatio={next.widthRatio}
                heightRatio={next.heightRatio}
                rotationDeg={-page.rotationToNext}
                frameW={frameW}
                frameH={frameH}
                originX={restX}
                originY={restY}
              />
            </div>
            {/* The shadow filter and the perspective live here, one level above
                the 3D flap. A filter on the flap itself flattens its two faces
                into one picture, which then turns over as a mirror image. */}
            <div
              className="poster-flap-stage absolute"
              style={{ ...boxStyle(restX, restY), perspective: PERSPECTIVE_PX }}
            >
              <div
                className="poster-flap absolute inset-0 transform-3d"
                style={{
                  transformOrigin:
                    fold.axis === "Y"
                      ? `${page.unfoldingEdgeToNext} center`
                      : `center ${page.unfoldingEdgeToNext}`,
                  transform: flapTransform(
                    pose === "unfolded" ? fold.flipDeg : 0,
                  ),
                  transition:
                    transitionMs > 0
                      ? `transform ${transitionMs}ms ease-in-out`
                      : "none",
                }}
              >
                <div className="poster-flap-front absolute inset-0 overflow-hidden backface-hidden">
                  <PosterImage
                    src={srcs[pageIndex]}
                    alt={`Season Poster ${pageIndex + 1}`}
                  />
                </div>
                {/* turned over once by the hinge and once here, so it lands
                    facing the right way round */}
                <div
                  className="poster-flap-back absolute inset-0 overflow-hidden backface-hidden"
                  style={{ transform: flapTransform(180) }}
                >
                  <FramePage
                    src={srcs[pageIndex + 1]}
                    widthRatio={next.widthRatio}
                    heightRatio={next.heightRatio}
                    rotationDeg={-page.rotationToNext}
                    frameW={frameW}
                    frameH={frameH}
                    originX={landX}
                    originY={landY}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className="poster-last-page absolute inset-0"
            style={boxStyle(0, 0)}
          >
            <PosterImage
              src={srcs[pageIndex]}
              alt={`Season Poster ${pageIndex + 1}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// A season poster that unfolds like a french fold: cover, quarter, half, then
// the full poster. `pages` are the four image files inside `path`, in that order.
export function FrenchFoldSeasonPoster({
  path,
  pages,
}: {
  path: string;
  pages: PosterPages;
}) {
  const dev = false;
  const posterSrcs = pages.map((page) => `${path}/${page}`);

  // the page the poster is showing, and how far along its unfold it is
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

  const runPose = (nextPose: Pose, ms: number, then: () => void) => {
    setTransitionMs(ms);
    setPose(nextPose);
    timeoutRef.current = window.setTimeout(then, ms);
  };

  // Unfolds one step: the sheet turns first if the page needs it, then the flap
  // opens. The next page's scene mounts folded, in the same picture.
  const unfold = () => {
    if (isBusyRef.current || step >= LAST_PAGE_INDEX) return;

    const needsTurn = getPage(step).rotationToNext !== 0;
    const done = () => {
      setStep((prev) => prev + 1);
      setPose("ready");
      setTransitionMs(0);
      isBusyRef.current = false;
    };

    isBusyRef.current = true;
    if (needsTurn) {
      runPose("turned", TURN_MS, () => runPose("unfolded", UNFOLD_MS, done));
    } else {
      runPose("unfolded", UNFOLD_MS, done);
    }
  };

  // The reverse: the previous scene mounts open, folds up, then turns back.
  const fold = () => {
    if (isBusyRef.current || step <= 0) return;

    const needsTurn = getPage(step - 1).rotationToNext !== 0;
    const done = () => {
      setTransitionMs(0);
      isBusyRef.current = false;
    };

    isBusyRef.current = true;
    setStep(step - 1);
    setPose("unfolded");
    setTransitionMs(0);
    // wait for the open sheet to paint before folding it back up
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = window.requestAnimationFrame(() => {
        if (needsTurn) {
          runPose("turned", UNFOLD_MS, () => runPose("ready", TURN_MS, done));
        } else {
          runPose("ready", UNFOLD_MS, done);
        }
      });
    });
  };

  const buttonClass =
    "flex h-8 w-12 items-center justify-center rounded-full border transition-opacity";

  return (
    <div className="french-fold-poster-container h-full w-full">
      {dev && (
        <div className="dev-container flex min-h-120 items-start justify-start gap-4 border">
          {posterSrcs.map((src, index) => {
            const displayWidth = 600;
            return (
              <div
                key={index}
                className="relative min-h-80 w-80 shrink-0 border"
              >
                <Image
                  src={src}
                  alt={`Season Poster ${index + 1}`}
                  sizes={`${displayWidth}px`}
                  className="block h-auto w-full object-contain"
                  fill
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="season-poster-container aspect-2/3 md:aspect-3/2 w-full">
        <div className="season-poster-display-container mx-auto flex w-full flex-col items-center gap-4">
          <div
            ref={viewportRef}
            className={`season-poster-viewport relative aspect-2/3 md:aspect-3/2 w-full ${step < LAST_PAGE_INDEX ? "cursor-pointer" : ""}`}
            style={{ visibility: view.width > 0 ? "visible" : "hidden" }}
            onClick={unfold}
          >
            {view.width > 0 && (
              <PosterScene
                key={step}
                srcs={posterSrcs}
                pageIndex={step}
                pose={pose}
                transitionMs={transitionMs}
                view={view}
              />
            )}
          </div>
          <div className="season-poster-controls flex items-center gap-4">
            <button
              type="button"
              aria-label="Fold poster"
              className={`${buttonClass} ${step === 0 ? "cursor-not-allowed opacity-20" : "cursor-pointer opacity-60 hover:opacity-100"}`}
              onClick={fold}
            >
              &#9664;
            </button>
            <span className="text-sm tabular-nums">
              {step + 1} / {POSTER_LAYOUT.length}
            </span>
            <button
              type="button"
              aria-label="Unfold poster"
              className={`${buttonClass} ${step === LAST_PAGE_INDEX ? "cursor-not-allowed opacity-20" : "cursor-pointer opacity-60 hover:opacity-100"}`}
              onClick={unfold}
            >
              &#9654;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
