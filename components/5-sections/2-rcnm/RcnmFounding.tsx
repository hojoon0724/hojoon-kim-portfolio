import { StaggeredReveal, StaggeredTextReveal } from "@/components/1-atoms";
import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";

// the groundwork, in the order it happened. each step answers the question the next one depends on.
// tag is the startup term for the move. item is the specific thing done at rcnm
const foundingSteps = [
  {
    item: "Huntsville",
    tag: "Market thesis",
    line: "A fast-growing city of literal rocket scientists, building what’s never been built, with a real appetite for culture. Music by living composers, in a concert experience built from scratch.",
  },
  {
    item: "Founding donors",
    tag: "Seed round",
    line: "Five core donors committed to supporting the organization, each asked to bring in five more.",
  },
  {
    item: "Nonprofit status",
    tag: "Legal foundation",
    line: "Filed before launch, so every donation from the first night was tax-deductible.",
  },
  {
    item: "Free fundraiser concert",
    tag: "MVP",
    line: "Season zero: one free concert in 2021, paid for with initial startup funds, to show the city what this would be.",
  },
  {
    item: "More donors committed",
    tag: "Traction",
    line: "They’d seen it work. That was the green light to build.",
  },
];

// the strip comes in from top to bottom, the same way the database intro does.
// each value is when that part starts, in ms after it comes into view
const foundingTiming = {
  eyebrow: 100,
  headline: 300,
  paragraph: 600,
  paragraphDone: 1000,
  steps: 1000,
  handoff: 1700,
  handoffDone: 2300,
};
const headlineStaggerMs = 35;
const stepsStaggerMs = 120;

const introParagraph =
  "Before building anything, we answered the same questions a startup would ask.";
const handoffLine =
  "With the idea validated, I built the organization to last: the systems behind every concert, the show the audience saw, and the identity that tied it together.";

// an opening strip, not a featured section: it is kept out of the section nav and hands off to the database
export function RcnmFounding({ id }: { id: string }) {
  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      className="px-md lg:px-xl gap-md mx-auto flex max-w-7xl flex-col justify-center py-16"
      snapToEnd
    >
      <div className="gap-sm flex flex-col">
        <StaggeredReveal delayMs={foundingTiming.eyebrow}>
          <h5 className="text-rcnm-red-400">Founding</h5>
        </StaggeredReveal>
        <h1>
          <StaggeredTextReveal
            text="Launched Like a Startup"
            delayMs={foundingTiming.headline}
            staggerMs={headlineStaggerMs}
          />
        </h1>
        <StaggeredTextReveal
          text={introParagraph}
          className="mt-md max-w-prose text-pretty"
          delayMs={foundingTiming.paragraph}
          finishByMs={foundingTiming.paragraphDone}
        />
      </div>

      {/* the rows come in one after another, in the order they happened */}
      <StaggeredReveal
        tag="ol"
        className="border-rcnm-black-300"
        delayMs={foundingTiming.steps}
        staggerMs={stepsStaggerMs}
      >
        {foundingSteps.map((step, index) => (
          <li
            key={step.item}
            className="border-rcnm-black-300 gap-x-lg pt-sm pb-2xl lg:pb-md grid grid-cols-[3ch_minmax(0,1fr)] items-baseline gap-y-1 border-t lg:grid-cols-[3ch_minmax(0,1fr)_minmax(0,65ch)] xl:grid-cols-[3ch_minmax(0,2fr)_minmax(0,3fr)_minmax(0,65ch)]"
          >
            <span
              className="roboto-mono text-rcnm-red-400 row-span-2 text-xs md:text-sm lg:row-span-1"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="roboto-mono text-rcnm-white-700 text-xs tracking-wide uppercase md:text-sm">
              {step.tag}
            </span>
            <div className="flex flex-col gap-1 xl:contents">
              <h3 className="text-balance">{step.item}</h3>
              <p className="text-rcnm-white-500 max-w-prose text-sm md:text-base">
                {step.line}
              </p>
            </div>
          </li>
        ))}
        <li className="border-rcnm-black-300 gap-x-lg pt-sm pb-2xl lg:pb-sm grid grid-cols-[3ch_minmax(0,1fr)] items-baseline gap-y-1 border-t lg:grid-cols-[3ch_minmax(0,1fr)_minmax(0,65ch)] xl:grid-cols-[3ch_minmax(0,2fr)_minmax(0,3fr)_minmax(0,65ch)]">
        </li>
      </StaggeredReveal>

      <StaggeredTextReveal
        text={handoffLine}
        className="roboto-narrow max-w-prose text-xl text-balance md:text-2xl"
        delayMs={foundingTiming.handoff}
        finishByMs={foundingTiming.handoffDone}
      />
    </ProjectSectionSnapTargetContainer>
  );
}
