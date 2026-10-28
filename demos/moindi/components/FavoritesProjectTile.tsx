import { projectUrl } from "@/demos/moindi/lib/format";
import type { ProjectInterface } from "@/demos/moindi/types";
import { ImageContainer } from "./ImageContainer";
import { LinkButton } from "./LinkButton";

// a favorited project: image, title, and a link to it
export function FavoritesProjectTile({
  project,
}: {
  project: ProjectInterface;
}) {
  return (
    <div className="favorites-tile grid grid-cols-1 border">
      <div className="border p-(--standard-space)">
        <ImageContainer
          srcSet={project.heroSrcSet}
          description={project.title}
        />
      </div>
      <div className="border p-(--standard-space)">{project.title}</div>
      <LinkButton
        href={projectUrl(project.id)}
        className="border"
        variant="none"
        color="primary"
        size="small"
      >
        View Project
      </LinkButton>
    </div>
  );
}
