"use client";

import {
  BookWithPageTurns,
  FrenchFoldSeasonPoster,
  S06_EnsrqBarrelRollBrochure,
} from "@/components/5-sections";
import { projectOverviewData } from "@/data";

const projectData = projectOverviewData.find(
  (project) => project.id === "rcnm",
);

export default function BuildPage() {
  if (!projectData) {
    return null;
  }
  return (
    <>
      <div className="build-top-container p-md gap-md flex min-h-dvh w-full flex-col">
        <BookWithPageTurns
          path="/ensrq/s07/brochure-pages"
          pages={[
            "s07-season-brochure-01.jpg",
            "s07-season-brochure-02.jpg",
            "s07-season-brochure-03.jpg",
            "s07-season-brochure-04.jpg",
            "s07-season-brochure-05.jpg",
            "s07-season-brochure-06.jpg",
            "s07-season-brochure-07.jpg",
            "s07-season-brochure-08.jpg",
            "s07-season-brochure-09.jpg",
            "s07-season-brochure-10.jpg",
            "s07-season-brochure-11.jpg",
          ]}
        />
        <FrenchFoldSeasonPoster
          path="/ensrq/s08/brochure-pages"
          pages={[
            "s08-season-poster_01-cover.jpg",
            "s08-season-poster_02-quarter.jpg",
            "s08-season-poster_03-half.jpg",
            "s08-season-poster_04-full.jpg",
          ]}
        />
        <FrenchFoldSeasonPoster
          path="/ensrq/s09/brochure-pages"
          pages={[
            "s09-season-poster_01-cover.jpg",
            "s09-season-poster_02-quarter.jpg",
            "s09-season-poster_03-half.jpg",
            "s09-season-poster_04-full.jpg",
          ]}
        />
        <FrenchFoldSeasonPoster
          path="/ensrq/s10/brochure-pages"
          pages={[
            "s10-season-poster_01-cover.jpg",
            "s10-season-poster_02-quarter.jpg",
            "s10-season-poster_03-half.jpg",
            "s10-season-poster_04-full.jpg",
          ]}
        />
        <FrenchFoldSeasonPoster
          path="/ensrq/s11/brochure-pages"
          pages={[
            "s11-season-poster_01-cover.jpg",
            "s11-season-poster_02-quarter.jpg",
            "s11-season-poster_03-half.jpg",
            "s11-season-poster_04-full.jpg",
          ]}
        />

        <S06_EnsrqBarrelRollBrochure />
        <div className="spacer h-120 w-full"></div>
      </div>
    </>
  );
}
