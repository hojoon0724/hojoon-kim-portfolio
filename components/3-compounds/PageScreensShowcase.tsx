"use client";

import { Icon, SegmentedControl } from "@/components/1-atoms";
import { useInView } from "@/hooks";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

export interface PageScreen {
  src: string;
  width: number;
  height: number;
  // the screenshot isn't in public/ yet: a dashed frame at its size names the file to add instead
  placeholder?: boolean;
}

export interface PageScreens {
  desktop: PageScreen;
  mobile: PageScreen;
}

export interface ShowcaseVersion {
  // the toggle's label, and how the alt text names this version
  label: string;
  screens: PageScreens;
  // a dark-mode screenshot: the phone's safari toolbar switches to its dark look to match
  dark?: boolean;
}

export interface ShowcasePage {
  // the page's name, for its tab and the alt text. only needed when there's more than one page to pick from
  title?: string;
  // one version shows no toggle; more get a toggle that fades between them at the same scroll spot
  versions: ShowcaseVersion[];
  // shown in both address bars
  url?: string;
}

type Device = keyof PageScreens;

const deviceLabels: Record<Device, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
};

// iphone 17 pro: a 71.9 × 150 mm body around a 402 × 874 pt screen, with an even ~2.65 mm bezel.
// everything on the phone is sized from its width (cqw), so the bezel, the corners and the safari chrome keep their
// proportions at any size. pt() turns screen points into a share of the phone's width
const PHONE_ASPECT = 71.9 / 150;
const BEZEL_CQW = 3.7;
const SCREEN_CQW = 100 - BEZEL_CQW * 2;
const SCREEN_PT = 402;
const pt = (points: number) =>
  `${((points * SCREEN_CQW) / SCREEN_PT).toFixed(3)}cqw`;
// the screen's corner radius; the body's is the same curve pushed out by the bezel, so the two stay concentric
const SCREEN_RADIUS_PT = 62;
const BODY_RADIUS = `calc(${pt(SCREEN_RADIUS_PT)} + ${BEZEL_CQW}cqw)`;

const STATUS_BAR_PT = 54;
const TOOLBAR_PT = 80;

// the phone's width sets both frames' height: the phone is as tall as an iphone 17 pro at that width, and the
// desktop window matches it. capped by the viewport height so a whole phone fits on screen.
// a parent can set --showcase-phone-w to size it for its own layout
const phoneWidth =
  "var(--showcase-phone-w,min(clamp(240px,26vw,330px),calc(80svh*71.9/150)))";
const frameSizes = {
  "--phone-w": phoneWidth,
  "--frame-h": `calc(var(--phone-w) / ${PHONE_ASPECT})`,
} as CSSProperties;

// stands in for a screenshot that hasn't been added yet, at the size it will be, so the window scrolls the same
function ScreenPlaceholder({ screen }: { screen: PageScreen }) {
  return (
    <div
      className="flex w-full flex-col items-center justify-start gap-1 border-2 border-dashed border-black/25 bg-black/5 px-2 pt-16 text-center font-mono text-[10px] text-black/60 md:text-xs"
      style={{ aspectRatio: `${screen.width} / ${screen.height}` }}
    >
      <span className="font-bold uppercase">Screenshot needed</span>
      <span className="break-all">public{screen.src}</span>
    </div>
  );
}

// every version stacked from the top, so a switch fades between them at the same scroll spot. only the showing one
// takes up space, so the window scrolls exactly as far as that version's page; the rest overlay it, clipped
function ScreenLayers({
  page,
  device,
  version,
}: {
  page: ShowcasePage;
  device: Device;
  version: number;
}) {
  return (
    <div className="relative overflow-hidden">
      {page.versions.map((option, index) => {
        const screen = option.screens[device];
        const layerClass = `w-full transition-opacity duration-500 ${index === version ? "relative opacity-100" : "absolute inset-x-0 top-0 opacity-0"}`;
        return screen.placeholder ? (
          <div key={index} className={layerClass}>
            <ScreenPlaceholder screen={screen} />
          </div>
        ) : (
          // served as-is: next's optimizer re-encodes without the color profile,
          // which flattens display p3 screenshots to srgb
          <Image
            key={index}
            src={screen.src}
            alt={
              index === version
                ? `${page.title ? `${page.title} page` : "Page"} on ${deviceLabels[device].toLowerCase()}, ${option.label.toLowerCase()}`
                : ""
            }
            width={screen.width}
            height={screen.height}
            unoptimized
            className={`h-auto ${layerClass}`}
          />
        );
      })}
    </div>
  );
}

