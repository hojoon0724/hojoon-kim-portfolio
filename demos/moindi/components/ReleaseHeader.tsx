import type { ReleaseInterface } from "@/demos/moindi/types";
import { Button } from "./Button";
import { FavoriteReleaseButton } from "./FavoriteReleaseButton";
import { ImageContainer } from "./ImageContainer";

// the original's release-header: cover art beside the genre and year, title, artist, a play button and a
// favorite heart. the demo has no audio or artist pages, so play does nothing and the artist isn't a link
export function ReleaseHeader({
  release,
  className = "",
}: {
  release: ReleaseInterface;
  className?: string;
}) {
  return (
    <div
      className={`release-header grid gap-(--standard-space) md:grid-cols-[3fr_5fr] ${className}`}
    >
      <div className="release-art-container aspect-square w-full min-w-0 border">
        <ImageContainer
          srcSet={release.coverArt}
          description={`${release.title} cover art`}
        />
      </div>
      <div className="release-vitals-container flex w-full min-w-0 flex-col items-start justify-between gap-2">
        <div className="top-line space-grotesk flex items-baseline border text-sm uppercase">
          <div className="genre border px-(--standard-space)">
            {release.genre}
          </div>
          <div className="release-type border px-(--standard-space)">
            {release.releaseType}
          </div>
          <div className="release-date border px-(--standard-space)">
            {release.releaseDate.getUTCFullYear()}
          </div>
        </div>
        <div className="center-line w-full min-w-0">
          <div className="release-title space-grotesk max-w-full truncate text-3xl tracking-tight md:text-4xl lg:text-5xl">
            {release.title}
          </div>
          <div className="artist mt-(--standard-space-half) max-w-full truncate text-xl font-medium text-(--text-secondary) md:text-2xl lg:text-3xl">
            {release.artistName}
          </div>
        </div>
        <div className="bottom-row space-grotesk mt-8 flex w-full items-center justify-between gap-(--standard-space)">
          <Button iconName="play" variant="fill" color="primary">
            Play
          </Button>
          <FavoriteReleaseButton releaseId={release.id} />
        </div>
      </div>
    </div>
  );
}
