import type { MarkdownLineStyled } from "@/lib/markdown-parser";
import { markdownParser } from "@/lib/markdown-parser";
import { createElement } from "react";
import { StaggeredReveal } from "./StaggeredReveal";

type WordToken = {
  format: MarkdownLineStyled["content"][number]["format"];
  string: string;
};

function getWordTokens(line: MarkdownLineStyled): WordToken[] {
  const tokens = line.content.flatMap((chunk) => {
    const words = chunk.string.match(/\S+\s*/g) ?? [];

    return words.map((string) => ({
      format: chunk.format,
      string,
    }));
  });

  return tokens.reduce<WordToken[]>((acc, item) => {
    const word = item.string.trim();
    const isPunctuationOnly = /^[,.;:!?]+$/.test(word);

    if (isPunctuationOnly && acc.length > 0) {
      acc[acc.length - 1].string += item.string;
      return acc;
    }

    acc.push({ ...item });
    return acc;
  }, []);
}

function formatMarkdownByWord({ line }: { line: MarkdownLineStyled }) {
  const mergedTokens = getWordTokens(line);

  return mergedTokens.map((token, index) => (
    <span
      key={index}
      className={[
        "inline-block",
        "whitespace-pre",
        token.format.bold && "font-bold",
        token.format.italic && "italic",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {token.string}
    </span>
  ));
}

function calculateLineTimings(
  lines: MarkdownLineStyled[],
  delayMs: number,
  staggerMs: number,
  finishByMs: number,
): Array<{ delayMs: number; staggerMs: number }> {
  if (finishByMs <= 0) {
    return lines.map((_, index) => ({
      delayMs: index * delayMs,
      staggerMs,
    }));
  }

  const tokenCounts = lines.map((line) =>
    Math.max(1, getWordTokens(line).length),
  );
  const totalTokenCount = tokenCounts.reduce((sum, count) => sum + count, 0);
  const globalStepMs =
    totalTokenCount > 1 ? finishByMs / (totalTokenCount - 1) : 0;

  let runningTokenOffset = 0;
  return tokenCounts.map((count) => {
    const timing = {
      delayMs: runningTokenOffset * globalStepMs,
      staggerMs: globalStepMs,
    };

    runningTokenOffset += count;
    return timing;
  });
}

function MarkdownWrapper({
  line,
  animate = false,
  staggerMs,
  delayMs = 0,
  threshold = 0.3,
}: {
  threshold?: number;
  line: MarkdownLineStyled;
  animate?: boolean;
  staggerMs?: number;
  delayMs?: number;
}) {
  const computedStaggerMs = staggerMs ?? 50;

  if (!animate) {
    return createElement(line.type, {}, formatMarkdownByWord({ line }));
  }

  if (animate) {
    return (
      <StaggeredReveal
        tag={line.type}
        delayMs={delayMs}
        staggerMs={computedStaggerMs}
        threshold={threshold}
      >
        {formatMarkdownByWord({ line })}
      </StaggeredReveal>
    );
  }

  return null;
}

// final step show the whole thing
export function MarkdownRenderer({
  content,
  animate,
  staggerMs = 50,
  delayMs = 0,
  finishByMs = 0,
  threshold = 0.3,
}: {
  content: string;
  animate?: boolean;
  staggerMs?: number;
  delayMs?: number;
  finishByMs?: number;
  threshold?: number;
}) {
  const parsedContent = markdownParser(content);
  const lineTimings = calculateLineTimings(
    parsedContent,
    delayMs,
    staggerMs,
    finishByMs,
  );

  return (
    <>
      {parsedContent.map((line, index) => (
        <MarkdownWrapper
          key={index}
          line={line}
          animate={animate}
          staggerMs={lineTimings[index].staggerMs}
          delayMs={lineTimings[index].delayMs}
          threshold={threshold}
        />
      ))}
    </>
  );
}
