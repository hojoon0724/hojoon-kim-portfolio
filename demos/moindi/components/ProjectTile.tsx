import { projectUrl } from "@/demos/moindi/lib/format";
import type { ProjectInterface } from "@/demos/moindi/types";
import Link from "next/link";
import { ImageContainer } from "./ImageContainer";
import { LinkButton } from "./LinkButton";
import { StakeBreakdown } from "./StakeBreakdown";
import { SvgIcon } from "./SvgIcon";
import { UserBadge } from "./UserBadge";

type ProjectTileProps = {
  project: ProjectInterface;
  isFavorite: boolean;
  isFollowingCreator: boolean;
  onToggleFavorite: (projectId: string) => void;
  onToggleFollow: (userId: string) => void;
};

// a project on the explore page: creator, hero image with a favorite toggle, description, and share split
export function ProjectTile({
  project,
  isFavorite,
  isFollowingCreator,
  onToggleFavorite,
  onToggleFollow,
}: ProjectTileProps) {
  return (
    <div className="project-tile z-10 grid h-full max-w-128 grid-cols-1 grid-rows-[auto_auto_1fr_auto] border">
      <div className="project-tile__header flex w-full items-center border">
        <UserBadge
          userId={project.creatorId}
          userName={project.creatorInfo.displayName}
          userImageSrcSet={project.creatorInfo.profileSrcSet}
          border
          isFollowing={isFollowingCreator}
          onToggleFollow={onToggleFollow}
        />
      </div>
      <div className="project-tile__image group relative flex h-full items-center justify-center border p-(--standard-space-half)">
        <Link href={projectUrl(project.id)} className="h-full w-full">
          <ImageContainer
            srcSet={project.heroSrcSet}
            description={project.title}
          />
        </Link>
        <div
          className={`pointer-events-none absolute top-0 left-0 flex h-full w-full items-end justify-end transition-opacity duration-300 group-hover:opacity-100 ${isFavorite ? "opacity-100" : "opacity-0"}`}
        >
          <button
            type="button"
            className="pointer-events-auto m-(--standard-space) h-[clamp(2.5rem,12%,48px)] w-[clamp(2.5rem,12%,48px)] border bg-(--surface-tertiary)"
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(project.id)}
          >
            <SvgIcon
              iconName={isFavorite ? "heart" : "heart-o"}
              color="primary"
            />
          </button>
        </div>
      </div>
      <div className="project-tile__info flex w-full flex-col justify-between border p-(--standard-space)">
        <div className="project-tile__top mb-4">
          <h5 className="project-tile__title space-grotesk mb-2 font-semibold tracking-tight">
            <Link href={projectUrl(project.id)}>{project.title}</Link>
          </h5>
          <div className="line-clamp-5 text-sm">{project.description}</div>
        </div>
        <div className="flex flex-wrap gap-1">
          <div className="bg-(--surface-tertiary-medium) px-2 py-1 text-xs uppercase opacity-60">
            {project.projectType}
          </div>
          {project.genres.map((genre) => (
            <div
              key={genre}
              className="bg-(--surface-tertiary-feather) px-2 py-1 text-xs uppercase opacity-60"
            >
              {genre}
            </div>
          ))}
        </div>
      </div>
      <StakeBreakdown
        className="border"
        color="tertiary"
        small
        project={project}
      />
      <div className="project-tile__cta border">
        <LinkButton
          href={projectUrl(project.id)}
          variant="none"
          color="primary"
          size="small"
        >
          View Project
        </LinkButton>
      </div>
    </div>
  );
}
