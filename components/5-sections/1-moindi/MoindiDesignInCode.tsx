import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import Image from "next/image";

// title and copy are what the section shows. purpose and layout are guides for building it and are never rendered
const notes = {
  title: "Design in Code",
  purpose:
    "Show the speed and why it existed: no Figma-to-dev handoff. A sketch for alignment, then straight into production code.",
  copy: "I started with a rough sketch — just enough to agree with the CTO on where things would go and how it should feel. Then I skipped the Figma library entirely and built directly in the code that would ship. There was no design file to hand off, no translation step, no intent lost between the mockup and the product. The design happened in the medium it was going to live in.",
  layout:
    "Side-by-side: the rough alignment sketch next to the shipped interface, with the gap labeled 'everything after this happened in code.' The sketch should look deliberately unpolished — that's the point. Keep text tight; the artifact carries it.",
};

// the two things being compared. set src once the file is in /public/moindi and the placeholder is replaced
const sketch = {
  src: "",
  label: "The sketch",
  caption: "Rough, for alignment only.",
};
const shipped = {
  src: "",
  label: "What shipped",
  caption: "Designed in the code it runs on.",
};

type Comparison = typeof sketch;

// one side of the comparison: the image once it has a src, and an empty frame until then
function ComparisonFrame({ item }: { item: Comparison }) {
  return (
    <figure className="gap-sm flex flex-col">
      <div className="relative aspect-4/3 w-full border border-dashed border-gray-950">
        {item.src ? (
          <Image
            src={item.src}
            alt={item.label}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="roboto-mono p-sm absolute text-xs md:text-sm">
            Image to come
          </span>
        )}
      </div>
      <figcaption className="flex flex-col">
        <span className="roboto-mono text-xs font-bold uppercase md:text-sm">
          {item.label}
        </span>
        <span className="text-sm md:text-base">{item.caption}</span>
      </figcaption>
    </figure>
  );
}

// the sketch beside the screen it became. the gap between them is the point: nothing sat in the middle
export function MoindiDesignInCode({ id }: { id: string }) {
  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      className="px-md lg:px-xl flex items-center py-16"
      snapToEnd
    >
      <div className="gap-2xl mx-auto flex w-full max-w-7xl flex-col">
        <div className="gap-lg flex flex-col">
          <h2>{notes.title}</h2>
          <p className="max-w-prose text-lg text-pretty md:text-xl">
            {notes.copy}
          </p>
        </div>

        <div className="gap-lg grid grid-cols-1 items-center lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <ComparisonFrame item={sketch} />
          <p className="roboto-mono py-sm mx-auto max-w-[22ch] border-y border-gray-950 text-center text-xs text-balance md:text-sm lg:mx-0">
            Everything after this happened in code.
          </p>
          <ComparisonFrame item={shipped} />
        </div>
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
