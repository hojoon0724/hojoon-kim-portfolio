"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ScrollContext = createContext<{ activeTargetKey: string | null }>({
  activeTargetKey: null,
});

export function useScrollContext() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [activeTargetKey, setActiveTargetKey] = useState<string | null>(null);

  useEffect(() => {
    let frameId = 0;
    let activeColor = "";
    let cachedTargetKey: string | null = null;

    const getTargets = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-snap-target]"));

    const getVisibleArea = (rect: DOMRect) => {
      const width = Math.max(
        0,
        Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0),
      );
      const height = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
      );
      return width * height;
    };

    const findActiveTarget = (): HTMLElement | null => {
      const targets = getTargets();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      let bestTarget: HTMLElement | null = null;
      let bestScore = Number.POSITIVE_INFINITY;

      for (const target of targets) {
        const rect = target.getBoundingClientRect();
        const visibleArea = getVisibleArea(rect);

        if (visibleArea === 0) {
          continue;
        }

        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;
        const distance = Math.hypot(
          targetCenterX - centerX,
          targetCenterY - centerY,
        );

        if (distance < bestScore) {
          bestScore = distance;
          bestTarget = target;
        }
      }

      return bestTarget;
    };

    const syncBodyColor = () => {
      frameId = 0;
      const activeTarget = findActiveTarget();

      if (!activeTarget) {
        if (cachedTargetKey !== null) {
          cachedTargetKey = null;
          setActiveTargetKey(null);
        }
        return;
      }

      const nextTargetKey = activeTarget.dataset.animationKey ?? null;
      if (nextTargetKey !== cachedTargetKey) {
        cachedTargetKey = nextTargetKey;
        setActiveTargetKey(nextTargetKey);
      }

      const backgroundColor =
        window.getComputedStyle(activeTarget).backgroundColor;

      if (
        !backgroundColor ||
        backgroundColor === "transparent" ||
        backgroundColor === "rgba(0, 0, 0, 0)"
      ) {
        return;
      }

      if (backgroundColor !== activeColor) {
        activeColor = backgroundColor;
        document.body.style.backgroundColor = backgroundColor;
      }
    };

    const queueSync = () => {
      if (frameId !== 0) {
        return;
      }
      frameId = window.requestAnimationFrame(syncBodyColor);
    };

    const containers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-snap-container]"),
    );

    containers.forEach((container) => {
      container.addEventListener("scroll", queueSync, { passive: true });
    });
    window.addEventListener("resize", queueSync);
    window.addEventListener("scroll", queueSync, { passive: true });

    queueSync();

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      containers.forEach((container) => {
        container.removeEventListener("scroll", queueSync);
      });
      window.removeEventListener("resize", queueSync);
      window.removeEventListener("scroll", queueSync);
      document.body.style.backgroundColor = "";
      setActiveTargetKey(null);
    };
  }, []);

  const contextValue = useMemo(() => ({ activeTargetKey }), [activeTargetKey]);

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
}
