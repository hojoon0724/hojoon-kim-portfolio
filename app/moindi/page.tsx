import { ProjectSectionNav } from "@/components/4-organisms";
import {
  MoindiBrand,
  MoindiCollaboration,
  MoindiConclusion,
  MoindiDemo,
  MoindiDesignInCode,
  MoindiThesis,
} from "@/components/5-sections";
import { ProjectPageContainer } from "@/components/6-pages";
export default function MoindiPage() {
  const moindiSections = [
    { id: "thesis", fullNavLabel: "Thesis", shortNavLabel: "Thesis" },
    {
      id: "no-handoff",
      fullNavLabel: "Design in Code",
      shortNavLabel: "Design",
    },
    {
      id: "collaboration",
      fullNavLabel: "Collaboration",
      shortNavLabel: "Collab",
    },
    { id: "demo", fullNavLabel: "Try It", shortNavLabel: "Try" },
    { id: "brand", fullNavLabel: "A Coder's Brand", shortNavLabel: "Brand" },
    { id: "conclusion", fullNavLabel: "One Loop", shortNavLabel: "Loop" },
  ];

  // const innerSections = [
  //   {
  //     title: "Thesis",
  //     purpose:
  //       "The brand couldn't be designed in the abstract, because a brand isn't a logo sitting by itself, it's what the product makes people feel. To build the product I had to design it, engineer it, and understand how those two constrain each other, and because I could do all of that myself, I could work directly with the CTO instead of through handoffs and meetings. We moved fast because I already knew what was possible. I wasn't proposing ideas that fall apart the moment they hit code.",
  //   },
  //   {
  //     title: "No handoff",
  //     purpose: "show sketch for alignment, then designed directly in code",
  //   },
  //   {
  //     title: "Collaboration",
  //     purpose:
  //       "CTO owned architecture, i owned interface, but we crossed into each other's code and refined it. this shows i can work with others' code, no designer vs engineer tension. improve each other's work through iteration",
  //     copy: "The CTO owned the architecture and chose the stack. I owned most of the interface. But the line between us was never a wall, she'd build an interactive element and I'd go in and refine it; I'd put together a flow and she'd tighten it underneath. We worked across each other's code instead of guarding our own.\n\nWhat made that work wasn't that we got along. It's that I didn't need her to tell me what was possible. I already understood the constraints she was working within, so I wasn't proposing things that fall apart the moment they meet the architecture. We were on the same page from the start, and that saved an enormous amount of time, no translating, no waiting, no meetings to find out whether an idea was even buildable.",
  //   },
  //   { title: "Demo", purpose: "let the user try it out" },
  //   {
  //     title: "Brand",
  //     purpose:
  //       "-coder's brand- show the layers of what can change. use the building metaphor i used in the brand guidelines",
  //   },
  //   {
  //     title: "Conclusion",
  //     purpose:
  //       "Moindi was an early-stage startup where I led product design and build. pulling the thesis back together: you designed and built in one loop, validated with real users, and authored the brand as a system, all on one product. link to the next project. A standard developer builds what they're handed; a standard designer hands off what they can't build. You do both at once, and Moindi is the proof.",
  //   },
  // ];

  // const conclusionCopyDraft = `You've just seen what that means.\n\nThe interface wasn't drawn and handed off, it was designed in the medium it shipped in, so nothing was lost in translation. The work didn't stop at my own boundary, the CTO and I moved through each other's code, refining as we went, because the line between design and engineering wasn't a wall. The product wasn't a screenshot, it was real, and it still runs, because I can still build it. And the brand wasn't decoration, it was a system, a coder's brand, built structure-to-skin.\n\nThat's four things, but it's really one. A developer builds what they're handed. A designer hands off what they can't build. I do both, in the same loop, on the same product. Moindi is where that stops being a claim and starts being something you can click through.\n\nThis is the work I want to keep doing, designing and building as one act, for teams who'd rather not translate between the two.`;

  return (
    <ProjectPageContainer projectId="moindi">
      <ProjectSectionNav
        projectId="moindi"
        sectionIds={moindiSections.map((section) => section.id)}
        fullLabels={moindiSections.map((section) => section.fullNavLabel)}
        shortLabels={moindiSections.map((section) => section.shortNavLabel)}
      />
      <MoindiThesis id="thesis" />
      <MoindiDesignInCode id="no-handoff" />
      <MoindiCollaboration id="collaboration" />
      <MoindiDemo id="demo" />
      <MoindiBrand id="brand" />
      <MoindiConclusion id="conclusion" />
    </ProjectPageContainer>
  );
}
