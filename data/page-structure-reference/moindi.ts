export const moindiPageStructure = [
  {
    id: "thesis",
    navLabel: "Thesis",
    title: "The product is the brand",
    effect:
      "Picks up from the expanded summary and states the argument of the page: a brand is what the product makes people feel, so the brand had to be built by building the product. Establishes why one person doing design and code is the point.",
    presentation:
      "One paragraph of large-set prose. No visuals, no scroll effects. Short enough to read in one breath before the evidence starts.",
    data: ["Thesis paragraph in Hojoon's voice"],
  },
  {
    id: "discovery",
    navLabel: "Discovery",
    title: "Product first",
    effect:
      "Sets up the reversal: the founders asked for a brand, there was no product, so the work started with defining one. Proves strategic groundwork without becoming a strategy section. A setup beat, not a showcase.",
    presentation:
      "Compact item list in the same pattern as the brand guidelines section: each item named, followed by a two-to-three sentence outcome (what was concluded, not what was done). Optional small chart or persona card per item. Kept visually light so the reader moves quickly into the build.",
    data: [
      "Market and competitive landscape",
      "Target market definition",
      "User personas",
      "Problem statement",
      "Jobs to be done / user needs",
      "User journey mapping",
      "Value proposition",
      "Product definition and scope",
      "Core feature set / MVP priorities",
      "Risks and constraints",
    ],
    notes:
      "Item list is a candidate set; final selection pending. Revenue model, success metrics, and go-to-market are deliberately excluded.",
  },
  {
    id: "design-in-code",
    navLabel: "Design in Code",
    title: "No handoff",
    effect:
      "Shows the speed: a rough sketch only to align with the CTO, then design happened directly in production code. No Figma library, no handoff step.",
    presentation:
      "Side-by-side or scroll-linked comparison: the rough alignment sketch next to the shipped screen it became. Short prose explaining that the sketch's only job was alignment.",
    data: [
      "Rough Figma alignment sketch(es)",
      "Corresponding production screens",
      "Short copy on skipping the design-to-dev handoff",
    ],
  },
  {
    id: "collaboration",
    navLabel: "Collaboration",
    title: "Already on the same page",
    effect:
      "Explains why it worked: the CTO owned architecture and the stack, both moved fluidly through each other's code, and there was no friction because both understood what was possible. Not about getting along.",
    presentation:
      "Prose with a simple ownership diagram: CTO lane (architecture, stack, Firebase + Angular, Stripe/Plaid/KYC integration) and Hojoon lane (product, UI, brand), with an overlap zone where both worked in the same code.",
    data: [
      "Ownership split between Hojoon and the CTO",
      "Stack: Firebase, Angular, Stripe, Plaid, compliance/KYC partner",
      "Short copy on no committee, no endless meetings, no infeasible proposals",
    ],
  },
  {
    id: "try-it",
    navLabel: "Try It",
    title: "Use it",
    effect:
      "Proof of reality and the hinge of the page: moves from how he worked to what it produced. The reader uses the product instead of looking at screenshots.",
    presentation:
      "Embedded interactive demo, rebuilt from a fresh repo: genre gallery, artist offering page, buy flow with the live slider that calculates percentage. Visibly fictional data and a 'demo, not a real investment product' note. Quiet caption that the demo was rebuilt solo. Usability study and private alpha summarized beside it as reconstructed graphics (task success rates, fixes made).",
    data: [
      "Live demo (gallery, offering page, buy flow)",
      "Usability study: ~8 users, task lists, success rates, resulting fixes (own graphics, no footage)",
      "Private alpha with invited users exercising real features",
      "Demo disclaimer and rebuild caption",
    ],
    notes: "Demo build is a separate work session.",
  },
  {
    id: "brand",
    navLabel: "Brand",
    title: "A coder's brand",
    effect:
      "Continues the story: once the product existed, the brand grew from it. Shows systems thinking through the guidelines.",
    presentation:
      "Numbered exhibits, claim and reason on the left, guideline evidence on the right. Built (MoindiBrand component).",
    data: [
      "Opening quote",
      "Core Idea traceability matrix",
      "Three degrees of freedom ring diagram (Limits, Direction, Freedom)",
      "Identity system",
      "Terminology sheet",
      "Cheatsheet decision tree",
      "Do / Don't with WHY lines",
      "Fail-closed rule",
      "Stylization edge cases",
      "Motion principles comparison",
    ],
  },
  {
    id: "wrap-up",
    navLabel: "Wrap-up",
    title: "You've just seen it",
    effect:
      "Synthesis anchored to the evidence shown, not a restatement of the thesis. Lands the hiring pitch: one person wearing many hats saves a small team time, money, and development resources.",
    presentation:
      "Short prose, optionally a four-line recap where each line points back to a section (interface designed as it shipped, engineering wasn't a wall, the product wasn't a screenshot, the brand is a system).",
    data: [
      "Conclusion copy",
      "Back-references to Design in Code, Collaboration, Try It, Brand",
    ],
  },
];
