"use client";

import { Button } from "./Button";
import { useDemoAuth } from "./DemoAuthProvider";

// a heart that adds the release to the visitor's favorites, filled while it's in them.
// release ids share user.favorites with project ids; the favorites page only lists projects for now
export function FavoriteReleaseButton({ releaseId }: { releaseId: string }) {
  const { user, updateUser } = useDemoAuth();
  if (!user) return null;

  const isFavorite = user.favorites.includes(releaseId);
  const label = isFavorite ? "Remove from Favorites" : "Add to Favorites";

  return (
    <Button
      iconName={isFavorite ? "heart" : "heart-o"}
      iconOnly
      variant="none"
      color="primary"
      title={label}
      aria-label={label}
      aria-pressed={isFavorite}
      onClick={() =>
        updateUser((u) => ({
          ...u,
          favorites: isFavorite
            ? u.favorites.filter((id) => id !== releaseId)
            : [...u.favorites, releaseId],
        }))
      }
    />
  );
}
