import { AssetImage, type SlideAsset } from "@/components/1-atoms";

// pitch deck slides, 16:9. drop each file into public/moindi/deck/, set its real size and remove placeholder
const deckSlides: SlideAsset[] = [
  {
    src: "/moindi/deck/deck-1.png",
    width: 1920,
    height: 1080,
    alt: "Pitch deck title slide",
    placeholder: true,
  },
  {
    src: "/moindi/deck/deck-2.png",
    width: 1920,
    height: 1080,
    alt: "Pitch deck slide using the product's charts",
    placeholder: true,
  },
  {
    src: "/moindi/deck/deck-3.png",
    width: 1920,
    height: 1080,
    alt: "Pitch deck slide using the pattern tiles",
    placeholder: true,
  },
];

export function DeckSlides() {
  return (
    <div className="gap-md grid grid-cols-1 md:grid-cols-3">
      {deckSlides.map((slide) => (
        <AssetImage
          key={slide.src}
          asset={slide}
          className="shadow-xl ring-1 ring-black/10"
        />
      ))}
    </div>
  );
}
