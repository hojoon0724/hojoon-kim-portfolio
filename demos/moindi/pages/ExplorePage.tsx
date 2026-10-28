"use client";

import { ProjectTile } from "@/demos/moindi/components/ProjectTile";
import { useDemoAuth } from "@/demos/moindi/components/DemoAuthProvider";
import { moindiDemoProjects } from "@/demos/moindi/data/projects";

// adds the id if it's missing, removes it if it's there
function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

// every public project as a tile. the original's filters and map view aren't ported
export function ExplorePage() {
  const { user, updateUser } = useDemoAuth();
  if (!user) return null;

  const projects = moindiDemoProjects.filter(
    (project) => project.public && !project.disabled,
  );

  return (
    <div className="explore-container flex w-full flex-col items-start gap-(--standard-space) p-(--standard-space)">
      <h2 className="w-full text-left">Explore Projects</h2>
      {projects.length === 0 ? (
        <p>No Projects Found :(</p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-(--standard-space) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectTile
              key={project.id}
              project={project}
              isFavorite={user.favorites.includes(project.id)}
              isFollowingCreator={user.following.includes(project.creatorId)}
              onToggleFavorite={(id) =>
                updateUser((u) => ({
                  ...u,
                  favorites: toggle(u.favorites, id),
                }))
              }
              onToggleFollow={(id) =>
                updateUser((u) => ({
                  ...u,
                  following: toggle(u.following, id),
                }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
