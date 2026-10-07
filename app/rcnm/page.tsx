import { ProjectPageContainer } from "@/components/6-pages";
import Link from "next/link";

export default function RcnmPage() {
  return (
    <ProjectPageContainer projectId="rcnm">
      <Link
        href="/rcnm/database-architecture"
        className=""
        transitionTypes={["project-forward"]}
      >
        <h1>Database Architecture</h1>
      </Link>
      <Link
        href="/rcnm/visual-identity"
        className=""
        transitionTypes={["project-forward"]}
      >
        <h1>Visual Identity</h1>
      </Link>
      <Link
        href="/rcnm/stage-lighting"
        className=""
        transitionTypes={["project-forward"]}
      >
        <h1>Stage & Lighting</h1>
      </Link>
      <Link
        href="/rcnm/video-production"
        className=""
        transitionTypes={["project-forward"]}
      >
        <h1>Video Production</h1>
      </Link>
    </ProjectPageContainer>
  );
}
