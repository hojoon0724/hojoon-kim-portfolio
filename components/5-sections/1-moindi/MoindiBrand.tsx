"use client";

import { AppliedExamples } from "./brand/AppliedExamples";
import { BrandPatterns } from "./brand/BrandPatterns";
import { BrandRings } from "./brand/BrandRings";
import { ColorRoles } from "./brand/ColorRoles";
import { RuleTrace } from "./brand/RuleTrace";
import { IdentitySystem } from "./brand/IdentitySystem";
import { MotionComparison } from "./brand/MotionComparison";
import { TypemarkPicker } from "./brand/TypemarkPicker";
import { VoiceExamples } from "./brand/VoiceExamples";
import { SlideCarousel, type Slide } from "./SlideCarousel";

// guides for building the section, never rendered. the source is public/moindi/brand-guidelines-v1.pdf
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notes = {
  purpose:
    "Continue the story: once the product existed, the brand grew from it. Show the guidelines as a system an engineer would recognize: rules traced to a reason, sorted by what they cost to break, a mark built like a component with a fixed set of variants picked by a decision tree, and rules specific enough to build and test.",
  layout:
    "Same slides as Designed in Code. Each point gets a live visual built from the product's own parts (the typemark path, the tile pattern, the color tokens, the motion curve) rather than screenshots, except the last slide, which shows real pages from the guidelines.",
};

const title = "A Coder's Brand";

const slides: Slide[] = [
  {
    subtitle: "Rules Start With Why",
    copy: [
      "Once the product existed, the brand had something real to grow from. The guidelines open with why MOindi exists, before a single color or letter.",
      "Every hard rule answers a sentence in that story. If a rule can't be traced back to one, it doesn't belong.",
    ],
    visualTitle: "From the problem to the rules",
    visual: <RuleTrace />,
  },
  {
    subtitle: "Not Every Rule Costs the Same",
    copy: [
      "I sorted the rules by what it costs to break them. Limits are gravity: break one and the brand stops making sense. Direction is the building, and it only moves if the whole brand does.",
      "Freedom is the furniture. Creatives can move it however they like, because the structure holds.",
    ],
    visualTitle: "Three degrees of freedom",
    visual: <BrandRings />,
  },
  {
    subtitle: "One Shape, Every Letter",
    copy: [
      "There's no single logo. Every letter of the typemark starts as the icon, four corners around a diamond, and is built from it by moving, growing and cutting those pieces. They all come from the same shape, so they look like one family.",
      "It isn't built to be read at a glance. Once you see the letters, you can't unsee them.",
    ],
    visualTitle: "Six letters, one source",
    visual: <IdentitySystem />,
  },
  {
    subtitle: "The Space Picks the Mark",
    copy: [
      "Letters that rearrange could easily turn into picking whatever looks nice. So there's a fixed set of variants, each with a name, and a cheatsheet that picks one from the space it has to fit.",
      "It's a decision tree, so anyone can get the same answer I would.",
    ],
    visualTitle: "Pick a mark, follow the path",
    visual: <TypemarkPicker />,
  },
  {
    subtitle: "Patterns With Rules",
    copy: [
      "The MOindi Grid is the typemark repeated in a fixed order, one letter later on each row, so it reads across and down. The Angle Array is random, but only within what its six tiles allow.",
      "None of them are filler. They anchor a layout, they don't cover empty space.",
    ],
    visualTitle: "Graphic elements",
    visual: <BrandPatterns />,
  },
  {
    subtitle: "Color Isn't Decoration",
    copy: [
      "Gray does most of the work: shades of it build the hierarchy on every screen. Secondary is the accent, for anything that needs a little more weight. Primary is reserved for the one thing that matters most, usually a single action, so it still stands out when it appears.",
      "Success, warning, error and info are only for system states. None of them are there for decoration.",
    ],
    visualTitle: "Every color has a job",
    visual: <ColorRoles />,
  },
  {
    subtitle: "Rules That Say Why",
    copy: [
      "The voice rules come with examples: one right version and four wrong ones, each with the reason it's wrong.",
      "Like a good error message, it tells you what to fix, so the rules can be checked against real copy.",
    ],
    visualTitle: "Do, don't, and why",
    visual: <VoiceExamples />,
  },
  {
    subtitle: "Motion With Weight",
    copy: [
      "The motion rules are specific enough to build: things move with momentum, friction and inertia, never at a constant speed, and nothing moves just for effect.",
      "Both charts build in with the same timings. Only the curves differ, and only one feels like it has weight.",
    ],
    visualTitle: "Same distance, same time",
    visual: <MotionComparison />,
  },
  {
    subtitle: "Correct Isn't Always Best",
    copy: [
      "The examples rank choices instead of just marking them right or wrong. A placement can follow every rule and still miss what the setting offers.",
      "A rule bends when following it makes things worse, like the nav bar's clearspace. And when something isn't covered, the answer is to ask, not to assume.",
    ],
    visualTitle: "From the guidelines",
    visual: <AppliedExamples />,
  },
];

// the brand as a system, one point per slide, each shown with a live piece of it
export function MoindiBrand({ id }: { id: string }) {
  return <SlideCarousel id={id} title={title} slides={slides} />;
}
