// guides for building the actual section
const notes = {
  title: "No Wall Between Us",
  purpose:
    "Prove I work fluidly inside someone else's code, and that the frictionlessness came from shared understanding, not chemistry.",
  copy: "The CTO owned the architecture and chose the stack. I owned most of the interface. But the line between us was never a wall — she'd build an interactive element and I'd refine it; I'd put together a flow and she'd tighten it underneath. What made that work wasn't that we got along. It's that I didn't need her to tell me what was possible. I already understood the constraints, so I never proposed things that fall apart the moment they meet the architecture. We were on the same page from the start, and that saved an enormous amount of time.",
  layout:
    "Show one feature that passed back and forth between us — her function, my interface on top, a refinement that went back the other way. A simple two-column or annotated diagram of 'hers / mine / ours' reads better than prose alone.",
};

export function MoindiCollaboration({ id }: { id: string }) {
  return (
    <div
      className="scroll-mt-nav px-md py-xl flex min-h-dvh items-center justify-center"
      id={id}
    >
      <div className="gap-md grid w-fit grid-cols-[auto_1fr]">
        <h2 className="key">title:</h2>
        <h2>{notes.title}</h2>
        <div className="key font-bold">purpose:</div>
        <p className="max-w-prose">{notes.purpose}</p>
        <div className="key font-bold">copy:</div>
        <p className="max-w-prose">{notes.copy}</p>
        <div className="key font-bold">layout:</div>
        <p className="max-w-prose">{notes.layout}</p>
      </div>
    </div>
  );
}
