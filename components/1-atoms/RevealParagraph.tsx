"use client";

import { useScroll, useTransformedProgress } from "@/hooks";
import { useRef } from "react";

interface RevealParagraphProps {
  text: string;
  className?: string;
  revealBy?: "paragraph" | "word" | "letter" | "line";
  startAt?: number;
  endAt?: number;
}

export function RevealParagraph({
  text,
  className,
  revealBy = "word",
  startAt = 0.8,
  endAt = 0.2,
}: RevealParagraphProps) {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: [`start ${startAt}`, `start ${endAt}`],
  });

  const content = () => {
    let renderedText: React.ReactNode = null;
    switch (revealBy) {
      case "paragraph":
        renderedText = <>{text}</>;
        break;
      case "word":
        const words = text.split(" ");
        renderedText = words.map((word, index) => {
          const start = index / words.length;
          const end = (index + 1) / words.length;
          return (
            <Unit
              key={index}
              range={[start, end]}
              progress={scrollYProgress}
              type="word"
            >
              {word}
            </Unit>
          );
        });
        break;
      case "letter":
        const letters = text.split("");
        renderedText = letters.map((letter, index) => {
          const start = index / letters.length;
          const end = (index + 1) / letters.length;
          return (
            <Unit
              key={index}
              range={[start, end]}
              progress={scrollYProgress}
              type="letter"
            >
              {letter}
            </Unit>
          );
        });
        break;
    }
    return <>{renderedText}</>;
  };

  return (
    <p
      ref={element}
      className={`${className} ${revealBy === "word" ? "flex flex-wrap" : ""}`}
      {...(revealBy === "paragraph"
        ? { style: { opacity: scrollYProgress } }
        : {})}
    >
      {content()}
    </p>
  );
}

function Unit({
  children,
  range,
  progress,
  type,
}: {
  children: React.ReactNode;
  range: [number, number];
  progress: number;
  type: "paragraph" | "word" | "letter" | "line";
}) {
  const transformedProgress = useTransformedProgress(progress, range, [0, 1]);
  return (
    <span className={type === "word" ? `` : ""}>
      <span className="absolute opacity-[0.1] shadow">{children}</span>
      <span
        style={{
          opacity: transformedProgress,
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        {children}
        {type === "word" ? "\u00a0" : ""}
      </span>
    </span>
  );
}
