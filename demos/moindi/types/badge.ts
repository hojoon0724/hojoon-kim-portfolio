type ProgressShowType = "percentage" | "count";
// show count when they're small numbers. count would be like "3/10 projects backed"
// show percentage when the actual numbers don't matter much and are too big
// 256/356 days streak feels too abstract than "72% to reach 1 year"
// however, all awards will show a progress bar with percentage internally

export interface BadgeFamily {
  id: string;
  badgeSet: BadgeInterface[];
  progressShowType: ProgressShowType;
}

export interface BadgeInterface {
  id: string;
  title: string;
  description: string;
  hint: string;
  iconSrcSet: string;
}
