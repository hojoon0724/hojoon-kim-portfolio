import type { UserInterface } from "./user";

// the demo has no auth, so the signed-in user is just a demo user. null is signed out, undefined is still loading
export type AuthUserResponse = UserInterface | null | undefined;
export type PrimitiveTypes = string | number | boolean | object;
export type SizeTypes = "large" | "medium" | "small" | "tiny";
export type ColorTypes = "primary" | "secondary" | "tertiary";
export type FullColorTypes =
  | ColorTypes
  | "default"
  | "error"
  | "success"
  | "info"
  | "inverse";
export type ContentStatus = "draft" | "available" | "archived";
export type FormatTypes = "fraction" | "percentage" | "string" | "currency";
export type AlignmentTypes = "center" | "between" | "around" | "left" | "right";
export type InputState = "default" | "loading" | "error" | "success";
export interface ChartSeriesItem {
  count: number;
  maxCount: number;
  label?: string;
  link?: string;
  specialRank?: number;
  highlighted?: boolean;
}
