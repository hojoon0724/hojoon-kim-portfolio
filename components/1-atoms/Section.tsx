interface SectionProps {
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
  id?: string;
}

export function Section({ className, fullWidth, children, id }: SectionProps) {
  return (
    <section id={id} className={`flex flex-col ${fullWidth ? "max-w-none" : "max-w-7xl mx-auto px-xl"} ${className}`}>
      {children}
      
    </section>
  );
}