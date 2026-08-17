interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  fullWidth?: boolean;
}

export function Section({
  className,
  fullWidth,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={`flex flex-col ${fullWidth ? "max-w-none" : "px-xl mx-auto max-w-7xl"} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}
