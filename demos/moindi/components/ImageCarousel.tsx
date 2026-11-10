"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { ImageContainer } from "./ImageContainer";
import { LinkButton } from "./LinkButton";
import { SvgIcon } from "./SvgIcon";

export interface CarouselSlide {
  src: string;
  title: string;
  // the button is left off a slide without text. without a url it's a plain button that does nothing
  buttonText?: string;
  buttonUrl?: string;
}

const AUTO_ADVANCE_MS = 5000;

// the original's image-carousel: full-bleed slides with a title and button over the image,
// advancing on its own every few seconds. the arrows show on hover; the dots are always there
export function ImageCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = slides.length;

  // restarts whenever the slide changes, so a click isn't immediately followed by an auto-advance
  useEffect(() => {
    if (count < 2) return;
    const timer = setTimeout(
      () => setActiveIndex((index) => (index + 1) % count),
      AUTO_ADVANCE_MS,
    );
    return () => clearTimeout(timer);
  }, [activeIndex, count]);

  if (count === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-(--surface-base)">
        <span className="opacity-60">No images available</span>
      </div>
    );
  }

  const step = (direction: 1 | -1) =>
    setActiveIndex((index) => (index + direction + count) % count);

  return (
    <div className="image-carousel group relative h-full w-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.src}
              className="relative h-full w-full shrink-0"
              aria-hidden={!isActive}
            >
              <ImageContainer
                className="absolute inset-0"
                srcSet={slide.src}
                square={false}
                description={slide.title}
              />
              <div
                className={`carousel-text absolute inset-0 flex flex-col justify-between gap-(--standard-space) p-(--standard-space) pt-(--standard-space-double) text-white transition-opacity delay-500 duration-300 [text-shadow:0_2px_4px_rgb(0_0_0/0.9),0_2px_12px_rgb(0_0_0/0.7),0_2px_24px_rgb(0_0_0/0.5)] md:flex-row md:items-center md:pt-(--standard-space) ${isActive ? "opacity-100" : "opacity-0"}`}
              >
                <div className="space-grotesk text-3xl">{slide.title}</div>
                {slide.buttonText && (
                  <div className="flex shrink-0 justify-end self-end p-(--standard-space) md:self-center">
                    {slide.buttonUrl ? (
                      <LinkButton
                        href={slide.buttonUrl}
                        size="small"
                        color="primary"
                      >
                        {slide.buttonText}
                      </LinkButton>
                    ) : (
                      <Button
                        size="small"
                        color="primary"
                        tabIndex={isActive ? 0 : -1}
                      >
                        {slide.buttonText}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          {(
            [
              ["left", "Previous", -1],
              ["right", "Next", 1],
            ] as const
          ).map(([side, label, direction]) => (
            <button
              key={side}
              type="button"
              aria-label={`${label} slide`}
              className={`absolute bottom-1/2 z-10 h-8 w-8 translate-y-1/2 border bg-(--surface-base) opacity-0 transition-opacity group-hover:opacity-80 focus-visible:opacity-80 md:bottom-(--standard-space) md:translate-y-0 ${side === "left" ? "left-(--standard-space-half)" : "right-(--standard-space-half)"}`}
              onClick={() => step(direction)}
            >
              <SvgIcon iconName={`angle-${side}`} />
            </button>
          ))}
          <div className="absolute bottom-(--standard-space) z-10 flex w-full items-center justify-center gap-(--standard-space-half)">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex}
                className={`h-2 border transition-all duration-300 ${index === activeIndex ? "w-6 bg-(--surface-secondary)" : "w-2 bg-(--surface-secondary-light)"}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
