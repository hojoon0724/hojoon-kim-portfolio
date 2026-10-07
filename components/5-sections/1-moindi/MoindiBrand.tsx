"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

// guides for building the actual section
const notes = {
  title: "A Coder's Brand",
  purpose:
    "Continue the story: once the product existed, the brand grew from it. Show systems thinking through the three degrees of freedom: Limits, Direction, and Freedom.",
  copy: "Once the product existed, the brand had something real to grow from. I knew what MOindi was and who it was for, so the identity could be built around it rather than painted on top.\n\nI wrote the guidelines as three degrees of freedom. Limits are gravity: break them and the brand stops making sense. MOindi exists because money, attention, and control shape who gets heard, so it can never treat culture as something you need permission for, or treat fans as a passive audience. Direction is the building: the attitude, the voice, the stance of artists and fans against the gatekeepers. It can change, but only if the whole brand does. Freedom is the furniture: campaigns, localization, composition, style. Creatives can move it however they like, because the structure holds.\n\nThe point wasn't to restrict anyone. It was to make sure everything MOindi put out felt like it came from the same place.",
  layout:
    "Centerpiece is a nested-ring diagram driven by moindiBrandLayers: Limits (gravity) as the outer field, Direction (building) inside it, Freedom (furniture) at the center. Tap or hover a ring to reveal its exact list from the guidelines. Order for this audience is Limits, then Direction, then Freedom, leading with why the system exists. Give each layer one concrete example: a campaign variation for Freedom, a voice principle for Direction, and a crossed-out piece of copy that violates a Limit. Support with two or three real guideline spreads (good vs. bad practice, logo treatment). Don't show all 68 pages, and don't explain the 'degrees of freedom' engineering reference; let the reader notice it.",
};

const moindiBrandLayers = [
  {
    id: "limits",
    label: "Limits",
    metaphor: "Gravity",
    rule: "Violating these breaks the idea of the brand existing at all.",
    items: [
      "Permission-based framing of culture",
      "Passive audience positioning",
      "Over-polished corporate tone",
      "Emotional performances as manipulation",
      "Ignoring system forces (money, attention, control)",
    ],
  },
  {
    id: "direction",
    label: "Direction",
    metaphor: "The building",
    rule: "The current identity. Changes only if the entire brand direction changes.",
    items: [
      "Core attitude",
      "Voice principles",
      "Fixed elements",
      "Structural stance (artists + fans vs. gatekeepers)",
    ],
  },
  {
    id: "freedom",
    label: "Freedom",
    metaphor: "The furniture",
    rule: "Changes by campaign and region. Varied, but never a mishmash.",
    items: [
      "Visual execution",
      "Campaign storytelling",
      "Regional localization, not just translation",
      "Cultural references and framing",
      "Composition and style",
    ],
  },
];

// sentences from the Core Idea page and the rule each one produced.
// only the links that are direct are listed; a forced link would undercut the point of the exhibit
const coreIdeaTrace = {
  closingLine:
    "Music moves within the system that already exists. We are just changing who gets to move it.",
  traces: [
    {
      id: "gatekeepers",
      source:
        "A small group of people in power began controlling who gets seen, what gets heard, and what gets pushed forward.",
      layer: "Direction",
      rule: "Structural stance (artists + fans vs. gatekeepers)",
    },
    {
      id: "permission",
      source:
        "For most artists, success depends on getting permission from those in power.",
      layer: "Limits",
      rule: "Permission-based framing of culture",
    },
    {
      id: "passive",
      source:
        "For most fans, the role is limited to consuming what has already been selected.",
      layer: "Limits",
      rule: "Passive audience positioning",
    },
    {
      id: "system-forces",
      source: "Attention and capital decide what moves and what doesn't.",
      layer: "Limits",
      rule: "Ignoring system forces (money, attention, control)",
    },
  ],
};

type GuidelineElement = {
  id: string;
  source: string;
  content?: string;
  whyItFits: string;
  howToShow: string;
  examples?: {
    id: string;
    correct: string;
    incorrect: { text: string; why: string }[];
  }[];
};

