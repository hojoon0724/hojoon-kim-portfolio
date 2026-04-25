interface SectionProps {
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Section({ className, fullWidth, children }: SectionProps) {
  return (
    <section className={`flex flex-col ${fullWidth ? "max-w-none" : "max-w-7xl mx-auto px-xl"} ${className}`}>
      {children}
    </section>
  );
}
