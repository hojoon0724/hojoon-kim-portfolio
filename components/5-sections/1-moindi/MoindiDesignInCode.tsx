"use client";

import {
  PageScreensShowcase,
  type PageScreens,
  type ShowcasePage,
} from "@/components/3-compounds";
import { DeckSlides } from "./design-in-code/DeckSlides";
import { LayoutTests } from "./design-in-code/LayoutTests";
import { MotionSamples } from "./design-in-code/MotionSamples";
import { PatternTiles } from "./design-in-code/PatternTiles";
import { PurchaseGrowth } from "./design-in-code/PurchaseGrowth";
import { SlideCarousel, type Slide } from "./SlideCarousel";

// guides for building the section, never rendered. what it shows is in section and slides
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notes = {
  purpose:
    "Show the seed and what grew from it: a few look-and-feel tests and one Figma page set the direction, and everything after was built straight in code, from the product's pages and components to the pitch deck.",
  layout:
    "Title and intro stay put while the slides scroll sideways, each a subtitle and copy over the thing it talks about. A row of steps above shows how far along the story is. Slides 2 and 3 use the same frames, so moving from one to the next reads as the before and after.",
};

const section = {
  title: "Design in Code",
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

// screenshots still to add: drop the files at these paths, set their real sizes and remove placeholder
const pendingScreens = (name: string): PageScreens => ({
  desktop: {
    src: `/moindi/pages/${name}-desktop.png`,
    width: 1440,
    height: 2400,
    placeholder: true,
  },
  mobile: {
    src: `/moindi/pages/${name}-mobile.png`,
    width: 360,
    height: 2600,
    placeholder: true,
  },
});

const otherPages: ShowcasePage[] = [
  "Store",
  "Project",
  "Release",
  "Leaderboard",
  "Dashboard",
  "Checkout",
].map((title) => ({
  title,
  url: profileUrl,
  versions: [
    { label: "In production", screens: pendingScreens(title.toLowerCase()) },
  ],
}));

const profileThemes: ShowcasePage = {
  title: "Profile",
  url: profileUrl,
  versions: [
    { label: "Light", screens: profileShipped },
    {
      label: "Dark",
      screens: {
        desktop: {
          src: "/moindi/after-desktop-dark.png",
          width: 1440,
          height: 2139,
          placeholder: true,
        },
        mobile: {
          src: "/moindi/after-mobile-dark.png",
          width: 360,
          height: 2532,
          placeholder: true,
        },
      },
    },
  ],
};

const slides: Slide[] = [
  {
    subtitle: "Planting the Seed",
    copy: [
      "Before any real screen, I made a handful of tests: the logo, a statement, some accent text, icons and buttons, each in four color themes.",
      "They weren't designs to hand off. They were there to answer one question: how should MOindi feel? How loud could the orange get, did the type hold up in the dark, and what should a button feel like to press?",
    ],
    visualTitle: "Trying on colors",
    visual: <LayoutTests />,
  },
  {
    subtitle: "One Page to Aim At",
    copy: [
      "Then one page: the artist profile, sketched in Figma just far enough for the team to agree on a direction.",
      "It worked as a compass, not a spec. Nothing in it was polished pixel by pixel, and nothing after it was drawn first.",
    ],
    visual: (
      <PageScreensShowcase
        title="The only sketch"
        pages={[
          {
            title: "Profile",
            url: profileUrl,
            versions: [{ label: "Figma, day one", screens: profileSketch }],
          },
        ]}
      />
    ),
  },
  {
    subtitle: "Straight to Production",
    copy: [
      "Everything after that was built in code, inside the Angular component library that became the product.",
      "The profile page that shipped, many versions later, is still clearly the same idea. It grew into what it needed: stats, an active contract, and tabs for releases and products.",
    ],
    visual: (
      <PageScreensShowcase
        title="What actually shipped"
        pages={[
          {
            title: "Profile",
            url: profileUrl,
            versions: [{ label: "In production", screens: profileShipped }],
          },
        ]}
      />
    ),
  },
  {
    subtitle: "A Component Grows Up",
    copy: [
      "The purchase block shows the same growth at the scale of one component. The sketch had all the parts: a countdown, the split, the shares left, and an amount to buy.",
      "In code they became one control. Drag the slider and the share bar, the percentage and the dollar amount all move together.",
    ],
    // takes its own title, so it can sit beside the column when there's room
    visual: <PurchaseGrowth title="Drag it, it works" />,
  },
  {
    subtitle: "Designed to Move",
    copy: [
      "When an interface moves unnaturally, people sense something is off, even if they can't say what. When it moves the way real things do, it feels familiar, and it feels like someone cared.",
      "A prototype can show the right animation, but the product has to handle every variation. Tuning them directly in code took seconds, with no round trips.",
    ],
    visualTitle: "Things that move",
    visual: <MotionSamples />,
  },
  {
    subtitle: "Texture From Rules",
    copy: [
      "The slashes and ticks from the first tests became a pattern system. Each tile picks its pattern at random but matches its neighbors' edges.",
      "No two screens look the same, and every one still looks like MOindi.",
    ],
    visualTitle: "Never the same twice",
    visual: <PatternTiles />,
  },
  {
    subtitle: "No Sketch Needed",
    copy: [
      "From here, the rest of the app didn't need a sketch. The store, project and release pages, the leaderboard, the dashboard and checkout were all built straight in code from the same parts.",
      "A new page was mostly a new arrangement of components that already existed.",
    ],
    visual: (
      <PageScreensShowcase title="Built without a mockup" pages={otherPages} />
    ),
  },
  {
    subtitle: "The Dark Theme Was Real",
    copy: [
      "One of the four test themes made it all the way into the product. The dark theme became a real setting, with auto, light and dark.",
      "It was built on the same color tokens the tests used, so every component worked in both from day one.",
    ],
    visual: <PageScreensShowcase title="Lights off" pages={[profileThemes]} />,
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
export function MoindiDesignInCode({ id }: { id: string }) {
  return <SlideCarousel id={id} title={section.title} slides={slides} />;
}
