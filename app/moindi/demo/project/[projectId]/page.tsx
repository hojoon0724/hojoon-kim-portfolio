import { moindiDemoProjects } from "@/demos/moindi/data/projects";
import { ProjectPage } from "@/demos/moindi/pages";
import { notFound } from "next/navigation";

// builds a page for every demo project ahead of time
export function generateStaticParams() {
  return moindiDemoProjects.map((project) => ({ projectId: project.id }));
}

// an id that isn't a demo project is a 404
export const dynamicParams = false;

export default async function MoindiDemoProject({
  params,
}: PageProps<"/moindi/demo/project/[projectId]">) {
  const { projectId } = await params;
  const project = moindiDemoProjects.find((p) => p.id === projectId);

  if (!project) notFound();

  return <ProjectPage project={project} />;
}
