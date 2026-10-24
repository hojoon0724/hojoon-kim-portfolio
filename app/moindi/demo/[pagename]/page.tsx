import { notFound } from "next/navigation";
import { ProjectsPage } from "@/demos/moindi/components";

// every page in the demo after the landing page, keyed by its url: /moindi/demo/[pagename].
// add an entry here to add a page
const demoPages: Record<string, () => React.ReactNode> = {
  projects: ProjectsPage,
};

// builds every demo page ahead of time
export function generateStaticParams() {
  return Object.keys(demoPages).map((pagename) => ({ pagename }));
}

// a pagename that isn't in demoPages is a 404 instead of an attempt to render it
export const dynamicParams = false;

export default async function MoindiDemoSubPage({
  params,
}: PageProps<"/moindi/demo/[pagename]">) {
  const { pagename } = await params;
  const DemoPage = demoPages[pagename];

  if (!DemoPage) notFound();

  return <DemoPage />;
}
