import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";

// title and copy are what the section shows. purpose and layout are guides for building it and are never rendered
const notes = {
  title: "No Wall Between Us",
  purpose:
    "Prove I work fluidly inside someone else's code, and that the frictionlessness came from shared understanding, not chemistry.",
  copy: "The CTO owned the architecture and chose the stack. I owned most of the interface. But the line between us was never a wall — she'd build an interactive element and I'd refine it; I'd put together a flow and she'd tighten it underneath. What made that work wasn't that we got along. It's that I didn't need her to tell me what was possible. I already understood the constraints, so I never proposed things that fall apart the moment they meet the architecture. We were on the same page from the start, and that saved an enormous amount of time.",
  layout:
    "Show one feature that passed back and forth between us — her function, my interface on top, a refinement that went back the other way. A simple two-column or annotated diagram of 'hers / mine / ours' reads better than prose alone.",
};

// the copy turns at this sentence, from who owned what to why it worked
const turnStart = notes.copy.indexOf("What made that work");
const whoOwnedWhat = notes.copy.slice(0, turnStart).trim();
const whyItWorked = notes.copy.slice(turnStart);

// who owned what. the middle lane is the code both of us worked in
const lanes = [
  {
    id: "hers",
    label: "Hers",
    owner: "The CTO",
    items: [
      "Architecture",
      "The stack: Firebase and Angular",
      "Stripe, Plaid and KYC integration",
    ],
  },
  {
    id: "ours",
    label: "Ours",
    owner: "The same code",
    items: [
      "Interactive elements she built and I refined",
      "Flows I put together and she tightened underneath",
    ],
  },
  {
    id: "mine",
    label: "Mine",
    owner: "Me",
    items: ["Product", "Interface", "Brand"],
  },
];

// the ownership diagram is three lanes with the shared one filled in, so the overlap is the first thing seen
export function MoindiCollaboration({ id }: { id: string }) {
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
          <div className="gap-lg grid grid-cols-1 lg:grid-cols-2">
            <p className="max-w-prose text-pretty">{whoOwnedWhat}</p>
            <p className="max-w-prose font-semibold text-pretty">
              {whyItWorked}
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 border border-gray-950 md:grid-cols-3">
          {lanes.map((lane) => (
            <li
              key={lane.id}
              className={`gap-md p-md flex flex-col border-gray-950 not-last:border-b md:not-last:border-r md:not-last:border-b-0 ${lane.id === "ours" ? "text-moindi-orange bg-gray-950" : ""}`}
            >
              <div className="flex flex-col">
                <span className="roboto-mono text-xs md:text-sm">
                  {lane.owner}
                </span>
                <h3>{lane.label}</h3>
              </div>
              <ul className="gap-sm flex flex-col">
                {lane.items.map((item) => (
                  <li key={item} className="gap-sm flex items-baseline">
                    <span
                      className="roboto-mono w-4 shrink-0"
                      aria-hidden="true"
                    >
                      +
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
