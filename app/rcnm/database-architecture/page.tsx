import {
  CountUp,
  Icon,
  ScrambleRevealText,
  StaggeredReveal,
  StaggeredTextReveal,
} from "@/components/1-atoms";
import { ScrollNudge } from "@/components/2-molecules";
import { RcnmDatabaseStory } from "@/components/5-sections";
import { ProjectPageContainer } from "@/components/6-pages";
import { getDatabaseStory } from "@/data/project-details/rcnm-database-story";
import Link from "next/link";

// the intro comes in from top to bottom. each value is when that part starts, in ms after the page appears
const introTiming = {
  eyebrow: 100,
  headline: 300,
  paragraph: 800,
  paragraphDone: 1400,
  stats: 1400,
  scrollHint: 5000,
};
const eyebrowStaggerMs = 120;
const headlineStaggerMs = 35;
const statsStaggerMs = 80;

export default function RcnmDatabaseArchitecturePage() {
  const story = getDatabaseStory();
  const { totals, eventCounts, event, ledger, seasons } = story;
  const people = event.counts.musicians + event.counts.staff;
  const headline = `One concert is ${ledger.entries} receipts, ${people} people, ${event.counts.repertoire} pieces, and an airplane hangar.`;
  const introParagraph =
    "Rocket City New Music is a small nonprofit that stages contemporary music in Huntsville, Alabama. Every concert leaves a trail of records: who played, what they played, where, and what it cost. I designed the database that keeps those records connected.";
  const busiestSeason = Math.max(...seasons.map((season) => season.entries));

  const stats = [
    { value: eventCounts.scheduled, label: "events" },
    { value: eventCounts.planned, label: "planned" },
    { value: totals.contacts, label: "contacts" },
    { value: totals.repertoire, label: "works" },
    { value: totals.venues, label: "venues" },
    { value: totals.ledger, label: "ledger entries" },
  ];

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
    <ProjectPageContainer projectId="rcnm">
      {/* the intro is a cover: it sits above the story and scrolls away to reveal it */}
      <header className="database-story-intro bg-rcnm-black-500 border-rcnm-black-300 px-md lg:px-xl gap-lg relative z-20 flex min-h-dvh flex-col justify-between border-b py-16">
        <div className="back-button-container">
          <Link
            href="/rcnm"
            transitionTypes={["project-back"]}
            className="roboto-mono text-rcnm-white-700 gap-sm flex w-fit flex-row items-center justify-center text-xs transition-transform hover:-translate-x-1 md:text-sm"
          >
            <div className="icon-container flex h-4 w-4">
              <Icon icon="arrowLeft" className="text-rcnm-white-700" />
            </div>
            <span>Rocket City New Music</span>
          </Link>
        </div>
        <div className="intro-content-container gap-lg relative z-20 flex flex-col justify-center">
          <StaggeredReveal
            className="gap-lg flex flex-col"
            delayMs={introTiming.eyebrow}
            staggerMs={eyebrowStaggerMs}
          >
            <h5 className="text-rcnm-red-400">Database architecture</h5>
          </StaggeredReveal>
          <h1 className="max-w-5xl">
            <StaggeredTextReveal
              text={headline}
              className="text-balance"
              delayMs={introTiming.headline}
              staggerMs={headlineStaggerMs}
            />
          </h1>
          <StaggeredTextReveal
            text={introParagraph}
            className="text-rcnm-white-500 text-md max-w-prose md:text-lg"
            delayMs={introTiming.paragraph}
            finishByMs={introTiming.paragraphDone}
          />
          <StaggeredReveal
            tag="dl"
            className="roboto-mono gap-x-3xl pt-2xl flex flex-wrap gap-y-2"
            delayMs={introTiming.stats}
            staggerMs={statsStaggerMs}
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="">
                <dd className="roboto-wide text-2xl font-bold md:text-3xl">
                  {/* each number starts counting as its stat fades in */}
                  <CountUp
                    targetNumber={stat.value}
                    delayMs={introTiming.stats + index * statsStaggerMs}
                    durationMs={1500}
                    easeOut
                  />
                </dd>
                <dt className="text-rcnm-white-700 text-xs md:text-sm">
                  {/* the label scrambles in alongside its number */}
                  <ScrambleRevealText
                    text={stat.label}
                    delayMs={introTiming.stats + index * statsStaggerMs}
                  />
                </dt>
              </div>
            ))}
          </StaggeredReveal>
        </div>
        <StaggeredReveal delayMs={introTiming.scrollHint}>
          <div className="scroll-indicator flex items-center justify-end">
            {/* the line changes the longer the page sits unscrolled. 5 seconds after the last one, it scrolls by itself */}
            <ScrollNudge
              className="roboto-mono text-rcnm-white-700 text-xs md:text-sm"
              startDelayMs={introTiming.scrollHint}
              scrollAwayAfterMs={5000}
            />
            <div className="icon-container animation-bounce-up flex h-16 w-16 justify-end md:w-16">
              <Icon
                icon="arrowRight"
                className="text-rcnm-white-700 rotate-90"
              />
            </div>
          </div>
        </StaggeredReveal>
      </header>

      {/* the story starts underneath the intro. the spacer gives it one extra screen of room to stay pinned in,
          so it holds still until the intro has scrolled off and then scrolls as normal.
          it is also a cover itself: it sits above the outro and scrolls away to reveal it */}
      <div className="database-story-reveal bg-rcnm-black-500 border-rcnm-black-300 relative z-10 mt-[-100dvh] border-b">
        <div className="sticky top-0">
          <RcnmDatabaseStory story={story} />
        </div>
        <div className="h-dvh" aria-hidden="true" />
      </div>

      {/* the outro starts underneath the last screen of the story and stays pinned until the story has scrolled off */}
      <div className="database-story-outro-reveal mt-[-100dvh]">
        <section className="database-story-outro px-md lg:px-xl gap-2xl sticky top-0 flex min-h-dvh flex-col justify-center py-24">
          <div className="gap-sm flex flex-col">
            <h5 className="text-rcnm-red-400">Why it matters</h5>
            <h2 className="max-w-192 text-balance">
              A small organization can&apos;t afford to look everything up
              twice.
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
              Ledger entries tracked per season. Season 5 is still being
              planned.
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
            names, phone numbers, emails and home addresses have been replaced
            with placeholder data, and money is shown only as totals.
          </p>
        </section>
        <div className="h-dvh" aria-hidden="true" />
      </div>
    </ProjectPageContainer>
  );
}
