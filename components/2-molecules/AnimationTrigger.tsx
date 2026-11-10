"use client";

import { Button } from "@/components/1-atoms";
import { useState } from "react";

interface AnimationTriggerProps {
  animationClass: string;
  animationName: string;
  children?: React.ReactNode;
  duration?: number;
  startVisible?: boolean;
  onComplete?: () => void;
}

export function AnimationTrigger({
  animationClass,
  animationName,
  children,
  startVisible = false,
  onComplete,
}: AnimationTriggerProps) {
  const [animationState, setAnimationState] = useState<
    "idle" | "animating" | "completed"
  >("idle");
  const [animationKey, setAnimationKey] = useState(0);

  const resetToInitial = () => {
    setAnimationState("idle");
    setAnimationKey(0);
  };

  const handleTrigger = () => {
    setAnimationKey((prev) => prev + 1);
    setAnimationState("animating");

    // 500ms delay + animation duration
    setTimeout(() => {
      setAnimationState("completed");
      onComplete?.();
    }, 500);
  };

  const shouldApplyAnimation =
    animationState === "animating" || animationState === "completed";
  const isDisabled = animationState === "animating";

  return (
    <div className="grid grid-cols-[auto_1fr] items-center border">
      <div className="name-button-container px-xs py-xs flex h-full flex-col items-end border-r">
        <span className="capitalize">{animationName}</span>
        <div className="buttons-container grid grid-cols-2">
          <Button
            onClick={resetToInitial}
            disabled={animationState !== "completed"}
            text="reset"
            variant="filled"
            color="neutral"
            size="sm"
          />
          <Button
            onClick={handleTrigger}
            disabled={isDisabled}
            text="play"
            variant="filled"
            color="accent"
            size="sm"
          />
        </div>
      </div>
      <div className="overflow-hidden py-2 pr-26 pl-2">
        <div
          key={animationKey}
          className={`${shouldApplyAnimation ? animationClass : startVisible ? "" : "invisible"}`}
        >
          {children || (
            <div className="bg-surface-accent-on-inverted h-12 w-24 rounded border" />
          )}
        </div>
      </div>
    </div>
  );
}
