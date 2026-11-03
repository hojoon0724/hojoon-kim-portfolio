"use client";

import { useEffect, useRef, useState } from "react";

const TRANSITION_MS = 500;

// clamps its content to maxLines with a "keep reading" toggle that only shows when the content overflows.
// opening and closing animate max-height between the clamped and full heights, then hand back to the line clamp
export function CollapsibleParagraph({
  maxLines = 5,
  children,
}: {
  maxLines?: number;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState("none");
  const [isOverflowing, setIsOverflowing] = useState(false);

  // re-measures on resize, since a narrower column can push the text past the clamp
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      if (!isOpen) {
        setIsOverflowing(element.scrollHeight > element.clientHeight);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [isOpen]);

  const clampedHeight = (element: HTMLElement) => {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 20;
    return `${lineHeight * maxLines}px`;
  };

  const toggle = () => {
    const element = contentRef.current;
    if (!element) return;

    if (!isOpen) {
      // pin the clamped height before dropping the clamp, so the full paragraph doesn't flash
      const fullHeight = `${element.scrollHeight}px`;
      setMaxHeight(clampedHeight(element));
      setIsOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMaxHeight(fullHeight);
          setTimeout(() => setMaxHeight("none"), TRANSITION_MS);
        });
      });
    } else {
      setMaxHeight(`${element.scrollHeight}px`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMaxHeight(clampedHeight(element));
          setTimeout(() => {
            setIsOpen(false);
            setMaxHeight("none");
          }, TRANSITION_MS);
        });
      });
    }
  };

  return (
    <div className="collapsible-paragraph flex h-full flex-col">
      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{
          maxHeight,
          ...(!isOpen && {
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
          }),
        }}
      >
        {children}
      </div>
      {isOverflowing && (
        <button
          type="button"
          className="space-mono mt-(--standard-space) px-(--standard-space-half) text-end text-xs font-bold uppercase opacity-60"
          aria-expanded={isOpen}
          onClick={toggle}
        >
          {isOpen ? "Close" : "Keep reading"}
        </button>
      )}
    </div>
  );
}
