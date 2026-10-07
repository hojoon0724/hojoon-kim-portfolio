// guides for building the actual section
const notes = {
  title: "The Product Is the Brand",
  purpose:
    "State the core claim and why I'm the right person: a brand isn't a logo, it's how the product makes people feel — so I built the brand by building the product.",
  copy: "A brand isn't a logo sitting by itself. It's what the product makes people feel. So building Moindi's brand meant building Moindi — designing it, engineering it, and understanding how those two constrain each other. Because I could do all of that myself, there was no gap between the idea and the thing. We moved fast because I already knew what was possible.",
  layout:
    "Full-viewport opening. One short paragraph, large type, generous space, no imagery competing with it. This is the claim everything below proves — it should feel like a statement, not a hero banner. Ends on a line that sets up the sections to come.",
};

export function MoindiThesis({ id }: { id: string }) {
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
