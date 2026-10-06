import { ProjectPageContainer } from "@/components/6-pages";
import { Section } from '@/components/1-atoms';

export default function RcnmPage() {
  return (
    <ProjectPageContainer projectId="rcnm">
      <Section className="min-h-120 border">
        <h1>Database</h1>
      </Section>
      <Section className="min-h-120 border">
        <h1>Design</h1>
      </Section>
      <Section className="min-h-120 border">
        <h1>Production</h1>
      </Section>
      <Section className="min-h-120 border">
        <h1>Capture</h1>
      </Section>
    </ProjectPageContainer>
  );
}
