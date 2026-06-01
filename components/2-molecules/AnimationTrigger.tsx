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
  const [animationState, setAnimationState] = useState<"idle" | "animating" | "completed">("idle");
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

  const shouldApplyAnimation = animationState === "animating" || animationState === "completed";
  const isDisabled = animationState === "animating";

  return (
    <div className="grid grid-cols-[auto_1fr] items-center border">
      <div className="name-button-container flex flex-col items-end border-r px-xs py-xs h-full">
        <span className="capitalize">{animationName}</span>
        <div className="buttons-container grid grid-cols-2">
          <Button
            onClick={resetToInitial}
            disabled={animationState !== "completed"}
            text="reset"
            variant="filled"
            color="secondary"
            size="sm"
          />
          <Button onClick={handleTrigger} disabled={isDisabled} text="play" variant="filled" color="primary" size="sm" />
        </div>
      </div>
      <div className="overflow-hidden pl-2 pr-26 py-2">
        <div
          key={animationKey}
          className={`${shouldApplyAnimation ? animationClass : startVisible ? "" : "invisible"}`}
        >
          {children || <div className="w-24 h-12 bg-surface-primary border rounded" />}
        </div>
      </div>
    </div>
  );
}
