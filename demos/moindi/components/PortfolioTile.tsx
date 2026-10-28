import {
  formatCurrency,
  formatDateTime,
  projectUrl,
} from "@/demos/moindi/lib/format";
import type { ProjectInterface } from "@/demos/moindi/types";
import Link from "next/link";
import { ImageContainer } from "./ImageContainer";

type PortfolioTileProps = {
  project: ProjectInterface;
  // dollars spent on the project; shares are $1 each
  purchased: number;
  purchasedAt: Date;
};

// a project the visitor has bought into. the original hard-coded its numbers; earnings stay at $0 here
// until the demo simulates payouts
export function PortfolioTile({
  project,
  purchased,
  purchasedAt,
}: PortfolioTileProps) {
  const earnings = 0;

  return (
    <div className="portfolio-tile flex h-full flex-col border">
      <Link
        href={projectUrl(project.id)}
        className="portfolio-tile__image h-full border p-(--standard-space-half)"
      >
        <ImageContainer
          srcSet={project.heroSrcSet}
          description={project.title}
        />
      </Link>
      <div className="portfolio-tile__info grid h-full grid-cols-1 grid-rows-[1fr_auto] justify-between">
        <div className="border">
          <h5 className="space-grotesk m-0 w-full p-(--standard-space-half) text-center font-semibold tracking-tight">
            {project.title}
          </h5>
        </div>
        <div className="space-mono flex h-full w-full flex-col items-center justify-between border p-(--standard-space-half) text-xs">
          <div className="flex w-full items-center justify-between">
            <span>Purchased:</span>
            <span className="text-red-700">{formatCurrency(purchased)}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Total Earnings:</span>
            <span className="text-green-700">{formatCurrency(earnings)}</span>
          </div>
          <hr className="my-(--standard-space-half) w-full border-t" />
          <div className="flex w-full items-center justify-between">
            <span>Balance:</span>
            <span
              className={
                earnings - purchased < 0 ? "text-red-700" : "text-green-700"
              }
            >
              {formatCurrency(earnings - purchased)}
            </span>
          </div>
        </div>
        <div className="space-mono flex h-full w-full items-center justify-between border p-(--standard-space-half) text-xs opacity-70">
          <span>Purchased on:</span>
          <span>{formatDateTime(purchasedAt)}</span>
        </div>
      </div>
    </div>
  );
}
