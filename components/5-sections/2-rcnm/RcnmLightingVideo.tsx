"use client";

import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import { useActiveScrollStep } from "@/hooks";
import Image from "next/image";

// notes and intendedEffect are guides for building the section. they are never rendered
// label is the software term for the same stage of work. it is shown beside the step number
type ProductionStep = {
  heading: string;
  label: string;
  notes: string;
  intendedEffect: string;
  text: string;
  images: string[];
};

// the process, from the first listen to the finished video. the examples beside the steps come from different pieces and cues
const productionSteps: ProductionStep[] = [
  {
    heading: "Know the piece",
    label: "research",
    notes:
      "Understanding the piece and its limits (parallel: reading the spec or the codebase before writing anything)",
    intendedEffect:
      "The work starts with understanding the material and its constraints, not with ideas.",
    text: "Before any light moves, I learn what I'm working with. I listen to recordings, watch past performances when they exist, and find out what the piece is about, so nothing I add works against what the composer intended. Then the practical limits: the venue, the rig, where the performers sit, what can and can't change. Those are the boundaries everything else has to fit inside.",
    images: [],
  },
  {
    heading: "Mark up the score",
    label: "analysis",
    notes:
      "Annotating the music's structure (parallel: mapping the system and its requirements before designing)",
    intendedEffect:
      "The design comes from the structure of the music, not from personal taste.",
    text: "Then I mark what the music does: where it builds, where it thins out, where new instruments enter, how one section flows into the next. These notes are a map I can come back to later and still know exactly how the piece moves.",
    images: [],
  },
  {
    heading: "Design the looks",
    label: "sketch",
    notes:
      "Writing lighting ideas into the score alongside the music (parallel: sketching the design before building it)",
    intendedEffect:
      "The lighting is planned as continuous motion that follows the music, not a series of separate scenes.",
    text: "Next I write my lighting ideas into the same score, right next to the music they respond to. They aren't a sequence of separate scenes. The lighting moves the way the music does, continuously, so the ideas read more like a line than a list.",
    images: [],
  },
  {
    heading: "Program the cues",
    label: "prototype + build",
    notes:
      "Building the cue list in the lighting console while testing the planned ideas (parallel: prototyping and implementation at the same time)",
    intendedEffect:
      "The design keeps evolving during the build. Ideas get tested in the real tool, not locked in a plan.",
    text: "Programming is where the ideas get tested. As I build each cue, I try out what I planned, keep what works, and rework what doesn’t. The transitions matter as much as the looks: they have to carry the feel of the music, and they have to stay adjustable, so if the timing shifts on the night I can shift with it.",
    images: [],
  },
  {
    heading: "Rehearse",
    label: "test",
    notes:
      "Testing and refining against the real performance (parallel: testing and debugging)",
    intendedEffect:
      "The second round of testing, this time against the real room and the real performers.",
    text: "I can imagine it, program it, and previsualize it, but the first time in the room is never exactly what I pictured. The venue changes how light reads, and some effects don't work for the performers on stage. Rehearsal is where I fix what the plan got wrong.",
    images: [],
  },
  {
    heading: "Perform",
    label: "production",
    notes:
      "Cueing live from the iPad score as part of the ensemble (parallel: running in production, no rollback)",
    intendedEffect:
      "Execution under pressure. The lighting responds to the music as it happens.",
    text: "During the concert I follow the score on an iPad and advance the cues by hand as the music happens. The tempo belongs to the performers, not a click track, so nothing can be fully pre-timed. I'm reading and reacting in real time, which makes me part of the ensemble. My watch usually sends a high heart rate alert here, because as far as it can tell, I’m sitting perfectly still.",
    images: [],
  },
  {
    heading: "Edit the video",
    label: "same rules, new output",
    notes:
      "Multicam synced in Final Cut Pro, cuts and Ken Burns moves matched to the music (parallel: the same rules applied to a different output)",
    intendedEffect:
      "The same principle carries from the live show into the recording.",
    text: "Every concert is filmed on several cameras and synced into one multicam timeline in Final Cut Pro. The edit follows the same rule as the lighting: it isn't switching angles at random. Cuts, zooms, and pans land where the music moves, so what you see matches what you hear.",
    images: [],
  },
];

// where the steps end up: the full performance, with the lighting and the edit together
// the only entry with a video, so link lives here and not on every step
const premiere: Omit<ProductionStep, "label"> & { link: string } = {
  heading: "World premiere",
  notes: "World-premiere video with full production and edit",
  intendedEffect:
    "Proof. Everything above, in one piece, from start to finish.",
  text: "The examples above come from different pieces. This is all of it in one: a full performance, with the lighting and the edit together. It was a world premiere, and the first work we commissioned.",
  images: [],
  link: "",
};

