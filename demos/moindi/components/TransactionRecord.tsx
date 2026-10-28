import {
  formatCurrency,
  formatDateTime,
  projectUrl,
} from "@/demos/moindi/lib/format";
import type {
  TransactionInterface,
  TransactionStatus,
} from "@/demos/moindi/types";
import Link from "next/link";
import { ImageContainer } from "./ImageContainer";

const STATUS_CLASS: Record<TransactionStatus, string> = {
  cart: "bg-gray-300 text-gray-700",
  submitted: "bg-(--surface-secondary) text-(--text-on-surface-secondary)",
  cancelled: "border-2 bg-(--surface-base) text-(--text-on-surface-base)",
  failed: "bg-(--surface-error) text-(--text-on-surface-error)",
  processing: "bg-(--surface-primary) text-(--text-on-surface-primary)",
  completed: "bg-(--surface-success) text-(--text-on-surface-success)",
};

// project, artist and status: the activity page's accordion header
export function TransactionHeader({
  transaction,
}: {
  transaction: TransactionInterface;
}) {
  return (
    <div className="transaction-header flex w-full flex-col items-start justify-between bg-(--surface-base) py-(--standard-space) pl-(--standard-space) sm:flex-row sm:items-center">
      <div className="space-grotesk flex flex-col items-start gap-0 lg:flex-row lg:gap-4">
        <p className="text-xl font-bold text-nowrap">
          {transaction.projectInfo.projectName}
        </p>
        <p className="text-nowrap">{transaction.projectInfo.creatorName}</p>
      </div>
      <div className="flex items-center justify-end">
        <div
          className={`px-3 py-1 text-[0.6rem] font-bold uppercase sm:text-xs ${STATUS_CLASS[transaction.status]}`}
        >
          {transaction.status}
        </div>
      </div>
    </div>
  );
}

// a purchase's details: project image, shares and price, and its status timeline
export function TransactionRecord({
  transaction,
  hideHeader = false,
}: {
  transaction: TransactionInterface;
  hideHeader?: boolean;
}) {
  return (
    <div className="transaction-record w-full">
      {!hideHeader && <TransactionHeader transaction={transaction} />}
      <div className="transaction-details grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 xl:grid-cols-10">
        <Link
          href={projectUrl(transaction.projectId)}
          className="project-image col-span-1 aspect-square border lg:col-span-3"
        >
          <ImageContainer srcSet={transaction.projectInfo.projectPic} />
        </Link>
        <div className="transaction-info-container col-span-1 grid grid-cols-1 gap-(--standard-space) border p-(--standard-space) sm:col-span-2 sm:grid-cols-2 md:col-span-3 md:grid-cols-3 lg:col-span-4 xl:col-span-5">
          <div>
            <p className="mb-0 text-sm text-neutral-500">Shares Purchased</p>
            <p className="font-medium">{transaction.shares.toLocaleString()}</p>
          </div>
          <div>
            <p className="mb-0 text-sm text-neutral-500">Price per Share</p>
            <p className="font-medium">{formatCurrency(1)}</p>
          </div>
          <div>
            <p className="mb-0 text-sm text-neutral-500">Total Paid</p>
            <p className="text-lg font-medium">
              {formatCurrency(transaction.shares)}
            </p>
          </div>
        </div>
        <div className="transaction-history col-span-1 flex flex-row justify-between border p-(--standard-space) sm:col-span-3 md:col-span-4 lg:col-span-2 lg:flex-col">
          <div className="w-full">
            <p className="mb-3 text-sm font-medium">Transaction Details</p>
            {/* the line behind the status squares */}
            <div className="relative space-y-3 before:absolute before:top-3 before:bottom-3 before:left-1.5 before:w-px before:bg-(--gray-300)">
              {transaction.statusHistory.map((event) => (
                <div key={event.status} className="relative flex items-start">
                  <div
                    className={`mt-1.5 mr-3 h-3 w-3 ${STATUS_CLASS[event.status]}`}
                  />
                  <div>
                    <div className="text-sm font-medium uppercase">
                      {event.status}
                    </div>
                    <div className="text-xs opacity-40">
                      {formatDateTime(event.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-(--standard-space) flex w-full items-end justify-end text-[0.6rem] opacity-40 lg:justify-start">
            <span className="m-0 pr-[1ch] leading-none">Transaction ID:</span>
            <span className="space-mono m-0 leading-none uppercase">
              {transaction.id}
            </span>
          </div>
        </div>
        <div className="activity-spacer col-span-full h-2 w-full border bg-(--border-color)" />
      </div>
    </div>
  );
}
