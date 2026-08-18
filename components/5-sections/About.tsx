"use client";

import { ScrollRevealText, Section } from "@/components/1-atoms";
import { useEffect, useState } from "react";

export function About({
  landingIconAnimationDuration = 200,
  id = "about",
}: {
  landingIconAnimationDuration?: number;
  id?: string;
}) {
  const [showText, setShowText] = useState(false);
  const descriptionText =
    "Designer and software developer creating products, brands, and media across tech, film, and music helping teams turn early ideas into shipped products.";

  useEffect(() => {
    const delayMs = Math.max(0, landingIconAnimationDuration);
    const timeoutIds: number[] = [];

    if (delayMs === 0) {
      timeoutIds.push(
        window.setTimeout(() => {
          setShowText(true);
        }, 0),
      );
    } else {
      timeoutIds.push(
        window.setTimeout(() => {
          setShowText(false);
        }, 0),
      );

      timeoutIds.push(
        window.setTimeout(() => {
          setShowText(true);
        }, delayMs),
      );
    }

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [landingIconAnimationDuration]);
  {
    return (
      <>
        <Section
          className="about relative flex h-dvh max-h-none w-full shrink-0 snap-start flex-col items-center justify-center bg-gray-700"
          data-snap-target
          id={id}
          fullWidth
        >
          <div className="background-container absolute flex h-full w-full items-center justify-center"></div>
          <div className="banner-content nav-padding gap-xl p-xl pb-3xl flex w-full max-w-7xl flex-col items-start justify-between md:flex-row md:items-center">
            <h1 className="text">
              <ScrollRevealText
                className="max-w-prose text-left text-balance"
                revealBy="letter"
                staggerMs={80}
                text="Hojoon Kim"
                wrap={false}
              />
            </h1>

            <div className="min-h-14 max-w-prose text-balance">
              {showText ? (
                <ScrollRevealText
                  className="max-w-prose text-left text-balance md:text-right"
                  revealBy="word"
                  staggerMs={40}
                  text={descriptionText}
                />
              ) : (
                <p className="invisible">{descriptionText}</p>
              )}
            </div>
          </div>
        </Section>
      </>
    );
  }
}
