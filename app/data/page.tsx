import { Section } from "@/components/1-atoms";
import { WorkGallery } from "@/components/4-organisms";
import { CaseStudyDev } from "@/components/5-sections";
import { ensrq, moindi, rcnm } from "@/data/case-studies";
import { CaseStudy } from "@/types/case-study";

export default function DataPage() {
  const projects = [ensrq, moindi, rcnm] as CaseStudy[];
  return (
    <>
      {projects.map((project) => (
        <CaseStudyDev key={project.id} project={project} />
      ))}

      <Section
        className="work-hover-gallery no-main-spacing hidden overflow-clip lg:h-[min(100vh_auto)]"
        id="work"
        fullWidth
      >
        <WorkGallery />
      </Section>
    </>
  );
}
