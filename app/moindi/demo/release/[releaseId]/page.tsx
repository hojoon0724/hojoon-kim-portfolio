import { getReleaseById, storeReleases } from "@/demos/moindi/data/store";
import { ReleasePage } from "@/demos/moindi/pages";
import { notFound } from "next/navigation";

// builds a page for every release in the store ahead of time
export function generateStaticParams() {
  return storeReleases.map((release) => ({ releaseId: release.id }));
}

// an id that isn't in the store is a 404
export const dynamicParams = false;

export default async function MoindiDemoRelease({
  params,
}: PageProps<"/moindi/demo/release/[releaseId]">) {
  const { releaseId } = await params;
  const release = getReleaseById(releaseId);

  if (!release) notFound();

  return <ReleasePage release={release} />;
}
