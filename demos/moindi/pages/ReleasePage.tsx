import { BackButton } from "@/demos/moindi/components/BackButton";
import { Button } from "@/demos/moindi/components/Button";
import { ReleaseHeader } from "@/demos/moindi/components/ReleaseHeader";
import { SongRow } from "@/demos/moindi/components/SongRow";
import type { ReleaseInterface } from "@/demos/moindi/types";

// a frozen "now playing" moment, since the demo has no audio: the third track, about a third of the way in
const NOW_PLAYING = { trackIndex: 2, progress: 35 };

// the original's view-release: the release header and tracklist, beside the purchase and download panels.
// comments aren't ported, and purchasing isn't wired up, so downloads stay locked
export function ReleasePage({ release }: { release: ReleaseInterface }) {
  return (
    <div className="release-page flex w-full min-w-0 flex-col gap-(--standard-space) p-(--standard-space)">
      <div className="flex">
        <BackButton />
      </div>

      <div className="grid w-full items-start gap-(--standard-space) md:grid-cols-[1fr_auto]">
        <div className="release-detail-container flex w-full min-w-0 flex-col border">
          <ReleaseHeader
            className="border p-(--standard-space)"
            release={release}
          />
          {release.tracks.length > 0 ? (
            <div className="release-tracks-container flex w-full flex-col">
              {release.tracks.map((track, index) => (
                <SongRow
                  key={track.id}
                  track={track}
                  index={index}
                  playProgress={
                    index === NOW_PLAYING.trackIndex
                      ? NOW_PLAYING.progress
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="border p-(--standard-space) text-sm opacity-60">
              No tracks listed.
            </div>
          )}
        </div>

        <aside className="grid w-full border md:w-[30ch]">
          <div className="purchase-section flex h-full w-full flex-col gap-(--standard-space-half) border p-(--standard-space)">
            <h4 className="space-grotesk mb-0! font-semibold">Purchase</h4>
            <div className="space-grotesk text-left text-pretty opacity-70">
              Don&apos;t just rent your music. Own it. Buy to unlock downloads
              and support the artist.
            </div>
            <div className="flex flex-col pt-(--standard-space)">
              <label
                htmlFor="amount"
                className="space-grotesk text-xs uppercase opacity-70"
              >
                Pay what you want
              </label>
              <div className="flex items-center gap-(--standard-space-half) border">
                <span className="border-r px-2 py-1 text-sm opacity-70">$</span>
                <input
                  id="amount"
                  className="w-full bg-transparent px-2 py-1 outline-none"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={1.99}
                />
              </div>
            </div>
            <Button
              variant="fill"
              size="medium"
              color="primary"
              className="text-nowrap"
            >
              Pay &amp; Download
            </Button>
          </div>

          <div className="download-section-container flex w-full min-w-0 flex-col border p-(--standard-space)">
            <h4 className="space-grotesk mb-0! font-semibold">Downloads</h4>
            <div className="space-grotesk mt-(--standard-space) opacity-70">
              Purchase to unlock downloads
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