const usefulSectionsFromBrandGuidelines: {
  section: string;
  narrative: string;
  elements: GuidelineElement[];
  suggestedOrder: string[];
} = {
  section: "brand",
  narrative:
    "A coder's brand: systems thinking, structure-to-skin, architecture metaphors",
  elements: [
    {
      id: "opening-quote",
      source: "Introduction",
      content:
        "The brand is not defined by what it says it is, but by what it consistently does.",
      whyItFits:
        "Echoes the page thesis that the product is the brand, so the guidelines visibly come from the same thinking as the rest of the page.",
      howToShow: "First line of the brand section.",
    },
    {
      id: "creative-boundaries",
      source: "Creative Boundaries",
      content:
        "Three degrees of freedom: Limits (gravity), Direction (the building), Freedom (the furniture).",
      whyItFits:
        "A constrained-system model named the way an engineer would describe one: stable core, costly-to-change middle, flexible edges.",
      howToShow:
        "Nested-ring diagram driven by moindiBrandLayers, ordered Limits, Direction, Freedom. Tap or hover a ring to reveal its list.",
    },
    {
      id: "identity-system",
      source: "Identity System",
      content:
        "Typemark and icon generated by rearranging sections of one modular source shape. A finite set of variants, selected based on context, not preference.",
      whyItFits:
        "The strongest element. It's a component system: one source, constrained outputs, selection by rules instead of taste. Reads like a component with a limited set of props.",
      howToShow:
        "Animate the source shape breaking apart and reassembling into the letters and icon. Likely the single best visual in the section.",
    },
    {
      id: "terminology",
      source: "Terminology",
      content:
        "Replaces the broad term 'logo' with precise names for each variation.",
      whyItFits:
        "A naming convention. Shared vocabulary is what keeps a system from drifting.",
      howToShow:
        "Show the terminology sheet, framed as defining the vocabulary before anyone uses the system.",
    },
    {
      id: "cheatsheet",
      source: "Cheatsheet",
      content: "Flowchart for choosing which identity variation to use.",
      whyItFits:
        "Turns a judgment call into a decision tree, so someone without the designer's taste still gets the right answer. Documentation designed as an interface.",
      howToShow:
        "Show the flowchart, ideally next to the terminology sheet as a pair: the vocabulary, then the logic that uses it.",
    },
    {
      id: "do-dont-why",
      source: "Do / Don't",
      whyItFits:
        "Works like a good error message: not just wrong, but why. Also shows the voice rules are testable.",
      howToShow:
        "Pick one example for the page. Show the correct version, then one or two incorrect versions with their WHY lines. Doubles as the copy-voice example.",
      examples: [
        {
          id: "tone-1",
          correct:
            "The brand is not defined by what it says it is, but by what it consistently does. That behavior is what builds the image and character that others assign to it.",
          incorrect: [
            {
              text: "The brand is defined by execution, not narrative. It’s what we consistently deliver that compounds into perception, shaping a clear and durable identity in the market. Every action reinforces the signal, building the character others come to recognize, trust, and scale with.",
              why: "Buzzwords like “execution,” “deliver,” and “compounds” make it sound corporate.",
            },
            {
              text: "The brand is endlessly shaped by how it presents itself, how it frames its identity, and how it chooses to speak about what it is. Over time, these expressions accumulate into a constantly evolving impression, creating a layered and highly articulated sense of image and character in the minds of others.",
              why: "Phrases like “how it presents itself” make the message indirect. Words like “constantly evolving impression” sound like they’re trying to sound important. Inflated language with “endlessly” or “highly.”",
            },
            {
              text: "The brand is defined by what it does, and that’s something powerful. Every action matters, every output adds up, and everything you put into the world becomes part of the story people see and feel. It all works out as long as you keep showing up and staying aligned, because consistency naturally turns into clarity, and clarity always leads to success.",
              why: "It uses motivational filler like “that’s something powerful” and “clarity always leads to success.” Focuses on the emotional message instead of the message.",
            },
            {
              text: "The brand is not primarily constituted through its explicit self-description, but rather through the cumulative behaviors over time. These actions function as the principal basis from which external observers derive an identity and character.",
              why: "It uses big words for no good reason.",
            },
          ],
        },
        {
          id: "tone-2",
          correct:
            "The real issue is that there is no way for artists and fans to organize in a direct, coordinated way that can compete with the major players in the industry.",
          incorrect: [
            {
              text: "What if artists and fans could actually move together in real time, with real coordination, at a scale that stands alongside the biggest forces in the industry? Right now, that kind of seamless alignment still doesn’t exist in a simple, accessible way.",
              why: "Asking a rhetorical question is performative. Softens the original problem. Uses buzzwords like “alignment.”",
            },
            {
              text: "The real issue is that artists and fans are fundamentally blocked from any real form of direct, coordinated organization, and this gap is exactly what keeps them from ever being able to compete in any serious way with the dominant players in the industry with an advantage and scale that simply cannot be matched.",
              why: "Too many absolutes and definitive words like “blocked” and “simply cannot” make the situation feel more extreme and come across as too persuasive.",
            },
            {
              text: "The real issue is that there is, at present, no clearly defined or consistently functioning way for artists and fans to come together, coordinate their actions, and organize themselves in a shared direction that would allow them to collectively operate at a level comparable to the large, established organizations that currently dominate the industry landscape.",
              why: "Adds redundant adjectives. Uses several phrases like “come together, coordinate their actions, and organize themselves in a shared direction” to describe the same thing.",
            },
            {
              text: "The real issue may be that there isn’t a very clear or consistent way for artists and fans to organize together in a coordinated way that could really compete with the larger players in the industry, or at least not in a straightforward sense. It might also be that the existing structures just don’t naturally support that kind of alignment yet.",
              why: "Phrases like “may be” and “might also be” show a lack of conviction. The “or” in “very clear or consistent way” shows the writer isn’t sure what the real issue is.",
            },
          ],
        },
      ],
    },
    {
      id: "fail-closed",
      source: "Do / Don't",
      content:
        "If something isn't covered, don't assume it falls under Freedom. Just ask.",
      whyItFits:
        "A fail-closed default. When the system doesn't cover a case, it doesn't silently allow it.",
      howToShow:
        "A single pull-quote line. Let the reader recognize the instinct.",
    },
    {
      id: "stylization-edge-cases",
      source: "Stylization",
      content:
        "MOindi capitalization rule with exceptions for URLs, file names, email addresses, and system text. Social handle @mo__indi uses a double underscore to stand in for the uppercase break.",
      whyItFits:
        "Edge-case handling. Planning for the technical environments where the rule breaks.",
      howToShow:
        "Small detail callout: the stylized name, the system-text exceptions, and the handle.",
    },
    {
      id: "motion-principles",
      source: "Creative Direction",
      content:
        "Movement is physically grounded (momentum, friction, inertia). No artificial linear motion. Nothing moves purely for effect.",
      whyItFits:
        "A spec that can be implemented and demonstrated in code, linking the guideline directly to build skills.",
      howToShow:
        "Optional. A tiny side-by-side of linear easing versus a physics-based curve.",
    },
  ],
  suggestedOrder: [
    "opening-quote",
    "creative-boundaries",
    "identity-system",
    "terminology",
    "cheatsheet",
    "do-dont-why",
    "fail-closed",
    "stylization-edge-cases",
    "motion-principles",
  ],
};

