import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import { StaggeredTextReveal } from "../../1-atoms/StaggeredTextReveal";

// long version of the claim
// A brand is what a product does. It’s how people feel when they see the logo or use the product. Looking good and being easy to use aren’t enough. Without a personality, a product is forgettable, either because it plays it safe trying to appeal to everyone, or because nobody decided how it should feel to use.

// With nothing built yet, MOindi had a chicken-and-egg problem. You can’t define a brand’s character without a product, and you can’t give a product character without a brand. Getting both right takes several rounds of iteration.

// So I started with the product and defined the brand through it. The iterating happened from day one, on both at once, and nobody was waiting on anybody. There were no handoffs between brand, design and engineering, and no feature designed in a way that couldn’t be built and had to be redone.

// I could see the big picture and build it myself, so ideas went straight into the product without a meeting in between. And because I understand the technical side, I could translate between disciplines without having to switch gears.

// title and copy are what the section shows. purpose and layout are guides for building it and are never rendered
const notes = {
  title: "The Product Is the Brand",
  copy: "A product that only works becomes a tool. One that makes people feel something becomes a brand. A logo can claim what a brand is.",
  emphasis: "Only the product can make them feel it.",
  purpose:
    "State the core claim and why I'm the right person: a brand isn't a logo, it's how the product makes people feel — so I built the brand by building the product.",
  layout:
    "Full-viewport opening. One short paragraph, large type, generous space, no imagery competing with it. This is the claim everything below proves — it should feel like a statement, not a hero banner. Ends on a line that sets up the sections to come.",
};

// the claim the rest of the page proves: one paragraph of large type and nothing competing with it
export function MoindiThesis({ id }: { id: string }) {
  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="header"
      className="px-md lg:px-xl flex items-center"
    >
      <div className="gap-lg mx-auto flex w-full max-w-7xl flex-col">
        <StaggeredTextReveal tag="h1" text={notes.title} delayMs={0} />

        <StaggeredTextReveal
          className="roboto-narrow max-w-5xl text-2xl font-light text-pretty md:text-4xl"
          delayMs={200}
          finishByMs={500}
          text={notes.copy}
        />
        <StaggeredTextReveal
          className="roboto-narrow max-w-5xl text-2xl font-semibold text-pretty md:text-4xl"
          delayMs={400}
          text={notes.emphasis}
        />
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