// stands in for a step's example until its images exist
function StagePlaceholder() {
  return (
    <div className="border-rcnm-black-200 p-md flex aspect-video w-full items-start border border-dashed">
      <p className="roboto-mono text-rcnm-white-800 text-xs uppercase md:text-sm">
        Example to come
      </p>
    </div>
  );
}

function StepExample({ step }: { step: ProductionStep }) {
  if (step.images.length === 0) return <StagePlaceholder />;

  return (
    <div className="relative aspect-video w-full">
      <Image
        src={step.images[0]}
        alt={step.heading}
        fill
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

// three sections in a row: the intro, the steps and the premiere.
// the intro carries the nav id, so the nav item covers all three
export function RcnmLightingVideo({ id }: { id: string }) {
  const { activeIndex, stepRefs } = useActiveScrollStep();

  return (
    <>
      <ProjectSectionSnapTargetContainer
        id={id}
        tag="header"
        className="px-md lg:px-xl gap-lg flex flex-col justify-center py-16"
      >
        <h5 className="text-rcnm-red-400">Lighting &amp; video</h5>
        <h1 className="max-w-5xl text-balance">Scored to the Music</h1>
        <p className="text-rcnm-white-500 max-w-prose text-base md:text-lg">
          Rocket City New Music was built to perform music by living composers,
          in a concert experience where the lighting is part of the performance.
          Every light, camera move, and cut comes from the music.
        </p>
        <p className="max-w-prose text-base md:text-lg">
          Here is how a piece goes from the score to the stage to the screen.
        </p>
      </ProjectSectionSnapTargetContainer>

      {/* same layout as the database story: the example is pinned and the steps scroll past it.
          in the two column layout every step is one screen and a snap point of its own */}
      <ProjectSectionSnapTargetContainer
        id={`${id}-steps`}
        className="bg-rcnm-black-500 border-rcnm-black-300 border-y lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        snapToEnd
      >
        {/* every step's example is laid out in the same cell, so the box is as tall as the tallest one and never changes size */}
        <div className="stage bg-rcnm-black-500 border-rcnm-black-300 px-md py-sm lg:px-lg top-nav sticky z-10 grid items-center border-b lg:order-2 lg:h-[calc(100svh-var(--spacing-nav))] lg:border-b-0 lg:border-l">
          {productionSteps.map((step, index) => (
            <div
              key={step.heading}
              className={`col-start-1 row-start-1 min-w-0 ${index === activeIndex ? "animation-fade-in" : "invisible"}`}
              aria-hidden={index !== activeIndex}
            >
              <StepExample step={step} />
            </div>
          ))}
        </div>

        <ol className="steps px-md lg:px-xl lg:order-1">
          {productionSteps.map((step, index) => (
            <li
              key={step.heading}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
              className={`step pt-lg lg:scroll-mt-nav flex min-h-[70dvh] flex-col justify-start gap-3 transition-opacity duration-500 last:min-h-[45dvh] lg:min-h-[calc(100dvh-var(--spacing-nav))] lg:snap-start lg:justify-center lg:pt-0 lg:last:min-h-[calc(100dvh-var(--spacing-nav))] ${index === activeIndex ? "opacity-100" : "opacity-30"}`}
            >
              <p className="roboto-mono text-rcnm-red-400 text-xs md:text-sm">
                {String(index + 1).padStart(2, "0")} / {step.label}
              </p>
              <h2>{step.heading}</h2>
              <p className="text-rcnm-white-500 max-w-prose text-base md:text-lg">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </ProjectSectionSnapTargetContainer>

      <ProjectSectionSnapTargetContainer
        id={`${id}-premiere`}
        tag="section"
        className="px-md lg:px-xl gap-lg flex flex-col justify-center py-16"
      >
        <div className="gap-sm flex flex-col">
          <h5 className="text-rcnm-red-400">The result</h5>
          <h2>{premiere.heading}</h2>
          <p className="text-rcnm-white-500 max-w-prose text-base md:text-lg">
            {premiere.text}
          </p>
        </div>

        {/* the video goes here once premiere.link is set */}
        {premiere.link ? (
          <a
            href={premiere.link}
            target="_blank"
            rel="noreferrer"
            className="roboto-mono border-rcnm-black-200 px-md py-sm w-fit border text-sm"
          >
            Watch the performance
          </a>
        ) : (
          <div className="max-w-5xl">
            <StagePlaceholder />
          </div>
        )}
      </ProjectSectionSnapTargetContainer>
    </>
  );
}
