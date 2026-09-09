"use client";

import {
  Section,
  StaggeredReveal,
  StaggeredTextReveal,
} from "@/components/1-atoms";
import { Fragment, useEffect, useRef, useState } from "react";

export function About({
  landingIconAnimationDuration = 200,
  id = "about",
}: {
  landingIconAnimationDuration?: number;
  id?: string;
}) {
  const [showText, setShowText] = useState(false);
  const wasVisibleRef = useRef(false);
  const revealTimeoutRef = useRef<number | null>(null);
  const revealRafRef = useRef<number | null>(null);
  // const descriptionText =
  //   "Designer and software developer creating products, brands, and media across tech, music, and film helping teams turn early ideas into shipped products.";

  const aboutTextArr = [
    {
      string: "Designer",
      color: "text-[#da70d6]",
    },
    {
      string: "and",
      color: "text-gray-100",
    },
    {
      string: "software",
      color: "text-[#da70d6]",
    },
    {
      string: "developer",
      color: "text-[#da70d6]",
    },
    {
      string: "creating",
      color: "text-gray-100",
    },
    {
      string: "products",
      color: "text-[#ffd800]",
    },
    {
      string: ",",
      color: "text-gray-100",
    },
    {
      string: "brands",
      color: "text-[#ffd800]",
    },
    {
      string: ",",
      color: "text-gray-100",
    },
    {
      string: "and",
      color: "text-gray-100",
    },
    {
      string: "media",
      color: "text-[#ffd800]",
    },
    {
      string: "across",
      color: "text-gray-100",
    },
    {
      string: "tech",
      color: "text-[#a2e6ff]",
    },
    {
      string: ",",
      color: "text-gray-100",
    },
    {
      string: "music",
      color: "text-[#a2e6ff]",
    },
    {
      string: ",",
      color: "text-gray-100",
    },
    {
      string: "and",
      color: "text-gray-100",
    },
    {
      string: "film",
      color: "text-[#a2e6ff]",
    },
    {
      string: "helping",
      color: "text-gray-100",
    },
    {
      string: "teams",
      color: "text-gray-100",
    },
    {
      string: "turn",
      color: "text-gray-100",
    },
    {
      string: "early",
      color: "text-gray-100",
    },
    {
      string: "ideas",
      color: "text-[#e1895e]",
    },
    {
      string: "into",
      color: "text-gray-100",
    },
    {
      string: "shipped",
      color: "text-[#e1895e]",
    },
    {
      string: "products.",
      color: "text-[#e1895e]",
    },
  ];

  const mergedTokens = aboutTextArr.reduce<
    Array<{ segments: Array<{ string: string; color: string }> }>
  >((acc, item) => {
    const isPunctuationOnly = /^[,.;:!?]+$/.test(item.string);
    if (isPunctuationOnly && acc.length > 0) {
      acc[acc.length - 1].segments.push({ ...item });
      return acc;
    }

    acc.push({ segments: [{ ...item }] });
    return acc;
  }, []);

  useEffect(() => {
    const section = document.getElementById(id);
    if (!section) return;

    const clearPendingReveal = () => {
      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current);
        revealTimeoutRef.current = null;
      }
      if (revealRafRef.current !== null) {
        window.cancelAnimationFrame(revealRafRef.current);
        revealRafRef.current = null;
      }
    };

    const replayReveal = () => {
      clearPendingReveal();
      setShowText(false);

      const delayMs = Math.max(0, landingIconAnimationDuration);
      if (delayMs === 0) {
        revealRafRef.current = window.requestAnimationFrame(() => {
          setShowText(true);
        });
        return;
      }

      revealTimeoutRef.current = window.setTimeout(() => {
        setShowText(true);
      }, delayMs);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          if (!wasVisibleRef.current) {
            wasVisibleRef.current = true;
            replayReveal();
          }
          return;
        }

        wasVisibleRef.current = false;
        clearPendingReveal();
        setShowText(false);
      },
      { threshold: 0.6 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearPendingReveal();
      wasVisibleRef.current = false;
    };
  }, [id, landingIconAnimationDuration]);
  {
    return (
      <>
        <Section
          className="about-section relative flex h-dvh max-h-none w-full shrink-0 snap-start flex-col items-center justify-center bg-gray-700"
          data-snap-target
          id={id}
          fullWidth
        >
          <div className="background-container absolute flex h-full w-full items-center justify-center"></div>
          <div className="banner-content gap-xl p-md flex w-full max-w-5xl flex-col items-start justify-between md:flex-row md:items-center">
            <h1 className="text">
              <StaggeredTextReveal
                className="max-w-prose text-left text-balance"
                revealBy="letter"
                staggerMs={80}
                text="Hojoon Kim"
                wrap={false}
              />
            </h1>

            <p className="roboto-mono min-h-14 max-w-prose text-left text-balance md:text-right">
                {mergedTokens.map((item, index) => (
                  <Fragment key={index}>
                    <span
                      className="inline-block font-mono font-semibold"
                      style={{
                        opacity: showText ? 1 : 0,
                        transform: showText
                          ? "translateY(0)"
                          : "translateY(12px)",
                        transition:
                          "opacity 500ms var(--bezier-fade), transform 500ms var(--bezier-movement-inertia-500)",
                        transitionDelay: showText ? `${index * 40}ms` : "0ms",
                      }}
                    >
                      {item.segments.map((segment, segmentIndex) => (
                        <span key={segmentIndex} className={segment.color}>
                          {segment.string}
                        </span>
                      ))}
                    </span>
                    {index < mergedTokens.length - 1 ? " " : null}
                  </Fragment>
                ))}
            </p>
          </div>
        </Section>
      </>
    );
  }
}
