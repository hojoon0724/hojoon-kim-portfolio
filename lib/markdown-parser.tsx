//* line-by-line markdown parser
export interface MarkdownLineParsed {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "ul" | "ol" | "hr";
  content: string;
}

// input: string
// output: array of each line with type and raw string
export function markdownParserByLine(string: string): MarkdownLineParsed[] {
  const lines = string.split("\n");

  return lines
    .map((line): MarkdownLineParsed | null => {
      const headingMatch = line.match(/^#{1,6}\s/);
      const unorderedListMatch = line.match(/^[-*]\s/);
      const orderedListMatch = line.match(/^\d+\.\s/);
      // const horizontalRuleMatch = line.match(/^---$/);

      if (headingMatch) {
        const level = headingMatch[0].trim().length;

        return {
          type: `h${level}` as MarkdownLineParsed["type"],
          content: line.slice(headingMatch[0].length),
        };
      }

      if (unorderedListMatch) {
        return {
          type: "ul",
          content: line.slice(unorderedListMatch[0].length),
        };
      }

      if (orderedListMatch) {
        return {
          type: "ol",
          content: line.slice(orderedListMatch[0].length),
        };
      }

      // if (horizontalRuleMatch) {
      //   return {
      //     type: "hr",
      //     content: "",
      //   };
      // }

      if (line.trim() === "") {
        return null;
      }

      return {
        type: "p",
        content: line,
      };
    })
    .filter((line): line is MarkdownLineParsed => line !== null);
}

//* chunk-by-chunk parser
type Format = {
  bold: boolean;
  italic: boolean;
};
interface FormattedString {
  format: Format;
  string: string;
}
export interface MarkdownLineStyled {
  type: MarkdownLineParsed["type"];
  content: FormattedString[];
}

export function markdownParserByStyle(
  lineParsedArray: MarkdownLineParsed[],
): MarkdownLineStyled[] {
  return lineParsedArray.map((line) => ({
    type: line.type,
    content:
      line.type === "p" || line.type.startsWith("h")
        ? parseInline(line.content)
        : [{ format: { bold: false, italic: false }, string: line.content }],
  }));
}

//* function that separates the range that needs formatting
// input: raw markdown string
// output: array of sections with formatting information
function parseInline(
  string: string,
  format: Format = { bold: false, italic: false },
): FormattedString[] {
  let i = 0;

  function parseUntil(
    closingDelimiter?: "***" | "**" | "*",
    currentFormat: Format = format,
  ): FormattedString[] {
    const result: FormattedString[] = [];
    let text = "";

    function flush() {
      if (!text) return;

      result.push({
        format: { ...currentFormat },
        string: text,
      });

      text = "";
    }

    while (i < string.length) {
      // Closing delimiter for the current level.
      //
      // This must happen BEFORE checking for opening delimiters.
      if (closingDelimiter && string.startsWith(closingDelimiter, i)) {
        flush();
        i += closingDelimiter.length;
        return result;
      }

      // Bold italic
      if (string.startsWith("***", i)) {
        flush();
        i += 3;

        result.push(
          ...parseUntil("***", {
            ...currentFormat,
            bold: true,
            italic: true,
          }),
        );

        continue;
      }

      // Bold
      if (string.startsWith("**", i)) {
        flush();
        i += 2;

        result.push(
          ...parseUntil("**", {
            ...currentFormat,
            bold: true,
          }),
        );

        continue;
      }

      // Italic
      if (string[i] === "*") {
        flush();
        i += 1;

        result.push(
          ...parseUntil("*", {
            ...currentFormat,
            italic: true,
          }),
        );

        continue;
      }

      text += string[i];
      i++;
    }

    flush();
    return result;
  }

  return parseUntil(undefined, format);
}

//* converts line-parsed markdown into styled markdown
export function markdownParser(string: string): MarkdownLineStyled[] {
  const lineParsedArray = markdownParserByLine(string);
  return markdownParserByStyle(lineParsedArray);
}
