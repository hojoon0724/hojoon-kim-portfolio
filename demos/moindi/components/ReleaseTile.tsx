import type { ReleaseInterface, ReleaseType } from "@/demos/moindi/types";
import { Button } from "./Button";
import { ImageContainer } from "./ImageContainer";

const releaseTypeBgClass: Record<ReleaseType, string> = {
  single: "bg-(--surface-tertiary-light)",
  ep: "bg-(--surface-secondary-light)",
  album: "bg-(--surface-primary-light)",
};

// the original's release-tile. there's no release page in the demo, so none of the layouts are links.
// default: cover beside the type, title, year and a buy button.
// big: a square cover over the title and artist, sized by its parent (the store's snap-scroller rows).
// small: a one-line row with a thumbnail, for dense lists
export function ReleaseTile({
  release,
  variant = "default",
  className = "",
}: {
  release: ReleaseInterface;
  variant?: "default" | "big" | "small";
  className?: string;
}) {
  if (variant === "big") {
    return (
      <div
        className={`release-tile flex min-w-0 flex-col border bg-(--surface-base) ${className}`}
      >
        <div className="album-art aspect-square w-full border">
          <ImageContainer
            srcSet={release.coverArt}
            description={`${release.title} cover art`}
          />
        </div>
        <div className="flex min-w-0 flex-col items-center justify-center border p-(--standard-space-half)">
          <div className="max-w-full truncate text-lg leading-tight font-semibold">
            {release.title}
          </div>
          <div className="max-w-full truncate text-sm leading-none">
            {release.artistName}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "small") {
    return (
      <div
        className={`release-tile flex w-full min-w-0 items-center gap-(--standard-space-half) border-2 bg-(--surface-base) ${className}`}
      >
        <div className="album-art h-12 w-12 shrink-0 border-r-2">
          <ImageContainer
            srcSet={release.coverArt}
            description={`${release.title} cover art`}
          />
        </div>
        <div className="min-w-0 pr-(--standard-space-half)">
          <div className="space-grotesk truncate leading-tight font-semibold">
            {release.title}
          </div>
          <div className="truncate text-xs leading-tight opacity-60">
            {release.artistName}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`release-tile relative grid grid-cols-2 gap-(--standard-space) border bg-(--surface-base) p-(--standard-space) ${className}`}
    >
      <ImageContainer
        className="border"
        srcSet={release.coverArt}
        description={`${release.title} cover art`}
      />
      <div className="release-info-container flex flex-col items-start justify-between">
        <div className="flex w-full flex-col items-start">
          <div
            className={`release-type space-grotesk mb-(--standard-space-half) truncate px-(--standard-space-half) py-1 text-sm font-semibold uppercase ${releaseTypeBgClass[release.releaseType]}`}
          >
            {release.releaseType}
          </div>
          <div className="release-title space-grotesk line-clamp-3 max-w-full text-2xl font-normal wrap-break-word">
            {release.title}
          </div>
          <div className="release-date text-sm opacity-60">
            {release.releaseDate.getUTCFullYear()}
          </div>
        </div>
        <div className="flex w-full flex-wrap">
          <Button
            variant="outline"
            color="tertiary"
            size="small"
            className="flex-1"
          >
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
}
