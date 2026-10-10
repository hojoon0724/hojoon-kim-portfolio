export const rcnmPageStructure = [
  {
    id: "founding",
    navLabel: "Founding",
    title: "More alike than they look",
    effect:
      "Opens by continuing the expanded summary ('an idea isn't an organization, it needs the infrastructure around it'). Claims the zero-to-one credential and makes non-tech founder work legible to a tech reader.",
    presentation:
      "Short bridge line, then the claim ('A nonprofit and a startup are more alike than they look. I built one the way you'd build the other.'), then a two-column parallel table: arts term on the left (the truth), startup equivalent on the right (the lens). Strongest parallels first. This mapping device is used only here.",
    data: [
      "Founding donors → Seed round",
      "Free fundraiser concert → MVP / working prototype",
      "Underserved market in a high-education city → Market thesis",
      "Nonprofit filing, done up front → Incorporating before launch",
      "Season zero (2021) → Proof of concept",
    ],
    notes:
      "Season one (2022) → Launch is optional; it only restates the timeline.",
  },
  {
    id: "database",
    navLabel: "Database",
    title: "One concert, every system",
    effect:
      "The main systems-thinking and software showcase. Shows that the organization ran on connected data designed from scratch.",
    presentation:
      "Scrollytelling steps that follow one concert by its concert ID, with a schema map beside each step showing how the databases connect. Built.",
    data: [
      "Concert ID",
      "Venues",
      "Ledger",
      "Programming / repertoire",
      "Artists",
      "Composers",
      "Staff",
      "Schema map of the relations",
    ],
  },
  {
    id: "lighting-video",
    navLabel: "Lighting & Video",
    title: "Scored to the Music",
    effect:
      "Range into something few people can do, and the clearest instance of the site-wide through-line: everything (lights, camera moves, cuts) arises from the music. Same way of working, different medium.",
    presentation:
      "Same scroll layout as the database section: numbered steps with an example off to the side, following one piece in one concert. Ends on the world-premiere video where both the lighting and the editing are visible.",
    data: [
      "1. Reading the score — score notes on what the lights should do (parallel: reading a spec or codebase first)",
      "2. Designing the looks — visual ideas from the notes (parallel: architecting a solution)",
      "3. Programming the cues — cue list in the lighting software (parallel: implementation)",
      "4. Rehearsal — testing and refining against the performance (parallel: testing and debugging)",
      "5. The concert — cueing live from the iPad score as part of the ensemble (parallel: production, no rollback)",
      "6. The edit — multicam synced in Final Cut Pro, cuts and Ken Burns moves matched to the music",
      "World-premiere video with full production and edit",
    ],
    notes:
      "Specific piece and concert to be chosen. Cueing is event-driven, an optional deeper engineering parallel.",
  },
  {
    id: "brand",
    navLabel: "Brand",
    title: "Taste driven by concept",
    effect:
      "Proves visual taste without repeating Moindi's systems-heavy brand section. The argument is coherence: one concept, every decision laddering up to it.",
    presentation:
      "Lean and visual, not step-by-step. State the concept, reveal the logo with an annotated or animated breakdown, then palette and type as the concept extended. Futura detail as a single-line callout next to the type specimen.",
    data: [
      "Concept: 1960s Apollo-era American optimism",
      "Logo: pill-shaped vertical sound waves, hidden R C M initials, curves reading as both audio waves and rocket plumes",
      "Palette: NASA red and blue, dark gray, cream white, plus working shades",
      "Type: Futura, all caps, letter-spacing matched to the Apollo 11 moon plaque",
      "Applications: poster, program, social",
    ],
  },
];