// the collaboration section's editor window, as a browser: same corners, shadow, ring and title bar
function DesktopFrame({
  page,
  version,
}: {
  page: ShowcasePage;
  version: number;
}) {
  return (
    // the window behind the screenshot takes the page's own background, like the phone's screen
    <div
      className={`flex h-(--frame-h) flex-col overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10 transition-colors duration-500 ${page.versions[version]?.dark ? "bg-(--moindi-gray-850)" : "bg-white"}`}
    >
      <div className="relative flex h-5 shrink-0 items-center gap-1.25 bg-[#252526] px-3 md:h-7 md:gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#F85149]/80 md:h-2.5 md:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#D29922]/80 md:h-2.5 md:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#2EA043]/80 md:h-2.5 md:w-2.5" />
        <span className="absolute left-1/2 flex h-4.5 w-[min(40%,16rem)] -translate-x-1/2 items-center justify-center rounded-sm bg-[#1E1E1E] font-mono text-[8px] text-[#9D9D9D] md:text-[10px]">
          {page.url}
        </span>
      </div>
      <div
        tabIndex={0}
        aria-label={`${page.title ?? "Page"}, desktop. Scrolls to show the full page.`}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <ScreenLayers page={page} device="desktop" version={version} />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-black font-semibold text-white"
      style={{
        height: pt(STATUS_BAR_PT),
        paddingInline: pt(32),
        fontSize: pt(17),
      }}
    >
      <span style={{ width: pt(54), textAlign: "center" }}>9:41</span>
      {/* dynamic island */}
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10"
        style={{ top: pt(11), width: pt(126), height: pt(37) }}
      />
      <span className="flex items-center" style={{ gap: pt(6) }}>
        {/* signal */}
        <svg viewBox="0 0 18 12" style={{ width: pt(18) }} fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wi-fi */}
        <svg viewBox="0 0 16 12" style={{ width: pt(16) }} fill="currentColor">
          <path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .8 10.3 10.3 0 0 0 .8 3.7L2 5c1.6-1.5 3.7-2.4 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4.4c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5c-.6 0-1.1.2-1.5.5L8 12l1.5-1.8c-.4-.3-.9-.5-1.5-.5Z" />
        </svg>
        {/* battery */}
        <svg viewBox="0 0 27 13" style={{ width: pt(27) }} fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="23"
            height="12"
            rx="3.8"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <rect
            x="2"
            y="2"
            width="20"
            height="9"
            rx="2.5"
            fill="currentColor"
          />
          <path
            d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
        </svg>
      </span>
    </div>
  );
}

// safari's compact bottom bar: back, the address pill and more, floating over the page, then the home indicator
function SafariToolbar({
  url,
  dark = false,
}: {
  url?: string;
  dark?: boolean;
}) {
  // safari's floating glass, light or dark to match the page under it
  const glass = `flex items-center justify-center rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.15)] ring-1 backdrop-blur-md transition-colors duration-500 ${
    dark
      ? "bg-[#1C1C1E]/75 text-white ring-white/10"
      : "bg-white/75 text-black ring-black/5"
  }`;
  const circle = { width: pt(48), height: pt(48) };
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center"
      style={{ paddingInline: pt(26), height: pt(TOOLBAR_PT) }}
    >
      <div className="flex w-full items-center" style={{ gap: pt(8) }}>
        <span className={glass} style={circle}>
          <svg
            viewBox="0 0 12 20"
            style={{ height: pt(18) }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 2 2 10l8 8" />
          </svg>
        </span>
        <span
          className={`${glass} flex-1 font-medium`}
          style={{ height: pt(48), fontSize: pt(16), gap: pt(6) }}
        >
          {url}
        </span>
        <span className={glass} style={circle}>
          <svg viewBox="0 0 20 4" style={{ width: pt(20) }} fill="currentColor">
            <circle cx="2" cy="2" r="2" />
            <circle cx="10" cy="2" r="2" />
            <circle cx="18" cy="2" r="2" />
          </svg>
        </span>
      </div>
      <span
        className="absolute hidden rounded-full bg-black"
        style={{ bottom: pt(8), width: pt(134), height: pt(5) }}
      />
    </div>
  );
}

// an iphone 17 pro running safari. the page scrolls under the status bar and the floating toolbar, and its padding
// lets the top and bottom of the page clear them
function PhoneFrame({
  page,
  version,
}: {
  page: ShowcasePage;
  version: number;
}) {
  return (
    <div className="@container w-(--phone-w)">
      <div
        // an explicit height rather than aspect-ratio: safari adds the bezel's padding on top of an aspect-ratio
        // height, which made the phone taller than the desktop window. --frame-h is that same ratio, so the two
        // always match
        className="relative h-(--frame-h) w-full bg-[#1C1C1E] shadow-xl ring-1 ring-black/10"
        style={{ borderRadius: BODY_RADIUS, padding: `${BEZEL_CQW}cqw` }}
      >
        <div
          // the screen behind the screenshot takes the page's own background, so its edges can't show as a light
          // hairline around a dark screenshot
          className={`relative h-full w-full overflow-hidden transition-colors duration-500 ${page.versions[version]?.dark ? "bg-(--moindi-gray-850)" : "bg-white"}`}
          style={{ borderRadius: pt(SCREEN_RADIUS_PT) }}
        >
          <StatusBar />
          <div
            tabIndex={0}
            aria-label={`${page.title ?? "Page"}, mobile. Scrolls to show the full page.`}
            className="absolute inset-0 overflow-y-auto [scrollbar-width:none]"
            style={{
              paddingTop: pt(STATUS_BAR_PT),
              paddingBottom: pt(TOOLBAR_PT),
            }}
          >
            <ScreenLayers page={page} device="mobile" version={version} />
          </div>
          <SafariToolbar url={page.url} dark={page.versions[version]?.dark} />
        </div>
      </div>
    </div>
  );
}

