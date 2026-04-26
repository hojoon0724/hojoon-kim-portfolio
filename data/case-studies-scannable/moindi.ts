import { PortfolioCaseStudy } from "@/types";
import { moindi as moindiOriginal } from "../case-studies-originals/moindi";

export const moindiScannable: PortfolioCaseStudy = {
  id: "moindi",
  title: "MOindi",
  position: "Director of Brand & Product",
  date: "2025-current",
  thumbnail: "/assets/case-studies/moindi/thumbnail.png",
  roleTag: "Founding product and brand operator",
  careerSignal: "I can move from market framing to shipped interface without handoff friction.",
  oneLiner:
    "A branding brief became a product leadership role where I helped define strategy, designed the experience, and built front-end product surfaces with the CTO.",
  hiringPitch:
    "Strong fit for teams that need one person who can shape direction, build UI systems, and ship with engineering.",
  rawStreamOfConsciousness: moindiOriginal.streamOfConsciousness,
  collaboration: [
    "Founders (positioning, role design, product direction)",
    "CTO (system constraints, feature architecture, implementation loop)",
  ],
  scope: [
    "Product framing and MVP definition",
    "Brand and product alignment",
    "UX design and interaction model",
    "Angular front-end build and iteration",
    "Retention and engagement feature strategy",
  ],
  highlights: [
    "Redirected the engagement from visual branding only to product-first strategy",
    "Established a design language that could be implemented immediately",
    "Reduced design-engineering handoff by building production UI directly",
  ],
  callouts: [
    "I did not just style the product. I shaped what got built.",
    "Product strategy and front-end execution happened in the same loop.",
    "From blank prototype to live workflow: no handoff bottleneck.",
  ],
  proofPoints: [
    {
      label: "Core move",
      detail: "Turned down branding-first execution and reframed the work around product readiness.",
    },
    {
      label: "Execution model",
      detail: "Moved from Figma prototypes into Angular implementation to accelerate iteration.",
    },
    {
      label: "Business impact",
      detail: "Contributed to prioritizing retention mechanics early in MVP scope.",
    },
  ],
  pageFlow: [
    {
      sectionTitle: "Hero",
      goal: "Set role, stakes, and unique value in 8 seconds",
      layout: "hero",
      contentFocus: ["title", "oneLiner", "careerSignal", "roleTag"],
      photoDirection: [
        "Product screen collage with annotated arrows",
        "Photo of notebook sketch beside interface screenshot",
      ],
      captionIdea: "From brand request to product direction",
    },
    {
      sectionTitle: "Decision Moment",
      goal: "Show strategic judgment before execution",
      layout: "quote",
      contentFocus: ["proofPoints[0]", "callouts[0]"],
      photoDirection: [
        "Simple visual of two paths: branding-first vs product-first",
        "Screenshot of early product definition notes",
      ],
      captionIdea: "Why product had to come first",
    },
    {
      sectionTitle: "Build Loop",
      goal: "Show how design and code were integrated",
      layout: "two-column",
      contentFocus: ["scope", "proofPoints[1]"],
      photoDirection: ["Left: wireframe and Figma flow", "Right: Angular component screenshot or code snippet"],
      captionIdea: "Design and implementation in one workflow",
    },
    {
      sectionTitle: "What I Owned",
      goal: "Make ownership scannable for hiring managers",
      layout: "grid",
      contentFocus: ["highlights", "collaboration"],
      photoDirection: [
        "Three cards with role icons: strategy, design, build",
        "Small badges for partners and stakeholders",
      ],
      captionIdea: "Cross-functional ownership map",
    },
    {
      sectionTitle: "Takeaway",
      goal: "Anchor what this case proves about your stack",
      layout: "quote",
      contentFocus: ["hiringPitch", "callouts[2]"],
      photoDirection: ["Single clean pull-quote over subtle product backdrop"],
      captionIdea: "What this says about how I work",
    },
  ],
  sections: [
    {
      id: "context",
      heading: "Context And Stakes",
      summary:
        "Originally hired for branding, then asked to co-lead product and brand as the startup needed product clarity before identity polish.",
      bullets: [
        "Founders needed market-fit clarity, not surface-level brand work",
        "Role expanded into product direction with direct CTO collaboration",
        "Speed mattered because team and resources were constrained",
      ],
      visualNarrative: "Use a split visual: initial brand brief on one side, product roadmap on the other.",
      suggestedAssets: [
        "Screenshot of original brief or notes",
        "Roadmap board snapshot",
        "Early low-fidelity user flow",
      ],
    },
    {
      id: "process",
      heading: "How I Worked",
      summary:
        "Validated assumptions in Figma, then built front-end directly in Angular so product thinking and implementation evolved together.",
      bullets: [
        "Prototype, validate, build, and revise in tight cycles",
        "No translation lag between design intent and shipped UI",
        "Integrated interface decisions with business logic constraints",
      ],
      visualNarrative: "Show a timeline strip: sketch -> prototype -> component -> released screen.",
      suggestedAssets: ["Sketch photo", "Figma frame", "Angular component screenshot", "Released UI capture"],
    },
    {
      id: "impact",
      heading: "What This Proves",
      summary: "I can lead at the intersection of strategy, UX, and execution in an early-stage environment.",
      bullets: [
        "Shaped product scope, not just visual output",
        "Built implementation-ready UI systems",
        "Influenced retention strategy in MVP planning",
      ],
      visualNarrative: "Present three proof cards with one concise metric or example each.",
      suggestedAssets: ["Feature priority matrix", "Before/after product screen", "CTO collaboration artifact"],
    },
  ],
};
