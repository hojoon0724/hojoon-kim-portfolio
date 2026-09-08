"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function FullScreenCarousel({ imageArray }: { imageArray: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    imageArray[0] || null,
  );
  const [startCountdown, setStartCountdown] = useState<boolean>(false);
  const countdownTimeoutRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const clearInactivityTimers = () => {
      if (countdownTimeoutRef.current !== null) {
        window.clearTimeout(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }

      if (autoAdvanceTimeoutRef.current !== null) {
        window.clearTimeout(autoAdvanceTimeoutRef.current);
        autoAdvanceTimeoutRef.current = null;
      }
    };

    const selectNextImage = () => {
      setSelectedImage((prevImage) => {
        const currentIndex = imageArray.findIndex(
          (image) => image === prevImage,
        );
        const nextIndex = (currentIndex + 1) % imageArray.length;
        return imageArray[nextIndex];
      });
    };

    const scheduleInactivityFlow = () => {
      clearInactivityTimers();
      setStartCountdown(false);

      // 2s idle: show countdown bar, then fill it for 3s.
      countdownTimeoutRef.current = window.setTimeout(() => {
        setStartCountdown(true);
      }, 7000);

      // 5s idle total: advance to the next image and restart the idle flow.
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        selectNextImage();
        scheduleInactivityFlow();
      }, 10000);
    };

    const handleMouseMove = () => {
      scheduleInactivityFlow();
    };

    window.addEventListener("mousemove", handleMouseMove);
    scheduleInactivityFlow();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInactivityTimers();
    };
  }, [imageArray]);

  return (
    <div className="works-summary-landing content-max-width gap-sm flex flex-col">
      <div className="rendered-section bg-surface-light/60 flex-1">
        {selectedImage && (
          <div className="selected-image-container">
            <Image
              src={selectedImage}
              alt="Selected image"
              width={800}
              height={600}
            />
            <div className="countdown-bar bg-surface-light h-1 w-full">
              <div
                className={`progress bg-surface-accent h-full transition-all ${startCountdown ? "w-full delay-0 duration-3000" : "w-0 delay-0 duration-0"}`}
              ></div>
            </div>
          </div>
        )}
      </div>
      <div className="image-select-container grid grid-cols-1 md:grid-cols-4">
        {imageArray.map((image, index) => (
          <div
            key={index}
            className={`image-option-container hover:bg-surface-accent hover:text-on-accent flex cursor-pointer flex-col items-center justify-center transition-colors duration-300 ${
              selectedImage === image
                ? "bg-surface-accent text-on-accent"
                : "bg-surface-feather text-on-light"
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <div className="image-select__content">
              <div className="image-select__thumbnail">
                <Image
                  src={image}
                  alt={`Thumbnail ${index}`}
                  width={200}
                  height={150}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
