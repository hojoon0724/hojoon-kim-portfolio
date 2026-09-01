import { ToolIcon } from "@/components/1-atoms";
import { CaseStudy } from "@/types";
import Image from "next/image";

interface CaseStudyDevProps {
  project: CaseStudy;
}

export function CaseStudyDev({ project }: CaseStudyDevProps) {
  return (
    <div className="case-study-dev content-max-width py-2xl border-b">
      {Object.entries(project).map(([key, value]) => {
        const valueToRender = (() => {
          switch (key) {
            case "thumbnail":
              return (
                <div className="thumbnail-container border">
                  <Image
                    src={project.thumbnail}
                    alt={`${project.title} thumbnail`}
                    width={400}
                    height={300}
                  />
                </div>
              );
            case "toolsIds":
              return (
                <div className="tools-container mb-lg flex gap-2">
                  {project.toolsIds.map((toolId) => (
                    <ToolIcon key={toolId} toolId={toolId} pixelSize={64} />
                  ))}
                </div>
              );
            case "bulletPoints":
              return (
                <ul className="bullet-points-container mb-lg list-disc pl-6">
                  {project.bulletPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              );
            case "collaboration":
              return (
                <ul className="collaboration-container mb-lg list-disc pl-6">
                  {project.collaboration.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              );
            case "scope":
              return (
                <ul className="scope-container mb-lg list-disc pl-6">
                  {project.scope.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              );
            case "highlights":
              return (
                <ul className="highlights-container mb-lg list-disc pl-6">
                  {project.highlights.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              );
            case "callouts":
              return (
                <ul className="callouts-container mb-lg list-disc pl-6">
                  {project.callouts.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              );
            case "proofPoints":
              return (
                <div className="proof-points-container mb-lg pb-xl">
                  {project.proofPoints.map((item, index) => (
                    <div key={index} className="mb-md">
                      <div className="font-bold">{item.label}</div>
                      <div>{item.detail}</div>
                    </div>
                  ))}
                </div>
              );
            case "pageFlow":
              return (
                <div className="page-flow-container mb-lg pb-xl">
                  {project.pageFlow.map((item, index) => (
                    <div key={index} className="mb-md">
                      <div className="font-bold">{item.sectionTitle}</div>
                      <div className="mb-lg font-sans">
                        <span className="bg-gray-30 px-2 py-1 text-2xl font-bold text-black">
                          {item.goal}
                        </span>
                      </div>
                      <div className="">
                        Layout:{" "}
                        <span className="roboto-flex">{item.layout}</span>
                      </div>
                      <div className="">
                        Content Focus: {item.contentFocus.join(", ")}
                      </div>
                      <div className="">Photo Direction:</div>
                      <div className="roboto-flex">
                        {item.photoDirection.join(", ")}
                      </div>
                      <div className="">
                        Caption Idea:{" "}
                        <span className="roboto-flex">{item.captionIdea}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            case "sections":
              return (
                <div className="sections-flow-container mb-lg pb-xl">
                  {project.sections.map((item, index) => (
                    <div key={index} className="mb-md">
                      <div className="font-bold">{item.id}</div>
                      <div className="roboto-flex text-xl font-bold">
                        {item.heading}
                      </div>
                      <div className="font-bold">Summary: {item.summary}</div>
                      <div className="font-bold">
                        {item.bullets.map((bullet, index) => (
                          <div key={index}>{bullet}</div>
                        ))}
                      </div>
                      <div className="font-bold">
                        Visual: {item.visualNarrative}
                      </div>
                      <div className="font-bold">
                        {item.suggestedAssets.map((asset, index) => (
                          <div key={index}>{asset}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            default:
              return JSON.stringify(value);
          }
        })();

        return (
          <div
            key={key}
            className="case-study-dev-row gap-xl px-xl roboto-mono grid grid-cols-[14ch_1fr]"
          >
            <div className="key text-left">{key}</div>
            <div className="value">{valueToRender}</div>
          </div>
        );
      })}
    </div>
  );
}