// outermost ring first. each ring is drawn smaller than the one before it
const ringSizeClassNames = ["size-full", "size-2/3", "size-1/3"];

// which do / don't example is on the page, and how many of its wrong versions are shown
const doDontExampleId = "tone-1";
const doDontIncorrectCount = 2;

const stylizedName = "MOindi";
const socialHandle = "@mo__indi";

// what the viewer reads before each piece of the guidelines: the decision, then the reason for it.
// the guideline content itself is shown next to it as the evidence
const evidenceCopy: Record<string, { claim: string; reason: string }> = {
  "opening-quote": {
    claim: "A brand is behavior, so I wrote rules for behavior.",
    reason:
      "This is the same idea as the rest of this page: the product is the brand. The guidelines open with it because every rule after it follows from it.",
  },
  "core-idea": {
    claim: "Every rule traces back to one problem.",
    reason:
      "The guidelines explain why MOindi exists before they describe how it looks. The hard rules aren't taste. Each one answers a specific sentence in that story, and a rule that can't be traced back doesn't belong.",
  },
  "creative-boundaries": {
    claim: "Not every rule costs the same to break.",
    reason:
      "So I sorted them by what a change would cost: a core that can't move, a middle that moves only when the whole brand does, and edges that are free.",
  },
  "identity-system": {
    claim: "One source shape, a fixed set of outputs.",
    reason:
      "The mark works like a component: one source, a limited set of variants, and rules for which one to use. Nobody picks by taste.",
  },
  terminology: {
    claim: "Name the parts before anyone uses them.",
    reason:
      "\u201cLogo\u201d was too broad a word for a system with this many variations. A shared vocabulary is what keeps a system from drifting.",
  },
  cheatsheet: {
    claim: "Turn a judgment call into a decision tree.",
    reason:
      "Someone without my eye should still get the right answer. This is documentation designed as an interface.",
  },
  "do-dont-why": {
    claim: "A rule should say why.",
    reason:
      "Each wrong version comes with its reason, the way a good error message does. It also means the voice rules can be tested against real copy.",
  },
  "fail-closed": {
    claim: "What the system doesn't cover isn't allowed by default.",
    reason:
      "When a case isn't covered, the answer is to ask, not to assume. The system fails closed.",
  },
  "stylization-edge-cases": {
    claim: "Plan for where the rule breaks.",
    reason:
      "The capitalization can't survive every technical environment, so the exceptions are part of the rule.",
  },
  "motion-principles": {
    claim: "A rule I can build.",
    reason:
      "The motion rule is specific enough to implement and to check in code. Both dots cover the same distance in the same time.",
  },
};

