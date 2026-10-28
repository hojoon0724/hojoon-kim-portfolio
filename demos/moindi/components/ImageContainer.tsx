// the original's image-container, minus the click-to-expand popup.
// a blank srcset shows an empty frame, since the placeholder data has no images yet
export function ImageContainer({
  srcSet,
  description = "",
  square = true,
  className = "",
}: {
  srcSet: string;
  description?: string;
  square?: boolean;
  className?: string;
}) {
  const frameClasses = `image-container flex h-full w-full items-center justify-center ${square ? "aspect-square" : ""} ${className}`;

  if (!srcSet) {
    return (
      <div
        className={`${frameClasses} bg-(--surface-tertiary-feather)`}
        role="img"
        aria-label={description}
      />
    );
  }

  // srcsets without width descriptors are a single url
  const hasDescriptors = /\s\d+[wx]/i.test(srcSet);
  return (
    <div className={frameClasses}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="h-full w-full object-cover"
        src={hasDescriptors ? undefined : srcSet}
        srcSet={hasDescriptors ? srcSet : undefined}
        alt={description}
      />
    </div>
  );
}
