"use client";

import MarkdownIt from "markdown-it";
import React, { useEffect, useState } from "react";

function escapeHtmlAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function splitPlainTextUnits(text: string, revealBy: "letter" | "word") {
  if (revealBy === "letter") {
    return text.split("");
  }

  return text.split(" ");
}

function splitMarkdownTextUnits(text: string, revealBy: "letter" | "word") {
  if (revealBy === "letter") {
    return text.split("");
  }

  // Keep whitespace tokens so markdown spacing/newlines are preserved.
  return text.split(/(\s+)/).filter((unit) => unit.length > 0);
}

interface StaggeredTextRevealProps {
  text: string;
  className?: string;
  animationClassName?: string;
  delayMs?: number;
  staggerMs?: number;
  finishByMs?: number;
  revealBy?: "letter" | "word";
  threshold?: number;
  resetOnLeave?: boolean;
  wrap?: boolean;
  isMarkdown?: boolean;
}

export function StaggeredTextReveal({
  text,
  className,
  animationClassName = "animation-fade-in-up-16",
  delayMs = 100,
  staggerMs = 50,
  finishByMs = 0, // Default 0 = uses delay+stagger. If set, will override delay+stagger to finish by this time.
  threshold = 0.5,
  revealBy = "word",
  resetOnLeave = true,
  wrap = true,
  isMarkdown = false,
}: StaggeredTextRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const textUnits: string[] = !text ? [] : splitPlainTextUnits(text, revealBy);
  const revealableUnitCount = textUnits.filter(
    (unit) => unit.length > 0,
  ).length;
  const calculatedStaggerMs =
    finishByMs > 0
      ? Math.max(0, finishByMs - delayMs) / Math.max(1, revealableUnitCount - 1)
      : staggerMs;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (!resetOnLeave) {
            observer.disconnect();
          }
          return;
        }
        if (resetOnLeave) {
          setRevealed(false);
        }
      },
      { threshold },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [resetOnLeave, threshold]);

  if (isMarkdown) {
    const markdown = new MarkdownIt({ html: false });
    let unitIndex = 0;
    const originalTextRule = markdown.renderer.rules.text;

    markdown.renderer.rules.text = (tokens, idx) => {
      const token = tokens[idx];
      const splitUnits = splitMarkdownTextUnits(token.content, revealBy);

      const renderedUnits = splitUnits
        .map((unit) => {
          if (/^\s+$/.test(unit)) {
            return markdown.utils.escapeHtml(unit);
          }

          const childDelayMs = delayMs + unitIndex * calculatedStaggerMs;
          unitIndex += 1;

          return `<span class="${escapeHtmlAttr(revealed ? animationClassName : "opacity-0")}" style="display:inline-block;animation-delay:${childDelayMs}ms, ${childDelayMs}ms;white-space:${revealBy === "letter" ? "pre" : "normal"};">${markdown.utils.escapeHtml(unit)}</span>`;
        })
        .join("");

      return renderedUnits;
    };

    const renderedMarkdown = markdown.render(text);
    markdown.renderer.rules.text = originalTextRule;

    return (
      <div
        ref={containerRef}
        className={`staggered-text-reveal-container ${className} ${wrap ? "" : "text-nowrap"}`}
        dangerouslySetInnerHTML={{
          __html: renderedMarkdown,
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`staggered-text-reveal-container ${className} ${wrap ? "" : "text-nowrap"}`}
    >
      {textUnits.map((unit, index) => {
        const childDelayMs = delayMs + index * calculatedStaggerMs;

        return (
          <span
            key={index}
            className={revealed ? animationClassName : "opacity-0"}
            style={{
              display: "inline-block",
              animationDelay: `${childDelayMs}ms, ${childDelayMs}ms`,
              whiteSpace: revealBy === "letter" ? "pre" : "normal",
            }}
          >
            {unit}
            {revealBy === "word" && index < textUnits.length - 1
              ? "\u00a0"
              : ""}
          </span>
        );
      })}
    </div>
  );
}
