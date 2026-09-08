"use client";

import { StaggeredReveal } from "@/components/1-atoms";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SimpleCarouselProps {
  imageArray: string[];
  className?: string;
  overflow?: "hidden" | "scroll" | "auto";
}

export function SimpleCarousel({
  imageArray,
  className = "",
}: SimpleCarouselProps) {
  const debug = true;
  const [layerAIndex, setLayerAIndex] = useState(0);
  const [layerBIndex, setLayerBIndex] = useState(imageArray.length - 1);
  const [bVisible, setBVisible] = useState(false);
  // const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const interval = 5000;
  const transitionDuration = 500;

  const arrayLength = imageArray.length;

  useEffect(() => {
    if (arrayLength < 2) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!bVisible) {
      // A is visible and B is hidden.
      // Wait, then start fading B in.
      timeout = setTimeout(() => {
        setBVisible(true);
      }, interval);
    } else {
      // B is visible.
      // Wait until the fade-in is complete,
      // then change A underneath B.
      timeout = setTimeout(() => {
        setLayerAIndex((currentA) => {
          return (currentA + 2) % arrayLength;
        });
      }, transitionDuration);

      // After A has changed underneath B,
      // wait before fading B back out.
      const fadeOutTimeout = setTimeout(() => {
        setBVisible(false);
      }, interval);

      return () => {
        clearTimeout(timeout);
        clearTimeout(fadeOutTimeout);
      };
    }

    return () => clearTimeout(timeout);
  }, [bVisible, arrayLength]);

  // When B has finished fading out, put the next image
  // into B while it is still invisible.
  useEffect(() => {
    if (bVisible || arrayLength < 2) return;

    const timeout = setTimeout(() => {
      setLayerBIndex((currentB) => {
        return (currentB + 2) % arrayLength;
      });
    }, transitionDuration);

    return () => clearTimeout(timeout);
  }, [bVisible, arrayLength]);

  if (arrayLength === 0) return null;

  const currentIndex = bVisible ? layerBIndex : layerAIndex;
  const layerAImage = imageArray[layerAIndex];
  const layerBImage = imageArray[layerBIndex];

  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      <div className="image-container opacity-100">
        {/* Layer A — always opaque */}
        <Image
          src={layerAImage}
          fill
          sizes="100svw"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Layer B — the only layer that fades */}
        <Image
          src={layerBImage}
          fill
          sizes="100svw"
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity"
          style={{
            opacity: bVisible ? 1 : 0,
            transitionDuration: `${transitionDuration}ms`,
          }}
        />

        {/* Temp layer for clicked index */}
        {/* <Image
        src={clickedIndex !== null ? imageArray[clickedIndex] : ""}
        fill
        sizes="100svw"
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity"
        style={{
          opacity: clickedIndex !== null ? 1 : 0,
          transitionDuration: `${transitionDuration}ms`,
        }}
      /> */}

        {/* Establishes the container's dimensions */}
        <Image
          src={bVisible ? layerBImage : layerAImage}
          fill
          sizes="100svw"
          alt=""
          className="invisible h-full w-full object-cover"
        />
      </div>
      {/* Debug */}
      {debug && (
        <div className="gap-md absolute inset-0 z-20 flex items-center justify-center">
          <div className="current-index p-md bg-blue-500 text-xl text-white">
            {currentIndex}
          </div>
          <div
            className="p-md bg-blue-500 text-xl text-white"
            style={{ border: !bVisible ? "3px solid white" : "0px" }}
          >
            A: {layerAIndex}
          </div>

          <div
            className="p-md bg-blue-500 text-xl text-white"
            style={{ border: bVisible ? "3px solid white" : "0px" }}
          >
            B: {layerBIndex}
          </div>

          <div className="p-md bg-blue-500 text-xl text-white">
            B: {bVisible ? "visible" : "hidden"}
          </div>
        </div>
      )}
      <StaggeredReveal
        className="gap-sm p-xl absolute bottom-0 flex w-full items-center justify-center"
        delayMs={1000}
        staggerMs={20}
        resetOnLeave={false}
      >
        {imageArray.map((image, index) => (
          <div
            key={`indicator-${index}`}
            className={`h-2 shrink border border-gray-700/40 bg-gray-200 transition-all duration-700 ${index === currentIndex ? "w-9" : "w-2"}`}
            // onClick={() => setClickedIndex(index)}
          ></div>
        ))}
      </StaggeredReveal>
    </div>
  );
}
