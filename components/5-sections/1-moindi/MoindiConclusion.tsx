"use client";

import { ProjectSectionSnapTargetContainer } from "@/components/4-organisms";
import Link from "next/link";

// title and copy are what the section shows. purpose and layout are guides for building it and are never rendered
const notes = {
  title: "One Loop",
  purpose:
    "Synthesis — re-collect the evidence as a verdict. 'You've just seen it,' not a restatement of the thesis.",
  copy: "The interface wasn't drawn and handed off — it was designed the way it would ship. The CTO and I moved fast because engineering was never a wall between us. The product wasn't a screenshot; you just used it. And the brand wasn't decoration — it was a system built around what the product should make people feel. Four things, but really one: design and engineering as a single loop. For a small team, that's the difference between one person moving and a committee deliberating.",
  layout:
    "Short — shorter than the sections it summarizes. Prose, not bullets mirroring the nav. End with a forward-looking line and a clear handoff: next project, back to gallery, contact.",
};

// the copy turns at this sentence, from the four things shown to the one thing they add up to
const verdictStart = notes.copy.indexOf("Four things");
const verdict = notes.copy.slice(verdictStart);

// the four things the page showed, each with the section that showed it.
// sectionId has to match the id the page gives that section
const evidence = [
  {
    sectionId: "no-handoff",
    section: "Design in Code",
    line: "The interface wasn't drawn and handed off — it was designed the way it would ship.",
  },
  {
    sectionId: "collaboration",
    section: "Collaboration",
    line: "The CTO and I moved fast because engineering was never a wall between us.",
  },
  {
    sectionId: "demo",
    section: "Try It",
    line: "The product wasn't a screenshot; you just used it.",
  },
  {
    sectionId: "brand",
    section: "A Coder's Brand",
    line: "And the brand wasn't decoration — it was a system built around what the product should make people feel.",
  },
];

// where to go from here
const nextLinks = [
  { href: "/rcnm", label: "Next project: Rocket City New Music" },
  { href: "/", label: "All projects" },
  { href: "/#contact", label: "Get in touch" },
];

// the verdict: what was just shown, gathered up. shorter than any of the sections it points back to
export function MoindiConclusion({ id }: { id: string }) {
  // iOS Safari jumps to the top of the page before a native hash navigation, so scroll to the section ourselves
  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ProjectSectionSnapTargetContainer
      id={id}
      tag="section"
      className="px-md lg:px-xl flex items-center py-16"
      snapToEnd
    >
      <div className="gap-2xl mx-auto flex w-full max-w-7xl flex-col">
        <div className="gap-lg flex flex-col">
          <h2>{notes.title}</h2>
          {/* one paragraph, not a list. each sentence carries a small link back to the section it is about */}
          <p className="max-w-prose text-lg text-pretty md:text-xl">
            {evidence.map((item) => (
              <span key={item.sectionId}>
                {item.line}{" "}
                <a
                  href={`#${item.sectionId}`}
                  onClick={(event) => scrollToSection(event, item.sectionId)}
                  className="roboto-mono text-xs whitespace-nowrap underline underline-offset-4 opacity-70 transition-opacity hover:opacity-100 md:text-sm"
                >
                  {item.section}
                </a>{" "}
              </span>
            ))}
          </p>
          <p className="roboto-narrow max-w-5xl text-2xl font-semibold text-balance md:text-4xl">
            {verdict}
          </p>
        </div>

        <ul className="gap-x-xl gap-y-sm pt-md flex flex-col border-t border-gray-950 md:flex-row">
          {nextLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="roboto-mono text-xs font-semibold opacity-70 transition-opacity hover:opacity-100 md:text-sm"
              >
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ProjectSectionSnapTargetContainer>
  );
}
