// stand-in for a demo page that hasn't been built yet
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex w-full flex-col gap-(--standard-space) p-(--standard-space)">
      <h1 className="space-mono text-3xl font-bold uppercase">{title}</h1>
      <p className="text-sm">This page hasn’t been built yet.</p>
    </div>
  );
}
