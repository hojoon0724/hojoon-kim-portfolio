import { ensrq, moindi, rcnm } from "@/data/case-studies";
import { CaseStudy } from "@/types";
import { ToolIcon } from "@/components/1-atoms";

export function WorkSummaryLanding() {
  const projects = [ensrq, moindi, rcnm] as CaseStudy[];

  return (
    <div className="works-summary-landing content-max-width">
      {projects.map((project) => (
        <div
          key={project.id}
          className="project-summary gap-y-xl py-xl px-xl grid grid-cols-[auto_1fr] gap-4 border-b font-mono"
        >
          <div className="key text-right">id</div>
          <div className="id">{project.id}</div>
          <div className="key text-right">title</div>
          <div className="title">{project.title}</div>
          <div className="key text-right">description</div>
          <div className="description">{project.description}</div>
          <div className="key text-right">thumbnail</div>
          <div className="thumbnail">{project.thumbnail}</div>
          <div className="key text-right">position</div>
          <div className="position">{project.position}</div>
          <div className="key text-right">caseStudyOf</div>
          <div className="caseStudyOf">{project.caseStudyOf}</div>
          <div className="key text-right">bulletPoints</div>
          <div className="bulletPoints">
            {project.bulletPoints.map((point, index) => (
              <span key={index}>
                • {point}
                <br />
              </span>
            ))}
          </div>
          <div className="key text-right">tools</div>
          <div className="tools flex gap-2 flex-wrap">
            {project.toolsIds.map((toolId) => (
              <ToolIcon key={toolId} toolId={toolId} pixelSize={64} />
            ))}
          </div>
          <div className="key text-right">date</div>
          <div className="date">{project.date}</div>
        </div>
      ))}
    </div>
  );
}
