"use client";

import { useInView } from "@/hooks";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { coreIdeaTrace } from "./data";
import { visualHeight } from "./frame";

const STEP_MS = 2600;
const DRAW_MS = 600;
// the same curve as --bezier-movement-inertia-1000; the animations api can't read css variables
const DRAW_EASE = "cubic-bezier(0.44, 0.7, 0.12, 1)";

const traces = coreIdeaTrace.traces;
const layers = ["Direction", "Limits"] as const;

// splits a story paragraph into plain text and the [[id|phrase]] marks a rule was written from
function parseStory(paragraph: string) {
  return paragraph
    .split(/(\[\[[^\]]+\]\])/)
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^\[\[([^|]+)\|(.+)\]\]$/);
      return match ? { id: match[1], text: match[2] } : { text: part };
    });
}

const story = coreIdeaTrace.story.map(parseStory);

// the Core Idea on the left, the rules it produced on the right, sorted by layer. one phrase at a time lights up
// and a line draws from it to its rule. it steps through on its own while it's on screen; hovering or focusing
// a phrase or a rule takes over
export function RuleTrace() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHeld, setIsHeld] = useState(false);
  const [path, setPath] = useState<string | null>(null);
  const [inViewRef, inView] = useInView<HTMLDivElement>(0.4);
  const boxRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const phraseRefs = useRef(new Map<string, HTMLElement>());
  const ruleRefs = useRef(new Map<string, HTMLElement>());

  const activeId = traces[activeIndex].id;

  useEffect(() => {
    if (!inView || isHeld) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = setTimeout(
      () => setActiveIndex((index) => (index + 1) % traces.length),
      STEP_MS,
    );
    return () => clearTimeout(timeout);
  }, [inView, isHeld, activeIndex]);

  // the line runs from the story's edge, level with the phrase (it can wrap, so its last line), to the rule:
  // sideways from the right edge when the rule sits beside it, down from the bottom edge when the columns stack
  // on phones. it starts at the edge so it never crosses the text
  useLayoutEffect(() => {
    const measure = () => {
      const box = boxRef.current?.getBoundingClientRect();
      const storyBox = storyRef.current?.getBoundingClientRect();
      const phraseRects = phraseRefs.current.get(activeId)?.getClientRects();
      const rule = ruleRefs.current.get(activeId)?.getBoundingClientRect();
      if (!box || !storyBox || !phraseRects?.length || !rule) return;
      const end = phraseRects[phraseRects.length - 1];
      const beside = rule.left >= storyBox.right;
      const from = beside
        ? { x: storyBox.right + 8, y: end.top + end.height / 2 }
        : { x: end.left + end.width / 2, y: storyBox.bottom + 6 };
      const to = beside
        ? { x: rule.left - 4, y: rule.top + rule.height / 2 }
        : { x: rule.left + rule.width / 2, y: rule.top - 4 };
      const [x1, y1, x2, y2] = [
        from.x - box.left,
        from.y - box.top,
        to.x - box.left,
        to.y - box.top,
      ];
      setPath(
        beside
          ? `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`
          : `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (boxRef.current) observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [activeId]);

  // draws the line in from the phrase each time it moves to a new one
  useEffect(() => {
    const element = pathRef.current;
    if (!element || !path) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = element.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { duration: DRAW_MS, easing: DRAW_EASE },
    );
    return () => animation.cancel();
    // only a new trace redraws it; a resize just moves the finished line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const hold = (id: string) => ({
    onMouseEnter: () => {
      setIsHeld(true);
      setActiveIndex(traces.findIndex((trace) => trace.id === id));
    },
    onMouseLeave: () => setIsHeld(false),
    onFocus: () => {
      setIsHeld(true);
      setActiveIndex(traces.findIndex((trace) => trace.id === id));
    },
    onBlur: () => setIsHeld(false),
  });

  return (
    <div ref={inViewRef} className={`flex flex-col ${visualHeight}`}>
      <div
        ref={boxRef}
        className="relative grid min-h-0 flex-1 grid-cols-1 content-start gap-y-12 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:content-center md:gap-x-24"
      >
        {/* the story */}
        <div
          ref={storyRef}
          className="gap-sm flex flex-col text-sm text-pretty md:text-lg"
        >
          <div className="roboto-mono text-xs font-bold uppercase opacity-70">
            Core Idea
          </div>
          {story.map((paragraph, index) => (
            <p key={index}>
              {paragraph.map((part, partIndex) =>
                "id" in part && part.id ? (
                  <mark
                    key={partIndex}
                    ref={(element) => {
                      if (element) phraseRefs.current.set(part.id, element);
                    }}
                    tabIndex={0}
                    {...hold(part.id)}
                    className={`box-decoration-clone px-0.5 transition-colors duration-300 ${part.id === activeId ? "bg-(--moindi-gray-950) text-(--moindi-primary-500)" : "bg-transparent text-inherit underline decoration-current/40 underline-offset-4"}`}
                  >
                    {part.text}
                  </mark>
                ) : (
                  <Fragment key={partIndex}>{part.text}</Fragment>
                ),
              )}
            </p>
          ))}
        </div>

        {/* the rules, grouped by the layer they belong to */}
        <div className="gap-md flex flex-col justify-center">
          {layers.map((layer) => (
            <div key={layer} className="gap-xs flex flex-col">
              <div className="roboto-mono text-xs font-bold uppercase opacity-70">
                {layer}
              </div>
              {traces
                .filter((trace) => trace.layer === layer)
                .map((trace) => (
                  <div
                    key={trace.id}
                    ref={(element) => {
                      if (element) ruleRefs.current.set(trace.id, element);
                    }}
                    tabIndex={0}
                    {...hold(trace.id)}
                    className={`px-sm py-xs border border-(--moindi-gray-950) text-sm font-semibold transition-colors duration-300 md:text-base ${trace.id === activeId ? "bg-(--moindi-gray-950) text-(--moindi-primary-500)" : ""}`}
                  >
                    {trace.rule}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* the line from the active phrase to its rule, drawn over both columns */}
        {path && (
          <svg
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d={path}
              pathLength={1}
              fill="none"
              stroke="var(--moindi-gray-950)"
              strokeWidth={2}
              strokeDasharray="1"
            />
          </svg>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {`"${
          story.flat().find((part) => "id" in part && part.id === activeId)
            ?.text
        }" became the rule: ${traces[activeIndex].rule}`}
      </p>
    </div>
  );
}
