// content from the MOindi brand guidelines (public/moindi/brand-guidelines-v1.pdf) that the brand slides show

// the three degrees of freedom, outermost ring first
export const moindiBrandLayers = [
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
export const coreIdeaTrace = {
  // the Core Idea page, shortened. each [[id|text]] is the phrase a rule was written from
  story: [
    "The music industry used to be driven by artists and the people who listened to them. Over time, [[gatekeepers|a small group of people in power began controlling who gets seen]], what gets heard, and what gets pushed forward.",
    "For most artists, success depends on [[permission|getting permission from those in power]]. For most fans, [[passive|the role is limited to consuming what has already been selected]].",
    "We think that's the wrong shape for culture. Music still moves through the same system as everything else. [[system-forces|Attention and capital decide what moves]] and what doesn't.",
  ],
  closingLine:
    "Music moves within the system that already exists. We are just changing who gets to move it.",
  traces: [
    {
      id: "gatekeepers",
      layer: "Direction",
      rule: "Structural stance: artists and fans vs. gatekeepers",
    },
    {
      id: "permission",
      layer: "Limits",
      rule: "Never frame culture as something that needs permission",
    },
    {
      id: "passive",
      layer: "Limits",
      rule: "Never treat fans as a passive audience",
    },
    {
      id: "system-forces",
      layer: "Limits",
      rule: "Never ignore the forces of money, attention and control",
    },
  ],
};

// the voice examples from the do / don't pages: one right version, and wrong ones with the reason each is wrong
export const voiceExamples: {
  id: string;
  label: string;
  correct: string;
  incorrect: { text: string; why: string }[];
}[] = [
  {
    id: "tone-1",
    label: "On the brand",
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
    label: "On the problem",
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
];
