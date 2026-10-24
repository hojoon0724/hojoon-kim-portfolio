import type { ContentStatus } from "./common-types";

export interface ProductInterface {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  status: ContentStatus;
  images: string[];
  availableCount: number | null;
  artistId: string;
  artistName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPurchaseInterface {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productCoverArt: string;
  artistId: string;
  artistName: string;
  priceInCents: number;
  createdAt: Date;
  updatedAt: Date;
}
