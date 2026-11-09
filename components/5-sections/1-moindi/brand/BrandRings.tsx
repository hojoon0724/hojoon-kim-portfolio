"use client";

import { useState } from "react";
import { moindiBrandLayers } from "./data";
import { Stage, visualHeight } from "./frame";

// outermost ring first. each ring is drawn smaller than the one before it
const ringSizeClassNames = ["size-full", "size-2/3", "size-1/3"];

// the three degrees of freedom as nested rings: the rings are stacked circles, so the part of each one left
// showing is its band. hover or tap a ring for its list from the guidelines
export function BrandRings() {
  const [activeLayerId, setActiveLayerId] = useState(moindiBrandLayers[0].id);
  const activeLayerIndex = moindiBrandLayers.findIndex(
    (layer) => layer.id === activeLayerId,
  );
  const activeLayer = moindiBrandLayers[activeLayerIndex];

  return (
    <div
      className={`gap-md grid grid-cols-1 grid-rows-[minmax(0,1fr)_auto] md:grid-cols-2 md:grid-rows-1 md:items-center ${visualHeight}`}
    >
      <Stage w={1} h={1}>
        {moindiBrandLayers.map((layer, index) => {
          const isActive = layer.id === activeLayerId;
          const isInnermost = index === moindiBrandLayers.length - 1;

          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveLayerId(layer.id)}
              onMouseEnter={() => setActiveLayerId(layer.id)}
              onFocus={() => setActiveLayerId(layer.id)}
              className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center rounded-full border-2 border-(--moindi-gray-950) transition-colors duration-300 ${ringSizeClassNames[index]} ${isInnermost ? "justify-center" : "justify-start pt-[4%]"} ${isActive ? "bg-(--moindi-gray-950) text-(--moindi-primary-500)" : "bg-(--moindi-primary-500) text-(--moindi-gray-950)"}`}
            >
              <span className="roboto-wide text-[max(10px,4cqw)] font-bold">
                {layer.label}
              </span>
              <span className="roboto-mono text-[max(8px,2.6cqw)]">
                {layer.metaphor}
              </span>
            </button>
          );
        })}
      </Stage>

      <div
        className="gap-xs md:gap-sm pt-sm flex flex-col border-t border-current text-sm md:text-base"
        aria-live="polite"
      >
        <div className="roboto-mono text-xs md:text-sm">
          0{activeLayerIndex + 1} / {activeLayer.label}
        </div>
        <p className="font-semibold text-pretty">{activeLayer.rule}</p>
        <ul className="flex flex-col gap-1">
          {activeLayer.items.map((item) => (
            <li key={item} className="gap-sm flex items-baseline">
              {/* limits are things the brand never does, so they are marked as ruled out */}
              <span className="roboto-mono w-4 shrink-0" aria-hidden="true">
                {activeLayer.id === "limits" ? "×" : "+"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
