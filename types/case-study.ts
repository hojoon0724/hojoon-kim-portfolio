export type PortfolioProofPoint = {
  label: string;
  detail: string;
};

export type PortfolioPageBlock = {
  sectionTitle: string;
  goal: string;
  layout: "hero" | "timeline" | "two-column" | "grid" | "gallery" | "quote";
  contentFocus: string[];
  photoDirection: string[];
  captionIdea: string;
};

export type CaseStudySection = {
  id: string;
  heading: string;
  summary: string;
  bullets: string[];
  visualNarrative: string;
  suggestedAssets: string[];
};

export type CaseStudy = {
  id: string;
  title: string;
  position: string;
  caseStudyOf: string;
  description: string;
  bulletPoints: string[];
  toolsIds: string[];
  date: string;
  thumbnail: string;
  roleTag: string;
  careerSignal: string;
  oneLiner: string;
  hiringPitch: string;
  collaboration: string[];
  scope: string[];
  highlights: string[];
  callouts: string[];
  proofPoints: PortfolioProofPoint[];
  pageFlow: PortfolioPageBlock[];
  sections: CaseStudySection[];
};
