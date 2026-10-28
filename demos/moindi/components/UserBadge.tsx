import type { SizeTypes } from "@/demos/moindi/types";
import Link from "next/link";
import { ImageContainer } from "./ImageContainer";

const PHOTO_SIZE: Record<SizeTypes, string> = {
  large: "h-20 w-20",
  medium: "h-12 w-12",
  small: "h-10 w-10",
  tiny: "h-8 w-8",
};

const NAME_SIZE: Record<SizeTypes, string> = {
  large: "text-2xl",
  medium: "text-lg",
  small: "text-base",
  tiny: "text-sm",
};

type UserBadgeProps = {
  userId: string;
  userName: string;
  userImageSrcSet: string;
  size?: SizeTypes;
  // a border right of the photo, for project tiles
  border?: boolean;
  showName?: boolean;
  noLink?: boolean;
  // shows a follow toggle on hover when given
  isFollowing?: boolean;
  onToggleFollow?: (userId: string) => void;
};

// the demo has no other users' profile pages yet, so badges link to nothing unless they're the visitor's own
export function UserBadge({
  userId,
  userName,
  userImageSrcSet,
  size = "medium",
  border = false,
  showName = true,
  noLink = true,
  isFollowing = false,
  onToggleFollow,
}: UserBadgeProps) {
  const photo = (
    <div
      className={`user-badge__image-container ${PHOTO_SIZE[size]} ${border ? "box-content border-r-2" : ""}`}
    >
      <ImageContainer
        srcSet={userImageSrcSet}
        description={`${userName} avatar`}
      />
    </div>
  );

  return (
    <div className="user-badge group grid h-full w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-0">
      {noLink ? photo : <Link href="/moindi/demo/profile">{photo}</Link>}
      {showName && (
        <div
          className={`user-badge__name space-grotesk flex w-full min-w-0 items-center justify-between pl-(--standard-space) font-medium ${NAME_SIZE[size]}`}
        >
          <div className="min-w-0 grow overflow-hidden text-ellipsis whitespace-nowrap opacity-60">
            {userName}
          </div>
          {onToggleFollow && (
            <button
              type="button"
              className={`user-badge__follow-button m-1 flex w-fit px-0.5 text-xs uppercase opacity-0 transition-all duration-300 group-hover:bg-(--surface-primary) group-hover:text-(--text-on-surface-primary) group-hover:opacity-100 ${isFollowing ? "bg-(--surface-primary) text-(--text-on-surface-primary) opacity-100" : ""}`}
              onClick={() => onToggleFollow(userId)}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
