"use client";

import { useInView } from "@/hooks";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useCountdown } from "./shared";

// moindi's own type, as the shipped page sets it: Space Grotesk for text, Space Mono for numbers and labels
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const mono = spaceMono.className;

// the purchase block from its first Figma sketch (public/moindi/before-purchase-component.png) to the shipped
// view-project page (moindi-angular: project-header, collapsible-paragraph, user-badge, stake-breakdown,
// range-slider and purchase-shares-calculator), rebuilt as one card that changes a step at a time

// the round both versions show. a share is a dollar, so the goal is the total share count
const round = {
  title: "Echoes in Amber",
  total: 100000,
  artist: 50000,
  sold: 12000,
  artistName: "Luna Veyne",
  artistImage: "/moindi/demo-assets/users/lunaveyne_profile.webp",
  cover: "/moindi/demo-assets/projects/defaultproject.webp",
  description:
    "“Echoes in Amber” is a collection of moments suspended in time—fragments of love, loss, and the quiet in-between. I wanted this album to feel like warm light filtering through old film, like voices from the past whispering through the present. Each track carries a piece of a story, some blurred by memory, others sharp and unshaken. Sonically, it’s a mix of the organic and the surreal—layers of dreamy synths, raw vocals, and textures that crackle like a worn record. This album is for anyone who’s ever looked back at a moment and felt it glowing, even in its absence.",
};
const available = round.total - round.artist - round.sold;
const percentOf = (shares: number) => (shares / round.total) * 100;
const dollars = (value: number) => `$${value.toLocaleString("en-US")}`;

// the changes, in the order they're shown (never rendered: the card shows them). each step keeps every
// change before it
const steps = [
  "The first version: everything we knew it needed, all on screen at once.",
  "The title moves up, and the countdown joins it in the header.",
  "The description becomes a preview, with a favorite button under it.",
  "The artist/investor split repeated the share bar, so the artist and the goal take its place.",
  "The share bar drops its labels and gets thinner, in the secondary tints.",
  "Revenue potential leaves the card.",
  "Typing an amount becomes a slider, and the purchase shows up in the bar.",
] as const;
const FINAL = steps.length - 1;
// the sketch holds long enough to read, then each change starts as the one before it finishes
const HOLD_MS = 1500;
const STEP_MS = 500;

const ease =
  "ease-[cubic-bezier(0.36,0.07,0.19,0.97)] duration-450 motion-reduce:transition-none";

