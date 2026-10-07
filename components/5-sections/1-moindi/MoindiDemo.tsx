// guides for building the actual section
const notes = {
  title: "Try It",
  purpose:
    "Proof of reality — the hinge between 'how I work' and 'what it produced.' Let the reviewer use the actual product.",
  copy: "This is the product, rebuilt for this page. Browse the artist offerings, open one, and move the slider to buy a share — the amount and the percentage stay in sync, the way they did in the real thing. The data is invented and no money moves; everything else works exactly as it shipped.",
  layout:
    "Embedded interactive demo: genre gallery, an offering page, the buy flow with the live slider. Visibly fictional data and a small 'demo — not a real investment product' note. This is the strongest asset on the page; give it room and make the interaction obvious. (Demo build is its own work session.)",
};

export function MoindiDemo({ id }: { id: string }) {
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
