import type { TrackInterface } from "@/demos/moindi/types";
import { formatDuration } from "../lib/format";
import { Button } from "./Button";

// the original's song-row: track number, title (and feature), an add-to-queue button and the length.
// the demo has no audio, so a row only looks like it's playing when it's given playProgress (0–100):
// the number turns into bouncing wave bars and the row fills from the left as far as the progress.
// the queue button does nothing
export function SongRow({
  track,
  index,
  playProgress,
}: {
  track: TrackInterface;
  index: number;
  playProgress?: number;
}) {
  const isPlaying = playProgress !== undefined;

  return (
    <div className="song-row group relative flex min-h-14 w-full items-center justify-between gap-(--standard-space-double) border bg-(--surface-base) px-(--standard-space) py-1">
      {isPlaying && (
        <div
          className="track-progress absolute inset-y-0 left-0 bg-(--surface-secondary-light) transition-colors group-hover:bg-(--surface-primary-light)"
          style={{ width: `${playProgress}%` }}
          aria-hidden
        />
      )}
      <div className="relative flex w-full min-w-0 items-center gap-(--standard-space)">
        <div className="flex w-4 shrink-0 justify-center">
          {isPlaying ? (
            <div
              className="flex h-4 w-4 items-end justify-between gap-[2px]"
              aria-label="Now playing"
            >
              <div className="wave-bar h-full w-full bg-(--surface-accent)" />
              <div className="wave-bar h-full w-full bg-(--surface-accent)" />
              <div className="wave-bar h-full w-full bg-(--surface-accent)" />
            </div>
          ) : (
            <div className="space-mono text-center text-xs font-bold">
              {index + 1}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div
            className={`truncate transition-colors ${isPlaying ? "" : "group-hover:text-(--text-accent)"}`}
          >
            {track.title}
          </div>
          {track.feat && (
            <div className="truncate text-xs opacity-60">feat. {track.feat}</div>
          )}
        </div>
      </div>
      <div className="relative flex shrink-0 items-center gap-(--standard-space)">
        <div className="opacity-30 transition-opacity hover:opacity-100">
          <Button
            variant="none"
            size="tiny"
            iconName="plus"
            iconOnly
            aria-label={`Add ${track.title} to queue`}
          />
        </div>
        <div className="space-mono pr-(--standard-space) text-sm lg:pr-(--standard-space-half)">
          {formatDuration(track.durationSeconds)}
        </div>
      </div>
    </div>
  );
}
