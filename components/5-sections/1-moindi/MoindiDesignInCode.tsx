// guides for building the actual section
const notes = {
  title: "Design in Code",
  purpose:
    "Show the speed and why it existed: no Figma-to-dev handoff. A sketch for alignment, then straight into production code.",
  copy: "I started with a rough sketch — just enough to agree with the CTO on where things would go and how it should feel. Then I skipped the Figma library entirely and built directly in the code that would ship. There was no design file to hand off, no translation step, no intent lost between the mockup and the product. The design happened in the medium it was going to live in.",
  layout:
    "Side-by-side: the rough alignment sketch next to the shipped interface, with the gap labeled 'everything after this happened in code.' The sketch should look deliberately unpolished — that's the point. Keep text tight; the artifact carries it.",
};

export function MoindiDesignInCode({ id }: { id: string }) {
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
