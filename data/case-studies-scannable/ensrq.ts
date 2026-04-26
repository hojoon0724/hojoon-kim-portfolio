import { PortfolioCaseStudy } from "@/types";
import { ensrq as ensrqOriginal } from "../case-studies-originals/ensrq";

export const ensrqScannable: PortfolioCaseStudy = {
  id: "ensrq",
  title: "enSRQ",
  position: "Lead Brand & Systems Designer",
  date: "2018-2026",
  thumbnail: "/assets/case-studies/ensrq/thumbnail.png",
  roleTag: "Designer who builds operational systems",
  careerSignal: "I can evolve public brand expression and internal operational tooling as one coherent system.",
  oneLiner:
    "What started as seasonal visual design became a multi-year transformation of identity, content architecture, and admin workflow infrastructure.",
  hiringPitch:
    "Strong fit for orgs that need design quality and durable internal systems, not one-off campaign visuals.",
  rawStreamOfConsciousness: ensrqOriginal.streamOfConsciousness,
  collaboration: [
    "Artistic directors and leadership team",
    "Operational staff managing concerts, programs, and artist information",
  ],
  scope: [
    "Seasonal identity direction and rebrand",
    "Website redesign from static CMS to structured system",
    "Data architecture for historical seasons and content",
    "Internal admin tooling for programs, artists, notes, and bios",
    "Workflow modernization from folders to single source of truth",
  ],
  highlights: [
    "Built continuity across multiple seasons without flattening each season's visual identity",
    "Converted fragmented content operations into structured workflows",
    "Translated technical possibilities into language stakeholders could act on",
  ],
  callouts: [
    "Brand systems are only complete when operations can run on them.",
    "I designed the front stage and the backstage.",
    "Design maturity is not just better visuals. It is better systems.",
  ],
  proofPoints: [
    {
      label: "Strategic shift",
      detail: "Evolved the brand from credibility-focused early years to a confident and approachable season voice.",
    },
    {
      label: "Platform decision",
      detail: "Moved from CMS constraints to a custom structure that preserves each season's look and history.",
    },
    {
      label: "Operational impact",
      detail: "Centralized program, artist, and concert content into a single system for accuracy and speed.",
    },
  ],
  pageFlow: [
    {
      sectionTitle: "Hero",
      goal: "Frame this as systems-level design, not campaign design",
      layout: "hero",
      contentFocus: ["oneLiner", "careerSignal", "roleTag"],
      photoDirection: [
        "Layered collage of season posters over UI admin screen",
        "Color and typography board beside database-like content table",
      ],
      captionIdea: "Brand and operations in one architecture",
    },
    {
      sectionTitle: "Brand Evolution",
      goal: "Show the strategic reason for visual change over time",
      layout: "timeline",
      contentFocus: ["proofPoints[0]", "highlights[0]"],
      photoDirection: ["Season-by-season visual timeline", "Before/after identity examples"],
      captionIdea: "From credibility to confidence",
    },
    {
      sectionTitle: "System Rebuild",
      goal: "Demonstrate the practical operations transformation",
      layout: "two-column",
      contentFocus: ["scope", "proofPoints[2]"],
      photoDirection: ["Old folder-based workflow snapshot", "New structured dashboard and content model"],
      captionIdea: "From fragmented files to single source of truth",
    },
    {
      sectionTitle: "Tooling",
      goal: "Make internal tools tangible and scannable",
      layout: "grid",
      contentFocus: ["sections[1]", "callouts[1]"],
      photoDirection: ["Cards for concerts, artists, programs, bios, and notes modules", "Annotated UI screenshots"],
      captionIdea: "Admin workflows that support artistic excellence",
    },
    {
      sectionTitle: "Takeaway",
      goal: "Position this case in hiring context",
      layout: "quote",
      contentFocus: ["hiringPitch", "callouts[2]"],
      photoDirection: ["Strong text-first section with subtle texture background"],
      captionIdea: "What this case proves",
    },
  ],
  sections: [
    {
      id: "context",
      heading: "Context And Stakes",
      summary:
        "Joined as a brand designer and stayed as a strategic partner as the organization scaled, archives grew, and workflows became harder to manage.",
      bullets: [
        "Needed identity evolution without losing institutional memory",
        "Needed content operations that could scale with each season",
        "Needed systems understandable by non-technical stakeholders",
      ],
      visualNarrative: "Set up a side-by-side of visual identity pressure and operations pressure.",
      suggestedAssets: [
        "Season collateral from early year vs 10th season",
        "Workflow diagram of old process",
        "Sticky-note planning board",
      ],
    },
    {
      id: "solution",
      heading: "What I Designed And Built",
      summary:
        "Built a hybrid design and tooling system: seasonal visual identities for audiences and structured admin workflows for internal teams.",
      bullets: [
        "Established design standards and seasonal flexibility",
        "Created data-driven site architecture for historical continuity",
        "Designed backend flows for program and artist management",
      ],
      visualNarrative: "Use an exploded view showing front-end experience connected to admin data fields.",
      suggestedAssets: ["Public page screenshots", "Admin panel screenshots", "Content model schema or table"],
    },
    {
      id: "impact",
      heading: "What This Proves",
      summary:
        "I bridge aesthetics and systems, helping mission-driven teams run better while presenting a stronger public identity.",
      bullets: [
        "Design decisions remained tied to operational realities",
        "Stakeholders gained a clearer and more reliable publishing workflow",
        "The organization can preserve and reuse season-specific identity over time",
      ],
      visualNarrative: "Close with proof cards that connect brand quality to operational reliability.",
      suggestedAssets: [
        "Short testimonial quote",
        "Publishing flow before/after chart",
        "Gallery of reusable season styles",
      ],
    },
  ],
};
