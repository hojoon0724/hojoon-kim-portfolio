import { moindiDemoProjects } from "@/demos/moindi/data/projects";

// the project tiles shown after the landing page: every public offering
export function ProjectsPage() {
  const projects = moindiDemoProjects.filter(
    (project) => project.public && !project.disabled,
  );

  return (
    <div className="px-md lg:px-xl py-xl gap-xl mx-auto flex w-full max-w-7xl flex-col">
      <div className="gap-sm flex flex-col">
        <h1 className="text-3xl font-bold md:text-5xl">Discover artists</h1>
        <p className="max-w-prose text-lg text-pretty">
          Own a share of the music you believe in. Pick an offering, choose how
          much of it you want, and back the artist directly.
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="font-(family-name:--font-space-mono) text-sm">
          No offerings yet.
        </p>
      ) : (
        <ul className="gap-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const soldPercent = Math.round(
              (project.soldShares / project.availableShares) * 100,
            );

            return (
              <li
                key={project.id}
                className="gap-sm p-md flex flex-col border border-gray-200"
              >
                <div className="aspect-square w-full bg-gray-100" />
                <span className="font-(family-name:--font-space-mono) text-xs uppercase">
                  {project.projectType} · {project.genres.join(", ")}
                </span>
                <h2 className="text-xl font-bold">{project.title}</h2>
                <span className="text-sm">
                  {project.creatorInfo.displayName}
                </span>

                <div className="gap-xs pt-sm mt-auto flex flex-col">
                  <div className="h-1.5 w-full bg-gray-200">
                    <div
                      className="bg-moindi-orange h-full"
                      style={{ width: `${Math.min(soldPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-(family-name:--font-space-mono) text-xs">
                    <span>{soldPercent}% funded</span>
                    <span>
                      ${project.projectGoal.toLocaleString("en-US")} goal
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
