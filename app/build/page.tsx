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
            "s07-season-brochure-01.png",
            "s07-season-brochure-02.png",
            "s07-season-brochure-03.png",
            "s07-season-brochure-04.png",
            "s07-season-brochure-05.png",
            "s07-season-brochure-06.png",
            "s07-season-brochure-07.png",
            "s07-season-brochure-08.png",
            "s07-season-brochure-09.png",
            "s07-season-brochure-10.png",
            "s07-season-brochure-11.png",
          ]}
        />
        <FrenchFoldSeasonPoster
          path="/ensrq/s08/brochure-pages"
          pages={[
            "s08-season-poster_01-cover.png",
            "s08-season-poster_02-quarter.png",
            "s08-season-poster_03-half.png",
            "s08-season-poster_04-full.png",
          ]}
        />
        <FrenchFoldSeasonPoster
          path="/ensrq/s09/brochure-pages"
          pages={[
            "s09-season-poster_01-cover.png",
            "s09-season-poster_02-quarter.png",
            "s09-season-poster_03-half.png",
            "s09-season-poster_04-full.png",
          ]}
        />
        <FrenchFoldSeasonPoster
          path="/ensrq/s10/brochure-pages"
          pages={[
            "s10-season-poster_01-cover.png",
            "s10-season-poster_02-quarter.png",
            "s10-season-poster_03-half.png",
            "s10-season-poster_04-full.png",
          ]}
        />
        <FrenchFoldSeasonPoster
          path="/ensrq/s11/brochure-pages"
          pages={[
            "s11-season-poster_01-cover.png",
            "s11-season-poster_02-quarter.png",
            "s11-season-poster_03-half.png",
            "s11-season-poster_04-full.png",
          ]}
        />

        <S06_EnsrqBarrelRollBrochure />
        <div className="spacer h-120 w-full"></div>
      </div>
    </>
  );
}
