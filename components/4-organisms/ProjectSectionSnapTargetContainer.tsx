interface ProjectSectionSnapTargetContainerProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  tag?: "div" | "section" | "header";
  // for sections taller than the screen: adds a second snap point at the end,
  // so scrolling back up from the next section lands on the end of this one
  snapToEnd?: boolean;
}

// one section of a project page. it fills the screen under the section nav and snaps to its top.
// layout, spacing and colors come from className
export function ProjectSectionSnapTargetContainer({
  id,
  tag: Tag = "div",
  snapToEnd = false,
  className = "",
  children,
  ...rest
}: ProjectSectionSnapTargetContainerProps) {
  return (
    <Tag
      {...rest}
      className={`scroll-mt-nav relative min-h-[calc(100dvh-var(--spacing-nav))] w-full shrink-0 snap-start ${className}`}
      data-snap-target
      id={id}
    >
      {children}
      {snapToEnd && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-px w-full snap-end"
          aria-hidden="true"
        />
      )}
    </Tag>
  );
}
