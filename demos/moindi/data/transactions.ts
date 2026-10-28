import type { TransactionInterface, TransactionStatus } from "../types";
import { moindiDemoProjects } from "./projects";
import { DEMO_CURRENT_USER_ID, moindiDemoUsers } from "./users";

// placeholder purchases by the demo user, until the real dummy data replaces them
export const moindiDemoTransactions: TransactionInterface[] = [
  placeholderTransaction(
    "tx_001",
    "artist-one-project",
    500,
    "completed",
    "2025-03-02T10:00:00Z",
  ),
  placeholderTransaction(
    "tx_002",
    "artist-three-project",
    250,
    "processing",
    "2025-04-18T15:40:00Z",
  ),
];

// walks the status history from cart up to the given status, a few minutes apart
function placeholderTransaction(
  id: string,
  projectId: string,
  shares: number,
  status: TransactionStatus,
  startedAt: string,
): TransactionInterface {
  const project = moindiDemoProjects.find((p) => p.id === projectId)!;
  const user = moindiDemoUsers.find((u) => u.id === DEMO_CURRENT_USER_ID)!;
  const steps: TransactionStatus[] = [
    "cart",
    "submitted",
    "processing",
    "completed",
  ];
  const start = new Date(startedAt).getTime();
  const statusHistory = steps
    .slice(0, steps.indexOf(status) + 1)
    .map((step, index) => ({
      status: step,
      updatedAt: new Date(start + index * 5 * 60_000),
    }));

  return {
    id,
    projectId,
    userId: user.id,
    shares,
    status,
    statusHistory,
    createdAt: new Date(start),
    updatedAt: statusHistory[statusHistory.length - 1].updatedAt,
    projectInfo: {
      projectName: project.title,
      projectPic: project.heroSrcSet,
      creatorName: project.creatorInfo.displayName,
      userName: user.displayName,
      userPic: user.profileSrcSet,
    },
  };
}
