// guides for building the actual section
const notes = {
  title: "One Loop",
  purpose:
    "Synthesis — re-collect the evidence as a verdict. 'You've just seen it,' not a restatement of the thesis.",
  copy: "The interface wasn't drawn and handed off — it was designed the way it would ship. The CTO and I moved fast because engineering was never a wall between us. The product wasn't a screenshot; you just used it. And the brand wasn't decoration — it was a system built around what the product should make people feel. Four things, but really one: design and engineering as a single loop. For a small team, that's the difference between one person moving and a committee deliberating.",
  layout:
    "Short — shorter than the sections it summarizes. Prose, not bullets mirroring the nav. End with a forward-looking line and a clear handoff: next project, back to gallery, contact.",
};

export function MoindiConclusion({ id }: { id: string }) {
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
