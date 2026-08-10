"use client";

import { ScrollRevealText, Section } from "@/components/1-atoms";
import { useEffect, useState } from "react";

export function About({
  landingIconAnimationDuration = 200,
}: {
  landingIconAnimationDuration?: number;
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
          className="about relative flex h-dvw max-h-none w-full flex-col items-center justify-end bg-gray-600 md:h-[75dvw] lg:h-[56.25dvw] lg:max-h-[60dvh]"
          id="about"
          fullWidth
        >
          <div className="background-container absolute h-full w-full bg-gray-800 opacity-90"></div>
          <div className="banner-content nav-padding gap-xl p-xl flex w-full max-w-5xl flex-col justify-between md:flex-row items-start md:items-end">
            <h1 className="text">
              <ScrollRevealText
                className="max-w-prose text-left text-balance"
                revealBy="letter"
                staggerMs={80}
                text="About"
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
