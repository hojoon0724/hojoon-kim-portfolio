"use client";

import { Fragment, useEffect, useState } from "react";

import { StaggeredReveal } from "@/components/1-atoms";
import { ExpandedProjectSummary } from "@/components/4-organisms";
import { projectOverviewData } from "@/data";

const projectData = projectOverviewData.find(
  (project) => project.id === "rcnm",
);

export default function BuildPage() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowText(true), 0);
  }, []);
  // const coloredDescriptionArr = [
  //   {
  //     string: "Designer",
  //     color: "text-[#da70d6]",
  //   },
  //   {
  //     string: "and",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "software",
  //     color: "text-[#da70d6]",
  //   },
  //   {
  //     string: "developer",
  //     color: "text-[#da70d6]",
  //   },
  //   {
  //     string: "creating",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "products",
  //     color: "text-[#ffd800]",
  //   },
  //   {
  //     string: ",",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "brands",
  //     color: "text-[#ffd800]",
  //   },
  //   {
  //     string: ",",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "and",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "media",
  //     color: "text-[#ffd800]",
  //   },

  //   {
  //     string: "across",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "tech",
  //     color: "text-[#a2e6ff]",
  //   },
  //   {
  //     string: ",",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "music",
  //     color: "text-[#a2e6ff]",
  //   },
  //   {
  //     string: ",",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "and",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "film",
  //     color: "text-[#a2e6ff]",
  //   },
  //   {
  //     string: "helping",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "teams",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "turn",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "early",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "ideas",
  //     color: "text-[#e1895e]",
  //   },
  //   {
  //     string: "into",
  //     color: "text-gray-100",
  //   },
  //   {
  //     string: "shipped",
  //     color: "text-[#e1895e]",
  //   },{
  //     string: "products.",
  //     color: "text-[#e1895e]",
  //   },
  // ];

  const coloredDescriptionArr = [
    {
      string: "Designer",
      color: "text-[#da70d6]",
    },
    {
      string: "and",
      color: "text-gray-100",
    },
    {
      string: "software developer",
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
      string: ", and",
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
      string: ", and",
      color: "text-gray-100",
    },
    {
      string: "film",
      color: "text-[#a2e6ff]",
    },
    {
      string: "helping teams turn early",
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
      string: "shipped products.",
      color: "text-[#e1895e]",
    },
  ];

  const wordTokens = coloredDescriptionArr.flatMap((item) => {
    const tokens = item.string.match(/[^\s]+/g) ?? [];
    return tokens.map((token) => ({
      string: token,
      color: item.color,
    }));
  });

  const mergedTokens = wordTokens.reduce<
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

  const animatedTokens = mergedTokens.map((item, index) => ({
    ...item,
    revealIndex: index,
  }));

  if (!projectData) {
    return null;
  }
  return (
    <>
      <div className="p-xl h-dvh w-full bg-slate-800">
        <div className="text-reveal-test container flex flex-col border-4 border-black text-right font-mono">
          {mergedTokens.map((item, index) => (
            <div key={index}>{JSON.stringify(item)}</div>
            // <span key={index} className={item.segments[0].color}>
            //   {item.segments[0].string}
            // </span>
          ))}
          <div className="roboto-mono h-full min-h-14 max-w-prose border text-left text-balance md:text-right">
            {animatedTokens.map((item, index) => (
              <Fragment key={index}>
                <span
                  className="inline-block border font-mono font-bold"
                  style={{
                    opacity: showText ? 1 : 0,
                    transform: showText ? "translateY(0)" : "translateY(12px)",
                    transition:
                      "opacity 500ms var(--bezier-fade), transform 500ms var(--bezier-movement-inertia-500)",
                    transitionDelay: showText
                      ? `${item.revealIndex * 40}ms`
                      : "0ms",
                  }}
                >
                  {item.segments.map((segment, segmentIndex) => (
                    <span key={segmentIndex} className={segment.color}>
                      {segment.string}
                    </span>
                  ))}
                </span>
                {index < animatedTokens.length - 1 ? " " : null}{" "}
                {`index: ${index} // segmentCount: ${animatedTokens.length} // ${index < animatedTokens.length} -----
                `}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="flex min-h-dvh items-center justify-center">
        <div className="w-200">
          <StaggeredReveal
            className="flex flex-col gap-16 border p-16"
            animationClassName="animation-fade-in-up-16"
            delayMs={100}
            staggerMs={40}
            finishByMs={0}
            threshold={0.1}
            resetOnLeave={true}
          >
            {animatedTokens.map((item, index) => (
              <span key={index} className="inline-block font-mono font-bold">
                {item.segments.map((segment, segmentIndex) => (
                  <span key={segmentIndex} className={`${segment.color}`}>
                    {segment.string}
                  </span>
                ))}
              </span>
            ))}
          </StaggeredReveal>
        </div>
      </div>
      <div className="h-dvh w-full bg-amber-100"></div>
      <ExpandedProjectSummary key={projectData.id} project={projectData} />
    </>
  );
}
