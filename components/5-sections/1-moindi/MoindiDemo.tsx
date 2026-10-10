import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";

// title and copy are what the section shows. purpose and layout are guides for building it and are never rendered
const notes = {
  title: "Try It",
  purpose:
    "Proof of reality — the hinge between 'how I work' and 'what it produced.' Let the reviewer use the actual product.",
  copy: "This is the product, rebuilt for this page. Browse the artist offerings, open one, and move the slider to buy a share — the amount and the percentage stay in sync, the way they did in the real thing. The data is invented and no money moves; everything else works exactly as it shipped.",
  layout:
    "Embedded interactive demo: genre gallery, an offering page, the buy flow with the live slider. Visibly fictional data and a small 'demo — not a real investment product' note. This is the strongest asset on the page; give it room and make the interaction obvious. (Demo build is its own work session.)",
};

// the evidence that sits beside the demo. each is an empty frame until its graphic is made
const evidence = ["Usability study", "Private alpha"];

// the hinge of the page: from how the work was done to the thing it produced.
// the demo itself is built separately. until then its frame holds the space it will need
export function MoindiDemo({ id }: { id: string }) {
  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      className="px-md lg:px-xl flex items-center py-16"
      snapToEnd
    >
      <div className="gap-xl mx-auto flex w-full max-w-7xl flex-col">
        <div className="gap-lg flex flex-col">
          <h2>{notes.title}</h2>
          <p className="max-w-prose text-lg text-pretty md:text-xl">
            {notes.copy}
          </p>
        </div>

        <div className="gap-lg grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
          <figure className="gap-sm flex flex-col">
            <div className="p-sm flex aspect-video w-full items-start border border-dashed border-gray-950">
              <span className="roboto-mono text-xs md:text-sm">
                Interactive demo to come
              </span>
            </div>
            <figcaption className="roboto-mono text-xs md:text-sm">
              Demo. Not a real investment product.
            </figcaption>
          </figure>

          <ul className="gap-lg grid grid-cols-2 lg:grid-cols-1">
            {evidence.map((label) => (
              <li key={label} className="gap-sm flex flex-col">
                <div className="p-sm flex aspect-4/3 w-full items-start border border-dashed border-gray-950">
                  <span className="roboto-mono text-xs md:text-sm">
                    Graphic to come
                  </span>
                </div>
                <span className="roboto-mono text-xs font-bold uppercase md:text-sm">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