function getElement(id: string) {
  const element = usefulSectionsFromBrandGuidelines.elements.find(
    (item) => item.id === id,
  );
  if (!element) throw new Error(`Missing brand guideline element: ${id}`);
  return element;
}

// each sentence from the Core Idea sits on the same row as the rule it produced.
// rows instead of connector lines, because lines drawn between two text columns break when the text reflows
function CoreIdeaTrace() {
  const [activeTraceId, setActiveTraceId] = useState<string | null>(null);

  return (
    <div className="gap-md flex flex-col">
      <ol className="gap-sm flex flex-col">
        {coreIdeaTrace.traces.map((trace, index) => {
          const isDimmed =
            activeTraceId !== null && activeTraceId !== trace.id;

          return (
            <li key={trace.id}>
              <button
                type="button"
                onMouseEnter={() => setActiveTraceId(trace.id)}
                onMouseLeave={() => setActiveTraceId(null)}
                onFocus={() => setActiveTraceId(trace.id)}
                onBlur={() => setActiveTraceId(null)}
                className={`gap-md pt-sm grid w-full cursor-default grid-cols-1 border-t border-gray-950 text-left transition-opacity duration-300 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] ${isDimmed ? "opacity-30" : "opacity-100"}`}
              >
                <p className="text-pretty">
                  <span className="roboto-mono mr-sm text-xs md:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {trace.source}
                </p>
                <p className="gap-sm flex items-baseline">
                  <span
                    className="roboto-mono shrink-0 text-xs md:text-sm"
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span>
                    <span className="roboto-mono block text-xs opacity-70 md:text-sm">
                      {trace.layer}
                    </span>
                    <span className="font-semibold">{trace.rule}</span>
                  </span>
                </p>
              </button>
            </li>
          );
        })}
      </ol>
      <blockquote className="roboto-narrow pt-md text-2xl font-light text-balance md:text-4xl">
        &ldquo;{coreIdeaTrace.closingLine}&rdquo;
      </blockquote>
    </div>
  );
}

