import { useEffect, useRef, useState } from "react";

/**
 * Tracks which step of a scroll story is active: the last one whose top has
 * crossed the trigger line. Put stepRefs on the steps, in order.
 */
export function useActiveScrollStep() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frameId = 0;

    // on small screens the text scrolls in under the pinned stage, so the line it has to cross sits lower
    const update = () => {
      frameId = 0;
      const isWide = window.matchMedia("(min-width: 1024px)").matches;
      const triggerLine = window.innerHeight * (isWide ? 0.6 : 0.9);

      let nextIndex = 0;
      stepRefs.current.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top < triggerLine) {
          nextIndex = index;
        }
      });
      setActiveIndex(nextIndex);
    };

    const queueUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(update);
    };

    update();
    // scroll doesn't bubble, so capture it to catch the snap container the page scrolls in
    document.addEventListener("scroll", queueUpdate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("scroll", queueUpdate, { capture: true });
      window.removeEventListener("resize", queueUpdate);
    };
  }, []);

  return { activeIndex, stepRefs };
}
