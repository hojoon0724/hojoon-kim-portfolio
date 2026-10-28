"use client";

import { FavoritesProjectTile } from "@/demos/moindi/components/FavoritesProjectTile";
import { useDemoAuth } from "@/demos/moindi/components/DemoAuthProvider";
import { moindiDemoProjects } from "@/demos/moindi/data/projects";

// the projects the visitor has hearted on the explore page
export function FavoritesPage() {
  const { user } = useDemoAuth();
  if (!user) return null;

  const favorites = moindiDemoProjects.filter((project) =>
    user.favorites.includes(project.id),
  );

  return (
    <div className="flex w-full flex-col gap-(--standard-space) p-(--standard-space)">
      <h2 className="w-full text-left">My Faves</h2>
      {favorites.length === 0 ? (
        <p>No Favorites Found :(</p>
      ) : (
        <div className="grid w-full grid-cols-1 gap-(--standard-space) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((project) => (
            <FavoritesProjectTile key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
