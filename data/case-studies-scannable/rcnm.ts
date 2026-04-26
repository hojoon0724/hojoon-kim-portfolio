import { PortfolioCaseStudy } from "@/types";
import { rcnm as rcnmOriginal } from "../case-studies-originals/rcnm";

export const rcnmScannable: PortfolioCaseStudy = {
  id: "rocket-city-new-music",
  title: "Rocket City New Music",
  position: "Co-founder",
  date: "2021-2026",
  thumbnail: "/assets/case-studies/rcnm/thumbnail.png",
  roleTag: "0-to-1 founder and systems builder",
  careerSignal: "I can create structure under ambiguity and scale a mission with limited resources.",
  oneLiner:
    "Co-founded a contemporary music organization from zero and built the operating system across fundraising, production, brand, and audience experience.",
  hiringPitch:
    "Strong fit for teams that need founder-level ownership across strategy, design, operations, and execution.",
  rawStreamOfConsciousness: rcnmOriginal.streamOfConsciousness,
  collaboration: [
    "Donors and community stakeholders",
    "Artists, production teams, and board-level partners",
    "Internal staff and volunteers",
  ],
  scope: [
    "Fundraising strategy and pitch narrative",
    "Brand identity and public communication",
    "Website, ticketing, CRM, and donor workflows",
    "Financial planning and operational systems",
    "Live production direction across lighting, video, and experience",
  ],
  highlights: [
    "Built startup infrastructure while running real productions",
    "Connected artistic vision with practical systems and budgeting",
    "Stepped away after building durable foundations that can continue without founder dependency",
  ],
  callouts: [
    "This was not event support. This was organization design.",
    "I built the experience and the machinery behind it.",
    "Founder-level range: strategy, systems, design, and delivery.",
  ],
  proofPoints: [
    {
      label: "0-to-1 reality",
      detail: "Launched with minimal initial budget and no established infrastructure.",
    },
    {
      label: "Systems ownership",
      detail: "Implemented interconnected workflows for donor relations, finance, artists, and production.",
    },
    {
      label: "Long-term durability",
      detail: "Organization continued to thrive after transition, validating systems and leadership model.",
    },
  ],
  pageFlow: [
    {
      sectionTitle: "Hero",
      goal: "Signal founder-level scope instantly",
      layout: "hero",
      contentFocus: ["oneLiner", "careerSignal", "callouts[0]"],
      photoDirection: [
        "Wide live-performance image with overlayed systems map",
        "Bold title card with concise scope bullets",
      ],
      captionIdea: "From nothing to a running organization",
    },
    {
      sectionTitle: "Origin",
      goal: "Show how opportunity was created, not handed over",
      layout: "timeline",
      contentFocus: ["proofPoints[0]", "scope[0]"],
      photoDirection: [
        "Early planning notes and donor pitch deck snapshots",
        "Small milestone timeline with budget markers",
      ],
      captionIdea: "Creating momentum with limited resources",
    },
    {
      sectionTitle: "Operating System",
      goal: "Make invisible systems work visible and credible",
      layout: "grid",
      contentFocus: ["scope", "proofPoints[1]"],
      photoDirection: [
        "System tiles: ticketing, CRM, budget, artist management, production",
        "Annotated screenshots with arrows between systems",
      ],
      captionIdea: "Founder-level systems architecture",
    },
    {
      sectionTitle: "Experience Layer",
      goal: "Connect operations to audience-facing outcomes",
      layout: "gallery",
      contentFocus: ["highlights", "callouts[1]"],
      photoDirection: ["Concert photos with lighting and staging details", "Program design, posters, and media stills"],
      captionIdea: "Operational rigor in service of artistic experience",
    },
    {
      sectionTitle: "Takeaway",
      goal: "Position as a high-agency builder",
      layout: "quote",
      contentFocus: ["hiringPitch", "proofPoints[2]"],
      photoDirection: ["Text-forward ending section with one strong portrait or stage photo"],
      captionIdea: "What this case proves about leadership and execution",
    },
  ],
  sections: [
    {
      id: "context",
      heading: "Context And Stakes",
      summary:
        "Started without institutional infrastructure, with limited budget, and with a mission that required both artistic quality and operational discipline.",
      bullets: [
        "No mature org systems to inherit",
        "High coordination demands across donors, artists, and production",
        "Need to build trust while shipping visible public outcomes",
      ],
      visualNarrative: "Use a startup-style opening board with constraints and objectives.",
      suggestedAssets: ["Early budget sheet", "Donor outreach notes", "First season concept slide"],
    },
    {
      id: "execution",
      heading: "What I Built",
      summary:
        "Built the organization's practical foundation while shaping its public identity and production quality.",
      bullets: [
        "Designed and launched brand and web presence",
        "Implemented ticketing, donor, CRM, and finance workflows",
        "Led production systems for lighting, video, and live experience",
      ],
      visualNarrative: "Present a layered architecture: audience layer, operations layer, infrastructure layer.",
      suggestedAssets: [
        "Website screenshots",
        "CRM or donor workflow snapshots",
        "Stage and lighting board screenshots",
      ],
    },
    {
      id: "impact",
      heading: "What This Proves",
      summary:
        "I can operate as a founder-level generalist specialist: strategic, technical, and execution-focused in high-ambiguity environments.",
      bullets: [
        "Translated vision into repeatable systems",
        "Maintained creative quality under resource constraints",
        "Left durable processes after stepping away",
      ],
      visualNarrative: "Close with three proof cards and one strong quote over a performance photo.",
      suggestedAssets: [
        "Season growth timeline",
        "Team collaboration photo",
        "Quote card from supporter or collaborator",
      ],
    },
  ],
};
