import type { ReleaseInterface, ReleaseType } from "@/demos/moindi/types";
import { Button } from "./Button";
import { ImageContainer } from "./ImageContainer";

const releaseTypeBgClass: Record<ReleaseType, string> = {
  single: "bg-(--surface-tertiary-light)",
  ep: "bg-(--surface-secondary-light)",
  album: "bg-(--surface-primary-light)",
};

// the original's release-tile, default layout only: cover beside the type, title, year and a buy button.
// there's no release page in the demo, so it isn't a link
export function ReleaseTile({
  release,
  className = "",
}: {
  release: ReleaseInterface;
  className?: string;
}) {
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
