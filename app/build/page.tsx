"use client";

import { MarkdownRenderer } from "@/components/1-atoms";
import { ExpandedProjectSummary } from "@/components/4-organisms";
import { projectOverviewData } from "@/data";
import { sampleMd } from "@/data/sample-md";

const projectData = projectOverviewData.find(
  (project) => project.id === "rcnm",
);

export default function BuildPage() {
  if (!projectData) {
    return null;
  }
  return (
    <>
      <ExpandedProjectSummary key={projectData.id} project={projectData} />
      <div className="grid h-full w-full grid-cols-1 items-start justify-start">
        <div className="renderer col-span-4">
          <MarkdownRenderer content={sampleMd} animate={true} finishByMs={1000} />
        </div>
        <div className="original-text col-span-2 flex w-200 flex-col gap-4 font-mono">
          <div>{`# Main Heading`}</div>
          <div>{`## Secondary Heading`}</div>
          <div>{`This is a normal paragraph with **bold text**, *italic text*, and ***bold italic text***.`}</div>
          <div>{`You can also have **bold text with *nested italic text*** inside it.`}</div>
          <div>{`Or *italic text with **nested bold text*** inside it.`}</div>
          <div>{`### Lists`}</div>
          <div>{`- First item`}</div>
          <div>{`- Second item with **bold text**`}</div>
          <div>{`- Third item with *italic text*`}</div>
          <div>{`1. First numbered item`}</div>
          <div>{`2. Second numbered item`}</div>
          <div>{`3. Third numbered item`}</div>
          <div>{`### Blockquote`}</div>
          <div>{`> This is a blockquote.`}</div>
          <div>{`> It can span multiple lines.`}</div>
        </div>
      </div>
    </>
  );
}
