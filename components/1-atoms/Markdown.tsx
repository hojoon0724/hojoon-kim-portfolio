import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: false,
});

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: md.render(children),
      }}
    />
  );
}
