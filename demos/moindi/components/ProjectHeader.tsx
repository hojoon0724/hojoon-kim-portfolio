import { CountdownClock } from "./CountdownClock";

// a bordered title bar with the project's countdown on the right
export function ProjectHeader({ title }: { title: string }) {
  return (
    <div className="block-title flex w-full flex-col items-center justify-start gap-(--standard-space) border px-(--standard-space) py-(--standard-space-half) text-left md:flex-row md:justify-between">
      <div className="title-block-left-group w-full md:w-auto">
        <h2 className="space-grotesk mb-0! w-full leading-none">{title}</h2>
      </div>
      <div className="title-block-right-group w-full md:w-auto">
        <div className="project-deadline-container flex w-full flex-col items-start md:items-end">
          <CountdownClock />
        </div>
      </div>
    </div>
  );
}
