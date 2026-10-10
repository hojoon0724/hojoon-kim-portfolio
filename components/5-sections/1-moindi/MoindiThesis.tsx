import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";

// title and copy are what the section shows. purpose and layout are guides for building it and are never rendered
const notes = {
  title: "The Product Is the Brand",
  purpose:
    "State the core claim and why I'm the right person: a brand isn't a logo, it's how the product makes people feel — so I built the brand by building the product.",
  copy: "A brand isn't a logo sitting by itself. It's what the product makes people feel. So building Moindi's brand meant building Moindi — designing it, engineering it, and understanding how those two constrain each other. Because I could do all of that myself, there was no gap between the idea and the thing. We moved fast because I already knew what was possible.",
  layout:
    "Full-viewport opening. One short paragraph, large type, generous space, no imagery competing with it. This is the claim everything below proves — it should feel like a statement, not a hero banner. Ends on a line that sets up the sections to come.",
};

// the last sentence is the one that sets up everything below, so it is set apart from the rest
const closingStart = notes.copy.lastIndexOf(". ") + 2;
const lead = notes.copy.slice(0, closingStart).trim();
const closing = notes.copy.slice(closingStart);

// the claim the rest of the page proves: one paragraph of large type and nothing competing with it
export function MoindiThesis({ id }: { id: string }) {
  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="header"
      className="px-md lg:px-xl flex items-center py-16"
    >
      <div className="gap-lg mx-auto flex w-full max-w-7xl flex-col">
        <h1 className="roboto-mono text-xs font-normal tracking-wide uppercase md:text-sm">
          {notes.title}
        </h1>
        <p className="roboto-narrow max-w-5xl text-2xl font-light text-pretty md:text-4xl">
          {lead}
        </p>
        <p className="roboto-narrow max-w-5xl text-2xl font-semibold text-balance md:text-4xl">
          {closing}
        </p>
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
