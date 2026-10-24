export type TransactionStatus =
  | "cart" // "cart" is for when the user is in the process of buying shares
  | "submitted" // "submitted" is for when the transaction has been successfully created
  | "cancelled" // "cancelled" is for when the user cancels the transaction before being sent to the broker
  | "failed" // "failed" is for when the transaction fails
  | "processing" // "processing" is for when the transaction has been sent to the broker
  | "completed"; // "completed" is for when the transaction is certified by the broker

interface StatusHistory {
  status: TransactionStatus;
  updatedAt: Date;
}

export interface TransactionInterface {
  projectId: string;
  userId: string;
  shares: number;
  status: TransactionStatus;
  statusHistory: StatusHistory[];

  // these fields are auto-set from Firestore
  id: string;
  updatedAt: Date;
  createdAt: Date;
  projectInfo: {
    projectName: string;
    projectPic: string;
    creatorName: string;
    userName: string;
    userPic: string;
  };
}
