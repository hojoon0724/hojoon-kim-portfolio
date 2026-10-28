import type { UserInterface } from "@/demos/moindi/types";
import { ImageContainer } from "./ImageContainer";
import { SvgIcon } from "./SvgIcon";

// banner, profile photo, name and location. the original's user-stats column (followers, investments)
// and the flag/state-name pipes aren't ported
export function UserProfileHeader({ user }: { user: UserInterface }) {
  const { address } = user;

  return (
    <div className="user-profile__top relative w-full border">
      <div className="h-[clamp(200px,25svw,320px)] w-full border">
        <ImageContainer
          srcSet={user.bannerSrcSet}
          description={user.displayName}
          square={false}
        />
      </div>
      <div className="flex flex-col items-center">
        <div className="-mt-[clamp(60px,10svw,100px)] h-[clamp(120px,20svw,200px)] w-[clamp(120px,20svw,200px)] border-2 bg-(--surface-base) p-(--standard-space-half)">
          <ImageContainer
            srcSet={user.profileSrcSet}
            description={user.displayName}
          />
        </div>
        <div className="space-grotesk flex flex-col items-center p-(--standard-space) text-center">
          <div className="text-lg font-semibold text-pretty">
            {user.displayName || `${user.firstName} ${user.lastName}`}
          </div>
          {address.city && (
            <div className="flex items-center justify-center text-nowrap opacity-60">
              <div className="-ml-2 h-8 w-8">
                <SvgIcon iconName="map-marker" />
              </div>
              <span className="capitalize">{address.city},</span>
              <span className="ml-[1ch] uppercase">{address.state}</span>
            </div>
          )}
          {user.bio && (
            <p className="mt-(--standard-space) max-w-prose text-sm text-pretty">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
