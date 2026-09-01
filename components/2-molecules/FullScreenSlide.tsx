interface FullScreenSlideProps {
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
  textColorClassName?: string;
}

export function FullScreenSlide({
  children,
  className,
  backgroundClassName,
  textColorClassName,
}: FullScreenSlideProps) {
  return (
    <div
      className={`flex h-dvh w-screen shrink-0 snap-start flex-col items-center justify-start ${className} ${backgroundClassName} ${textColorClassName}`}
    >
      {children}
    </div>
  );
}
