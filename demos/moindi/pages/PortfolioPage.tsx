import { PortfolioTile } from "@/demos/moindi/components/PortfolioTile";
import { moindiDemoProjects } from "@/demos/moindi/data/projects";
import { moindiDemoTransactions } from "@/demos/moindi/data/transactions";

// every project the visitor has bought into, with what they've spent on it
export function PortfolioPage() {
  const holdings = moindiDemoProjects
    .map((project) => {
      const purchases = moindiDemoTransactions.filter(
        (t) =>
          t.projectId === project.id &&
          t.status !== "cancelled" &&
          t.status !== "failed",
      );
      return {
        project,
        purchased: purchases.reduce((sum, t) => sum + t.shares, 0),
        purchasedAt: purchases[0]?.createdAt,
      };
    })
    .filter((holding) => holding.purchased > 0);

  return (
    <div className="flex w-full flex-col justify-start gap-(--standard-space) p-(--standard-space)">
      <h2>Portfolio</h2>
      {holdings.length === 0 ? (
        <p>No Projects Found</p>
      ) : (
        <div className="grid grid-cols-1 gap-(--standard-space) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {holdings.map(({ project, purchased, purchasedAt }) => (
            <PortfolioTile
              key={project.id}
              project={project}
              purchased={purchased}
              purchasedAt={purchasedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
