import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import { databaseStory } from "@/data/rcnm-db-data-masked/fixed-data";

export function RcnmDatabaseOutro({ id }: { id: string }) {
  const { seasons } = databaseStory;
  const busiestSeason = Math.max(...seasons.map((season) => season.entries));

  const reasons = [
    {
      heading: "The numbers are always on hand",
      body: "What a season cost, how many artists were paid, how many works reached an audience. Planning the next season starts with those figures, and grant applications and tax filings ask for the same ones. Here they come straight out of the links.",
    },
    {
      heading: "Fewer mistakes, less retyping",
      body: "Every fact is entered once and linked wherever it is needed. A changed address or a corrected amount can't fall out of sync between lists, and nothing is copied from one place to another by hand.",
    },
    {
      heading: "It keeps up as the seasons grow",
      body: "Each season adds more concerts, more people and more ledger entries. The structure stays the same, so a bigger season means more rows, not a new system.",
    },
  ];

  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      className="database-story-outro px-md lg:px-xl gap-2xl flex flex-col justify-center py-24"
    >
      <div className="gap-sm flex flex-col">
        <h5 className="text-rcnm-red-400">Why it matters</h5>
        <h2 className="max-w-192 text-balance">
          A small organization can&apos;t afford to look everything up twice.
        </h2>
      </div>

      <ul className="gap-lg grid grid-cols-1 md:grid-cols-3">
        {reasons.map((reason) => (
          <li
            key={reason.heading}
            className="border-rcnm-black-300 pt-sm gap-sm flex flex-col border-t"
          >
            <h3>{reason.heading}</h3>
            <p className="text-rcnm-white-500">{reason.body}</p>
          </li>
        ))}
      </ul>

      <figure className="gap-sm flex flex-col">
        <figcaption className="roboto-mono text-rcnm-white-700 text-xs md:text-sm">
          Ledger entries tracked per season. Season 5 is still being planned.
        </figcaption>
        <ul className="flex h-40 items-end gap-2 md:gap-4">
          {seasons.map((season, index) => (
            <li
              key={season.season}
              className="roboto-mono flex h-full flex-1 flex-col justify-end gap-1 text-center text-[10px] md:text-xs"
            >
              <div className="flex min-h-0 flex-1 flex-col justify-end gap-1">
                <span>{season.entries}</span>
                {/* the last season is still being planned, so its bar is hatched instead of solid */}
                <div
                  className={`w-full ${index === seasons.length - 1 ? "border-rcnm-red-500 border bg-[repeating-linear-gradient(135deg,var(--color-rcnm-red-500)_0_3px,transparent_3px_9px)]" : "bg-rcnm-red-500"}`}
                  style={{
                    height: `${Math.max(2, (season.entries / busiestSeason) * 80)}%`,
                  }}
                />
              </div>
              <span className="text-rcnm-white-700">
                S{Number(season.season)} · {season.year}
              </span>
            </li>
          ))}
        </ul>
      </figure>

      <p className="text-rcnm-white-800 max-w-prose text-xs md:text-sm">
        This page runs on a copy of the organization&apos;s records. Private
        names, phone numbers, emails and home addresses have been replaced with
        placeholder data, and money is shown only as totals.
      </p>
    </ProjectSectionSnapTargetContainer>
  );
}
