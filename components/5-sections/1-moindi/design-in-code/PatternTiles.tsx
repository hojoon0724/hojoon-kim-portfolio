"use client";

import { RandomTiles } from "@/demos/moindi/components/RandomTiles";
import { Icon } from "@/components/1-atoms";
import { useState } from "react";

// the live tile pattern: every shuffle deals a new random layout that still follows the edge rules, and the
// tiles turn over to it in a wave from the top-left corner
export function PatternTiles() {
  const [seed, setSeed] = useState(0);

  return (
    <div className="relative h-[max(200px,calc(100cqh-1rem))] w-full border border-current/15 bg-(--moindi-primary-500) text-(--moindi-gray-950) md:h-[min(calc(280px*150/71.9),calc(100svh-24rem))]">
      <div
        className="size-full"
        role="img"
        aria-label="A random pattern of triangle and square tiles"
      >
        <RandomTiles shuffle={seed} />
      </div>
      <button
        type="button"
        onClick={() => setSeed((count) => count + 1)}
        aria-label="Shuffle the pattern"
        title="Shuffle"
        className="absolute right-3 bottom-3 flex cursor-pointer items-center border border-(--moindi-gray-950) bg-(--moindi-gray-30) p-2 text-(--moindi-gray-950) shadow-lg transition-colors hover:bg-(--moindi-gray-950) hover:text-(--moindi-gray-30)"
      >
        <Icon icon="shuffle" className="size-6" />
      </button>
    </div>
  );
}
