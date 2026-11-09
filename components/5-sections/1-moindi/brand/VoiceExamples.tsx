"use client";

import { useState } from "react";
import { toggleButtonClass } from "../design-in-code/shared";
import { voiceExamples } from "./data";
import { visualHeight } from "./frame";

// one of the voice examples: the right version, then each wrong one with the reason it's wrong, like an error
// message that says what to fix
export function VoiceExamples() {
  const [exampleId, setExampleId] = useState(voiceExamples[0].id);
  // -1 is the right version
  const [versionIndex, setVersionIndex] = useState(-1);
  const example =
    voiceExamples.find((option) => option.id === exampleId) ?? voiceExamples[0];
  const incorrect =
    versionIndex >= 0 ? example.incorrect[versionIndex] : undefined;

  return (
    <div className={`gap-sm flex flex-col ${visualHeight}`}>
      <div className="gap-x-md gap-y-xs flex flex-wrap justify-between">
        <div
          className="gap-xs flex flex-wrap"
          role="group"
          aria-label="Example"
        >
          {voiceExamples.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={option.id === exampleId}
              onClick={() => {
                setExampleId(option.id);
                setVersionIndex(-1);
              }}
              className={toggleButtonClass(option.id === exampleId)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div
          className="gap-xs flex flex-wrap"
          role="group"
          aria-label="Version"
        >
          <button
            type="button"
            aria-pressed={versionIndex === -1}
            onClick={() => setVersionIndex(-1)}
            className={toggleButtonClass(versionIndex === -1)}
          >
            Do
          </button>
          {example.incorrect.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={versionIndex === index}
              onClick={() => setVersionIndex(index)}
              className={toggleButtonClass(versionIndex === index)}
            >
              × {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`p-md md:p-lg gap-sm flex min-h-0 flex-1 flex-col overflow-y-auto transition-colors duration-300 ${incorrect ? "border-2 border-current" : "bg-(--moindi-gray-950) text-(--moindi-primary-500)"}`}
        aria-live="polite"
      >
        <div className="roboto-mono text-xs font-bold uppercase md:text-sm">
          {incorrect ? `× Don't` : "Do"}
        </div>
        <p
          key={`${exampleId}-${versionIndex}`}
          className={`animate-[fade-in_300ms_ease-out_both] text-base text-pretty md:text-xl ${incorrect ? "opacity-70" : ""}`}
        >
          {incorrect ? incorrect.text : example.correct}
        </p>
        {incorrect && (
          <p className="roboto-mono pt-sm mt-auto border-t border-current text-xs md:text-sm">
            Why: {incorrect.why}
          </p>
        )}
      </div>
    </div>
  );
}
