"use client";

import { moindiDemoTransactions } from "@/demos/moindi/data/transactions";
import type { UserInterface } from "@/demos/moindi/types";
import { ProfileStat, ProfileStatRow } from "./UserStats";

// the right side of the profile header: earnings, likes and visitors for artists,
// purchases, likes and comments for everyone else. the demo has no comments yet
export function UserEarnings({
  user,
  className = "",
}: {
  user: UserInterface;
  className?: string;
}) {
  const purchases = moindiDemoTransactions.filter(
    (t) =>
      t.userId === user.id && t.status !== "cancelled" && t.status !== "failed",
  ).length;

  return (
    <div className={className}>
      <ProfileStatRow justify="end">
        {user.isArtist ? (
          <>
            <ProfileStat
              iconName="cash"
              prefix="$"
              value={Math.round(user.earningsTotalInCents / 100)}
              label="Earnings"
            />
            <ProfileStat
              iconName="thumbs-up"
              value={user.totalLikesReceived}
              label="Likes"
            />
            <ProfileStat
              iconName="eye"
              value={user.profileViewsCount}
              label="Visitors"
            />
          </>
        ) : (
          <>
            <ProfileStat iconName="cart" value={purchases} label="Purchases" />
            <ProfileStat
              iconName="heart"
              value={user.totalLikesReceived}
              label="Likes"
            />
            <ProfileStat iconName="medal" value={0} label="Comments" />
          </>
        )}
      </ProfileStatRow>
    </div>
  );
}
