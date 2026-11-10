import type { ProductInterface } from "@/demos/moindi/types";
import { formatCurrency } from "../lib/format";
import { ImageContainer } from "./ImageContainer";

// the original's product-tile, big-picture layout only: a square product shot over the name and price.
// there's no product page in the demo, so it isn't a link
export function ProductTile({
  product,
  className = "",
}: {
  product: ProductInterface;
  className?: string;
}) {
  return (
    <div
      className={`product-tile flex flex-col border bg-(--surface-base) ${className}`}
    >
      <div className="product-image aspect-square w-full border">
        <ImageContainer srcSet={product.images[0] ?? ""} description={product.name} />
      </div>
      <div className="flex min-w-0 items-center justify-between gap-(--standard-space-half) border p-(--standard-space-half)">
        <div className="min-w-0">
          <div className="truncate text-lg leading-tight font-semibold">
            {product.name}
          </div>
          <div className="truncate text-xs opacity-60">
            {product.artistName}
          </div>
        </div>
        <div className="space-mono shrink-0 text-sm">
          {formatCurrency(product.priceInCents / 100)}
        </div>
      </div>
    </div>
  );
}
