import { countryFlag, countryName } from "@/demos/moindi/lib/format";
import type { UserInterface } from "@/demos/moindi/types";
import { ImageContainer } from "./ImageContainer";
import { SocialLinks } from "./SocialLinks";
import { SvgIcon } from "./SvgIcon";
import { UserEarnings } from "./UserEarnings";
import { UserStats } from "./UserStats";

// banner, then stats on either side of the profile photo, name and location.
// the original's state-name pipe, edit-on-hover button and post feed aren't ported
export function UserProfileHeader({ user }: { user: UserInterface }) {
  const { address } = user;

  return (
    <div className="user-profile__top relative w-full border">
      <div className="user-profile__top-banner h-[clamp(200px,25svw,320px)] w-full border">
        <ImageContainer
          srcSet={user.bannerSrcSet}
          description={user.displayName}
          square={false}
          focalPoint="80% 70%"
        />
      </div>
      <div className="user-profile__bottom-container grid w-full grid-cols-1 justify-center gap-(--standard-space-double) border pb-(--standard-space) md:grid-cols-[minmax(25%,1fr)_minmax(30%,auto)_minmax(25%,1fr)] md:gap-0">
        <UserStats className="order-3 md:order-1" user={user} />
        <div className="user-profile__bottom-profile-photo order-1 flex w-full flex-col items-center md:order-2">
          <div className="profile-photo-container -mt-[clamp(60px,10svw,100px)] h-[clamp(120px,20svw,200px)] w-[clamp(120px,20svw,200px)] border-2 bg-(--surface-base) p-(--standard-space-half)">
            <ImageContainer
              srcSet={user.profileSrcSet}
              description={user.displayName}
            />
          </div>
          <div className="user-profile__name-location-container space-grotesk relative flex flex-col items-center justify-start p-(--standard-space) text-center">
            <div className="profile-name-container text-center text-lg font-semibold text-pretty">
              {user.displayName ? (
                <span>{user.displayName}</span>
              ) : (
                <>
                  <span>{user.firstName}</span>{" "}
                  <span className="whitespace-nowrap">{user.lastName}</span>
                </>
              )}
            </div>
            <div className="flex w-full items-center justify-center text-nowrap">
              <div className="-ml-2 h-8 w-8 opacity-60">
                <SvgIcon iconName="map-marker" />
              </div>
              <div className="user-profile__location flex items-center gap-[1ch]">
                {address.city && (
                  <span className="capitalize opacity-60">{address.city},</span>
                )}
                {address.state && (
                  <span className="uppercase opacity-60">{address.state}</span>
                )}
                {address.countryCode && (
                  <span
                    className="text-xl"
                    title={countryName(address.countryCode)}
                  >
                    {countryFlag(address.countryCode)}  
                  </span>
                )}
              </div>
            </div>
            {user.bio && (
              <p className="mt-(--standard-space) max-w-prose text-sm text-pretty">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <UserEarnings className="order-4" user={user} />
        <SocialLinks
          className="socials-block order-1 md:order-4 md:col-span-3"
          socials={user.socials}
        />
      </div>
    </div>
  );
}
