export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceInCents: number;
  currency: string;
  description: string;
  popular?: boolean;
  savingsText?: string;
}

type CreditTransactionType = "purchase" | "spend" | "refund" | "bonus";

type CreditTransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

export interface CreditTransactionInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  status: CreditTransactionStatus;
  description: string;
  priceInCents?: number; // if buying credits
}
