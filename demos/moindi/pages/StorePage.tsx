import { ImageCarousel } from "@/demos/moindi/components/ImageCarousel";
import { ProductTile } from "@/demos/moindi/components/ProductTile";
import { ReleaseTile } from "@/demos/moindi/components/ReleaseTile";
import { SnapScroller } from "@/demos/moindi/components/SnapScroller";
import {
  featuredArtists,
  mostDownloadedReleases,
  recentReleases,
  storeProducts,
} from "@/demos/moindi/data/store";

const ROW_COUNT = 8;

// the original's store: a featured-artist carousel, then rows of recent releases, merch and the most downloaded.
// the carousel's "view artist" button is just for show, since the demo has no artist pages yet
export function StorePage() {
  const slides = featuredArtists.map((artist) => ({
    src: artist.bannerSrc,
    title: artist.name,
    buttonText: "View Artist",
  }));

  return (
    <div className="store-container flex w-full min-w-0 flex-col gap-(--standard-space-double) p-(--standard-space)">
      <div className="carousel-banner-container relative flex aspect-4/3 w-full items-center justify-center overflow-hidden border md:aspect-video lg:aspect-3/1">
        <ImageCarousel slides={slides} />
      </div>

      <StoreSection title="Recent Releases">
        <SnapScroller>
          {recentReleases(ROW_COUNT).map((release) => (
            <ReleaseTile key={release.id} release={release} variant="big" />
          ))}
        </SnapScroller>
      </StoreSection>

      <StoreSection title="Featured Merchandise">
        <SnapScroller>
          {storeProducts.slice(0, ROW_COUNT).map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </SnapScroller>
      </StoreSection>

      <StoreSection title="Most Downloaded">
        <div className="grid grid-cols-1 gap-(--standard-space-half) md:grid-cols-2 lg:grid-cols-4">
          {mostDownloadedReleases(ROW_COUNT).map((release) => (
            <ReleaseTile key={release.id} release={release} variant="small" />
          ))}
        </div>
      </StoreSection>
    </div>
  );
}

function StoreSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <h4 className="space-grotesk m-0 font-semibold mb-0!">{title}</h4>
      {children}
    </div>
  );
}
