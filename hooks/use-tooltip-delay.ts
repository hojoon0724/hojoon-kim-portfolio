import { useEffect, useRef, useState } from "react";

const TOOLTIP_DELAY_MS = 300;
// how long after a tooltip hides that the next one skips the delay
const TOOLTIP_SKIP_DELAY_MS = 400;

// shared by every tooltip, so moving across a row of them keeps them "warm"
let tooltipsWarmUntil = 0;
// removes whichever tooltip was shown last, so it doesn't overlap the next one while fading out
let removeActiveTooltip: (() => void) | null = null;

export function useTooltipDelay() {
  // null while the tooltip isn't on the page at all: before it is first shown, and again once it has faded out.
  // a hidden tooltip left in place is wider than its trigger and adds sideways scroll to whatever holds it
  const [shown, setShown] = useState<boolean | null>(null);
  // true when it appeared without the delay, so it should skip its entrance animation too
  const [instant, setInstant] = useState(false);
  const timeoutRef = useRef(0);
  const isShownRef = useRef(false);
  const removeRef = useRef(() => {
    window.clearTimeout(timeoutRef.current);
    isShownRef.current = false;
    setShown(null);
  });

  useEffect(() => {
    const remove = removeRef.current;
    return () => {
      window.clearTimeout(timeoutRef.current);
      if (removeActiveTooltip === remove) removeActiveTooltip = null;
    };
  }, []);

  const show = (instantly: boolean) => {
    if (removeActiveTooltip !== removeRef.current) removeActiveTooltip?.();
    removeActiveTooltip = removeRef.current;
    isShownRef.current = true;
    setInstant(instantly);
    setShown(true);
  };

  const onMouseEnter = () => {
    window.clearTimeout(timeoutRef.current);
    if (Date.now() < tooltipsWarmUntil) {
      show(true);
      return;
    }
    timeoutRef.current = window.setTimeout(() => show(false), TOOLTIP_DELAY_MS);
  };

  // hides right away, and only fades out if it had actually appeared
  const onMouseLeave = () => {
    window.clearTimeout(timeoutRef.current);
    // only warm up if this tooltip actually appeared, not if the cursor just passed through
    if (isShownRef.current) {
      tooltipsWarmUntil = Date.now() + TOOLTIP_SKIP_DELAY_MS;
      isShownRef.current = false;
    }
    setShown((prev) => (prev ? false : prev));
  };

  // goes on the tooltip itself: takes it off the page once the fade-out ends
  const onAnimationEnd = () => setShown((prev) => (prev ? prev : null));

  return {
    shown,
    instant,
    triggerProps: { onMouseEnter, onMouseLeave },
    onAnimationEnd,
  };
}
