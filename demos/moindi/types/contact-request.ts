export type ContactRequestReason =
  | "feature-request"
  | "technical"
  | "payment"
  | "reporting-content"
  | "other";

export interface ContactRequestInterface {
  id: string;
  name: string;
  email: string;
  reason: ContactRequestReason;
  note: string;
  screenshotUrl?: string;
  createdAt: Date;
}
