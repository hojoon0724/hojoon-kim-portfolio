import { Accordion } from "@/demos/moindi/components/Accordion";
import {
  TransactionHeader,
  TransactionRecord,
} from "@/demos/moindi/components/TransactionRecord";
import { moindiDemoTransactions } from "@/demos/moindi/data/transactions";

// the visitor's purchases, newest first, each opening to its details
export function ActivityPage() {
  const transactions = [...moindiDemoTransactions].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <div className="flex w-full flex-col justify-start p-(--standard-space)">
      <h2>Activity</h2>
      {transactions.length === 0 ? (
        <p>No Transactions Found</p>
      ) : (
        transactions.map((transaction) => (
          <Accordion
            key={transaction.id}
            className="-mt-0.5"
            header={<TransactionHeader transaction={transaction} />}
          >
            <TransactionRecord transaction={transaction} hideHeader />
          </Accordion>
        ))
      )}
    </div>
  );
}
