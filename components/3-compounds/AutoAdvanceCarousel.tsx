"use client";

import { StaggeredReveal } from "@/components/1-atoms";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AutoAdvanceCarouselProps {
  imageArray: string[];
  className?: string;
  mounted?: boolean;
  overflow?: "hidden" | "scroll" | "auto";
}

export function AutoAdvanceCarousel({
  imageArray,
  className = "",
}: AutoAdvanceCarouselProps) {
  const debug = false;
  const [clicked, setClicked] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(0);
  const [carousel, setCarousel] = useState({
    currentIndex: 0,
    layerAIndex: 0,
    layerBIndex: imageArray.length - 1,
    bVisible: false,
    cVisible: false,
  });

  const interval = 5000;
  const transitionDuration = 500;

  const arrayLength = imageArray.length;

  useEffect(() => {
    if (arrayLength < 2) return;

    // when a user click is detected, show the clicked image on top (layer C)
    if (clicked) {
      const showClickedTimeout = setTimeout(() => {
        setCarousel((prev) => ({
          ...prev,
          currentIndex: clickedIndex,
          cVisible: true,
        }));
      }, 0);

      // prepare layer A and layer B for the next transition

      const prepareLayersTimeout = setTimeout(() => {
        setCarousel((prev) => ({
          ...prev,
          currentIndex: clickedIndex,
          layerAIndex: (clickedIndex + 1) % arrayLength,
          layerBIndex: clickedIndex % arrayLength,
          bVisible: false,
        }));
      }, transitionDuration);

      // hides C to reveal A => toggles layer B)
      const hideCTimeout = setTimeout(() => {
        setCarousel((prev) => ({
          ...prev,
          cVisible: false,
        }));
        setClicked(false);
      }, interval);

      return () => {
        clearTimeout(showClickedTimeout);
        clearTimeout(prepareLayersTimeout);
        clearTimeout(hideCTimeout);
      };
    }

    // advances the invisible layer
    const advanceLayerTimeout = setTimeout(() => {
      setCarousel((prev) => ({
        ...prev,
        ...(prev.bVisible
          ? {
              // if B is visible, advance layer A after the transition
              layerAIndex: (prev.layerAIndex + 2) % arrayLength,
            }
          : {
              // if B is NOT visible, advance layer B after the transition
              layerBIndex: (prev.layerBIndex + 2) % arrayLength,
            }),
      }));
    }, transitionDuration);

    // turns layer B on/off + advances the current index
    const toggleTimeout = setTimeout(() => {
      setCarousel((prev) => ({
        ...prev,
        bVisible: !prev.bVisible,
        currentIndex: (prev.currentIndex + 1) % arrayLength,
      }));
    }, interval);

    return () => {
      clearTimeout(advanceLayerTimeout);
      clearTimeout(toggleTimeout);
    };
  }, [
    clickedIndex,
    interval,
    carousel.bVisible,
    arrayLength,
    carousel.cVisible,
    clicked,
  ]);

  const layerAImage = imageArray[carousel.layerAIndex];
  const layerBImage = imageArray[carousel.layerBIndex];

  return (
    <div className={`relative h-full ${className}`}>
      <div className="image-container">
        {/* Layer A — always showing */}
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
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: carousel.bVisible ? 1 : 0,
            transitionDuration: `${transitionDuration}ms`,
          }}
        />

        {/* Temp layer for clicked index */}

        <Image
          src={imageArray[clickedIndex]}
          fill
          sizes="100svw"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: carousel.cVisible ? 1 : 0,
            transitionDuration: `${transitionDuration}ms`,
          }}
        />

        {/* Establishes the container's dimensions */}
        <Image
          src={carousel.bVisible ? layerBImage : layerAImage}
          fill
          sizes="100svw"
          alt=""
          className="invisible h-full w-full object-cover"
        />
      </div>
      {/* Debug */}
      {debug && (
        <div className="gap-xl p-2xl absolute inset-0 z-10 flex flex-col items-start justify-center">
          <div className="line-1 gap-md flex items-center justify-center">
            <div className="current-index p-md bg-blue-500 text-xl text-white">
              Current: {carousel.currentIndex}
            </div>
            <div
              className="p-md bg-blue-500 text-xl text-white"
              style={{ border: !carousel.bVisible ? "3px solid white" : "0px" }}
            >
              A: {carousel.layerAIndex}
            </div>

            <div
              className="p-md bg-blue-500 text-xl text-white"
              style={{ border: carousel.bVisible ? "3px solid white" : "0px" }}
            >
              B: {carousel.layerBIndex}
            </div>
            <div
              className="p-md bg-blue-500 text-xl text-white"
              style={{ border: carousel.cVisible ? "3px solid white" : "0px" }}
            >
              C: {clickedIndex !== null ? clickedIndex : "null"}
            </div>
          </div>
          <div className="line-2 gap-md flex items-center justify-center">
            <div
              className={`p-md text-xl text-white ${carousel.bVisible ? "bg-green-500" : "bg-gray-500"}`}
            >
              B Visible: {carousel.bVisible ? "visible" : "hidden"}
            </div>
            <div
              className={`p-md text-xl text-white ${carousel.cVisible ? "bg-green-500" : "bg-gray-500"}`}
            >
              C Visible: {carousel.cVisible ? "visible" : "hidden"}
            </div>
          </div>
          <div className="line-2 gap-md flex items-center justify-center">
            <div
              className={`p-md text-xl text-white ${clickedIndex !== null ? "bg-green-500" : "bg-gray-500"}`}
            >
              Clicked: {clickedIndex !== null ? clickedIndex : "null"}
            </div>
          </div>
        </div>
      )}
      <StaggeredReveal
        className="gap-sm p-xl absolute bottom-0 z-10 flex w-full items-center justify-center"
        delayMs={1000}
        staggerMs={20}
        resetOnLeave={false}
      >
        {imageArray.map((image, index) => (
          <div
            key={`indicator-${index}`}
            className={`z-10 h-2 shrink cursor-pointer border border-gray-700/40 bg-gray-200 transition-all duration-700 ${index === carousel.currentIndex ? "w-9" : "w-2"}`}
            onClick={() => {
              setClickedIndex(index);
              setClicked(true);
            }}
          ></div>
        ))}
      </StaggeredReveal>
    </div>
  );
}