// pages' desktop and mobile screenshots side by side at the same height, each scrolling on its own.
// more than one page gets tabs to pick between them; a page with more than one version gets a toggle that fades
// both frames between them
export function PageScreensShowcase({
  pages,
  defaultVersion = 0,
  autoSwitchMs,
  className = "",
}: {
  pages: ShowcasePage[];
  defaultVersion?: number;
  // when set, each time the showcase comes into view it starts on the default version and moves to the next
  // one after this long. picking a version by hand stops it
  autoSwitchMs?: number;
  className?: string;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [version, setVersion] = useState(defaultVersion);
  const [ref, isInView] = useInView<HTMLDivElement>(0.6);
  const [pickedByHand, setPickedByHand] = useState(false);

  useEffect(() => {
    if (autoSwitchMs === undefined || pickedByHand) return;
    // in view: wait, then switch. out of view: back to the default, ready for the next time it appears
    const timeout = setTimeout(
      () => setVersion(isInView ? defaultVersion + 1 : defaultVersion),
      isInView ? autoSwitchMs : 0,
    );
    return () => clearTimeout(timeout);
  }, [autoSwitchMs, defaultVersion, isInView, pickedByHand]);
  const page = pages[pageIndex];
  const shownVersion = Math.min(version, page.versions.length - 1);
  // below md there's room for one frame at a time, so a toggle picks which
  const [narrowDevice, setNarrowDevice] = useState<"desktop" | "mobile">(
    "mobile",
  );

  const pickVersion = (index: number) => {
    setPickedByHand(true);
    setVersion(index);
  };

  return (
    <div
      ref={ref}
      className={`gap-sm relative flex flex-col ${className} h-full overflow-x-clip`}
      style={frameSizes}
    >
      {/* every control in one row: which page on the left; light or dark, and on phones which device, on the
          right */}
      <div
        // on md and up the device switch is gone, so a single page with a single version has no row at all
        className={`h-7 items-center gap-2 ${pages.length > 1 || page.versions.length > 1 ? "flex" : "flex md:hidden"}`}
      >
        {pages.length > 1 && (
          <>
            <SegmentedControl
              label="Page"
              className="max-md:hidden"
              options={pages.map((option, index) => ({
                value: index,
                content: option.title,
              }))}
              value={pageIndex}
              onChange={setPageIndex}
            />
            {/* phones: the pages fold into a dropdown instead of a row of tabs */}
            <label className="relative h-7 min-w-0 md:hidden">
              <span className="sr-only">Page</span>
              <select
                value={pageIndex}
                onChange={(event) => setPageIndex(+event.target.value)}
                className="roboto-mono h-full max-w-full cursor-pointer appearance-none border border-current bg-transparent pr-7 pl-2.5 text-[11px] font-bold uppercase"
              >
                {pages.map((option, index) => (
                  <option key={index} value={index}>
                    {option.title}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 10 6"
                className="pointer-events-none absolute top-1/2 right-2.5 w-2.5 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m1 1 4 4 4-4" />
              </svg>
            </label>
          </>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {page.versions.length > 1 && (
            <SegmentedControl
              label={page.title ? `${page.title} version` : "Version"}
              options={page.versions.map((option, index) => ({
                value: index,
                content: option.label,
              }))}
              value={shownVersion}
              onChange={pickVersion}
            />
          )}
          <SegmentedControl
            label="Device"
            className="md:hidden"
            options={(["mobile", "desktop"] as const).map((device) => ({
              value: device,
              title: deviceLabels[device],
              content: <Icon icon={device} className="size-4" />,
            }))}
            value={narrowDevice}
            onChange={setNarrowDevice}
          />
        </div>
      </div>
      {/* md and up: side by side. phones: both frames stacked in one spot, cross-fading as the device switch
          changes */}
      <div className="gap-lg grid grid-cols-1 justify-items-center [grid-template-areas:'stack'] md:grid-cols-[minmax(0,1fr)_var(--phone-w)] md:[grid-template-areas:none]">
        {(["desktop", "mobile"] as const).map((device) => (
          <figure
            key={device}
            className={`gap-xs flex min-w-0 flex-col transition-[opacity,scale] duration-300 ease-out motion-reduce:transition-none max-md:[grid-area:stack] ${device === "mobile" ? "w-(--phone-w)" : "w-full"} ${device === narrowDevice ? "" : "max-md:pointer-events-none max-md:scale-95 max-md:opacity-0"}`}
          >
            {/* keyed by page, so a new page starts at its top */}
            {device === "desktop" ? (
              <DesktopFrame
                key={pageIndex}
                page={page}
                version={shownVersion}
              />
            ) : (
              <PhoneFrame key={pageIndex} page={page} version={shownVersion} />
            )}
            <figcaption className="roboto-mono text-xs uppercase opacity-70 max-md:hidden">
              {deviceLabels[device]}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
