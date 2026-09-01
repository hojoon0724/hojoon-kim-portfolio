interface FullScreenSlideProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...rest
}: FullScreenSlideProps) {
  return (
    <div
      {...rest}
      className={`flex h-dvh w-screen shrink-0 snap-start flex-col items-center justify-start ${className} ${backgroundClassName} ${textColorClassName}`}
    >
      {children}
    </div>
  );
}