// the same distance and duration twice: once at a constant speed, once with the easing this site moves with
function MotionComparison() {
  const [isMoved, setIsMoved] = useState(false);
  const tracks = [
    { label: "linear", easingClassName: "ease-linear" },
    {
      label: "inertia",
      easingClassName: "ease-(--bezier-movement-inertia-1000)",
    },
  ];

  return (
    <div className="gap-md flex flex-col">
      {tracks.map((track) => (
        <div key={track.label} className="gap-sm flex flex-col">
          <div className="roboto-mono text-xs md:text-sm">{track.label}</div>
          <div className="relative h-4 border-b border-gray-950">
            <div
              className={`absolute top-0 size-4 -translate-x-1/2 rounded-full bg-gray-950 transition-[left] duration-1000 ${track.easingClassName} ${isMoved ? "left-[calc(100%-0.5rem)]" : "left-2"}`}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setIsMoved((prev) => !prev)}
        className="roboto-mono px-md hover:text-moindi-orange w-fit cursor-pointer border-2 border-gray-950 py-1 text-xs font-semibold transition-colors hover:bg-gray-950 md:text-sm"
      >
        {isMoved ? "Move back" : "Move"}
      </button>
    </div>
  );
}

// one decision and the part of the guidelines that proves it: the reasoning on the left, the evidence on the right
function Exhibit({
  number,
  copyId,
  source,
  children,
}: {
  number: number;
  copyId: string;
  source: string;
  children: ReactNode;
}) {
  const copy = evidenceCopy[copyId];

  return (
    <li className="gap-lg pt-md lg:gap-2xl grid grid-cols-1 border-t-2 border-gray-950 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="gap-sm flex flex-col">
        <div className="roboto-mono text-xs md:text-sm">
          {String(number).padStart(2, "0")}
        </div>
        <h3 className="text-balance">{copy.claim}</h3>
        <p className="max-w-prose text-pretty">{copy.reason}</p>
      </div>
      <div className="gap-md flex min-w-0 flex-col">
        <div className="roboto-mono text-xs opacity-70 md:text-sm">
          Brand Guidelines: {source}
        </div>
        {children}
      </div>
    </li>
  );
}

function GuidelineSheet({ file, source }: { file: string; source: string }) {
  return (
    <Image
      src={`/moindi/${file}`}
      alt={`MOindi brand guidelines: ${source}`}
      width={1920}
      height={1080}
      sizes="(max-width: 1024px) 100vw, 66vw"
      className="h-auto w-full border border-gray-950"
    />
  );
}

export function MoindiBrand({ id }: { id: string }) {
  const [activeLayerId, setActiveLayerId] = useState(moindiBrandLayers[0].id);
  const activeLayerIndex = moindiBrandLayers.findIndex(
    (layer) => layer.id === activeLayerId,
  );
  const activeLayer = moindiBrandLayers[activeLayerIndex];
  const [intro, system, closing] = notes.copy.split("\n\n");

  const openingQuote = getElement("opening-quote");
  const boundaries = getElement("creative-boundaries");
  const identitySystem = getElement("identity-system");
  const terminology = getElement("terminology");
  const cheatsheet = getElement("cheatsheet");
  const doDont = getElement("do-dont-why");
  const doDontExample = doDont.examples?.find(
    (example) => example.id === doDontExampleId,
  );
  const failClosed = getElement("fail-closed");
  const stylization = getElement("stylization-edge-cases");
  const motion = getElement("motion-principles");

  return (
    <div className="scroll-mt-nav px-md py-3xl min-h-dvh" id={id}>
      <div className="gap-3xl mx-auto flex w-full max-w-7xl flex-col">
        <div className="gap-lg flex flex-col">
          <h2>{notes.title}</h2>
          <p className="max-w-prose text-lg text-pretty md:text-xl">{intro}</p>
        </div>

        <ol className="gap-3xl flex flex-col">
          <Exhibit
            number={1}
            copyId="opening-quote"
            source={openingQuote.source}
          >
            <blockquote className="roboto-narrow text-2xl font-light text-balance md:text-4xl">
              &ldquo;{openingQuote.content}&rdquo;
            </blockquote>
          </Exhibit>

          <Exhibit number={2} copyId="core-idea" source="Core Idea">
            <CoreIdeaTrace />
          </Exhibit>

          <Exhibit
            number={3}
            copyId="creative-boundaries"
            source={boundaries.source}
          >
            <p className="max-w-prose text-pretty">{system}</p>
            <div className="gap-lg grid grid-cols-1 items-center md:grid-cols-2">
              {/* the rings are stacked circles, so the part of each one left showing is its band */}
              <div className="relative mx-auto aspect-square w-full max-w-112">
                {moindiBrandLayers.map((layer, index) => {
                  const isActive = layer.id === activeLayerId;
                  const isInnermost = index === moindiBrandLayers.length - 1;

                  return (
                    <button
                      key={layer.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveLayerId(layer.id)}
                      onMouseEnter={() => setActiveLayerId(layer.id)}
                      onFocus={() => setActiveLayerId(layer.id)}
                      className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center rounded-full border-2 border-gray-950 transition-colors duration-300 ${ringSizeClassNames[index]} ${isInnermost ? "justify-center" : "justify-start pt-[4%]"} ${isActive ? "text-moindi-orange bg-gray-950" : "bg-moindi-orange text-gray-950"}`}
                    >
                      <span className="roboto-wide text-sm font-bold md:text-base">
                        {layer.label}
                      </span>
                      <span className="roboto-mono text-[10px] md:text-xs">
                        {layer.metaphor}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className="gap-md pt-md flex min-h-80 flex-col border-t border-gray-950"
                aria-live="polite"
              >
                <div className="roboto-mono text-xs md:text-sm">
                  0{activeLayerIndex + 1} / {activeLayer.label}
                </div>
                <h3>{activeLayer.metaphor}</h3>
                <p className="max-w-prose font-semibold">{activeLayer.rule}</p>
                <ul className="gap-sm flex flex-col">
                  {activeLayer.items.map((item) => (
                    <li key={item} className="gap-sm flex items-baseline">
                      {/* limits are things the brand never does, so they are marked as ruled out */}
                      <span
                        className="roboto-mono w-4 shrink-0"
                        aria-hidden="true"
                      >
                        {activeLayer.id === "limits" ? "×" : "+"}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Exhibit>

          <Exhibit
            number={4}
            copyId="identity-system"
            source={identitySystem.source}
          >
            <p className="max-w-prose text-lg text-pretty md:text-xl">
              {identitySystem.content}
            </p>
          </Exhibit>

          <Exhibit number={5} copyId="terminology" source={terminology.source}>
            <p className="max-w-prose text-pretty">{terminology.content}</p>
            <GuidelineSheet
              file="brand-guidelines-v1-9.jpg"
              source={terminology.source}
            />
          </Exhibit>

          <Exhibit number={6} copyId="cheatsheet" source={cheatsheet.source}>
            <p className="max-w-prose text-pretty">{cheatsheet.content}</p>
            <GuidelineSheet
              file="brand-guidelines-v1-10.jpg"
              source={cheatsheet.source}
            />
          </Exhibit>

          {doDontExample && (
            <Exhibit number={7} copyId="do-dont-why" source={doDont.source}>
              <div className="gap-sm p-md text-moindi-orange flex flex-col bg-gray-950">
                <div className="roboto-mono text-xs font-semibold md:text-sm">
                  Do
                </div>
                <p className="text-lg text-pretty md:text-xl">
                  {doDontExample.correct}
                </p>
              </div>
              <div className="gap-md grid grid-cols-1 md:grid-cols-2">
                {doDontExample.incorrect
                  .slice(0, doDontIncorrectCount)
                  .map((incorrect) => (
                    <div
                      key={incorrect.text}
                      className="gap-sm p-md flex flex-col border-2 border-gray-950"
                    >
                      <div className="roboto-mono text-xs font-semibold md:text-sm">
                        × Don&apos;t
                      </div>
                      <p className="text-pretty opacity-70">{incorrect.text}</p>
                      <p className="roboto-mono pt-sm mt-auto border-t border-gray-950 text-xs md:text-sm">
                        Why: {incorrect.why}
                      </p>
                    </div>
                  ))}
              </div>
            </Exhibit>
          )}

          <Exhibit number={8} copyId="fail-closed" source={failClosed.source}>
            <blockquote className="roboto-narrow text-2xl font-light text-balance md:text-4xl">
              &ldquo;{failClosed.content}&rdquo;
            </blockquote>
          </Exhibit>

          <Exhibit
            number={9}
            copyId="stylization-edge-cases"
            source={stylization.source}
          >
            <div className="gap-md flex flex-wrap items-baseline">
              <span className="roboto-logo text-3xl md:text-4xl">
                {stylizedName}
              </span>
              <span className="roboto-mono text-base md:text-lg">
                {socialHandle}
              </span>
            </div>
            <p className="max-w-prose text-pretty">{stylization.content}</p>
          </Exhibit>

          <Exhibit
            number={10}
            copyId="motion-principles"
            source={motion.source}
          >
            <p className="max-w-prose text-pretty">{motion.content}</p>
            <MotionComparison />
          </Exhibit>
        </ol>

        <p className="max-w-prose text-lg text-pretty md:text-xl">{closing}</p>
      </div>
    </div>
  );
}
