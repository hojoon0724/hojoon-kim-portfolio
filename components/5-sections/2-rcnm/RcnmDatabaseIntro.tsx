import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import {
  CountUp,
  Icon,
  ScrambleRevealText,
  StaggeredReveal,
  StaggeredTextReveal,
} from "@/components/1-atoms";
import { ScrollNudge } from "@/components/2-molecules";
import { databaseStory } from "@/data/rcnm-db-data-masked/fixed-data";

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

export function RcnmDatabaseIntro({ id }: { id: string }) {
  const { totals, eventCounts, event, ledger } = databaseStory;
  const people = event.counts.musicians + event.counts.staff;
  const headline = `One concert is ${ledger.entries} receipts, ${people} people, ${event.counts.repertoire} pieces, and an airplane hangar.`;
  const introParagraph =
    "Rocket City New Music is a small nonprofit that stages contemporary music in Huntsville, Alabama. Every concert leaves a trail of records: who played, what they played, where, and what it cost. I designed the database that keeps those records connected. Built to scale from the first season.";

  const stats = [
    { value: eventCounts.scheduled, label: "events" },
    { value: eventCounts.planned, label: "planned" },
    { value: totals.contacts, label: "contacts" },
    { value: totals.repertoire, label: "works" },
    { value: totals.venues, label: "venues" },
    { value: totals.ledger, label: "ledger entries" },
  ];

  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="header"
      className="database-story-intro bg-rcnm-black-500 border-rcnm-black-300 px-md lg:px-xl gap-lg flex flex-col justify-between border-b py-16"
    >
      {/* keeps the intro content centered between the top and the scroll hint */}
      <div aria-hidden="true" />
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
            <Icon icon="arrowRight" className="text-rcnm-white-700 rotate-90" />
          </div>
        </div>
      </StaggeredReveal>
    </ProjectSectionSnapTargetContainer>
  );
}
