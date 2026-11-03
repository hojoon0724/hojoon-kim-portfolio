"use client";

import { CountUp } from "@/components/1-atoms";
import { moindiDemoUsers } from "@/demos/moindi/data/users";
import { compactNumber } from "@/demos/moindi/lib/format";
import type { UserInterface } from "@/demos/moindi/types";
import { SvgIcon } from "./SvgIcon";

// one icon, number and label in a profile stat row
export function ProfileStat({
  iconName,
  value,
  label,
  prefix = "",
}: {
  iconName: string;
  value: number;
  label: string;
  prefix?: string;
}) {
  const { number, suffix } = compactNumber(value);
  return (
    <div className="stats-container flex flex-col items-center justify-start">
      <div className="h-6 w-6 md:h-8 md:w-8">
        <SvgIcon iconName={iconName} />
      </div>
      <div
        className="stats-value space-mono text-xl font-semibold md:text-lg lg:text-2xl"
        title={suffix ? `${prefix}${value.toLocaleString("en-US")}` : undefined}
      >
        {prefix}
        <CountUp targetNumber={number} startAnimation />
        {suffix}
      </div>
      <div className="stats-label">{label}</div>
    </div>
  );
}

// the stats grid both sides of the profile header share
export function ProfileStatRow({
  justify,
  children,
}: {
  justify: "start" | "end";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`space-mono flex h-full w-full items-center justify-center text-center text-sm ${justify === "start" ? "md:justify-start" : "md:justify-end"}`}
    >
      <div className="grid w-full max-w-[38ch] grid-cols-3 items-start justify-start gap-(--standard-space-double) px-(--standard-space) md:w-auto md:max-w-none md:gap-(--standard-space)">
        {children}
      </div>
    </div>
  );
}

// comments, favorites and fans, the left side of the profile header.
// the demo has no comments yet, and the original's fans list modal isn't ported
export function UserStats({
  user,
  className = "",
}: {
  user: UserInterface;
  className?: string;
}) {
  const fans = moindiDemoUsers.filter((fan) =>
    fan.following.includes(user.id),
  ).length;

  return (
    <div className={className}>
      <ProfileStatRow justify="start">
        <ProfileStat iconName="medal" value={1} label="Ranking" />
        <ProfileStat
          iconName="heart"
          // value={user.favorites.length}
          value={67}
          label="Favorites"
        />
        <ProfileStat
          iconName="user-star"
          value={978398}
          label={fans === 1 ? "Fan" : "Fans"}
        />
      </ProfileStatRow>
    </div>
  );
}
