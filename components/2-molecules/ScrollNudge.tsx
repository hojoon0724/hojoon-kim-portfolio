"use client";

import { ScrambleRevealText } from "@/components/1-atoms";
import { useEffect, useRef, useState } from "react";

interface ScrollNudgeProps {
  className?: string;
  startDelayMs?: number;
  scrollAwayAfterMs?: number;
  disableScramble?: boolean;
}

// interval: ms to wait after the line before it. the first one shows as soon as the hint appears
// scramble: false shows that line as plain text, with no scramble
type NudgeMessage = { interval: number; text: string; scramble?: boolean };

const scrollNudgeMessages: NudgeMessage[] = [
  { interval: 0, text: "Scroll down" },
  { interval: 10000, text: "Are you gonna scroll or not?" },
  { interval: 5000, text: "... seriously?" },
  { interval: 10000, text: "I can wait all day" },
  { interval: 10000, text: "Self destruct sequence initiated" },
  { interval: 1000, text: "Self destruct in 5", scramble: false },
  { interval: 1000, text: "Self destruct in 4", scramble: false },
  { interval: 1000, text: "Self destruct in 3", scramble: false },
  { interval: 1000, text: "Self destruct in 2", scramble: false },
  { interval: 1000, text: "Self destruct in 1", scramble: false },
  { interval: 1000, text: ".", scramble: false },
  { interval: 500, text: "..", scramble: false },
  { interval: 500, text: "...", scramble: false },
  { interval: 2000, text: "Fine, I'll scroll for you" },
];

const userScrolledBackUpText: NudgeMessage[] = [
  { interval: 0, text: "ARE YOU SERIOUS???" },
  { interval: 2000, text: "We can do this all day" },
];

const giveUpText: NudgeMessage[] = [
  { interval: 0, text: "Fine, you win..." },
  { interval: 2000, text: "But I'm not happy about it" },
  { interval: 2000, text: "Do whatever you want" },
  { interval: 2000, text: "I'm out" },
  { interval: 2000, text: "" },
];

const notDoingThisAgainText: NudgeMessage[] = [
  { interval: 0, text: "Scroll down" },
  { interval: 20000, text: "I'm not doing this again" },
  { interval: 5000, text: "Scroll down" },
];

// scrolling further than this counts as having left the top of the page
const scrolledPx = 8;
// the visitor can scroll back up this many times. on the last one the nudge gives up instead of scrolling again
const maxScrollBacks = 3;

// what the visitor has done so far, kept for the browser session so a later visit remembers it
const storageKey = "scroll-nudge";
type NudgeHistory = {
  autoScrolls: number;
  scrollBacks: number;
  gaveUp: boolean;
};

function readHistory(): NudgeHistory {
  try {
    const stored = window.sessionStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored) as NudgeHistory;
  } catch {
    // storage can be blocked. the nudge then just starts fresh each time
  }
  return { autoScrolls: 0, scrollBacks: 0, gaveUp: false };
}

function saveHistory(history: NudgeHistory): void {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(history));
  } catch {
    // see readHistory
  }
}

// a line of text that changes the longer the page sits unscrolled, and ends by scrolling one screen down by itself.
// - the visitor scrolls back up afterwards: it complains and scrolls down again
// - they do that maxScrollBacks times: it gives up and leaves the page alone
// - it shows up again later in the same session, after it has scrolled or given up: one short line and no scrolling
// - the visitor scrolls by themselves before any of that: it stays quiet
export function ScrollNudge({
  className,
  startDelayMs = 0,
  scrollAwayAfterMs = 5000,
  disableScramble = false,
}: ScrollNudgeProps) {
  // key goes up with every new line, which restarts the scramble
  const [shown, setShown] = useState({
    message: scrollNudgeMessages[0],
    key: 0,
  });

  const nudgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // on snap pages the sections scroll inside a container, not the window
    const scrollContainer =
      nudgeRef.current?.closest<HTMLElement>("[data-snap-container]") ?? null;
    const scrollTarget = scrollContainer ?? window;
    const getScrollTop = () =>
      scrollContainer ? scrollContainer.scrollTop : window.scrollY;

    const history = readHistory();
    let timeoutId = 0;
    let hasLeftTop = getScrollTop() > scrolledPx;
    let finished = false;

    // shows each line of the list in turn, then calls onDone once the last one is up
    const play = (
      list: NudgeMessage[],
      delayMs: number,
      onDone?: () => void,
    ) => {
      let index = 0;

      const show = () => {
        setShown((previous) => ({
          message: list[index],
          key: previous.key + 1,
        }));

        const next = list[index + 1];
        if (!next) {
          onDone?.();
          return;
        }
        timeoutId = window.setTimeout(() => {
          index += 1;
          show();
        }, next.interval);
      };

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(show, delayMs + list[0].interval);
    };

    const finish = () => {
      finished = true;
      window.clearTimeout(timeoutId);
      scrollTarget.removeEventListener("scroll", onScroll);
    };

    const queueAutoScroll = () => {
      timeoutId = window.setTimeout(() => {
        history.autoScrolls += 1;
        saveHistory(history);

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const behavior = reduceMotion ? "auto" : "smooth";
        const nextSection =
          nudgeRef.current?.closest("[data-snap-target]")?.nextElementSibling;

        // in a snap container, go to the next section so the page lands on a snap point
        if (scrollContainer && nextSection) {
          nextSection.scrollIntoView({ behavior, block: "start" });
        } else {
          window.scrollBy({ top: window.innerHeight, behavior });
        }
      }, scrollAwayAfterMs);
    };

    const giveUp = () => {
      history.gaveUp = true;
      saveHistory(history);
      finish();
    };

    function onScroll() {
      const atTop = getScrollTop() <= scrolledPx;

      if (!atTop) {
        if (hasLeftTop) return;
        hasLeftTop = true;

        // the page is moving, so whatever was queued is no longer needed
        window.clearTimeout(timeoutId);
        // the visitor scrolled by themselves before the nudge ever had to: nothing more to say
        if (history.autoScrolls === 0) finish();
        return;
      }

      // back at the top after the nudge has scrolled the page at least once
      if (!hasLeftTop || history.autoScrolls === 0 || finished) return;
      hasLeftTop = false;
      history.scrollBacks += 1;
      saveHistory(history);

      if (history.scrollBacks >= maxScrollBacks) play(giveUpText, 0, giveUp);
      else play(userScrolledBackUpText, 0, queueAutoScroll);
    }

    if (history.gaveUp || history.autoScrolls > 0) {
      // it has already done its thing this session
      play(notDoingThisAgainText, startDelayMs);
    } else if (!hasLeftTop) {
      play(scrollNudgeMessages, startDelayMs, queueAutoScroll);
      scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    }

    return finish;
  }, [startDelayMs, scrollAwayAfterMs]);

  const { message, key } = shown;

  return (
    <div className={className} ref={nudgeRef}>
      {disableScramble || message.scramble === false ? (
        message.text
      ) : (
        <ScrambleRevealText
          key={key}
          text={message.text}
          durationMs={500}
          startAnimation
        />
      )}
    </div>
  );
}
