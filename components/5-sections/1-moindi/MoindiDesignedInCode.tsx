"use client";

import {
  PageScreensShowcase,
  type PageScreens,
  type ShowcasePage,
} from "@/components/3-compounds";
import { DeckSlides } from "./designed-in-code/DeckSlides";
import { LayoutTests } from "./designed-in-code/LayoutTests";
import { MotionSamples } from "./designed-in-code/MotionSamples";
import { PatternTiles } from "./designed-in-code/PatternTiles";
import { PurchaseGrowth } from "./designed-in-code/PurchaseGrowth";
import { SlideCarousel, type Slide } from "@/components/4-organisms";

// guides for building the section, never rendered. what it shows is in section and slides
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notes = {
  purpose:
    "Show the seed and what grew from it: a few look-and-feel tests and one Figma page set the direction, and everything after was built straight in code, from the product's pages and components to the pitch deck.",
  layout:
    "Title and intro stay put while the slides scroll sideways, each the thing it talks about with a subtitle and copy under it. A row of steps above shows how far along the story is. Slides 2 and 3 use the same frames, so moving from one to the next reads as the before and after.",
};

const section = {
  title: "Designed in Code",
  intro:
    "MOindi didn't start as a set of screens. It started as a few small tests to find how it should feel, and everything else grew out of them in code.",
};

const profileUrl = "moindi.com";

// full-page screenshots at their real pixel sizes; each fills its window's width, so only the aspect ratio matters
const profileSketch: PageScreens = {
  desktop: { src: "/moindi/before-desktop.png", width: 1440, height: 1942 },
  mobile: { src: "/moindi/before-mobile.png", width: 720, height: 9256 },
};
const profileShipped: PageScreens = {
  desktop: { src: "/moindi/after-desktop.png", width: 1440, height: 2139 },
  mobile: { src: "/moindi/after-mobile.png", width: 360, height: 2532 },
};

// the rest of the app's pages, at their real pixel sizes (2x captures, so only the aspect ratio matters)
const screens = (
  file: string,
  desktopHeight: number,
  mobileHeight: number,
): PageScreens => ({
  desktop: {
    src: `/moindi/${file}-desktop.png`,
    width: 2880,
    height: desktopHeight,
  },
  mobile: {
    src: `/moindi/${file}-mobile.png`,
    width: 720,
    height: mobileHeight,
  },
});

const otherPages: ShowcasePage[] = [
  { title: "Store", screens: screens("store", 3109, 2789) },
  { title: "Project", screens: screens("project", 2362, 3596) },
  { title: "Release", screens: screens("release", 2157, 3076) },
  { title: "Leaderboard", screens: screens("leaderboards", 3915, 8432) },
].map(({ title, screens }) => ({
  title,
  url: profileUrl,
  versions: [{ label: "In production", screens }],
}));

// slides 2 and 3 share this one showcase: the frames stay put and the screenshots inside cross-fade from the
// figma sketch to the shipped page as the slide changes
const profileVisual = (shownInGroup: number) => (
  <PageScreensShowcase
    pages={[
      {
        url: profileUrl,
        versions: [
          { label: "Figma, day one", screens: profileSketch },
          { label: "In production", screens: profileShipped },
        ],
      },
    ]}
    version={shownInGroup}
  />
);

const profileThemes: ShowcasePage = {
  url: profileUrl,
  versions: [
    { label: "Light", screens: profileShipped },
    {
      label: "Dark",
      dark: true,
      screens: {
        desktop: {
          src: "/moindi/after-desktop-dark.png",
          width: 1440,
          height: 2139,
        },
        mobile: {
          src: "/moindi/after-mobile-dark.png",
          width: 360,
          height: 2531,
        },
      },
    },
  ],
};

const slides: Slide[] = [
  {
    subtitle: "Trying Things Out",
    copy: [
      "Before any real screen, I made a handful of tests: the logo, a statement, some accent text, icons and buttons, each in four color themes.",
      "They weren't designs to hand off. They were there to answer one question: how should MOindi feel? How loud could the orange get, did the type hold up in the dark, and what should a button feel like to press?",
    ],
    visual: <LayoutTests />,
  },
  {
    subtitle: "Sketched One Full Page",
    // shares its frames with the next or previous slide, so only the screenshots change between them
    visualGroup: "profile",
    copy: [
      "Then one page: the artist profile, sketched in Figma just far enough for the team to agree on a direction.",
      "It worked as a compass, not a spec. Nothing in it was polished pixel by pixel, and nothing after it was drawn first.",
    ],
    visual: profileVisual,
  },
  {
    subtitle: "Built to Ship",
    // shares its frames with the next or previous slide, so only the screenshots change between them
    visualGroup: "profile",
    copy: [
      "Everything after that was built in code, inside the Angular component library that became the product.",
      "The profile page that shipped, many versions later, is still clearly the same idea. It grew into what it needed: stats, an active contract, and tabs for releases and products.",
    ],
    visual: profileVisual,
  },
  {
    subtitle: "Revisions without Handoff",
    copy: [
      "The first version had everything we knew it needed, each with its own place on screen.",
      "Simplifying it took many passes and no handoffs. Designing and building at once, I hid the math and folded the inputs into one slider. Each revision was a commit, not a round of mockups.",
    ],
    visual: <PurchaseGrowth />,
  },
  {
    subtitle: "Fine Tuning Movements",
    copy: [
      "When an interface moves unnaturally, people sense something is off, even if they can't say what. When it moves the way real things do, it feels familiar, and it feels like someone cared.",
      "A prototype can show the right animation, but the product has to handle every variation. Tuning them directly in code took seconds, with no round trips.",
    ],
    visual: <MotionSamples />,
  },
  {
    subtitle: "Where Code Becomes Brand",
    copy: [
      "Every artist is different, so when I made the brand's pattern, I wanted it to be unique every time: random, but not so random it stops looking like MOindi.",
      'That "Random but not too random" is really hard to hand off.',
      "But when your design is built in code from the start, there's no guesswork.",
    ],
    visual: <PatternTiles />,
  },
  {
    subtitle: "Built Without a Mockup",
    copy: [
      "From here, the rest of the app didn't need a sketch. The store, project and release pages, the leaderboard, the dashboard and checkout were all built straight in code from the same parts.",
      "A new page was mostly a new arrangement of components that already existed.",
    ],
    visual: <PageScreensShowcase pages={otherPages} cyclePagesMs={4000} />,
  },
  {
    subtitle: "Lights Off",
    copy: [
      "Every color in the code was a role, not a value: about 200 of them, down to a button's outline text and an icon's fill. No component ever had a dark version; the roles just pointed somewhere else.",
      "Dark wasn't light flipped. Its base is gray-850, and the primary tints step darker instead of lighter. Even the browser's own scrollbars and inputs switch with it.",
    ],
    visual: <PageScreensShowcase pages={[profileThemes]} autoSwitchMs={1000} />,
  },
  {
    subtitle: "Beyond the App",
    copy: [
      "The seed carried outside the product too. The pitch deck used the same type, colors, tiles and charts, so investors felt the product before they ever opened it.",
      "And because the design was the code, the CTO and I were always working on the same thing.",
    ],
    visualTitle: "The pitch wore the brand",
    visual: <DeckSlides />,
  },
];

// the seed and everything that grew from it, as slides that scroll sideways under a fixed title
export function MoindiDesignedInCode({ id }: { id: string }) {
  return (
    <SlideCarousel id={id} title={section.title} slides={slides} textBelow />
  );
}
