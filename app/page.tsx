"use client";

import { ScrollRevealText, Section } from "@/components/1-atoms";

export default function Home() {
  return (
    <>
      <Section fullWidth className="no-main-spacing">
        <div className="w-full aspect-video bg-surface-heavy"></div>
      </Section>
      <Section>
        <div className="about-me py-4">
          <ScrollRevealText
            className="mb-6 max-w-prose text-4xl leading-snug font-semibold flex justify-center items-center pb-60"
            revealBy="word"
            staggerMs={100}
            text="I'm a product and brand designer who codes, turning early product ideas into real products fast by working across design, engineering, and business."
          />
        </div>
      </Section>
    </>
  );
}
