"use client";

import { ChartSeries } from "@/demos/moindi/components/ChartSeries";
import { useDemoAuth } from "@/demos/moindi/components/DemoAuthProvider";
import { LinkButton } from "@/demos/moindi/components/LinkButton";
import { SvgIcon } from "@/demos/moindi/components/SvgIcon";
import { getLeaderboard } from "@/demos/moindi/lib/leaderboard";
import { useRef, useState } from "react";

// the original's what's on feed of posts from followed artists. posts aren't ported, so this is its empty state
function WhatsOn({ followingCount }: { followingCount: number }) {
  return (
    <div className="space-mono flex h-full flex-col items-center justify-center gap-(--standard-space) py-16 text-center text-pretty uppercase">
      <p className="text-(--text-accent)">
        {followingCount === 0
          ? "You are not following any artists yet."
          : "None of the artists you are following have posted yet."}
      </p>
      <LinkButton href="/moindi/demo/explore">Explore Artists</LinkButton>
    </div>
  );
}

// the leaderboard charts as a swipeable carousel, with dots and arrows to step through them
function ChartCarousel() {
  const charts = getLeaderboard();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToChart = (index: number) => {
    const container = containerRef.current;
    container?.scrollTo({
      left: index * container.offsetWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const arrowClasses =
    "absolute bottom-0 z-10 h-8 w-8 border bg-(--surface-base) transition-opacity disabled:opacity-0";

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto"
        onScroll={(event) => {
          const container = event.currentTarget;
          setActiveIndex(
            Math.round(container.scrollLeft / container.offsetWidth),
          );
        }}
      >
        {charts.map((chart) => (
          <div
            key={chart.title}
            className="flex w-full shrink-0 snap-center flex-col border pb-12"
          >
            <h4 className="space-grotesk m-0 w-full bg-(--surface-base) px-(--standard-space) py-(--standard-space-half) font-semibold">
              {chart.title}
            </h4>
            <ChartSeries
              className="p-(--standard-space)"
              items={chart.items}
              format={chart.format}
              color={chart.color}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-2.5 left-0 flex w-full items-center justify-center gap-(--standard-space-half)">
        {charts.map((chart, index) => (
          <button
            key={chart.title}
            type="button"
            className={`h-2 border transition-all duration-300 ${activeIndex === index ? "w-6 bg-(--surface-secondary)" : "w-2 bg-(--surface-secondary-light)"}`}
            aria-label={`Go to chart ${index + 1}`}
            onClick={() => goToChart(index)}
          />
        ))}
      </div>
      <button
        type="button"
        className={`${arrowClasses} left-(--standard-space-half)`}
        aria-label="Previous chart"
        disabled={activeIndex === 0}
        onClick={() => goToChart(activeIndex - 1)}
      >
        <SvgIcon iconName="angle-left" />
      </button>
      <button
        type="button"
        className={`${arrowClasses} right-(--standard-space-half)`}
        aria-label="Next chart"
        disabled={activeIndex === charts.length - 1}
        onClick={() => goToChart(activeIndex + 1)}
      >
        <SvgIcon iconName="angle-right" />
      </button>
    </div>
  );
}

// what's on beside the leaderboard charts, then achievements. the original's streak view, badge details,
// followed-artist tiles and stripe payouts aren't ported
export function DashboardPage() {
  const { user } = useDemoAuth();
  if (!user) return null;

  return (
    <div className="dashboard-container grid w-full grid-cols-1 content-start border md:grid-cols-6 lg:grid-cols-8">
      <div className="border md:col-span-4 lg:col-span-6">
        <h4 className="space-grotesk m-0 w-full border-b-2 px-(--standard-space) py-(--standard-space-half) font-semibold">
          What&apos;s On
        </h4>
        <WhatsOn followingCount={user.following.length} />
      </div>
      <div className="min-h-120 md:col-span-2">
        <ChartCarousel />
      </div>
      <div className="col-span-full flex justify-center border p-(--standard-space)">
        <span className="space-grotesk mr-[1ch] font-semibold">
          Total Achievements:
        </span>
        <span className="space-mono">
          {user.badges.length.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
