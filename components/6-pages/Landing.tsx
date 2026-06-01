"use client";

// import { Button } from "@/components/1-atoms";
import { LandingIcon, ScrollRevealText } from "@/components/1-atoms";
import { useEffect, useState } from "react";

export function Landing({ landingIconAnimationDuration = 1000 }: { landingIconAnimationDuration?: number }) {
  const [showText, setShowText] = useState(false);
  const descriptionText =
    "Designer and software developer creating products, brands, and media across tech, film, and music.";

  useEffect(() => {
    const delayMs = Math.max(0, landingIconAnimationDuration);

    if (delayMs === 0) {
      setShowText(true);
      return;
    }

    setShowText(false);
    const timeoutId = window.setTimeout(() => {
      setShowText(true);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [landingIconAnimationDuration]);

  return (
    <div className="landing-container flex flex-col items-center justify-center h-dvh w-full no-main-spacing px-md">
      <h1>
        <ScrollRevealText
          className="max-w-prose text-center text-balance"
          revealBy="letter"
          staggerMs={80}
          text="Hojoon Kim"
        />
      </h1>
      <LandingIcon initialAnimationDuration={landingIconAnimationDuration} />
      <div className="max-w-prose min-h-[3.5rem] text-center text-balance">
        {showText ? (
          <ScrollRevealText
            className="max-w-prose text-center text-balance"
            revealBy="word"
            staggerMs={80}
            text={descriptionText}
          />
        ) : (
          <p className="invisible">{descriptionText}</p>
        )}
      </div>
    </div>
  );
}