// a block that grows in or collapses away
function Reveal({
  show,
  children,
  className = "",
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] ${ease} ${show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} ${className}`}
      aria-hidden={!show || undefined}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

// two versions of the same spot, cross-fading
function Swap({
  showSecond,
  first,
  second,
  className = "",
}: {
  showSecond: boolean;
  first: ReactNode;
  second: ReactNode;
  className?: string;
}) {
  const layer = (shown: boolean) =>
    `[grid-area:stack] transition-opacity ${ease} ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`;
  return (
    <div className={`grid [grid-template-areas:'stack'] ${className}`}>
      <div className={layer(!showSecond)} aria-hidden={showSecond || undefined}>
        {first}
      </div>
      <div className={layer(showSecond)} aria-hidden={!showSecond || undefined}>
        {second}
      </div>
    </div>
  );
}

// every box has the same 1px line in the shipped border color, shared between neighbors so the lines stay
// even: one box on the outside, and each inner box drawn against it, like a bento box
const line = "border-(--moindi-gray-500)";

// wide follows the desktop page; narrow stacks everything in one column, like the phone version
// the countdown comes in from outside, so the hidden measuring copies can share one still value instead of
// each ticking every second
function PurchaseCard({
  step,
  narrow,
  countdownText,
}: {
  step: number;
  narrow: boolean;
  countdownText: string;
}) {
  const [purchase, setPurchase] = useState(9500);
  const isFinal = step >= FINAL;
  const shownPurchase = isFinal ? purchase : 0;

  const segments = [
    {
      label: "artist’s shares",
      shares: round.artist,
      before: "bg-(--moindi-gray-300)",
      after: "bg-(--moindi-secondary-100)",
    },
    {
      label: "sold",
      shares: round.sold,
      before: "bg-(--moindi-gray-400)",
      after: "bg-(--moindi-secondary-200)",
    },
    {
      label: "available",
      shares: available - shownPurchase,
      before: "bg-(--moindi-secondary-500) text-(--moindi-gray-30)",
      after: "bg-(--moindi-secondary-500) text-(--moindi-gray-30)",
    },
    {
      label: "purchase",
      shares: shownPurchase,
      before: "bg-(--moindi-primary-500)",
      after: "bg-(--moindi-primary-500)",
    },
  ];
  const compactBar = step >= 4;

  return (
    <div
      // one padding everywhere, the shipped --standard-space: 1rem on desktop, 0.5rem on phones (1em here is
      // the shipped 16px)
      className={`${spaceGrotesk.className} flex flex-col border bg-(--moindi-gray-30) text-(--moindi-gray-950) ${line} ${narrow ? "[--pad:0.5em]" : "[--pad:1em]"}`}
    >
      {/* header: "Record Deal" gives way to the title, and the countdown moves up beside it */}
      <div
        className={`flex justify-between gap-(--pad) border-b p-(--pad) ${narrow ? "flex-col items-start gap-[0.25em]" : "items-center"} ${line}`}
      >
        <Swap
          showSecond={step >= 1}
          first={<div className={`${mono} text-[1.6em]`}>Record Deal</div>}
          second={
            <div className="text-[2.5em] leading-none">{round.title}</div>
          }
        />
        <div
          className={`${mono} text-right text-[1em] whitespace-nowrap transition-opacity ${ease} ${step >= 1 ? "opacity-100" : "opacity-0"}`}
        >
          <span className="opacity-50">Ends in: </span>
          {countdownText}
        </div>
      </div>

      {/* the body. wide: three columns become two as the split column folds away. narrow: one column with
          only horizontal lines, like the phone sketch and the shipped phone page. the split gives way to the
          artist and then the goal, each on its own row */}
      {narrow ? (
        <div className={`flex flex-col border-b ${line}`}>
          <div className="flex justify-center p-(--pad)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={round.cover}
              alt=""
              className="aspect-square w-[18em] max-w-full object-cover"
            />
          </div>

          <div className={`flex flex-col border-t p-(--pad) ${line}`}>
            <Reveal show={step < 1}>
              <div className="pb-[0.5em] text-[1.5em]">{round.title}</div>
            </Reveal>
            {/* the full text, then a preview that clamps to a few lines */}
            <p
              className={`text-[0.75em] leading-snug ${step >= 2 ? "overflow-hidden" : "text-justify"}`}
              style={
                step >= 2
                  ? ({
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                    } as CSSProperties)
                  : undefined
              }
            >
              {round.description}
            </p>
            {/* as the shipped collapsible paragraph: "keep reading" right under the text, on the right */}
            <Reveal show={step >= 2}>
              <span
                className={`${mono} block pt-(--pad) text-end text-[0.75em] font-bold uppercase opacity-60`}
              >
                Keep reading
              </span>
            </Reveal>
            {/* and the favorite button at the bottom of the box, on the left */}
            <Reveal show={step >= 2}>
              <div className="flex pt-(--pad)">
                <span
                  className={`${mono} flex items-center gap-[0.4em] border-2 border-(--moindi-primary-500) px-[1.5em] py-[0.5em] text-[0.8em] font-bold text-(--moindi-primary-600) uppercase`}
                >
                  <svg className="size-[1.2em]" aria-hidden="true">
                    <use href="/moindi/icons.svg#heart-o" />
                  </svg>
                  Favorite
                </span>
              </div>
            </Reveal>
          </div>

          {/* the sketch's time left, split and total */}
          <Reveal show={step < 3}>
            <div
              className={`flex flex-col gap-(--pad) border-t p-(--pad) ${line}`}
            >
              <Reveal show={step < 1}>
                <div className="flex flex-col items-center gap-[0.3em]">
                  <span className={`${mono} text-[0.75em]`}>
                    Time Remaining
                  </span>
                  <span
                    className={`${mono} w-full bg-(--moindi-secondary-100) py-[0.4em] text-center text-[1.1em]`}
                  >
                    {countdownText}
                  </span>
                </div>
              </Reveal>
              <div className="flex flex-col gap-[0.3em]">
                <div className="flex justify-between text-[0.7em]">
                  <span>Artist</span>
                  <span>Investor</span>
                </div>
                <div
                  className={`${mono} flex text-[1.1em] text-(--moindi-gray-30)`}
                >
                  <span className="flex-1 bg-(--moindi-secondary-800) px-[0.4em]">
                    50%
                  </span>
                  <span className="flex-1 bg-(--moindi-secondary-600) px-[0.4em] text-right">
                    50%
                  </span>
                </div>
                <span className="text-center text-[0.7em]">Split</span>
                <div
                  className={`${mono} mt-[0.4em] flex justify-between bg-(--moindi-gray-500) px-[0.6em] py-[0.3em] text-[0.65em] text-(--moindi-gray-30)`}
                >
                  <span>Total</span>
                  <span>{dollars(round.total)}</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* the artist, then the goal, as the shipped phone page stacks them */}
          <Reveal show={step >= 3}>
            <div
              className={`flex items-center gap-(--pad) border-t p-(--pad) ${line}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={round.artistImage}
                alt=""
                className="size-[3.2em] object-cover"
              />
              <span className="text-[1.2em] text-(--moindi-gray-600)">
                {round.artistName}
              </span>
            </div>
            <div
              className={`flex items-center justify-center gap-[0.6em] border-t p-(--pad) text-(--moindi-gray-600) ${line}`}
            >
              <span>Goal:</span>
              <span className={mono}>{dollars(round.total)}.00</span>
            </div>
          </Reveal>
        </div>
      ) : (
        <div
          className={`grid border-b transition-[grid-template-columns] ${ease} ${line}`}
          style={{
            gridTemplateColumns:
              step >= 3 ? "22em minmax(0,1fr) 0em" : "18em minmax(0,1fr) 19em",
          }}
        >
          <div className="p-(--pad)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={round.cover}
              alt=""
              className="aspect-square w-full object-cover"
            />
          </div>

          <div
            // sized by the cover, not its own text ([contain:size]), so the row is only as tall as the art.
            // the sketch has no line between the cover and the text; the shipped page draws one
            className={`flex min-w-0 flex-col justify-between overflow-hidden transition-[border-width] [contain:size] ${ease} ${line} ${step >= 3 ? "border-l" : "border-l-0"}`}
          >
            <div className="flex min-h-0 flex-1 flex-col p-(--pad) pb-0">
              <Reveal show={step < 1}>
                <div className="pb-[0.6em] text-[1.6em]">{round.title}</div>
              </Reveal>
              {/* the full text, then a preview that clamps to a few lines */}
              <p
                className={`leading-snug ${step >= 2 ? "overflow-hidden text-[1em]" : "text-[0.72em]"}`}
                style={
                  step >= 2
                    ? ({
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                      } as CSSProperties)
                    : undefined
                }
              >
                {round.description}
              </p>
              {/* as the shipped collapsible paragraph: "keep reading" right under the text, on the right */}
              <Reveal show={step >= 2}>
                <span
                  className={`${mono} block pt-(--pad) text-end text-[0.75em] font-bold uppercase opacity-60`}
                >
                  Keep reading
                </span>
              </Reveal>
              {/* and the favorite button at the bottom of the box, on the left */}
              <Reveal show={step >= 2} className="mt-auto">
                <div className="flex pt-(--pad) pb-(--pad)">
                  <span
                    className={`${mono} flex items-center gap-[0.4em] border-2 border-(--moindi-primary-500) px-[1.5em] py-[0.5em] text-[0.8em] font-bold text-(--moindi-primary-600) uppercase`}
                  >
                    <svg className="size-[1.2em]" aria-hidden="true">
                      <use href="/moindi/icons.svg#heart-o" />
                    </svg>
                    Favorite
                  </span>
                </div>
              </Reveal>
            </div>
            {/* the artist and the goal, where the split was */}
            <Reveal show={step >= 3}>
              <div className={`grid grid-cols-[1fr_auto] border-t ${line}`}>
                <div
                  className={`flex items-center gap-(--pad) border-r p-(--pad) ${line}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={round.artistImage}
                    alt=""
                    className="size-[5em] object-cover"
                  />
                  <span className="text-[1.5em] text-(--moindi-gray-600)">
                    {round.artistName}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-(--pad) text-(--moindi-gray-600)">
                  <span>Goal:</span>
                  <span className={mono}>{dollars(round.total)}.00</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* the sketch's right column: time left, the artist/investor split and the total */}
          <div
            className={`flex min-w-0 flex-col justify-between overflow-hidden transition-opacity [contain:size] ${ease} ${step >= 3 ? "opacity-0" : "opacity-100"}`}
            aria-hidden={step >= 3 || undefined}
          >
            <div className="flex w-[19em] flex-col justify-between gap-(--pad) p-(--pad)">
              <Reveal show={step < 1}>
                <div className="flex flex-col items-center gap-[0.4em]">
                  <span className="text-[0.75em]">Time Remaining</span>
                  <span
                    className={`${mono} w-full bg-(--moindi-gray-100) py-[0.6em] text-center text-[1.05em]`}
                  >
                    {countdownText}
                  </span>
                </div>
              </Reveal>
              <div className="flex flex-col gap-[0.4em]">
                <div className="flex justify-between text-[0.75em]">
                  <span>Artist</span>
                  <span>Investor</span>
                </div>
                <div
                  className={`${mono} flex text-[1.2em] text-(--moindi-gray-30)`}
                >
                  <span className="flex-1 bg-(--moindi-secondary-800) px-[0.4em]">
                    50%
                  </span>
                  <span className="flex-1 bg-(--moindi-secondary-600) px-[0.4em] text-right">
                    50%
                  </span>
                </div>
                <span className="text-center text-[0.75em]">Split</span>
                <div
                  className={`${mono} mt-[0.6em] flex justify-between bg-(--moindi-gray-500) px-[0.6em] py-[0.3em] text-[0.7em] text-(--moindi-gray-30)`}
                >
                  <span>Total</span>
                  <span>{dollars(round.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* the share bar, slider and amount */}
      <div className={`flex flex-col gap-[0.5em] border-b p-(--pad) ${line}`}>
        <div
          className={`${mono} flex w-full transition-[height,font-size] ${ease} ${compactBar ? "h-[2em] text-[0.875em]" : "h-[2.4em] text-[1.1em]"}`}
        >
          {segments.map((segment) => (
            <div
              key={segment.label}
              className={`flex items-center justify-center overflow-hidden whitespace-nowrap transition-[width,background-color] ${ease} ${compactBar ? segment.after : segment.before}`}
              style={{ width: `${percentOf(segment.shares)}%` }}
            >
              {segment.shares > 0 &&
                `${percentOf(segment.shares).toFixed(compactBar ? 2 : 0)}%`}
            </div>
          ))}
        </div>
        <Reveal show={!compactBar}>
          <div className={`${mono} flex pt-[0.4em] text-[0.8em]`}>
            {segments.slice(0, 3).map((segment) => (
              <span
                key={segment.label}
                className="text-center"
                style={{ width: `${percentOf(segment.shares)}%` }}
              >
                {segment.label}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal show={isFinal}>
          <input
            type="range"
            min={0}
            max={available}
            step={100}
            value={purchase}
            onChange={(event) => setPurchase(+event.target.value)}
            tabIndex={isFinal ? 0 : -1}
            aria-label="Shares to buy"
            className="my-[0.75em] h-[1.5em] w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-[1.5em] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-(--moindi-primary-500) [&::-moz-range-thumb]:shadow-[0_0_0.75em_0.3em_hsl(30_100%_50%/0.35)] [&::-moz-range-track]:h-[0.75em] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-(--moindi-gray-200) [&::-webkit-slider-runnable-track]:h-[0.75em] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-(--moindi-gray-200) [&::-webkit-slider-thumb]:-mt-[0.375em] [&::-webkit-slider-thumb]:size-[1.5em] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--moindi-primary-500) [&::-webkit-slider-thumb]:shadow-[0_0_0.75em_0.3em_hsl(30_100%_50%/0.35)]"
          />
        </Reveal>
        {/* typing an amount, then the calculator the slider drives */}
        <Swap
          showSecond={isFinal}
          className={isFinal ? "" : "pt-(--pad)"}
          first={
            <div
              className={`${mono} flex flex-wrap items-center gap-[0.8em] text-[0.85em] ${narrow ? "justify-center" : ""}`}
            >
              <span className={narrow ? "w-full" : "mr-auto"}>
                Purchase Amount
              </span>
              <span className="w-[8em] border border-(--moindi-gray-950) px-[0.6em] py-[0.3em] text-right">
                {available.toLocaleString("en-US")}
              </span>
              <span>in USD =</span>
              <span className="w-[5em] border border-(--moindi-gray-950) px-[0.6em] py-[0.3em] text-right">
                {percentOf(available).toFixed(1)}
              </span>
              <span>%</span>
              <span
                className={`bg-(--moindi-primary-500) px-[1.4em] py-[0.35em] text-center font-bold ${narrow ? "w-full" : ""}`}
              >
                Purchase Rights
              </span>
            </div>
          }
          second={
            <div
              className={`${mono} flex flex-wrap items-center justify-center gap-(--pad) text-[1em]`}
            >
              <span className="w-[7em] border border-(--moindi-gray-300) bg-(--moindi-gray-30) px-[0.6em] py-[0.4em] text-right">
                {percentOf(purchase).toFixed(2)}
              </span>
              <span>%</span>
              <span className="text-[1.4em]">=</span>
              <span>$</span>
              <span className="w-[7em] border border-(--moindi-gray-300) bg-(--moindi-gray-30) px-[0.6em] py-[0.4em]">
                {purchase}
              </span>
              <span
                className={`border-2 border-(--moindi-gray-950) bg-(--moindi-primary-500) px-[1.5em] py-[0.57em] text-center font-bold uppercase ${narrow ? "w-full" : ""}`}
              >
                Checkout
              </span>
            </div>
          }
        />
      </div>

      {/* revenue potential, which the shipped card leaves out */}
      <Reveal show={step < 5}>
        <div
          className={`${mono} p-(--pad) text-[0.8em] ${narrow ? "grid grid-cols-3 gap-[0.6em]" : "flex items-center justify-between"}`}
        >
          <span className={`text-[1.1em] ${narrow ? "col-span-3" : ""}`}>
            Revenue Potential
          </span>
          {[
            ["Streams", "100,000"],
            ["Amount", "$3,000 - $7,000"],
            ["Your Payout at 38.0%", "$1,140 - $2,660"],
          ].map(([label, value]) => (
            <span key={label} className="flex flex-col items-center">
              <span className="text-[0.75em]">{label}</span>
              <span>{value}</span>
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

// a circular arrow: restart from the beginning
function ReplayIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12a8 8 0 1 0 2.34-5.66" />
      <path d="M4 4v5h5" />
    </svg>
  );
}

// the measuring copies never change between countdown ticks, so they skip re-rendering with the parent
const MeasuredCard = memo(PurchaseCard);

// the margin around the card on the background, and the extra room under it for the replay button
const MARGIN = 12;
const REPLAY_ROW = 32;

type Layout = "narrow" | "wide" | "extraWide";
// the card's width in em for each layout. a wider card wraps its text less and gets shorter, so the widest one
// is for the widest rooms; its height in em is measured, and the card is scaled to fit both ways
const CARD_WIDTH_EM: Record<Layout, number> = {
  narrow: 32,
  wide: 56,
  extraWide: 72,
};
const layoutFor = (width: number, height: number): Layout => {
  const ratio = width / height;
  return ratio < 1.1 ? "narrow" : ratio < 2 ? "wide" : "extraWide";
};

// the card on a tinted background, scaled to fill whatever room it's given and laid out to suit its shape.
// it holds on the sketch, then runs through the changes back to back and stops at the shipped version, where
// the slider works
export function PurchaseGrowth() {
  const [inViewRef, isInView] = useInView<HTMLDivElement>(0.4);
  const measureRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [room, setRoom] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [fontSize, setFontSize] = useState(8);
  const countdown = useCountdown(12 * 86400 * 1000 + 19 * 3600 * 1000);
  const countdownText = countdown?.text ?? "12d 19h 00m 00s";

  useEffect(() => {
    if (!isInView || step >= FINAL) return;
    const timeout = setTimeout(
      () => setStep((current) => current + 1),
      step === 0 ? HOLD_MS : STEP_MS,
    );
    return () => clearTimeout(timeout);
  }, [isInView, step]);

  // the room inside the margins
  useEffect(() => {
    const element = inViewRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // the content box, so the margins and the replay row are already left out
      setRoom({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [inViewRef]);

  const layout = room ? layoutFor(room.width, room.height) : "wide";

  // the scale comes from every step at once: a hidden copy of the card at each one is measured, and the
  // tallest decides the font size. it only changes when the room does, never while the card is changing
  useEffect(() => {
    const stack = measureRef.current;
    if (!stack || !room) return;
    const fit = () => {
      const copies = Array.from(stack.children) as HTMLElement[];
      const size = parseFloat(getComputedStyle(stack).fontSize);
      const tallestEm = Math.max(
        ...copies.map((copy) => copy.offsetHeight / size),
      );
      if (!tallestEm) return;
      const next = Math.min(
        room.width / CARD_WIDTH_EM[layout],
        room.height / tallestEm,
      );
      // only when it really changed, so a measurement that comes out the same doesn't redraw everything
      setFontSize((current) =>
        Math.abs(current - next) > 0.05 ? next : current,
      );
    };
    fit();
    const observer = new ResizeObserver(fit);
    for (const copy of stack.children) observer.observe(copy);
    return () => observer.disconnect();
  }, [room, layout]);

  const cardStyle = { fontSize, width: `${CARD_WIDTH_EM[layout]}em` };

  return (
    <div
      ref={inViewRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-(--moindi-gray-200) md:h-[min(calc(280px*150/71.9),calc(100svh-24rem))]"
      style={{ padding: MARGIN, paddingBottom: MARGIN + REPLAY_ROW }}
    >
      <div className="shadow-lg" style={cardStyle}>
        <PurchaseCard
          step={step}
          narrow={layout === "narrow"}
          countdownText={countdownText}
        />
      </div>
      {/* the card at every step, laid out but never seen, for measuring */}
      <div
        ref={measureRef}
        className="pointer-events-none invisible absolute top-0 left-0"
        style={cardStyle}
        aria-hidden="true"
        inert
      >
        {steps.map((_, index) => (
          <div key={index}>
            <MeasuredCard
              step={index}
              narrow={layout === "narrow"}
              countdownText="00d 00h 00m 00s"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setStep(0)}
        aria-label="Replay"
        title="Replay"
        className="absolute right-2 bottom-1.5 flex size-7 cursor-pointer items-center justify-center border border-(--moindi-gray-700) bg-(--moindi-gray-30) text-(--moindi-gray-900) transition-colors hover:bg-(--moindi-gray-100)"
      >
        <ReplayIcon className="size-4" />
      </button>
    </div>
  );
}
